package com.flittly.bankendspringboot.controller;

import com.flittly.bankendspringboot.dto.LevelCreateRequest;
import com.flittly.bankendspringboot.dto.LevelProgressUpdateRequest;
import com.flittly.bankendspringboot.entity.Level;
import com.flittly.bankendspringboot.entity.UserLevelProgress;
import com.flittly.bankendspringboot.service.LevelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/levels")
@RequiredArgsConstructor
public class LevelController {

    private final LevelService levelService;

    @GetMapping({"", "/"})
    public ResponseEntity<List<Level>> getAllLevels() {
        try {
            List<Level> levels = levelService.getAllLevels();
            System.out.println("Levels found: " + levels.size());
            return ResponseEntity.ok(levels);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/{level_id}")
    public ResponseEntity<Level> getLevelById(@PathVariable("level_id") UUID levelId) {
        Level level = levelService.getLevelById(levelId);
        if (level == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(level);
    }

    @PostMapping("/")
    public ResponseEntity<Level> createLevel(@RequestBody LevelCreateRequest request) {
        return ResponseEntity.ok(levelService.createLevel(request));
    }

    @GetMapping("/user/{user_id}/progress")
    public ResponseEntity<List<UserLevelProgress>> getUserLevelProgress(
            @PathVariable("user_id") UUID userId,
            @RequestHeader(value = "X-User-Id", required = false) String xUserId) {
        if (xUserId == null) {
            return ResponseEntity.status(401).build();
        }
        if (!xUserId.equals(userId.toString())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(levelService.getUserLevelProgress(userId));
    }

    @PutMapping("/user/{user_id}/progress/{level_id}")
    public ResponseEntity<UserLevelProgress> updateLevelProgress(
            @PathVariable("user_id") UUID userId,
            @PathVariable("level_id") UUID levelId,
            @RequestBody LevelProgressUpdateRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String xUserId) {
        if (xUserId == null) {
            return ResponseEntity.status(401).build();
        }
        if (!xUserId.equals(userId.toString())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(levelService.updateLevelProgress(userId, levelId, request));
    }
}
