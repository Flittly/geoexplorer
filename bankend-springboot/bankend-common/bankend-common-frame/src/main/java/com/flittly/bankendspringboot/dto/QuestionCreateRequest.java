package com.flittly.bankendspringboot.dto;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class QuestionCreateRequest {
    private UUID levelId;
    private String question;
    private List<String> options;
    private Integer correctAnswer;
    private String explanation;
    private Integer orderIndex;
}
