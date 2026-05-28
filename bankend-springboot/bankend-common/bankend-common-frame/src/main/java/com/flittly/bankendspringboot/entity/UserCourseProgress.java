package com.flittly.bankendspringboot.entity;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UserCourseProgress {
    private UUID id;
    private UUID userId;
    private UUID courseId;
    private UUID packageId;
    private String status;
    private Integer progressPercent;
    private Integer lastPosition;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
