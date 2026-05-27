package com.flittly.bankendspringboot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProgressResponse {
    private UUID userId;
    private Integer totalStars;
    private String level;
    private Integer completedLevels;
    private UUID currentLevelId;
}
