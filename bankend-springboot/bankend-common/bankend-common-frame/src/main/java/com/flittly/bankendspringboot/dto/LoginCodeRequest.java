package com.flittly.bankendspringboot.dto;

import lombok.Data;

@Data
public class LoginCodeRequest {
    private String email;
    private String phone;
    private String code;
}
