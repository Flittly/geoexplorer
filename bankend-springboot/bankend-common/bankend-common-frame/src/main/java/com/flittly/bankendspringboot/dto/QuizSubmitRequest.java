package com.flittly.bankendspringboot.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class QuizSubmitRequest {
    private UUID questionId;
    private UUID userId;
    private Integer selectedAnswer;
    private Boolean isCorrect;
}
