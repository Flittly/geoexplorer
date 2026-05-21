package com.flittly.bankendspringboot.service;

import com.flittly.bankendspringboot.config.BusinessException;
import com.flittly.bankendspringboot.config.ErrorCode;
import com.flittly.bankendspringboot.entity.Comment;
import com.flittly.bankendspringboot.entity.Like;
import com.flittly.bankendspringboot.entity.Post;
import com.flittly.bankendspringboot.entity.enums.TargetType;
import com.flittly.bankendspringboot.mapper.CommentMapper;
import com.flittly.bankendspringboot.mapper.LikeMapper;
import com.flittly.bankendspringboot.mapper.PostMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeMapper likeMapper;
    private final PostMapper postMapper;
    private final CommentMapper commentMapper;

    @Transactional
    public boolean toggleLike(UUID userId, UUID targetId, String targetType) {
        TargetType type = TargetType.valueOf(targetType.toUpperCase());
        Like existing = likeMapper.findByUserAndTarget(userId, targetId, targetType.toUpperCase());

        if (existing != null) {
            likeMapper.deleteByUserAndTarget(userId, targetId, targetType.toUpperCase());
            if (type == TargetType.POST) {
                postMapper.decrementLikeCount(targetId);
            } else {
                commentMapper.decrementLikeCount(targetId);
            }
            return false;
        } else {
            Like like = new Like();
            like.setId(UUID.randomUUID());
            like.setUserId(userId);
            like.setTargetId(targetId);
            like.setTargetType(type);
            like.setCreatedAt(LocalDateTime.now());
            likeMapper.insert(like);

            if (type == TargetType.POST) {
                Post post = postMapper.findById(targetId);
                if (post == null) {
                    throw new BusinessException(ErrorCode.POST_NOT_FOUND);
                }
                postMapper.incrementLikeCount(targetId);
            } else {
                Comment comment = commentMapper.findById(targetId);
                if (comment == null) {
                    throw new BusinessException(ErrorCode.COMMENT_NOT_FOUND);
                }
                commentMapper.incrementLikeCount(targetId);
            }
            return true;
        }
    }

    public boolean isLiked(UUID userId, UUID targetId, String targetType) {
        return likeMapper.findByUserAndTarget(userId, targetId, targetType.toUpperCase()) != null;
    }
}
