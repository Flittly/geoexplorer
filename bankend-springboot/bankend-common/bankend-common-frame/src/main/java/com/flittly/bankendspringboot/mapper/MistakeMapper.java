package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.Mistake;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.UUID;

@Mapper
public interface MistakeMapper {
    List<Mistake> findByFilters(@Param("userId") UUID userId, @Param("category") String category,
                                @Param("masteryLevel") String masteryLevel,
                                @Param("limit") int limit, @Param("offset") int offset);
    Mistake findById(@Param("id") UUID id);
    int insert(Mistake mistake);
    int update(Mistake mistake);
    int deleteById(@Param("id") UUID id);
}
