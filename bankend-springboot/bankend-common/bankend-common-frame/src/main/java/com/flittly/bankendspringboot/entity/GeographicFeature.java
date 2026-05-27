package com.flittly.bankendspringboot.entity;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data
public class GeographicFeature {
    private UUID id;
    private String name;
    private String description;
    private String featureType;
    private Double latitude;
    private Double longitude;
    private String region;
    private String imageUrl;
    private Map<String, Object> stats;
    private String gradeLevel;
    private String textbook;
    private String sourceType;
    private String category;
    private Integer minZoom;
    private UUID levelId;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
