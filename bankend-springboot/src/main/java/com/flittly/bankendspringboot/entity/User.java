package com.flittly.bankendspringboot.entity;

import com.flittly.bankendspringboot.entity.enums.GenderType;
import com.flittly.bankendspringboot.entity.enums.UserLevel;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class User {
    private UUID id;
    private String name;
    private String email;
    private String phone;
    private String passwordHash;
    private String avatarUrl;
    private GenderType gender;
    private Integer age;
    private UserLevel level;
    private Integer totalStars;
    private Boolean isVerified;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
