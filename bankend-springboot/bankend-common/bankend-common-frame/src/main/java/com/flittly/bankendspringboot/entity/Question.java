package com.flittly.bankendspringboot.entity;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class Question {
    private UUID id;
    private UUID levelId;
    private String question;
    private List<String> options;
    private Integer correctAnswer;
    private String explanation;
    private Integer orderIndex;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
