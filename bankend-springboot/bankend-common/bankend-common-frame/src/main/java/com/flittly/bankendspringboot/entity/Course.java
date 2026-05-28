package com.flittly.bankendspringboot.entity;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class Course {
    private UUID id;
    private UUID packageId;
    private String title;
    private String description;
    private String videoUrl;
    private String coverUrl;
    private String duration;
    private Integer orderIndex;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
