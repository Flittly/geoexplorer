package com.flittly.ai.tool;

import com.flittly.ai.model.StudentProfile;
import io.agentscope.core.tool.Tool;
import io.agentscope.core.tool.ToolParam;
import org.springframework.stereotype.Component;
import java.util.Arrays;

@Component
public class QueryStudentProfileTool {

    @Tool(description = "查询学生档案，获取学生的基本信息和学习偏好")
    public StudentProfile queryStudentProfile(
            @ToolParam(description = "学生ID") Long studentId) {
        return StudentProfile.builder()
                .id(studentId)
                .userId(studentId)
                .name("学生" + studentId)
                .grade("高三")
                .learningStyle("visual")
                .interests(Arrays.asList("数学", "物理"))
                .goals(Arrays.asList("提高成绩", "考上好大学"))
                .weakAreas("英语语法")
                .build();
    }
}
