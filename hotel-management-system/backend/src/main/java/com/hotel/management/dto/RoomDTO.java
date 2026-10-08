package com.hotel.management.dto;

import com.hotel.management.entity.RoomStatus;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomDTO {
    private Long id;

    @NotBlank(message = "Số phòng không được để trống")
    private String roomNumber;

    @NotNull(message = "Tầng không được để trống")
    @Min(value = 1, message = "Tầng phải từ 1 trở lên")
    private Integer floor;

    @NotNull(message = "Loại phòng không được để trống")
    private Long roomTypeId;
    private String roomTypeName;

    private RoomStatus status;
    private BigDecimal priceOverride;
    private BigDecimal effectivePrice;
    private String imageUrl;
    private String description;
}
