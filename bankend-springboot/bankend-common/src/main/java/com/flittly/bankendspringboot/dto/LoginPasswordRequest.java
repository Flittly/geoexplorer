package com.flittly.bankendspringboot.dto;

import lombok.Data;

@Data
public class LoginPasswordRequest {
    private String email;
    private String phone;
    private String password;
}
