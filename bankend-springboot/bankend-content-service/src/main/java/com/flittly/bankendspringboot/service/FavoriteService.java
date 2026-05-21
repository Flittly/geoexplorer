package com.flittly.bankendspringboot.service;

import com.flittly.bankendspringboot.config.BusinessException;
import com.flittly.bankendspringboot.config.ErrorCode;
import com.flittly.bankendspringboot.dto.PostResponse;
import com.flittly.bankendspringboot.entity.Favorite;
import com.flittly.bankendspringboot.entity.Post;
import com.flittly.bankendspringboot.entity.User;
import com.flittly.bankendspringboot.entity.enums.PostType;
import com.flittly.bankendspringboot.entity.QuestionDetail;
import com.flittly.bankendspringboot.mapper.FavoriteMapper;
import com.flittly.bankendspringboot.mapper.LikeMapper;
import com.flittly.bankendspringboot.mapper.PostMapper;
import com.flittly.bankendspringboot.mapper.QuestionDetailMapper;
import com.flittly.bankendspringboot.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteMapper favoriteMapper;
    private final PostMapper postMapper;
    private final UserMapper userMapper;
    private final LikeMapper likeMapper;
    private final QuestionDetailMapper questionDetailMapper;

    @Transactional
    public boolean toggleFavorite(UUID userId, UUID postId) {
        Post post = postMapper.findById(postId);
        if (post == null) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        Favorite existing = favoriteMapper.findByUserAndPost(userId, postId);
        if (existing != null) {
            favoriteMapper.deleteByUserAndPost(userId, postId);
            postMapper.decrementFavoriteCount(postId);
            return false;
        } else {
            Favorite favorite = new Favorite();
            favorite.setId(UUID.randomUUID());
            favorite.setUserId(userId);
            favorite.setPostId(postId);
            favorite.setCreatedAt(LocalDateTime.now());
            favoriteMapper.insert(favorite);
            postMapper.incrementFavoriteCount(postId);
            return true;
        }
    }

    public boolean isFavorited(UUID userId, UUID postId) {
        return favoriteMapper.findByUserAndPost(userId, postId) != null;
    }

    public List<PostResponse> getFavorites(UUID userId, int page, int size) {
        int offset = (page - 1) * size;
        List<Favorite> favorites = favoriteMapper.findByUserId(userId, size, offset);
        return favorites.stream()
                .map(fav -> {
                    Post post = postMapper.findById(fav.getPostId());
                    if (post == null) return null;
                    return assemblePostResponse(post, userId);
                })
                .filter(r -> r != null)
                .collect(Collectors.toList());
    }

    private PostResponse assemblePostResponse(Post post, UUID currentUserId) {
        User author = userMapper.findById(post.getUserId());
        Boolean isLiked = likeMapper.findByUserAndTarget(currentUserId, post.getId(), "POST") != null;
        Boolean isAccepted = null;

        if (post.getPostType() == PostType.QUESTION) {
            QuestionDetail detail = questionDetailMapper.findByPostId(post.getId());
            if (detail != null) {
                isAccepted = detail.getIsAccepted();
            }
        }

        return PostResponse.builder()
                .id(post.getId())
                .userId(post.getUserId())
                .userName(author != null ? author.getName() : null)
                .userAvatar(author != null ? author.getAvatarUrl() : null)
                .userLevel(author != null && author.getLevel() != null ? author.getLevel().name() : null)
                .postType(post.getPostType().name().toLowerCase())
                .title(post.getTitle())
                .content(post.getContent())
                .images(post.getImages())
                .status(post.getStatus().name().toLowerCase())
                .likeCount(post.getLikeCount())
                .commentCount(post.getCommentCount())
                .favoriteCount(post.getFavoriteCount())
                .isTop(post.getIsTop())
                .isLiked(isLiked)
                .isFavorited(true)
                .isAccepted(isAccepted)
                .createdAt(post.getCreatedAt())
                .build();
    }
}
