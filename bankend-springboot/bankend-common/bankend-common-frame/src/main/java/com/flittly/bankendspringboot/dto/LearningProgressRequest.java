package com.flittly.bankendspringboot.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class LearningProgressRequest {
    private UUID courseId;
    private Integer progressPercent;
    private Integer lastPosition;
}
