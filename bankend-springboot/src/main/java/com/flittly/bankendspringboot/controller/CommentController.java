package com.flittly.bankendspringboot.controller;

import com.flittly.bankendspringboot.dto.*;
import com.flittly.bankendspringboot.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/api/posts/{postId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(
            @PathVariable UUID postId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        String userId = getCurrentUserIdOrNull();
        UUID uid = userId != null ? UUID.fromString(userId) : null;
        return ResponseEntity.ok(commentService.getComments(postId, uid, page, size));
    }

    @PostMapping("/api/posts/{postId}/comments")
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable UUID postId,
            @RequestBody CommentCreateRequest request) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(commentService.createComment(postId, UUID.fromString(userId), request));
    }

    @DeleteMapping("/api/comments/{id}")
    public ResponseEntity<MessageResponse> deleteComment(@PathVariable UUID id) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        commentService.deleteComment(id, UUID.fromString(userId));
        return ResponseEntity.ok(MessageResponse.success("删除成功"));
    }

    @PostMapping("/api/comments/{id}/accept")
    public ResponseEntity<MessageResponse> acceptComment(@PathVariable UUID id) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        commentService.acceptComment(id, UUID.fromString(userId));
        return ResponseEntity.ok(MessageResponse.success("采纳成功"));
    }

    private String getCurrentUserIdOrNull() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            return auth.getName();
        }
        return null;
    }
}
