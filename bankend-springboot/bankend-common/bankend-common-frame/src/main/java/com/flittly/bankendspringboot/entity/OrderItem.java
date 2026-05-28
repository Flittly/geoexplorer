package com.flittly.bankendspringboot.entity;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class OrderItem {
    private UUID id;
    private UUID orderId;
    private UUID packageId;
    private Integer price;
    private LocalDateTime createdAt;
}
