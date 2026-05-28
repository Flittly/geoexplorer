package com.flittly.bankendspringboot.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class MyCourseResponse {
    private UUID packageId;
    private String title;
    private String coverUrl;
    private Integer courseCount;
    private Integer completedCount;
    private Integer progressPercent;
    private LocalDateTime purchasedAt;
    private LocalDateTime expireAt;
    private List<CourseProgressItem> courses;
}
