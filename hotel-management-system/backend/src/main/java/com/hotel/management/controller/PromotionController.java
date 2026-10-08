package com.hotel.management.controller;

import com.hotel.management.entity.Promotion;
import com.hotel.management.repository.PromotionRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
@Tag(name = "Promotions", description = "Chương trình khuyến mãi và mã voucher")
public class PromotionController {

    private final PromotionRepository promotionRepository;

    @GetMapping
    @Operation(summary = "Lấy các voucher khuyến mãi đang có hiệu lực")
    public ResponseEntity<List<Promotion>> getActivePromotions() {
        return ResponseEntity.ok(promotionRepository.findByActiveTrueAndEndDateGreaterThanEqual(LocalDate.now()));
    }

    @GetMapping("/check/{code}")
    @Operation(summary = "Kiểm tra tính hợp lệ của mã giảm giá")
    public ResponseEntity<?> checkPromotionCode(@PathVariable String code) {
        return promotionRepository.findByCode(code.toUpperCase())
                .filter(p -> p.getActive() && !LocalDate.now().isAfter(p.getEndDate()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }
}
