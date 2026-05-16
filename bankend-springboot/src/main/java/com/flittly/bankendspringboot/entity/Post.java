package com.flittly.bankendspringboot.entity;

import com.flittly.bankendspringboot.entity.enums.PostStatus;
import com.flittly.bankendspringboot.entity.enums.PostType;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class Post {
    private UUID id;
    private UUID userId;
    private PostType postType;
    private String title;
    private String content;
    private List<String> images;
    private PostStatus status;
    private Integer likeCount;
    private Integer commentCount;
    private Integer favoriteCount;
    private Boolean isTop;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
