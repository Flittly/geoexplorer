package com.flittly.bankendspringboot.dto;

import lombok.Data;

@Data
public class LevelCreateRequest {
    private String name;
    private String description;
    private Integer orderIndex;
    private Integer unlockRequirement;
}
