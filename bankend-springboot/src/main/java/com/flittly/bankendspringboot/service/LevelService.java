package com.flittly.bankendspringboot.service;

import com.flittly.bankendspringboot.dto.LevelCreateRequest;
import com.flittly.bankendspringboot.dto.LevelProgressUpdateRequest;
import com.flittly.bankendspringboot.entity.Level;
import com.flittly.bankendspringboot.entity.UserLevelProgress;
import com.flittly.bankendspringboot.entity.enums.ProgressStatus;
import com.flittly.bankendspringboot.mapper.LevelMapper;
import com.flittly.bankendspringboot.mapper.UserLevelProgressMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LevelService {

    private final LevelMapper levelMapper;
    private final UserLevelProgressMapper progressMapper;

    public List<Level> getAllLevels() {
        return levelMapper.findAll();
    }

    public Level getLevelById(UUID levelId) {
        return levelMapper.findById(levelId);
    }

    public Level createLevel(LevelCreateRequest request) {
        Level level = new Level();
        level.setId(UUID.randomUUID());
        level.setName(request.getName());
        level.setDescription(request.getDescription());
        level.setOrderIndex(request.getOrderIndex());
        level.setUnlockRequirement(request.getUnlockRequirement());
        level.setIsActive(true);
        level.setCreatedAt(LocalDateTime.now());
        level.setUpdatedAt(LocalDateTime.now());

        levelMapper.insert(level);
        return level;
    }

    public List<UserLevelProgress> getUserLevelProgress(UUID userId) {
        return progressMapper.findByUserId(userId);
    }

    public UserLevelProgress updateLevelProgress(UUID userId, UUID levelId, LevelProgressUpdateRequest request) {
        UserLevelProgress progress = progressMapper.findByUserIdAndLevelId(userId, levelId);

        if (progress == null) {
            progress = new UserLevelProgress();
            progress.setId(UUID.randomUUID());
            progress.setUserId(userId);
            progress.setLevelId(levelId);
            progress.setStatus(ProgressStatus.ACTIVE);
            progress.setScore(0);
            progress.setStars(0);
            progress.setCompletionPercentage(0.0);
            progress.setCreatedAt(LocalDateTime.now());
            progress.setUpdatedAt(LocalDateTime.now());

            if (request.getStatus() != null) progress.setStatus(ProgressStatus.valueOf(request.getStatus()));
            if (request.getScore() != null) progress.setScore(request.getScore());
            if (request.getStars() != null) progress.setStars(request.getStars());
            if (request.getCompletionPercentage() != null) progress.setCompletionPercentage(request.getCompletionPercentage());

            progressMapper.insert(progress);
        } else {
            if (request.getStatus() != null) progress.setStatus(ProgressStatus.valueOf(request.getStatus()));
            if (request.getScore() != null) progress.setScore(request.getScore());
            if (request.getStars() != null) progress.setStars(request.getStars());
            if (request.getCompletionPercentage() != null) progress.setCompletionPercentage(request.getCompletionPercentage());

            if ("COMPLETED".equals(request.getStatus())) {
                progress.setCompletedAt(LocalDateTime.now());
            }

            progressMapper.update(progress);
        }

        return progress;
    }
}
