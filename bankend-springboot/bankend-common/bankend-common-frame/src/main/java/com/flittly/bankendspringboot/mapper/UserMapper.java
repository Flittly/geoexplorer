package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.dto.LeaderboardEntry;
import com.flittly.bankendspringboot.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.UUID;

@Mapper
public interface UserMapper {
    User findById(@Param("id") UUID id);
    User findByEmail(@Param("email") String email);
    User findByPhone(@Param("phone") String phone);
    User findByEmailOrPhone(@Param("email") String email, @Param("phone") String phone);
    int insert(User user);
    int update(User user);
    int updateStarsAndLevel(@Param("id") UUID id, @Param("totalStars") Integer totalStars, @Param("level") String level);
    List<LeaderboardEntry> findAllOrderByStars();
}
