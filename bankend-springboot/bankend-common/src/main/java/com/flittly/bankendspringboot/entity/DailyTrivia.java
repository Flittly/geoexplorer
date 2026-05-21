package com.flittly.bankendspringboot.entity;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class DailyTrivia {
    private UUID id;
    private String title;
    private String description;
    private String imageUrl;
    private String location;
    private String region;
    private LocalDate featuredDate;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
