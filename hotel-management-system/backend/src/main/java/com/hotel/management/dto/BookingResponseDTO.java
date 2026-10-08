package com.hotel.management.dto;

import com.hotel.management.entity.BookingStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponseDTO {
    private Long id;
    private String bookingCode;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private Long roomId;
    private String roomNumber;
    private String roomTypeName;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private LocalDateTime actualCheckIn;
    private LocalDateTime actualCheckOut;
    private Integer numberOfGuests;
    private BigDecimal totalAmount;
    private BigDecimal depositAmount;
    private BookingStatus status;
    private String specialRequests;
    private LocalDateTime createdAt;
}
