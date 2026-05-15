package com.flittly.bankendspringboot.controller;

import com.flittly.bankendspringboot.dto.QuestionCreateRequest;
import com.flittly.bankendspringboot.dto.QuizSubmitRequest;
import com.flittly.bankendspringboot.dto.QuizSubmitResponse;
import com.flittly.bankendspringboot.entity.Question;
import com.flittly.bankendspringboot.entity.QuizResult;
import com.flittly.bankendspringboot.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping("/level/{level_id}")
    public ResponseEntity<List<Question>> getQuestionsByLevel(@PathVariable("level_id") UUID levelId) {
        return ResponseEntity.ok(questionService.getQuestionsByLevelId(levelId));
    }

    @GetMapping("/{question_id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable("question_id") UUID questionId) {
        Question question = questionService.getQuestionById(questionId);
        if (question == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(question);
    }

    @PostMapping("/")
    public ResponseEntity<Question> createQuestion(@RequestBody QuestionCreateRequest request) {
        return ResponseEntity.ok(questionService.createQuestion(request));
    }

    @PostMapping("/submit")
    public ResponseEntity<QuizSubmitResponse> submitQuizAnswer(@RequestBody QuizSubmitRequest request) {
        return ResponseEntity.ok(questionService.submitQuizAnswer(request));
    }

    @GetMapping("/user/{user_id}/results")
    public ResponseEntity<List<QuizResult>> getUserQuizResults(@PathVariable("user_id") UUID userId) {
        return ResponseEntity.ok(questionService.getUserQuizResults(userId));
    }
}
