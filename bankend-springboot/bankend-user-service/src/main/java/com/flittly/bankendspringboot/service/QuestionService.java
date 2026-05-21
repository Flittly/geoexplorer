package com.flittly.bankendspringboot.service;

import com.flittly.bankendspringboot.dto.QuestionCreateRequest;
import com.flittly.bankendspringboot.dto.QuizSubmitRequest;
import com.flittly.bankendspringboot.dto.QuizSubmitResponse;
import com.flittly.bankendspringboot.entity.Question;
import com.flittly.bankendspringboot.entity.QuizResult;
import com.flittly.bankendspringboot.mapper.QuestionMapper;
import com.flittly.bankendspringboot.mapper.QuizResultMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionMapper questionMapper;
    private final QuizResultMapper quizResultMapper;

    public List<Question> getQuestionsByLevelId(UUID levelId) {
        return questionMapper.findByLevelId(levelId);
    }

    public Question getQuestionById(UUID questionId) {
        return questionMapper.findById(questionId);
    }

    public Question createQuestion(QuestionCreateRequest request) {
        Question question = new Question();
        question.setId(UUID.randomUUID());
        question.setLevelId(request.getLevelId());
        question.setQuestion(request.getQuestion());
        question.setOptions(request.getOptions());
        question.setCorrectAnswer(request.getCorrectAnswer());
        question.setExplanation(request.getExplanation());
        question.setOrderIndex(request.getOrderIndex());
        question.setIsActive(true);
        question.setCreatedAt(LocalDateTime.now());

        questionMapper.insert(question);
        return question;
    }

    public QuizSubmitResponse submitQuizAnswer(QuizSubmitRequest request) {
        Question question = questionMapper.findById(request.getQuestionId());
        if (question == null) {
            throw new RuntimeException("Question not found");
        }

        boolean isCorrect = question.getCorrectAnswer().equals(request.getSelectedAnswer());

        // Save quiz result
        QuizResult result = new QuizResult();
        result.setId(UUID.randomUUID());
        result.setUserId(request.getUserId());
        result.setQuestionId(request.getQuestionId());
        result.setSelectedAnswer(request.getSelectedAnswer());
        result.setIsCorrect(isCorrect);
        result.setCreatedAt(LocalDateTime.now());

        quizResultMapper.insert(result);

        return QuizSubmitResponse.builder()
                .isCorrect(isCorrect)
                .correctAnswer(question.getCorrectAnswer())
                .explanation(question.getExplanation())
                .build();
    }

    public List<QuizResult> getUserQuizResults(UUID userId) {
        return quizResultMapper.findByUserId(userId);
    }
}
