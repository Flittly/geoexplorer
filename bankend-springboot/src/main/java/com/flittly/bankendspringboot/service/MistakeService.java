package com.flittly.bankendspringboot.service;

import com.flittly.bankendspringboot.dto.MistakeCreateRequest;
import com.flittly.bankendspringboot.dto.MistakeUpdateRequest;
import com.flittly.bankendspringboot.entity.Mistake;
import com.flittly.bankendspringboot.entity.enums.CategoryType;
import com.flittly.bankendspringboot.entity.enums.MasteryLevel;
import com.flittly.bankendspringboot.mapper.MistakeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MistakeService {

    private final MistakeMapper mistakeMapper;

    public List<Mistake> getMistakes(UUID userId, String category, String masteryLevel, int limit, int offset) {
        return mistakeMapper.findByFilters(userId, category, masteryLevel, limit, offset);
    }

    public Mistake getMistakeById(UUID mistakeId) {
        return mistakeMapper.findById(mistakeId);
    }

    public Mistake createMistake(MistakeCreateRequest request) {
        Mistake mistake = new Mistake();
        mistake.setId(UUID.randomUUID());
        mistake.setUserId(request.getUserId());
        mistake.setTitle(request.getTitle());
        mistake.setQuestion(request.getQuestion());
        if (request.getCategory() != null) mistake.setCategory(CategoryType.valueOf(request.getCategory()));
        if (request.getMasteryLevel() != null) mistake.setMasteryLevel(MasteryLevel.valueOf(request.getMasteryLevel()));
        mistake.setImageUrl(request.getImageUrl());
        mistake.setAddedAt(LocalDateTime.now());
        mistake.setUpdatedAt(LocalDateTime.now());

        mistakeMapper.insert(mistake);
        return mistake;
    }

    public Mistake updateMistake(UUID mistakeId, MistakeUpdateRequest request) {
        Mistake mistake = mistakeMapper.findById(mistakeId);
        if (mistake == null) {
            throw new RuntimeException("Mistake not found");
        }

        if (request.getMasteryLevel() != null) mistake.setMasteryLevel(MasteryLevel.valueOf(request.getMasteryLevel()));
        if (request.getQuestion() != null) mistake.setQuestion(request.getQuestion());

        mistakeMapper.update(mistake);
        return mistake;
    }

    public void deleteMistake(UUID mistakeId) {
        mistakeMapper.deleteById(mistakeId);
    }
}
