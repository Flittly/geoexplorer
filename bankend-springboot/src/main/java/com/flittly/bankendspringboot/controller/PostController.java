package com.flittly.bankendspringboot.controller;

import com.flittly.bankendspringboot.dto.*;
import com.flittly.bankendspringboot.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<List<PostResponse>> getPosts(
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "approved") String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        String userId = getCurrentUserIdOrNull();
        UUID uid = userId != null ? UUID.fromString(userId) : null;
        return ResponseEntity.ok(postService.getPosts(type, status, uid, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable UUID id) {
        String userId = getCurrentUserIdOrNull();
        UUID uid = userId != null ? UUID.fromString(userId) : null;
        return ResponseEntity.ok(postService.getPostById(id, uid));
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@RequestBody PostCreateRequest request) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(postService.createPost(UUID.fromString(userId), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(@PathVariable UUID id, @RequestBody PostCreateRequest request) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(postService.updatePost(id, UUID.fromString(userId), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deletePost(@PathVariable UUID id) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        postService.deletePost(id, UUID.fromString(userId));
        return ResponseEntity.ok(MessageResponse.success("删除成功"));
    }

    private String getCurrentUserIdOrNull() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            return auth.getName();
        }
        return null;
    }
}
