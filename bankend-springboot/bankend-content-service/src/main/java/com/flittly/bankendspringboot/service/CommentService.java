package com.flittly.bankendspringboot.service;

import com.flittly.bankendspringboot.config.BusinessException;
import com.flittly.bankendspringboot.config.ErrorCode;
import com.flittly.bankendspringboot.dto.CommentCreateRequest;
import com.flittly.bankendspringboot.dto.CommentResponse;
import com.flittly.bankendspringboot.entity.Comment;
import com.flittly.bankendspringboot.entity.Post;
import com.flittly.bankendspringboot.entity.QuestionDetail;
import com.flittly.bankendspringboot.entity.User;
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
public class CommentService {

    private final CommentMapper commentMapper;
    private final PostMapper postMapper;
    private final QuestionDetailMapper questionDetailMapper;
    private final UserMapper userMapper;
    private final LikeMapper likeMapper;

    public List<CommentResponse> getComments(UUID postId, UUID currentUserId, int page, int size) {
        int offset = (page - 1) * size;
        List<Comment> comments = commentMapper.findByPostId(postId, size, offset);
        return comments.stream()
                .map(comment -> assembleCommentResponse(comment, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse createComment(UUID postId, UUID userId, CommentCreateRequest request) {
        Post post = postMapper.findById(postId);
        if (post == null) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        Comment comment = new Comment();
        comment.setId(UUID.randomUUID());
        comment.setPostId(postId);
        comment.setUserId(userId);
        comment.setParentId(request.getParentId());
        comment.setContent(request.getContent());
        comment.setImages(request.getImages() != null ? request.getImages() : new ArrayList<>());
        comment.setIsAccepted(false);
        comment.setLikeCount(0);
        comment.setCreatedAt(LocalDateTime.now());

        int rows = commentMapper.insert(comment);
        if (rows == 0) {
            throw new BusinessException(ErrorCode.COMMENT_CREATE_FAILED);
        }

        postMapper.incrementCommentCount(postId);

        return assembleCommentResponse(comment, userId);
    }

    @Transactional
    public void deleteComment(UUID commentId, UUID userId) {
        Comment comment = commentMapper.findById(commentId);
        if (comment == null) {
            throw new BusinessException(ErrorCode.COMMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        if (!comment.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, HttpStatus.FORBIDDEN);
        }

        commentMapper.deleteById(commentId);
        postMapper.decrementCommentCount(comment.getPostId());
    }

    @Transactional
    public void acceptComment(UUID commentId, UUID userId) {
        Comment comment = commentMapper.findById(commentId);
        if (comment == null) {
            throw new BusinessException(ErrorCode.COMMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        Post post = postMapper.findById(comment.getPostId());
        if (post == null) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        if (!post.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, HttpStatus.FORBIDDEN);
        }
        if (post.getPostType() != PostType.QUESTION) {
            throw new BusinessException(ErrorCode.POST_NOT_QUESTION);
        }

        commentMapper.updateAccepted(commentId, true);
        questionDetailMapper.updateAccepted(post.getId(), true, commentId);
    }

    private CommentResponse assembleCommentResponse(Comment comment, UUID currentUserId) {
        User author = userMapper.findById(comment.getUserId());
        Boolean isLiked = false;

        if (currentUserId != null) {
            isLiked = likeMapper.findByUserAndTarget(currentUserId, comment.getId(), "COMMENT") != null;
        }

        return CommentResponse.builder()
                .id(comment.getId())
                .postId(comment.getPostId())
                .userId(comment.getUserId())
                .userName(author != null ? author.getName() : null)
                .userAvatar(author != null ? author.getAvatarUrl() : null)
                .parentId(comment.getParentId())
                .content(comment.getContent())
                .images(comment.getImages())
                .isAccepted(comment.getIsAccepted())
                .likeCount(comment.getLikeCount())
                .isLiked(isLiked)
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
