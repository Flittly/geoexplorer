package com.flittly.bankendspringboot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LeaderboardEntry {
    private UUID userId;
    private String name;
    private String avatarUrl;
    private String level;
    private Integer totalStars;
    private Integer rank;
}
