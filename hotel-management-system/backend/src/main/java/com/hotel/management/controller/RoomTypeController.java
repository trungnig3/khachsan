package com.hotel.management.controller;

import com.hotel.management.entity.RoomType;
import com.hotel.management.repository.RoomTypeRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/room-types")
@RequiredArgsConstructor
@Tag(name = "Room Type", description = "Quản lý loại phòng")
public class RoomTypeController {

    private final RoomTypeRepository roomTypeRepository;

    @GetMapping
    @Operation(summary = "Lấy toàn bộ danh sách loại phòng")
    public ResponseEntity<List<RoomType>> getAllRoomTypes() {
        return ResponseEntity.ok(roomTypeRepository.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết loại phòng theo ID")
    public ResponseEntity<RoomType> getRoomTypeById(@PathVariable Long id) {
        return roomTypeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
