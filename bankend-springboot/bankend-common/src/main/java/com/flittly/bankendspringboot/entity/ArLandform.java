package com.flittly.bankendspringboot.entity;

import com.flittly.bankendspringboot.entity.enums.LandformType;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ArLandform {
    private UUID id;
    private String name;
    private String description;
    private LandformType type;
    private String imageUrl;
    private Double elevation;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
