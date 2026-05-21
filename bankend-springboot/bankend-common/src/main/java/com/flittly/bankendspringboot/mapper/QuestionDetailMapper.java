package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.QuestionDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.UUID;

@Mapper
public interface QuestionDetailMapper {
    QuestionDetail findByPostId(@Param("postId") UUID postId);
    int insert(QuestionDetail detail);
    int updateAccepted(@Param("postId") UUID postId, @Param("isAccepted") boolean isAccepted,
                       @Param("acceptedAnswerId") UUID acceptedAnswerId);
}
