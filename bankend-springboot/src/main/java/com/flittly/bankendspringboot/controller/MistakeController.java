package com.flittly.bankendspringboot.controller;

import com.flittly.bankendspringboot.dto.MistakeCreateRequest;
import com.flittly.bankendspringboot.dto.MistakeUpdateRequest;
import com.flittly.bankendspringboot.entity.Mistake;
import com.flittly.bankendspringboot.service.MistakeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/mistakes")
@RequiredArgsConstructor
public class MistakeController {

    private final MistakeService mistakeService;

    @GetMapping("/")
    public ResponseEntity<List<Mistake>> getMistakes(
            @RequestParam(required = false) UUID userId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String masteryLevel,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(defaultValue = "0") int offset) {
        return ResponseEntity.ok(mistakeService.getMistakes(userId, category, masteryLevel, limit, offset));
    }

    @GetMapping("/{mistake_id}")
    public ResponseEntity<Mistake> getMistakeById(@PathVariable("mistake_id") UUID mistakeId) {
        Mistake mistake = mistakeService.getMistakeById(mistakeId);
        if (mistake == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(mistake);
    }

    @PostMapping("/")
    public ResponseEntity<Mistake> createMistake(@RequestBody MistakeCreateRequest request) {
        return ResponseEntity.ok(mistakeService.createMistake(request));
    }

    @PutMapping("/{mistake_id}")
    public ResponseEntity<Mistake> updateMistake(@PathVariable("mistake_id") UUID mistakeId, @RequestBody MistakeUpdateRequest request) {
        try {
            return ResponseEntity.ok(mistakeService.updateMistake(mistakeId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{mistake_id}")
    public ResponseEntity<Map<String, String>> deleteMistake(@PathVariable("mistake_id") UUID mistakeId) {
        mistakeService.deleteMistake(mistakeId);
        return ResponseEntity.ok(Map.of("message", "Mistake deleted successfully"));
    }
}
