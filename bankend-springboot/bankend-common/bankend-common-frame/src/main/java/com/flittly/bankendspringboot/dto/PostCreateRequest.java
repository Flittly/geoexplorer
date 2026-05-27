package com.flittly.bankendspringboot.dto;

import lombok.Data;
import java.util.List;

@Data
public class PostCreateRequest {
    private String postType;
    private String title;
    private String content;
    private List<String> images;
}
