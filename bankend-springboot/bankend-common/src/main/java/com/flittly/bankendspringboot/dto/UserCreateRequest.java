package com.flittly.bankendspringboot.dto;

import lombok.Data;

@Data
public class UserCreateRequest {
    private String name;
    private String avatarUrl;
}
