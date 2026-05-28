package com.flittly.bankendspringboot.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class CourseProgressItem {
    private UUID courseId;
    private String title;
    private String duration;
    private String status;
    private Integer progressPercent;
    private Integer lastPosition;
}
