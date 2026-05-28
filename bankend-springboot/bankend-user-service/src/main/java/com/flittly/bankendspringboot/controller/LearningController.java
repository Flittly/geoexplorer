package com.flittly.bankendspringboot.controller;

import com.flittly.bankendspringboot.dto.*;
import com.flittly.bankendspringboot.service.LearningService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/my-courses")
@RequiredArgsConstructor
public class LearningController {
    private final LearningService learningService;

    @GetMapping("/")
    public ResponseEntity<List<MyCourseResponse>> getMyCourses(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(learningService.getMyCourses(UUID.fromString(userId)));
    }

    @PostMapping("/progress")
    public ResponseEntity<?> updateProgress(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody LearningProgressRequest request) {
        learningService.updateProgress(UUID.fromString(userId), request);
        return ResponseEntity.ok(MessageResponse.success("Progress updated"));
    }

    @PostMapping("/complete")
    public ResponseEntity<?> completeCourse(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam UUID courseId) {
        learningService.completeCourse(UUID.fromString(userId), courseId);
        return ResponseEntity.ok(MessageResponse.success("Course completed"));
    }
}
