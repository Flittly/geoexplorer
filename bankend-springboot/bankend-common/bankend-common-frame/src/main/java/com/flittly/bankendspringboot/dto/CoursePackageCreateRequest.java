package com.flittly.bankendspringboot.dto;

import lombok.Data;

@Data
public class CoursePackageCreateRequest {
    private String title;
    private String description;
    private String coverUrl;
    private String category;
    private Integer originalPrice;
    private Integer sellingPrice;
    private Integer expireDays;
    private Boolean isFeatured;
}
