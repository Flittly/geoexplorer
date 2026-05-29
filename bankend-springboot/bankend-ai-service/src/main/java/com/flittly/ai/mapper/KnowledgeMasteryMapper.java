package com.flittly.ai.mapper;

import com.flittly.ai.model.KnowledgeMastery;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface KnowledgeMasteryMapper {
    List<KnowledgeMastery> selectByStudentIdAndCourseId(@Param("studentId") Long studentId, @Param("courseId") Long courseId);
}
