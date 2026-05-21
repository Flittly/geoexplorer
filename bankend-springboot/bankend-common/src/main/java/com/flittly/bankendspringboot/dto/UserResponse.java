package com.flittly.bankendspringboot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private UUID id;
    private String name;
    private String email;
    private String phone;
    private String avatarUrl;
    private String level;
    private Integer totalStars;
    private Boolean isVerified;
    private LocalDateTime createdAt;
    private String gender;
    private Integer age;
}
