package com.hotel.management.controller;

import com.hotel.management.entity.HotelService;
import com.hotel.management.repository.HotelServiceRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
@Tag(name = "Hotel Services", description = "Dịch vụ khách sạn (Spa, Ẩm thực, Đưa đón)")
public class HotelServiceController {

    private final HotelServiceRepository hotelServiceRepository;

    @GetMapping
    @Operation(summary = "Lấy danh sách các dịch vụ đang hoạt động")
    public ResponseEntity<List<HotelService>> getActiveServices() {
        return ResponseEntity.ok(hotelServiceRepository.findByActiveTrue());
    }
}
