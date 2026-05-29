package com.flittly.ai.model;

import java.time.LocalDateTime;

public class LearningRecord {
    private Long id;
    private Long studentId;
    private Long courseId;
    private Long knowledgePointId;
    private Boolean isCorrect;
    private Integer score;
    private LocalDateTime attemptAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    public Long getKnowledgePointId() { return knowledgePointId; }
    public void setKnowledgePointId(Long knowledgePointId) { this.knowledgePointId = knowledgePointId; }
    public Boolean getIsCorrect() { return isCorrect; }
    public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public LocalDateTime getAttemptAt() { return attemptAt; }
    public void setAttemptAt(LocalDateTime attemptAt) { this.attemptAt = attemptAt; }
}
