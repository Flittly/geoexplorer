package com.flittly.bankendspringboot.dto;

import lombok.Data;

@Data
public class ArLandformCreateRequest {
    private String name;
    private String description;
    private String type;
    private String imageUrl;
    private Double elevation;
    private Integer noiseSeed;
    private String noiseType;
    private Double scale;
    private Double amplitude;
    private Integer octaves;
    private Double persistence;
    private String knowledgeContent;
    private String labels;
}
