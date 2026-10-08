package com.hotel.management.repository;

import com.hotel.management.entity.BookingServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingServiceItemRepository extends JpaRepository<BookingServiceItem, Long> {
    List<BookingServiceItem> findByBookingId(Long bookingId);
}
