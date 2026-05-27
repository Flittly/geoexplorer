package com.flittly.bankendspringboot.dto;

import lombok.Data;

@Data
public class LevelProgressUpdateRequest {
    private String status;
    private Integer score;
    private Integer stars;
    private Double completionPercentage;
}
