package com.flittly.bankendspringboot.dto;

import lombok.Data;

@Data
public class GeoFeatureCreateRequest {
    private String name;
    private String description;
    private String featureType;
    private Double latitude;
    private Double longitude;
    private String region;
    private String imageUrl;
    private java.util.Map<String, Object> stats;
    private String gradeLevel;
    private String textbook;
    private String sourceType;
    private String category;
    private Integer minZoom;
    private java.util.UUID levelId;
}
