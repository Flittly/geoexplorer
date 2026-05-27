package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.Level;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.UUID;

@Mapper
public interface LevelMapper {
    List<Level> findAll();
    Level findById(@Param("id") UUID id);
    int insert(Level level);
    int update(Level level);
}
