package com.flittly.bankendspringboot.entity;

import com.flittly.bankendspringboot.entity.enums.TargetType;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class Like {
    private UUID id;
    private UUID userId;
    private UUID targetId;
    private TargetType targetType;
    private LocalDateTime createdAt;
}
