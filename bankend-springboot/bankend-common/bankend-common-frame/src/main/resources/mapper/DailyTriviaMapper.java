package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.DailyTrivia;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Mapper
public interface DailyTriviaMapper {
    DailyTrivia findByFeaturedDate(@Param("date") LocalDate date);
    List<DailyTrivia> findAll(@Param("limit") int limit, @Param("offset") int offset);
    DailyTrivia findById(@Param("id") UUID id);
    int insert(DailyTrivia trivia);
}
