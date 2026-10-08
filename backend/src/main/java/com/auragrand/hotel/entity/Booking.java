package com.auragrand.hotel.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String bookingCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private User customer;

    @Column(nullable = false, length = 100)
    private String customerName;

    @Column(nullable = false, length = 100)
    private String customerEmail;

    @Column(nullable = false, length = 20)
    private String customerPhone;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(nullable = false)
    private LocalDate checkInDate;

    @Column(nullable = false)
    private LocalDate checkOutDate;

    @Column(nullable = false)
    private Integer nights;

    @Column(nullable = false)
    @Builder.Default
    private Integer numGuests = 2;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal roomPricePerNight;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal totalRoomPrice;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal servicesTotal = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "PENDING"; // PENDING, CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String paymentStatus = "UNPAID"; // UNPAID, PARTIALLY_PAID, PAID, REFUNDED

    @Column(length = 50)
    private String paymentMethod; // CASH, BANK_TRANSFER, CREDIT_CARD, VNPAY

    @Column(columnDefinition = "TEXT")
    private String specialRequests;

    private LocalDateTime checkedInAt;

    private LocalDateTime checkedOutAt;

    @Column(updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
