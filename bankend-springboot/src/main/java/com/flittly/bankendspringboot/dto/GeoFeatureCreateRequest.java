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
}
