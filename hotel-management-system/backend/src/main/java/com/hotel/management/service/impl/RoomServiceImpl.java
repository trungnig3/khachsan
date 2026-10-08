package com.hotel.management.service.impl;

import com.hotel.management.dto.RoomDTO;
import com.hotel.management.entity.Room;
import com.hotel.management.entity.RoomStatus;
import com.hotel.management.entity.RoomType;
import com.hotel.management.exception.DuplicateResourceException;
import com.hotel.management.exception.ResourceNotFoundException;
import com.hotel.management.repository.RoomRepository;
import com.hotel.management.repository.RoomTypeRepository;
import com.hotel.management.service.RoomService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<Room> getRooms(String search, Long roomTypeId, RoomStatus status, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        Specification<Room> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("roomNumber")), "%" + search.toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("description")), "%" + search.toLowerCase() + "%")
                ));
            }

            if (roomTypeId != null) {
                predicates.add(cb.equal(root.get("roomType").get("id"), roomTypeId));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return roomRepository.findAll(spec, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng với ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Room getRoomByNumber(String roomNumber) {
        return roomRepository.findByRoomNumber(roomNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng số: " + roomNumber));
    }

    @Override
    @Transactional
    public Room createRoom(RoomDTO dto) {
        if (roomRepository.existsByRoomNumber(dto.getRoomNumber())) {
            throw new DuplicateResourceException("Số phòng '" + dto.getRoomNumber() + "' đã tồn tại!");
        }

        RoomType roomType = roomTypeRepository.findById(dto.getRoomTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại phòng với ID: " + dto.getRoomTypeId()));

        Room room = Room.builder()
                .roomNumber(dto.getRoomNumber())
                .floor(dto.getFloor())
                .roomType(roomType)
                .status(dto.getStatus() != null ? dto.getStatus() : RoomStatus.AVAILABLE)
                .priceOverride(dto.getPriceOverride())
                .imageUrl(dto.getImageUrl())
                .description(dto.getDescription())
                .build();

        return roomRepository.save(room);
    }

    @Override
    @Transactional
    public Room updateRoom(Long id, RoomDTO dto) {
        Room room = getRoomById(id);

        if (!room.getRoomNumber().equalsIgnoreCase(dto.getRoomNumber()) && roomRepository.existsByRoomNumber(dto.getRoomNumber())) {
            throw new DuplicateResourceException("Số phòng '" + dto.getRoomNumber() + "' đã tồn tại!");
        }

        RoomType roomType = roomTypeRepository.findById(dto.getRoomTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại phòng với ID: " + dto.getRoomTypeId()));

        room.setRoomNumber(dto.getRoomNumber());
        room.setFloor(dto.getFloor());
        room.setRoomType(roomType);
        if (dto.getStatus() != null) {
            room.setStatus(dto.getStatus());
        }
        room.setPriceOverride(dto.getPriceOverride());
        room.setImageUrl(dto.getImageUrl());
        room.setDescription(dto.getDescription());

        return roomRepository.save(room);
    }

    @Override
    @Transactional
    public void deleteRoom(Long id) {
        Room room = getRoomById(id);
        roomRepository.delete(room);
    }

    @Override
    @Transactional
    public Room updateRoomStatus(Long id, RoomStatus status) {
        Room room = getRoomById(id);
        room.setStatus(status);
        return roomRepository.save(room);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Room> getAvailableRoomsInDateRange(LocalDate checkIn, LocalDate checkOut) {
        return roomRepository.findAvailableRoomsInDateRange(checkIn, checkOut);
    }
}
