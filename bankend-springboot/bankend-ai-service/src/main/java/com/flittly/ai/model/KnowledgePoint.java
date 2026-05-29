package com.flittly.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KnowledgePoint {
    private Long id;
    private Long courseId;
    private String name;
    private String description;
    private Long parentId;
    private Integer level;
}
