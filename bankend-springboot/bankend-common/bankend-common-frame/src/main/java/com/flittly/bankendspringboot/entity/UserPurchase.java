package com.flittly.bankendspringboot.entity;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UserPurchase {
    private UUID id;
    private UUID userId;
    private UUID packageId;
    private UUID orderId;
    private LocalDateTime purchasedAt;
    private LocalDateTime expireAt;
    private Boolean isExpired;
}
