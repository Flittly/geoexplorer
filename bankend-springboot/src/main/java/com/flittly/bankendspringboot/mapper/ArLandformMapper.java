package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.ArLandform;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.UUID;

@Mapper
public interface ArLandformMapper {
    List<ArLandform> findAll(@Param("landformType") String landformType);
    ArLandform findById(@Param("id") UUID id);
    int insert(ArLandform landform);
}
