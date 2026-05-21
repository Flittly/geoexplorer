package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.Like;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.UUID;

@Mapper
public interface LikeMapper {
    Like findByUserAndTarget(@Param("userId") UUID userId, @Param("targetId") UUID targetId,
                             @Param("targetType") String targetType);
    int insert(Like like);
    int deleteByUserAndTarget(@Param("userId") UUID userId, @Param("targetId") UUID targetId,
                              @Param("targetType") String targetType);
}
