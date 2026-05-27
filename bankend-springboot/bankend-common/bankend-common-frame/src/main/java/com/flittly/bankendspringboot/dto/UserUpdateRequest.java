package com.flittly.bankendspringboot.dto;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String name;
    private String avatarUrl;
    private String level;
    private Integer totalStars;
    private String gender;
    private Integer age;
}
