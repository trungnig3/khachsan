package com.auragrand.hotel.repository;

import com.auragrand.hotel.entity.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    Optional<Room> findByRoomNumber(String roomNumber);

    Boolean existsByRoomNumber(String roomNumber);

    List<Room> findByStatus(String status);

    List<Room> findByFloor(Integer floor);

    @Query("SELECT r FROM Room r WHERE " +
           "(:roomTypeId IS NULL OR r.roomType.id = :roomTypeId) AND " +
           "(:floor IS NULL OR r.floor = :floor) AND " +
           "(:status IS NULL OR r.status = :status)")
    Page<Room> findRoomsWithFilters(
            @Param("roomTypeId") Long roomTypeId,
            @Param("floor") Integer floor,
            @Param("status") String status,
            Pageable pageable
    );
}
