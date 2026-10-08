package com.hotel.management.controller;

import com.hotel.management.dto.BookingRequest;
import com.hotel.management.dto.BookingResponseDTO;
import com.hotel.management.entity.BookingStatus;
import com.hotel.management.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Booking Management", description = "Quản lý đặt phòng, Check-in, Check-out")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @Operation(summary = "Tạo mới đơn đặt phòng", description = "Kiểm tra phòng trùng lịch và tự động tạo hóa đơn")
    public ResponseEntity<BookingResponseDTO> createBooking(@Valid @RequestBody BookingRequest request) {
        return new ResponseEntity<>(bookingService.createBooking(request), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Lấy danh sách đơn đặt phòng", description = "Tìm kiếm theo từ khóa, trạng thái")
    public ResponseEntity<Page<BookingResponseDTO>> getBookings(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {

        Sort sort = sortDirection.equalsIgnoreCase("DESC") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return ResponseEntity.ok(bookingService.getAllBookings(search, status, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết đơn đặt phòng bằng ID")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/code/{bookingCode}")
    @Operation(summary = "Tra cứu đơn đặt theo Mã Booking Code")
    public ResponseEntity<BookingResponseDTO> getBookingByCode(@PathVariable String bookingCode) {
        return ResponseEntity.ok(bookingService.getBookingByCode(bookingCode));
    }

    @GetMapping("/my-bookings")
    @Operation(summary = "Xem danh sách đặt phòng theo email khách hàng")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(@RequestParam String email) {
        return ResponseEntity.ok(bookingService.getBookingsByCustomerEmail(email));
    }

    @PostMapping("/{id}/check-in")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Thực hiện Check-in nhận phòng")
    public ResponseEntity<BookingResponseDTO> checkIn(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.checkIn(id));
    }

    @PostMapping("/{id}/check-out")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Thực hiện Check-out trả phòng")
    public ResponseEntity<BookingResponseDTO> checkOut(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.checkOut(id));
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Hủy đặt phòng")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable Long id,
            @RequestParam(defaultValue = "Khách hàng yêu cầu hủy") String reason) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, reason));
    }
}
