package com.flittly.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LearningAnalysis {
    private Long id;
    private Long studentId;
    private Long courseId;
    private LocalDate analysisDate;
    private String masteryLevel;
    private BigDecimal overallMastery;
    private List<WeakPoint> weakPoints;
    private List<StrongPoint> strongPoints;
    private String trend;
    private List<String> recommendations;
    private String createdAt;
    private String updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeakPoint {
        private String knowledgePoint;
        private BigDecimal masteryScore;
        private Integer attemptCount;
        private Integer correctCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StrongPoint {
        private String knowledgePoint;
        private BigDecimal masteryScore;
    }
}
