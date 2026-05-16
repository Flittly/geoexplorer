package com.flittly.bankendspringboot.controller;

import com.flittly.bankendspringboot.dto.PostResponse;
import com.flittly.bankendspringboot.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> toggleFavorite(@RequestBody Map<String, UUID> body) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean favorited = favoriteService.toggleFavorite(UUID.fromString(userId), body.get("postId"));
        return ResponseEntity.ok(Map.of("favorited", favorited));
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> getFavorites(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(favoriteService.getFavorites(UUID.fromString(userId), page, size));
    }
}
