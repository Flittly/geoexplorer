package com.flittly.bankendspringboot.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class OrderCreateRequest {
    private List<UUID> packageIds;
}
