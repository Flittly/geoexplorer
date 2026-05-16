package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.Post;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.UUID;

@Mapper
public interface PostMapper {
    List<Post> findByFilters(@Param("postType") String postType, @Param("status") String status,
                             @Param("userId") UUID userId, @Param("limit") int limit, @Param("offset") int offset);
    Post findById(@Param("id") UUID id);
    int insert(Post post);
    int update(Post post);
    int deleteById(@Param("id") UUID id);
    int incrementLikeCount(@Param("id") UUID id);
    int decrementLikeCount(@Param("id") UUID id);
    int incrementCommentCount(@Param("id") UUID id);
    int decrementCommentCount(@Param("id") UUID id);
    int incrementFavoriteCount(@Param("id") UUID id);
    int decrementFavoriteCount(@Param("id") UUID id);
}
