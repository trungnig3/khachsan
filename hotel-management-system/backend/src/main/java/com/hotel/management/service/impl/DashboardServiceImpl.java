package com.hotel.management.service.impl;

import com.hotel.management.dto.DashboardStatsDTO;
import com.hotel.management.entity.BookingStatus;
import com.hotel.management.entity.RoomStatus;
import com.hotel.management.repository.BookingRepository;
import com.hotel.management.repository.RoomRepository;
import com.hotel.management.repository.UserRepository;
import com.hotel.management.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStatistics() {
        BigDecimal totalRevenue = bookingRepository.calculateTotalRevenue();
        BigDecimal todayRevenue = bookingRepository.calculateTodayRevenue(LocalDate.now());

        long totalBookings = bookingRepository.count();
        long pendingBookings = bookingRepository.countByStatus(BookingStatus.PENDING);
        long checkedInBookings = bookingRepository.countByStatus(BookingStatus.CHECKED_IN);

        long availableRooms = roomRepository.countByStatus(RoomStatus.AVAILABLE);
        long occupiedRooms = roomRepository.countByStatus(RoomStatus.OCCUPIED);
        long maintenanceRooms = roomRepository.countByStatus(RoomStatus.MAINTENANCE);
        long totalRooms = roomRepository.count();

        double occupancyRate = totalRooms > 0 ? ((double) occupiedRooms / totalRooms) * 100.0 : 0.0;
        long totalCustomers = userRepository.count();

        return DashboardStatsDTO.builder()
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .todayRevenue(todayRevenue != null ? todayRevenue : BigDecimal.ZERO)
                .totalBookings(totalBookings)
                .pendingBookings(pendingBookings)
                .checkedInBookings(checkedInBookings)
                .availableRooms(availableRooms)
                .occupiedRooms(occupiedRooms)
                .maintenanceRooms(maintenanceRooms)
                .occupancyRate(Math.round(occupancyRate * 10.0) / 10.0)
                .totalCustomers(totalCustomers)
                .build();
    }
}
