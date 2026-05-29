package com.flittly.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LearningRecord {
    private Long id;
    private Long studentId;
    private Long courseId;
    private Long knowledgePointId;
    private String knowledgePointName;
    private Boolean isCorrect;
    private BigDecimal score;
    private LocalDateTime attemptAt;
}
