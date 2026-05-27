package com.flittly.bankendspringboot.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class PostResponse {
    private UUID id;
    private UUID userId;
    private String userName;
    private String userAvatar;
    private String userLevel;
    private String postType;
    private String title;
    private String content;
    private List<String> images;
    private String status;
    private Integer likeCount;
    private Integer commentCount;
    private Integer favoriteCount;
    private Boolean isTop;
    private Boolean isLiked;
    private Boolean isFavorited;
    private Boolean isAccepted;
    private LocalDateTime createdAt;
}
