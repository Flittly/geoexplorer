package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.QuizResult;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.UUID;

@Mapper
public interface QuizResultMapper {
    List<QuizResult> findByUserId(@Param("userId") UUID userId);
    int insert(QuizResult quizResult);
}
