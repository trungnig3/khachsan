package com.hotel.management.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomTypeDTO {
    private Long id;

    @NotBlank(message = "Tên loại phòng không được để trống")
    private String name;

    @NotBlank(message = "Mã loại phòng không được để trống")
    private String code;

    private String description;

    @NotNull(message = "Giá cơ bản không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá cơ bản phải lớn hơn 0")
    private BigDecimal basePrice;

    @NotNull(message = "Sức chứa không được để trống")
    @Min(value = 1, message = "Sức chứa tối thiểu 1 người")
    private Integer capacity;

    private Integer area;
    private String bedType;
    private String imageUrl;
    private String amenities;
}
