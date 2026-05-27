package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.Favorite;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.UUID;

@Mapper
public interface FavoriteMapper {
    Favorite findByUserAndPost(@Param("userId") UUID userId, @Param("postId") UUID postId);
    List<Favorite> findByUserId(@Param("userId") UUID userId, @Param("limit") int limit, @Param("offset") int offset);
    int insert(Favorite favorite);
    int deleteByUserAndPost(@Param("userId") UUID userId, @Param("postId") UUID postId);
}
