package com.flittly.bankendspringboot.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class CommentResponse {
    private UUID id;
    private UUID postId;
    private UUID userId;
    private String userName;
    private String userAvatar;
    private UUID parentId;
    private String content;
    private List<String> images;
    private Boolean isAccepted;
    private Integer likeCount;
    private Boolean isLiked;
    private LocalDateTime createdAt;
}
