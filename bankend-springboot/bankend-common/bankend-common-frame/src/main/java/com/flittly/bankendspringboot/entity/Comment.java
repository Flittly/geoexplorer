package com.flittly.bankendspringboot.entity;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class Comment {
    private UUID id;
    private UUID postId;
    private UUID userId;
    private UUID parentId;
    private String content;
    private List<String> images;
    private Boolean isAccepted;
    private Integer likeCount;
    private LocalDateTime createdAt;
}
