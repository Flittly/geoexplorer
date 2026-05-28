package com.flittly.bankendspringboot.controller;

import com.flittly.bankendspringboot.entity.Course;
import com.flittly.bankendspringboot.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {
    private final CourseService courseService;

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable("id") UUID id) {
        Course course = courseService.getCourseById(id);
        if (course == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(course);
    }
}
