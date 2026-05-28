package com.flittly.bankendspringboot.entity;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class Order {
    private UUID id;
    private UUID userId;
    private String orderNo;
    private Integer totalAmount;
    private String status;
    private String paymentMethod;
    private LocalDateTime paymentTime;
    private LocalDateTime expireTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
