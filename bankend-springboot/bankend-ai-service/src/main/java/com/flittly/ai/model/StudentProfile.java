package com.flittly.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfile {
    private Long id;
    private Long userId;
    private String name;
    private String grade;
    private String learningStyle;
    private List<String> interests;
    private List<String> goals;
    private String weakAreas;
    private String createdAt;
    private String updatedAt;
}
