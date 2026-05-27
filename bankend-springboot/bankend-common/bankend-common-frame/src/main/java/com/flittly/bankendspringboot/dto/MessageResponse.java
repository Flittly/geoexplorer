package com.flittly.bankendspringboot.dto;

import com.flittly.bankendspringboot.config.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageResponse {
    private int code;
    private String message;
    private boolean success;

    public static MessageResponse success(String message) {
        return MessageResponse.builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message(message)
                .success(true)
                .build();
    }

    public static MessageResponse error(ErrorCode errorCode) {
        return MessageResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .success(false)
                .build();
    }

    public static MessageResponse error(int code, String message) {
        return MessageResponse.builder()
                .code(code)
                .message(message)
                .success(false)
                .build();
    }
}
