package com.hotel.management.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
    private BigDecimal totalRevenue;
    private BigDecimal todayRevenue;
    private long totalBookings;
    private long pendingBookings;
    private long checkedInBookings;
    private long availableRooms;
    private long occupiedRooms;
    private long maintenanceRooms;
    private double occupancyRate;
    private long totalCustomers;
}
