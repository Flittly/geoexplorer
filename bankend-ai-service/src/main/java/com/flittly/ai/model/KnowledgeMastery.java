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
public class KnowledgeMastery {
    private Long id;
    private Long studentId;
    private Long knowledgePointId;
    private Long courseId;
    private BigDecimal masteryScore;
    private Integer attemptCount;
    private Integer correctCount;
    private LocalDateTime lastAttemptAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
