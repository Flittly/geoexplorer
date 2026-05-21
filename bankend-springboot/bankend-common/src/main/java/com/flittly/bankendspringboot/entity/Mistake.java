package com.flittly.bankendspringboot.entity;

import com.flittly.bankendspringboot.entity.enums.CategoryType;
import com.flittly.bankendspringboot.entity.enums.MasteryLevel;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class Mistake {
    private UUID id;
    private UUID userId;
    private String title;
    private String question;
    private CategoryType category;
    private MasteryLevel masteryLevel;
    private String imageUrl;
    private String explanation;
    private LocalDateTime addedAt;
    private LocalDateTime updatedAt;
}
