package com.flittly.bankendspringboot.controller;

import com.flittly.bankendspringboot.config.JwtUtil;
import com.flittly.bankendspringboot.entity.User;
import com.flittly.bankendspringboot.mapper.UserMapper;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody AdminLoginRequest request) {
        // 查找用户（用邮箱作为 username）
        User user = userMapper.findByEmail(request.getUsername());
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("detail", "用户名或密码错误"));
        }

        // 验证密码
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body(Map.of("detail", "用户名或密码错误"));
        }

        // 生成 token（复用普通用户 token，但返回 admin 格式）
        String accessToken = jwtUtil.generateAccessToken(user.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("access_token", accessToken);
        response.put("token_type", "bearer");
        response.put("admin_id", user.getId().toString());
        response.put("username", user.getEmail());
        response.put("name", user.getName());
        response.put("role", "admin");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> adminMe(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String userId = jwtUtil.extractUserId(token);
            User user = userMapper.findById(UUID.fromString(userId));
            if (user == null) {
                return ResponseEntity.status(404).body(Map.of("detail", "管理员不存在"));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId().toString());
            response.put("username", user.getEmail());
            response.put("name", user.getName());
            response.put("role", "admin");
            response.put("is_active", true);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("detail", "Token 无效"));
        }
    }

    @Data
    static class AdminLoginRequest {
        private String username;
        private String password;
    }
}
