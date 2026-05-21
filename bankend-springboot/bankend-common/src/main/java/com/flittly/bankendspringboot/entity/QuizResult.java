package com.flittly.bankendspringboot.entity;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class QuizResult {
    private UUID id;
    private UUID userId;
    private UUID questionId;
    private Integer selectedAnswer;
    private Boolean isCorrect;
    private LocalDateTime createdAt;
}
