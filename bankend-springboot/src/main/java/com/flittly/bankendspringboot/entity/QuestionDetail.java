package com.flittly.bankendspringboot.entity;

import lombok.Data;
import java.util.UUID;

@Data
public class QuestionDetail {
    private UUID postId;
    private Boolean isAccepted;
    private UUID acceptedAnswerId;
}
