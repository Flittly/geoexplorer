package com.flittly.bankendspringboot.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String phone;
    private String code;
    private String name;
    private String password;
    private String avatarUrl;
}
