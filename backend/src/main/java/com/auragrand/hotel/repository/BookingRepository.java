package com.auragrand.hotel.repository;

import com.auragrand.hotel.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingCode(String bookingCode);

    List<Booking> findByCustomerId(Long customerId);

    List<Booking> findByStatus(String status);

    // Overlap verification query
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.room.id = :roomId " +
           "AND b.status NOT IN ('CANCELLED', 'CHECKED_OUT') " +
           "AND (:ignoreBookingId IS NULL OR b.id != :ignoreBookingId) " +
           "AND (b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate)")
    long countOverlappingBookings(
            @Param("roomId") Long roomId,
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate,
            @Param("ignoreBookingId") Long ignoreBookingId
    );

    @Query("SELECT b FROM Booking b WHERE " +
           "(:status IS NULL OR b.status = :status)")
    Page<Booking> findWithFilters(@Param("status") String status, Pageable pageable);
}
