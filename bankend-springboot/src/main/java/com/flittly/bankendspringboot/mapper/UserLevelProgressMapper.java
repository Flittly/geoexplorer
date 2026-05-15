package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.UserLevelProgress;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.UUID;

@Mapper
public interface UserLevelProgressMapper {
    List<UserLevelProgress> findByUserId(@Param("userId") UUID userId);
    UserLevelProgress findByUserIdAndLevelId(@Param("userId") UUID userId, @Param("levelId") UUID levelId);
    int insert(UserLevelProgress progress);
    int update(UserLevelProgress progress);
}
