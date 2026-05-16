package com.flittly.bankendspringboot.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class CommentCreateRequest {
    private UUID parentId;
    private String content;
    private List<String> images;
}
