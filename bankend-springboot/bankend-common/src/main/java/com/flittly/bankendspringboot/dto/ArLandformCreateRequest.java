package com.flittly.bankendspringboot.dto;

import lombok.Data;

@Data
public class ArLandformCreateRequest {
    private String name;
    private String description;
    private String type;
    private String imageUrl;
    private Double elevation;
}
