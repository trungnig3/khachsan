package com.auragrand.hotel.controller;

import com.auragrand.hotel.dto.BookingRequest;
import com.auragrand.hotel.entity.Booking;
import com.auragrand.hotel.entity.Room;
import com.auragrand.hotel.exception.ResourceNotFoundException;
import com.auragrand.hotel.exception.RoomUnavailableException;
import com.auragrand.hotel.repository.BookingRepository;
import com.auragrand.hotel.repository.RoomRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@Tag(name = "Bookings", description = "Quản lý đặt phòng, Check-in, Check-out & Ngăn trùng lịch")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BookingController {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    public BookingController(BookingRepository bookingRepository, RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Lấy danh sách tất cả các đơn đặt phòng")
    public ResponseEntity<Page<Booking>> getAllBookings(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(bookingRepository.findWithFilters(status, pageable));
    }

    @PostMapping
    @Operation(summary = "Tạo đặt phòng mới (Có kiểm tra trùng lịch)")
    public ResponseEntity<Booking> createBooking(@Valid @RequestBody BookingRequest request) {
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng có ID: " + request.getRoomId()));

        // Check date overlap
        long overlapCount = bookingRepository.countOverlappingBookings(
                request.getRoomId(),
                request.getCheckInDate(),
                request.getCheckOutDate(),
                null
        );

        if (overlapCount > 0) {
            throw new RoomUnavailableException("Phòng " + room.getRoomNumber() + " đã có khách đặt trong khoảng thời gian này!");
        }

        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        if (nights <= 0) nights = 1;

        BigDecimal roomTotal = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));
        BigDecimal tax = roomTotal.multiply(BigDecimal.valueOf(0.08)); // 8% VAT
        BigDecimal total = roomTotal.add(tax);

        String bookingCode = "AG-" + System.currentTimeMillis() % 100000000;

        Booking booking = Booking.builder()
                .bookingCode(bookingCode)
                .room(room)
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .customerPhone(request.getCustomerPhone())
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .nights((int) nights)
                .numGuests(request.getNumGuests())
                .roomPricePerNight(room.getPricePerNight())
                .totalRoomPrice(roomTotal)
                .taxAmount(tax)
                .totalAmount(total)
                .paymentMethod(request.getPaymentMethod())
                .specialRequests(request.getSpecialRequests())
                .status("CONFIRMED")
                .paymentStatus("PAID")
                .build();

        Booking saved = bookingRepository.save(booking);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{id}/check-in")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Lễ tân thực hiện Check-in")
    public ResponseEntity<Booking> checkIn(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy booking ID: " + id));

        booking.setStatus("CHECKED_IN");
        booking.setCheckedInAt(LocalDateTime.now());

        // Update room status
        Room room = booking.getRoom();
        room.setStatus("OCCUPIED");
        roomRepository.save(room);

        return ResponseEntity.ok(bookingRepository.save(booking));
    }

    @PostMapping("/{id}/check-out")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Lễ tân thực hiện Check-out")
    public ResponseEntity<Booking> checkOut(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy booking ID: " + id));

        booking.setStatus("CHECKED_OUT");
        booking.setCheckedOutAt(LocalDateTime.now());

        // Update room status to CLEANING
        Room room = booking.getRoom();
        room.setStatus("CLEANING");
        roomRepository.save(room);

        return ResponseEntity.ok(bookingRepository.save(booking));
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Hủy đơn đặt phòng")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy booking ID: " + id));

        booking.setStatus("CANCELLED");
        return ResponseEntity.ok(bookingRepository.save(booking));
    }
}
