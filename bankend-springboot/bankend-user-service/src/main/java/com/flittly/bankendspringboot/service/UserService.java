package com.flittly.bankendspringboot.service;

import com.flittly.bankendspringboot.dto.UserCreateRequest;
import com.flittly.bankendspringboot.dto.UserProgressResponse;
import com.flittly.bankendspringboot.dto.UserUpdateRequest;
import com.flittly.bankendspringboot.entity.User;
import com.flittly.bankendspringboot.entity.UserLevelProgress;
import com.flittly.bankendspringboot.entity.enums.GenderType;
import com.flittly.bankendspringboot.entity.enums.ProgressStatus;
import com.flittly.bankendspringboot.entity.enums.UserLevel;
import com.flittly.bankendspringboot.mapper.LevelMapper;
import com.flittly.bankendspringboot.mapper.UserLevelProgressMapper;
import com.flittly.bankendspringboot.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final UserLevelProgressMapper progressMapper;
    private final LevelMapper levelMapper;

    public User getUserById(UUID userId) {
        return userMapper.findById(userId);
    }

    public User createUser(UserCreateRequest request) {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setName(request.getName());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setLevel(UserLevel.BEGINNER);
        user.setTotalStars(0);
        user.setIsVerified(false);
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userMapper.insert(user);
        return user;
    }

    public User updateUser(UUID userId, UserUpdateRequest request) {
        User user = userMapper.findById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (request.getName() != null) user.setName(request.getName());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());
        if (request.getLevel() != null) user.setLevel(UserLevel.valueOf(request.getLevel().toUpperCase()));
        if (request.getTotalStars() != null) user.setTotalStars(request.getTotalStars());
        if (request.getGender() != null) user.setGender(GenderType.valueOf(request.getGender().toUpperCase()));
        if (request.getAge() != null) user.setAge(request.getAge());
        user.setUpdatedAt(LocalDateTime.now());

        userMapper.update(user);
        return user;
    }

    public UserProgressResponse getUserProgress(UUID userId) {
        User user = userMapper.findById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        List<UserLevelProgress> progressList = progressMapper.findByUserId(userId);
        int completedLevels = (int) progressList.stream()
                .filter(p -> p.getStatus() == ProgressStatus.COMPLETED)
                .count();

        UUID currentLevelId = progressList.stream()
                .filter(p -> p.getStatus() == ProgressStatus.ACTIVE)
                .map(UserLevelProgress::getLevelId)
                .findFirst()
                .orElse(null);

        return UserProgressResponse.builder()
                .userId(userId)
                .totalStars(user.getTotalStars())
                .level(user.getLevel() != null ? user.getLevel().name() : "BEGINNER")
                .completedLevels(completedLevels)
                .currentLevelId(currentLevelId)
                .build();
    }
}
