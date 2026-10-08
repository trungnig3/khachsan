package com.auragrand.hotel.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingRequest {

    @NotNull(message = "Mã phòng không được để trống")
    private Long roomId;

    @NotNull(message = "Ngày nhận phòng không được để trống")
    private LocalDate checkInDate;

    @NotNull(message = "Ngày trả phòng không được để trống")
    private LocalDate checkOutDate;

    @Min(value = 1, message = "Số khách tối thiểu là 1")
    private Integer numGuests = 2;

    @NotBlank(message = "Họ tên khách hàng không được để trống")
    private String customerName;

    @NotBlank(message = "Email khách hàng không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String customerEmail;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String customerPhone;

    private String specialRequests;

    private String promoCode;

    private String paymentMethod = "BANK_TRANSFER";
}
