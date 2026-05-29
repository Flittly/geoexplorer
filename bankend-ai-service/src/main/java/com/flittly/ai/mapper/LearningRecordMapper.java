package com.flittly.ai.mapper;

import com.flittly.ai.model.LearningRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface LearningRecordMapper {
    List<LearningRecord> selectByStudentIdAndCourseId(
        @Param("studentId") Long studentId,
        @Param("courseId") Long courseId
    );

    List<LearningRecord> selectByStudentId(
        @Param("studentId") Long studentId,
        @Param("days") Integer days
    );

    int insert(LearningRecord record);
}
