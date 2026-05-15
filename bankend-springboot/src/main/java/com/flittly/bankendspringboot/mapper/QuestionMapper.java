package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.Question;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.UUID;

@Mapper
public interface QuestionMapper {
    List<Question> findByLevelId(@Param("levelId") UUID levelId);
    Question findById(@Param("id") UUID id);
    int insert(Question question);
}
