package com.flittly.bankendspringboot.service;

import com.flittly.bankendspringboot.dto.TriviaCreateRequest;
import com.flittly.bankendspringboot.entity.DailyTrivia;
import com.flittly.bankendspringboot.mapper.DailyTriviaMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TriviaService {

    private final DailyTriviaMapper triviaMapper;

    public DailyTrivia getTodayTrivia() {
        return triviaMapper.findByFeaturedDate(LocalDate.now());
    }

    public List<DailyTrivia> getAllTrivia(int limit, int offset) {
        return triviaMapper.findAll(limit, offset);
    }

    public DailyTrivia getTriviaById(UUID triviaId) {
        return triviaMapper.findById(triviaId);
    }

    public DailyTrivia createTrivia(TriviaCreateRequest request) {
        DailyTrivia trivia = new DailyTrivia();
        trivia.setId(UUID.randomUUID());
        trivia.setTitle(request.getTitle());
        trivia.setDescription(request.getDescription());
        trivia.setImageUrl(request.getImageUrl());
        trivia.setLocation(request.getLocation());
        trivia.setRegion(request.getRegion());
        trivia.setFeaturedDate(request.getFeaturedDate() != null ? LocalDate.parse(request.getFeaturedDate()) : LocalDate.now());
        trivia.setIsActive(true);
        trivia.setCreatedAt(LocalDateTime.now());

        triviaMapper.insert(trivia);
        return trivia;
    }
}
