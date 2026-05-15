package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.VerificationCode;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface VerificationCodeMapper {
    List<VerificationCode> findActiveByTargetAndType(@Param("target") String target, @Param("type") String type, @Param("now") LocalDateTime now);
    int markAsUsed(@Param("target") String target, @Param("type") String type);
    int insert(VerificationCode code);
    int deleteExpired(@Param("now") LocalDateTime now);
}
