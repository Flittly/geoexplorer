package com.flittly.ai.tool;

import com.flittly.ai.mapper.LearningRecordMapper;
import com.flittly.ai.model.LearningRecord;
import io.agentscope.core.tool.Tool;
import io.agentscope.core.tool.ToolParam;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@RequiredArgsConstructor
public class QueryLearningRecordsTool {
    private final LearningRecordMapper learningRecordMapper;

    @Tool(description = "查询学生的学习记录，包括答题记录和成绩")
    public List<LearningRecord> queryLearningRecords(
            @ToolParam(description = "学生ID") Long studentId,
            @ToolParam(description = "课程ID，可选") Long courseId,
            @ToolParam(description = "查询最近N天的记录，默认30天", defaultValue = "30") Integer days) {
        if (courseId != null) {
            return learningRecordMapper.selectByStudentIdAndCourseId(studentId, courseId);
        }
        return learningRecordMapper.selectByStudentId(studentId, days);
    }
}
