package com.hotel.management.repository;

import com.hotel.management.entity.Room;
import com.hotel.management.entity.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long>, JpaSpecificationExecutor<Room> {
    Optional<Room> findByRoomNumber(String roomNumber);
    Boolean existsByRoomNumber(String roomNumber);
    List<Room> findByStatus(RoomStatus status);
    long countByStatus(RoomStatus status);

    @Query("SELECT r FROM Room r WHERE r.status != 'MAINTENANCE' AND r.id NOT IN (" +
           "  SELECT b.room.id FROM Booking b " +
           "  WHERE b.status IN ('CONFIRMED', 'CHECKED_IN') " +
           "  AND NOT (b.checkOutDate <= :checkIn OR b.checkInDate >= :checkOut)" +
           ")")
    List<Room> findAvailableRoomsInDateRange(@Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut);
}
