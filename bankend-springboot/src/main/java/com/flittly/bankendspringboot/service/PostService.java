package com.flittly.bankendspringboot.service;

import com.flittly.bankendspringboot.config.BusinessException;
import com.flittly.bankendspringboot.config.ErrorCode;
import com.flittly.bankendspringboot.dto.PostCreateRequest;
import com.flittly.bankendspringboot.dto.PostResponse;
import com.flittly.bankendspringboot.entity.Post;
import com.flittly.bankendspringboot.entity.QuestionDetail;
import com.flittly.bankendspringboot.entity.User;
import com.flittly.bankendspringboot.entity.enums.PostStatus;
import com.flittly.bankendspringboot.entity.enums.PostType;
import com.flittly.bankendspringboot.mapper.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostMapper postMapper;
    private final QuestionDetailMapper questionDetailMapper;
    private final UserMapper userMapper;
    private final LikeMapper likeMapper;
    private final FavoriteMapper favoriteMapper;

    public List<PostResponse> getPosts(String postType, String status, UUID userId, int page, int size) {
        String queryStatus = userId == null ? "approved" : status;
        int offset = (page - 1) * size;
        List<Post> posts = postMapper.findByFilters(postType, queryStatus, null, size, offset);
        return posts.stream()
                .map(post -> assemblePostResponse(post, userId))
                .collect(Collectors.toList());
    }

    public PostResponse getPostById(UUID postId, UUID currentUserId) {
        Post post = postMapper.findById(postId);
        if (post == null) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return assemblePostResponse(post, currentUserId);
    }

    @Transactional
    public PostResponse createPost(UUID userId, PostCreateRequest request) {
        Post post = new Post();
        post.setId(UUID.randomUUID());
        post.setUserId(userId);
        post.setPostType(PostType.valueOf(request.getPostType().toUpperCase()));
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setImages(request.getImages() != null ? request.getImages() : new ArrayList<>());
        post.setStatus(PostStatus.PENDING);
        post.setLikeCount(0);
        post.setCommentCount(0);
        post.setFavoriteCount(0);
        post.setIsTop(false);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());

        int rows = postMapper.insert(post);
        if (rows == 0) {
            throw new BusinessException(ErrorCode.POST_CREATE_FAILED);
        }

        if (post.getPostType() == PostType.QUESTION) {
            QuestionDetail detail = new QuestionDetail();
            detail.setPostId(post.getId());
            detail.setIsAccepted(false);
            questionDetailMapper.insert(detail);
        }

        return assemblePostResponse(post, userId);
    }

    @Transactional
    public PostResponse updatePost(UUID postId, UUID userId, PostCreateRequest request) {
        Post post = postMapper.findById(postId);
        if (post == null) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        if (!post.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, HttpStatus.FORBIDDEN);
        }

        if (request.getTitle() != null) post.setTitle(request.getTitle());
        if (request.getContent() != null) post.setContent(request.getContent());
        if (request.getImages() != null) post.setImages(request.getImages());
        post.setUpdatedAt(LocalDateTime.now());

        postMapper.update(post);
        return assemblePostResponse(post, userId);
    }

    @Transactional
    public void deletePost(UUID postId, UUID userId) {
        Post post = postMapper.findById(postId);
        if (post == null) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        if (!post.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, HttpStatus.FORBIDDEN);
        }
        postMapper.deleteById(postId);
    }

    public void approvePost(UUID postId) {
        Post post = postMapper.findById(postId);
        if (post == null) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        post.setStatus(PostStatus.APPROVED);
        post.setUpdatedAt(LocalDateTime.now());
        postMapper.update(post);
    }

    public void rejectPost(UUID postId) {
        Post post = postMapper.findById(postId);
        if (post == null) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        post.setStatus(PostStatus.REJECTED);
        post.setUpdatedAt(LocalDateTime.now());
        postMapper.update(post);
    }

    private PostResponse assemblePostResponse(Post post, UUID currentUserId) {
        User author = userMapper.findById(post.getUserId());
        Boolean isLiked = false;
        Boolean isFavorited = false;
        Boolean isAccepted = null;

        if (currentUserId != null) {
            isLiked = likeMapper.findByUserAndTarget(currentUserId, post.getId(), "POST") != null;
            isFavorited = favoriteMapper.findByUserAndPost(currentUserId, post.getId()) != null;
        }

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
                .isFavorited(isFavorited)
                .isAccepted(isAccepted)
                .createdAt(post.getCreatedAt())
                .build();
    }
}
