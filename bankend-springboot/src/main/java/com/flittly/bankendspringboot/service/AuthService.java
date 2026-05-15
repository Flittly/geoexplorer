package com.flittly.bankendspringboot.service;

import com.flittly.bankendspringboot.config.BusinessException;
import com.flittly.bankendspringboot.config.JwtUtil;
import com.flittly.bankendspringboot.dto.*;
import com.flittly.bankendspringboot.entity.RefreshToken;
import com.flittly.bankendspringboot.entity.User;
import com.flittly.bankendspringboot.entity.VerificationCode;
import com.flittly.bankendspringboot.entity.enums.UserLevel;
import com.flittly.bankendspringboot.mapper.RefreshTokenMapper;
import com.flittly.bankendspringboot.mapper.UserMapper;
import com.flittly.bankendspringboot.mapper.VerificationCodeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserMapper userMapper;
    private final RefreshTokenMapper refreshTokenMapper;
    private final VerificationCodeMapper verificationCodeMapper;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public MessageResponse sendVerificationCode(SendCodeRequest request) {
        String target = request.getTarget();
        String type = request.getType();

        // Mark old codes as used
        verificationCodeMapper.markAsUsed(target, type);

        // Generate new code (hardcoded "123456" for demo, same as original)
        String code = "123456";

        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setId(UUID.randomUUID());
        verificationCode.setTarget(target);
        verificationCode.setCode(code);
        verificationCode.setType(type);
        verificationCode.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        verificationCode.setIsUsed(false);
        verificationCode.setCreatedAt(LocalDateTime.now());

        verificationCodeMapper.insert(verificationCode);

        // In production, send code via SMS/email
        System.out.println("Verification code for " + target + ": " + code);

        return new MessageResponse("Verification code sent successfully", true);
    }

    @Transactional
    public TokenResponse register(RegisterRequest request) {
        // Validate verification code
        if (!"123456".equals(request.getCode())) {
            throw new BusinessException("验证码错误", HttpStatus.BAD_REQUEST);
        }

        // Check if user already exists
        User existingUser = userMapper.findByEmailOrPhone(request.getEmail(), request.getPhone());
        if (existingUser != null) {
            throw new BusinessException("该邮箱或手机号已注册", HttpStatus.CONFLICT);
        }

        // Create new user
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setAvatarUrl(request.getAvatarUrl());
        user.setLevel(UserLevel.BEGINNER);
        user.setTotalStars(0);
        user.setIsVerified(true);
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userMapper.insert(user);

        return generateTokenResponse(user);
    }

    public TokenResponse loginWithPassword(LoginPasswordRequest request) {
        User user = userMapper.findByEmailOrPhone(request.getEmail(), request.getPhone());
        if (user == null) {
            throw new BusinessException("用户不存在", HttpStatus.NOT_FOUND);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessException("密码错误", HttpStatus.UNAUTHORIZED);
        }

        return generateTokenResponse(user);
    }

    public TokenResponse loginWithCode(LoginCodeRequest request) {
        if (!"123456".equals(request.getCode())) {
            throw new BusinessException("验证码错误", HttpStatus.BAD_REQUEST);
        }

        User user = userMapper.findByEmailOrPhone(request.getEmail(), request.getPhone());
        if (user == null) {
            throw new BusinessException("用户不存在", HttpStatus.NOT_FOUND);
        }

        return generateTokenResponse(user);
    }

    public UserResponse getCurrentUser(String userId) {
        User user = userMapper.findById(UUID.fromString(userId));
        if (user == null) {
            throw new BusinessException("用户不存在", HttpStatus.NOT_FOUND);
        }

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .level(user.getLevel() != null ? user.getLevel().name() : null)
                .totalStars(user.getTotalStars())
                .isVerified(user.getIsVerified())
                .createdAt(user.getCreatedAt())
                .gender(user.getGender() != null ? user.getGender().name() : null)
                .age(user.getAge())
                .build();
    }

    @Transactional
    public TokenResponse refreshToken(RefreshRequest request) {
        String refreshTokenStr = request.getRefreshToken();

        // Validate refresh token JWT
        if (!jwtUtil.validateToken(refreshTokenStr) || !"refresh".equals(jwtUtil.getTokenType(refreshTokenStr))) {
            throw new BusinessException("Refresh Token 无效", HttpStatus.UNAUTHORIZED);
        }

        String userId = jwtUtil.extractUserId(refreshTokenStr);
        User user = userMapper.findById(UUID.fromString(userId));
        if (user == null) {
            throw new BusinessException("用户不存在", HttpStatus.NOT_FOUND);
        }

        // Revoke old refresh token
        refreshTokenMapper.revokeToken(refreshTokenStr);

        return generateTokenResponse(user);
    }

    @Transactional
    public MessageResponse logout(RefreshRequest request) {
        refreshTokenMapper.revokeToken(request.getRefreshToken());
        return new MessageResponse("Logged out successfully", true);
    }

    private TokenResponse generateTokenResponse(User user) {
        String accessToken = jwtUtil.generateAccessToken(user.getId());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());

        // Store refresh token in DB
        RefreshToken tokenEntity = new RefreshToken();
        tokenEntity.setId(UUID.randomUUID());
        tokenEntity.setUserId(user.getId());
        tokenEntity.setToken(refreshToken);
        tokenEntity.setExpiresAt(LocalDateTime.now().plus(Duration.ofMillis(jwtUtil.getRefreshTokenExpiration())));
        tokenEntity.setIsRevoked(false);
        tokenEntity.setCreatedAt(LocalDateTime.now());

        refreshTokenMapper.insert(tokenEntity);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("bearer")
                .expiresIn(jwtUtil.getAccessTokenExpiration() / 1000)
                .build();
    }
}
