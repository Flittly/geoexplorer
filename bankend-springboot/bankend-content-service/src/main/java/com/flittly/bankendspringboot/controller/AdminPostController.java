package com.flittly.bankendspringboot.controller;

import com.flittly.bankendspringboot.dto.MessageResponse;
import com.flittly.bankendspringboot.dto.PostResponse;
import com.flittly.bankendspringboot.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/posts")
@RequiredArgsConstructor
public class AdminPostController {

    private final PostService postService;

    @GetMapping("/pending")
    public ResponseEntity<List<PostResponse>> getPendingPosts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(postService.getPosts(null, "pending", null, page, size));
    }

    @GetMapping("/all")
    public ResponseEntity<List<PostResponse>> getAllPosts(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(postService.getPosts(type, status, null, page, size));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<MessageResponse> approvePost(@PathVariable UUID id) {
        postService.approvePost(id);
        return ResponseEntity.ok(MessageResponse.success("审核通过"));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<MessageResponse> rejectPost(@PathVariable UUID id) {
        postService.rejectPost(id);
        return ResponseEntity.ok(MessageResponse.success("已拒绝"));
    }
}
