package com.flittly.bankendspringboot.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class OrderItemResponse {
    private UUID id;
    private UUID packageId;
    private String packageTitle;
    private String packageCoverUrl;
    private Integer price;
}
