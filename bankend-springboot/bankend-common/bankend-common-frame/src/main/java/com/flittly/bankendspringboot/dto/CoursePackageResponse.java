package com.flittly.bankendspringboot.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CoursePackageResponse {
    private UUID id;
    private String title;
    private String description;
    private String coverUrl;
    private String category;
    private Integer originalPrice;
    private Integer sellingPrice;
    private Integer expireDays;
    private Integer courseCount;
    private Boolean isFeatured;
    private LocalDateTime createdAt;
}
