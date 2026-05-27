package com.flittly.bankendspringboot.dto;

import lombok.Data;

@Data
public class TriviaCreateRequest {
    private String title;
    private String description;
    private String imageUrl;
    private String location;
    private String region;
    private String featuredDate;
}
