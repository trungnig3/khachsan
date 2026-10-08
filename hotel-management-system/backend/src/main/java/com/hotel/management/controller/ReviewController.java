package com.hotel.management.controller;

import com.hotel.management.entity.Review;
import com.hotel.management.repository.ReviewRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Customer Reviews", description = "Đánh giá từ khách hàng")
public class ReviewController {

    private final ReviewRepository reviewRepository;

    @GetMapping
    @Operation(summary = "Lấy danh sách đánh giá đã duyệt hiển thị công khai")
    public ResponseEntity<List<Review>> getApprovedReviews() {
        return ResponseEntity.ok(reviewRepository.findByApprovedTrueOrderByCreatedAtDesc());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lấy toàn bộ đánh giá (Dành cho Admin kiểm duyệt)")
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewRepository.findAllByOrderByCreatedAtDesc());
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Duyệt hoặc ẩn đánh giá")
    public ResponseEntity<Review> toggleApproval(@PathVariable Long id, @RequestParam Boolean approved) {
        return reviewRepository.findById(id).map(r -> {
            r.setApproved(approved);
            return ResponseEntity.ok(reviewRepository.save(r));
        }).orElse(ResponseEntity.notFound().build());
    }
}
