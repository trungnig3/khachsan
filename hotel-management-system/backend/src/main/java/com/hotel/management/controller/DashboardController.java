package com.hotel.management.controller;

import com.hotel.management.dto.DashboardStatsDTO;
import com.hotel.management.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard Statistics", description = "Thống kê chỉ số KPI doanh thu, công suất phòng")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Lấy báo cáo tổng hợp KPI Dashboard", description = "Doanh thu tổng, doanh thu hôm nay, phòng trống, công suất phòng...")
    public ResponseEntity<DashboardStatsDTO> getStatistics() {
        return ResponseEntity.ok(dashboardService.getDashboardStatistics());
    }
}
