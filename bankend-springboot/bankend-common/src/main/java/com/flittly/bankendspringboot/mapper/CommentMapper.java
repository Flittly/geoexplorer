package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.Comment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.UUID;

@Mapper
public interface CommentMapper {
    List<Comment> findByPostId(@Param("postId") UUID postId, @Param("limit") int limit, @Param("offset") int offset);
    Comment findById(@Param("id") UUID id);
    int insert(Comment comment);
    int deleteById(@Param("id") UUID id);
    int updateAccepted(@Param("id") UUID id, @Param("isAccepted") boolean isAccepted);
    int incrementLikeCount(@Param("id") UUID id);
    int decrementLikeCount(@Param("id") UUID id);
}
