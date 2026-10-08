package com.hotel.management.service;

import com.hotel.management.dto.BookingRequest;
import com.hotel.management.dto.BookingResponseDTO;
import com.hotel.management.entity.Booking;
import com.hotel.management.entity.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookingService {
    BookingResponseDTO createBooking(BookingRequest request);
    Page<BookingResponseDTO> getAllBookings(String search, BookingStatus status, Pageable pageable);
    BookingResponseDTO getBookingById(Long id);
    BookingResponseDTO getBookingByCode(String bookingCode);
    List<BookingResponseDTO> getBookingsByCustomerEmail(String email);
    BookingResponseDTO checkIn(Long bookingId);
    BookingResponseDTO checkOut(Long bookingId);
    BookingResponseDTO cancelBooking(Long bookingId, String reason);
}
