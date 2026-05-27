package com.flittly.bankendspringboot.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class MistakeCreateRequest {
    private UUID userId;
    private String title;
    private String question;
    private String category;
    private String masteryLevel;
    private String imageUrl;
}
