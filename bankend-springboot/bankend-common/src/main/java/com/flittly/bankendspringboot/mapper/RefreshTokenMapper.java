package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.RefreshToken;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.time.LocalDateTime;
import java.util.UUID;

@Mapper
public interface RefreshTokenMapper {
    RefreshToken findByToken(@Param("token") String token);
    int insert(RefreshToken refreshToken);
    int revokeToken(@Param("token") String token);
    int revokeAllByUserId(@Param("userId") UUID userId);
    int deleteExpired(@Param("now") LocalDateTime now);
}
