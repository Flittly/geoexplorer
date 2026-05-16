package com.flittly.bankendspringboot.controller;

import com.flittly.bankendspringboot.service.LikeService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> toggleLike(@RequestBody LikeRequest request) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean liked = likeService.toggleLike(UUID.fromString(userId), request.getTargetId(), request.getTargetType());
        return ResponseEntity.ok(Map.of("liked", liked));
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> isLiked(
            @RequestParam UUID targetId,
            @RequestParam String type) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean liked = likeService.isLiked(UUID.fromString(userId), targetId, type);
        return ResponseEntity.ok(Map.of("liked", liked));
    }

    @Data
    static class LikeRequest {
        private UUID targetId;
        private String targetType;
    }
}
