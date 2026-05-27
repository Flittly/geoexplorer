package com.flittly.bankendspringboot.entity;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class Favorite {
    private UUID id;
    private UUID userId;
    private UUID postId;
    private LocalDateTime createdAt;
}
