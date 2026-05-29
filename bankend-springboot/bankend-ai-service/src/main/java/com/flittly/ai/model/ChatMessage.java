package com.flittly.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private Long id;
    private Long studentId;
    private String sessionId;
    private String role;
    private String content;
    private String agentType;
    private String metadata;
    private String createdAt;
}
