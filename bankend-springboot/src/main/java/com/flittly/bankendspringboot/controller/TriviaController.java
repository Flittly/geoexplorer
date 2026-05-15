package com.flittly.bankendspringboot.controller;

import com.flittly.bankendspringboot.dto.TriviaCreateRequest;
import com.flittly.bankendspringboot.entity.DailyTrivia;
import com.flittly.bankendspringboot.service.TriviaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/trivia")
@RequiredArgsConstructor
public class TriviaController {

    private final TriviaService triviaService;

    @GetMapping("/today")
    public ResponseEntity<DailyTrivia> getTodayTrivia() {
        DailyTrivia trivia = triviaService.getTodayTrivia();
        if (trivia == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(trivia);
    }

    @GetMapping("/")
    public ResponseEntity<List<DailyTrivia>> getAllTrivia(
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "0") int offset) {
        return ResponseEntity.ok(triviaService.getAllTrivia(limit, offset));
    }

    @GetMapping("/{trivia_id}")
    public ResponseEntity<DailyTrivia> getTriviaById(@PathVariable("trivia_id") UUID triviaId) {
        DailyTrivia trivia = triviaService.getTriviaById(triviaId);
        if (trivia == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(trivia);
    }

    @PostMapping("/")
    public ResponseEntity<DailyTrivia> createTrivia(@RequestBody TriviaCreateRequest request) {
        return ResponseEntity.ok(triviaService.createTrivia(request));
    }
}
