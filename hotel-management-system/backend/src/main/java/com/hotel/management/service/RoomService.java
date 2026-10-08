package com.hotel.management.service;

import com.hotel.management.dto.RoomDTO;
import com.hotel.management.entity.Room;
import com.hotel.management.entity.RoomStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface RoomService {
    Page<Room> getRooms(String search, Long roomTypeId, RoomStatus status, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    Room getRoomById(Long id);
    Room getRoomByNumber(String roomNumber);
    Room createRoom(RoomDTO dto);
    Room updateRoom(Long id, RoomDTO dto);
    void deleteRoom(Long id);
    Room updateRoomStatus(Long id, RoomStatus status);
    List<Room> getAvailableRoomsInDateRange(LocalDate checkIn, LocalDate checkOut);
}
