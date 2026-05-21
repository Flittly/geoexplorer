package com.flittly.bankendspringboot.entity;

import com.flittly.bankendspringboot.entity.enums.ProgressStatus;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UserLevelProgress {
    private UUID id;
    private UUID userId;
    private UUID levelId;
    private ProgressStatus status;
    private Integer score;
    private Integer stars;
    private Double completionPercentage;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
