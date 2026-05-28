package com.flittly.bankendspringboot.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CoursePackage {
    private java.util.UUID id;
    private String title;
    private String description;
    private String coverUrl;
    private String category;
    private Integer originalPrice;
    private Integer sellingPrice;
    private Integer expireDays;
    private Integer courseCount;
    private Boolean isActive;
    private Boolean isFeatured;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
