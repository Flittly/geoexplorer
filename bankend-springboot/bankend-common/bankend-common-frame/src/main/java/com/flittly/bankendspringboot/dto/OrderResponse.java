package com.flittly.bankendspringboot.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class OrderResponse {
    private UUID id;
    private String orderNo;
    private Integer totalAmount;
    private String status;
    private String paymentMethod;
    private LocalDateTime paymentTime;
    private LocalDateTime expireTime;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
}
