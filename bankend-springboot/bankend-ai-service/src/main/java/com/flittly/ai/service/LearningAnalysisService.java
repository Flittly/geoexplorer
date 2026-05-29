package com.flittly.ai.service;

import com.flittly.ai.mapper.KnowledgeMasteryMapper;
import com.flittly.ai.model.KnowledgeMastery;
import com.flittly.ai.model.LearningAnalysis;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class LearningAnalysisService {
    private final KnowledgeMasteryMapper knowledgeMasteryMapper;

    public LearningAnalysis getAnalysis(Long studentId, Long courseId) {
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
                .divide(new BigDecimal(Math.max(masteryList.size(), 1)), 2, BigDecimal.ROUND_HALF_UP);

        return LearningAnalysis.builder()
                .studentId(studentId)
                .courseId(courseId)
                .overallMastery(overallMastery)
                .weakPoints(weakPoints)
                .strongPoints(strongPoints)
                .trend("stable")
                .recommendations(generateRecommendations(weakPoints))
                .build();
    }

    private List<String> generateRecommendations(List<LearningAnalysis.WeakPoint> weakPoints) {
        List<String> recommendations = new ArrayList<>();
        for (LearningAnalysis.WeakPoint weakPoint : weakPoints) {
            recommendations.add("建议加强练习：" + weakPoint.getKnowledgePoint());
        }
        return recommendations;
    }
}
