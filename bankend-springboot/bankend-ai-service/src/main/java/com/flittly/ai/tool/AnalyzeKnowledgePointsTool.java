package com.flittly.ai.tool;

import com.flittly.ai.mapper.KnowledgeMasteryMapper;
import com.flittly.ai.model.KnowledgeMastery;
import com.flittly.ai.model.LearningAnalysis;
import io.agentscope.core.tool.Tool;
import io.agentscope.core.tool.ToolParam;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AnalyzeKnowledgePointsTool {
    private final KnowledgeMasteryMapper knowledgeMasteryMapper;

    @Tool(description = "分析学生知识点掌握情况，识别薄弱环节和优势领域")
    public LearningAnalysis analyzeKnowledgePoints(
            @ToolParam(description = "学生ID") Long studentId,
            @ToolParam(description = "课程ID") Long courseId) {
        List<KnowledgeMastery> masteryList = knowledgeMasteryMapper.selectByStudentIdAndCourseId(studentId, courseId);

        List<LearningAnalysis.WeakPoint> weakPoints = new ArrayList<>();
        List<LearningAnalysis.StrongPoint> strongPoints = new ArrayList<>();

        for (KnowledgeMastery mastery : masteryList) {
            if (mastery.getMasteryScore().compareTo(new BigDecimal("60")) < 0) {
                weakPoints.add(LearningAnalysis.WeakPoint.builder()
                        .knowledgePoint("知识点-" + mastery.getKnowledgePointId())
                        .masteryScore(mastery.getMasteryScore())
                        .attemptCount(mastery.getAttemptCount())
                        .correctCount(mastery.getCorrectCount())
                        .build());
            } else if (mastery.getMasteryScore().compareTo(new BigDecimal("80")) >= 0) {
                strongPoints.add(LearningAnalysis.StrongPoint.builder()
                        .knowledgePoint("知识点-" + mastery.getKnowledgePointId())
                        .masteryScore(mastery.getMasteryScore())
                        .build());
            }
        }

        BigDecimal overallMastery = masteryList.stream()
                .map(KnowledgeMastery::getMasteryScore)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(new BigDecimal(masteryList.size()), 2, BigDecimal.ROUND_HALF_UP);

        String trend = determineTrend(masteryList);

        return LearningAnalysis.builder()
                .studentId(studentId)
                .courseId(courseId)
                .overallMastery(overallMastery)
                .weakPoints(weakPoints)
                .strongPoints(strongPoints)
                .trend(trend)
                .recommendations(generateRecommendations(weakPoints))
                .build();
    }

    private String determineTrend(List<KnowledgeMastery> masteryList) {
        return "stable";
    }

    private List<String> generateRecommendations(List<LearningAnalysis.WeakPoint> weakPoints) {
        List<String> recommendations = new ArrayList<>();
        for (LearningAnalysis.WeakPoint weakPoint : weakPoints) {
            recommendations.add("建议加强练习：" + weakPoint.getKnowledgePoint());
        }
        return recommendations;
    }
}
