package com.hotel.management.service.impl;

import com.hotel.management.dto.BookingRequest;
import com.hotel.management.dto.BookingResponseDTO;
import com.hotel.management.entity.*;
import com.hotel.management.exception.BadRequestException;
import com.hotel.management.exception.ResourceNotFoundException;
import com.hotel.management.exception.RoomUnavailableException;
import com.hotel.management.repository.*;
import com.hotel.management.service.BookingService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final InvoiceRepository invoiceRepository;
    private final PromotionRepository promotionRepository;
    private final HotelServiceRepository hotelServiceRepository;
    private final BookingServiceItemRepository bookingServiceItemRepository;

    @Override
    @Transactional
    public BookingResponseDTO createBooking(BookingRequest request) {
        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new BadRequestException("Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày!");
        }

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng với ID: " + request.getRoomId()));

        if (room.getStatus() == RoomStatus.MAINTENANCE) {
            throw new RoomUnavailableException("Phòng đang trong trạng thái bảo trì, không thể đặt!");
        }

        // Section 10 Constraint: Overlap validation
        boolean isOverlapping = bookingRepository.hasOverlappingBooking(room.getId(), request.getCheckInDate(), request.getCheckOutDate());
        if (isOverlapping) {
            throw new RoomUnavailableException("Phòng " + room.getRoomNumber() + " đã có khách đặt trong khoảng thời gian từ "
                    + request.getCheckInDate() + " đến " + request.getCheckOutDate() + "!");
        }

        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        BigDecimal roomRate = room.getEffectivePrice();
        BigDecimal roomTotal = roomRate.multiply(BigDecimal.valueOf(nights));

        // Promotion discount calculation
        BigDecimal discount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            promotionRepository.findByCode(request.getCouponCode().toUpperCase()).ifPresent(promo -> {
                if (promo.getActive() && !LocalDate.now().isAfter(promo.getEndDate())) {
                    if (promo.getDiscountPercent() != null && promo.getDiscountPercent() > 0) {
                        BigDecimal percent = BigDecimal.valueOf(promo.getDiscountPercent()).divide(BigDecimal.valueOf(100));
                        discount.add(roomTotal.multiply(percent));
                    } else if (promo.getDiscountAmount() != null) {
                        discount.add(promo.getDiscountAmount());
                    }
                }
            });
        }

        BigDecimal finalTotal = roomTotal.subtract(discount).max(BigDecimal.ZERO);

        String bookingCode = "BK-" + System.currentTimeMillis() % 1000000;

        Booking booking = Booking.builder()
                .bookingCode(bookingCode)
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .customerPhone(request.getCustomerPhone())
                .room(room)
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .numberOfGuests(request.getNumberOfGuests())
                .totalAmount(finalTotal)
                .depositAmount(request.getDepositAmount() != null ? request.getDepositAmount() : BigDecimal.ZERO)
                .status(BookingStatus.CONFIRMED)
                .specialRequests(request.getSpecialRequests())
                .build();

        // Optional attach authenticated user
        userRepository.findByEmail(request.getCustomerEmail()).ifPresent(booking::setUser);

        Booking savedBooking = bookingRepository.save(booking);

        // Auto generate Invoice
        Invoice invoice = Invoice.builder()
                .invoiceCode("INV-" + System.currentTimeMillis() % 1000000)
                .booking(savedBooking)
                .roomAmount(roomTotal)
                .discountAmount(discount)
                .finalAmount(finalTotal)
                .status(InvoiceStatus.UNPAID)
                .build();
        invoiceRepository.save(invoice);

        return mapToDTO(savedBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponseDTO> getAllBookings(String search, BookingStatus status, Pageable pageable) {
        Specification<Booking> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("bookingCode")), pattern),
                        cb.like(cb.lower(root.get("customerName")), pattern),
                        cb.like(cb.lower(root.get("customerEmail")), pattern),
                        cb.like(cb.lower(root.get("customerPhone")), pattern),
                        cb.like(cb.lower(root.get("room").get("roomNumber")), pattern)
                ));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return bookingRepository.findAll(spec, pageable).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingById(Long id) {
        return bookingRepository.findById(id).map(this::mapToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt phòng: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingByCode(String bookingCode) {
        return bookingRepository.findByBookingCode(bookingCode).map(this::mapToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt mã: " + bookingCode));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getBookingsByCustomerEmail(String email) {
        return bookingRepository.findByCustomerEmail(email).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookingResponseDTO checkIn(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt: " + bookingId));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Đơn đặt phòng đã bị hủy, không thể Check-in!");
        }

        booking.setStatus(BookingStatus.CHECKED_IN);
        booking.setActualCheckIn(LocalDateTime.now());

        // Update room status to OCCUPIED
        Room room = booking.getRoom();
        room.setStatus(RoomStatus.OCCUPIED);
        roomRepository.save(room);

        return mapToDTO(bookingRepository.save(booking));
    }

    @Override
    @Transactional
    public BookingResponseDTO checkOut(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt: " + bookingId));

        booking.setStatus(BookingStatus.CHECKED_OUT);
        booking.setActualCheckOut(LocalDateTime.now());

        // Update room status to CLEANING or AVAILABLE
        Room room = booking.getRoom();
        room.setStatus(RoomStatus.CLEANING);
        roomRepository.save(room);

        // Update Invoice status to PAID if needed
        invoiceRepository.findByBookingId(bookingId).ifPresent(inv -> {
            inv.setStatus(InvoiceStatus.PAID);
            inv.setPaidAt(LocalDateTime.now());
            invoiceRepository.save(inv);
        });

        return mapToDTO(bookingRepository.save(booking));
    }

    @Override
    @Transactional
    public BookingResponseDTO cancelBooking(Long bookingId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt: " + bookingId));

        if (booking.getStatus() == BookingStatus.CHECKED_IN || booking.getStatus() == BookingStatus.CHECKED_OUT) {
            throw new BadRequestException("Đơn đặt đang ở trạng thái " + booking.getStatus() + ", không thể hủy!");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setSpecialRequests((booking.getSpecialRequests() != null ? booking.getSpecialRequests() + " | " : "") + "Lý do hủy: " + reason);

        Room room = booking.getRoom();
        if (room.getStatus() == RoomStatus.BOOKED) {
            room.setStatus(RoomStatus.AVAILABLE);
            roomRepository.save(room);
        }

        return mapToDTO(bookingRepository.save(booking));
    }

    private BookingResponseDTO mapToDTO(Booking b) {
        return BookingResponseDTO.builder()
                .id(b.getId())
                .bookingCode(b.getBookingCode())
                .customerName(b.getCustomerName())
                .customerEmail(b.getCustomerEmail())
                .customerPhone(b.getCustomerPhone())
                .roomId(b.getRoom().getId())
                .roomNumber(b.getRoom().getRoomNumber())
                .roomTypeName(b.getRoom().getRoomType().getName())
                .checkInDate(b.getCheckInDate())
                .checkOutDate(b.getCheckOutDate())
                .actualCheckIn(b.getActualCheckIn())
                .actualCheckOut(b.getActualCheckOut())
                .numberOfGuests(b.getNumberOfGuests())
                .totalAmount(b.getTotalAmount())
                .depositAmount(b.getDepositAmount())
                .status(b.getStatus())
                .specialRequests(b.getSpecialRequests())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
