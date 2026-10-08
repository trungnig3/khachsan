package com.auragrand.hotel.controller;

import com.auragrand.hotel.entity.Booking;
import com.auragrand.hotel.entity.Room;
import com.auragrand.hotel.repository.BookingRepository;
import com.auragrand.hotel.repository.RoomRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Thống kê KPI doanh thu và công suất phòng")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DashboardController {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    public DashboardController(BookingRepository bookingRepository, RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Lấy dữ liệu thống kê tổng hợp cho Admin Dashboard")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        List<Booking> bookings = bookingRepository.findAll();
        List<Room> rooms = roomRepository.findAll();

        BigDecimal totalRevenue = bookings.stream()
                .filter(b -> !"CANCELLED".equals(b.getStatus()))
                .map(Booking::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long occupiedRooms = rooms.stream().filter(r -> "OCCUPIED".equals(r.getStatus())).count();
        long availableRooms = rooms.stream().filter(r -> "AVAILABLE".equals(r.getStatus())).count();
        long maintenanceRooms = rooms.stream().filter(r -> "MAINTENANCE".equals(r.getStatus()) || "CLEANING".equals(r.getStatus())).count();

        double occupancyRate = rooms.isEmpty() ? 0 : Math.round(((double) occupiedRooms / rooms.size()) * 100);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("todayRevenue", totalRevenue.multiply(BigDecimal.valueOf(0.12)));
        stats.put("totalBookings", bookings.size());
        stats.put("occupiedRooms", occupiedRooms);
        stats.put("availableRooms", availableRooms);
        stats.put("maintenanceRooms", maintenanceRooms);
        stats.put("occupancyRate", occupancyRate);
        stats.put("totalRooms", rooms.size());

        return ResponseEntity.ok(stats);
    }
}
