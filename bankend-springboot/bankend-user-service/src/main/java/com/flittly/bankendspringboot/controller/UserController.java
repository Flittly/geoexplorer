package com.flittly.bankendspringboot.controller;

import com.flittly.bankendspringboot.dto.UserCreateRequest;
import com.flittly.bankendspringboot.dto.UserProgressResponse;
import com.flittly.bankendspringboot.dto.UserUpdateRequest;
import com.flittly.bankendspringboot.entity.User;
import com.flittly.bankendspringboot.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{user_id}")
    public ResponseEntity<User> getUserById(@PathVariable("user_id") UUID userId) {
        User user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping("/")
    public ResponseEntity<User> createUser(@RequestBody UserCreateRequest request) {
        return ResponseEntity.ok(userService.createUser(request));
    }

    @PutMapping("/{user_id}")
    public ResponseEntity<User> updateUser(@PathVariable("user_id") UUID userId, @RequestBody UserUpdateRequest request) {
        try {
            return ResponseEntity.ok(userService.updateUser(userId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{user_id}/progress")
    public ResponseEntity<UserProgressResponse> getUserProgress(@PathVariable("user_id") UUID userId) {
        try {
            return ResponseEntity.ok(userService.getUserProgress(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
