package com.flittly.bankendspringboot.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class CourseCreateRequest {
    private UUID packageId;
    private String title;
    private String description;
    private String videoUrl;
    private String coverUrl;
    private String duration;
    private Integer orderIndex;
}
