package com.flittly.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatHistory {
    private Long id;
    private Long studentId;
    private String sessionId;
    private String role;
    private String content;
    private String agentType;
    private String metadata;
    private LocalDateTime createdAt;
}
