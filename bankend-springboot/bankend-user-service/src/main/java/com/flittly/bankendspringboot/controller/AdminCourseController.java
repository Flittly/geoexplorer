package com.flittly.bankendspringboot.controller;

import com.flittly.bankendspringboot.dto.*;
import com.flittly.bankendspringboot.entity.Course;
import com.flittly.bankendspringboot.entity.CoursePackage;
import com.flittly.bankendspringboot.service.CourseService;
import com.flittly.bankendspringboot.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/courses")
@RequiredArgsConstructor
public class AdminCourseController {
    private final CourseService courseService;

    @PostMapping("/packages")
    public ResponseEntity<CoursePackage> createPackage(@RequestBody CoursePackageCreateRequest request) {
        return ResponseEntity.ok(courseService.createPackage(request));
    }

    @PutMapping("/packages/{id}")
    public ResponseEntity<CoursePackage> updatePackage(@PathVariable("id") UUID id, @RequestBody CoursePackageCreateRequest request) {
        CoursePackage pkg = courseService.updatePackage(id, request);
        if (pkg == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(pkg);
    }

    @DeleteMapping("/packages/{id}")
    public ResponseEntity<?> deletePackage(@PathVariable("id") UUID id) {
        courseService.deletePackage(id);
        return ResponseEntity.ok(MessageResponse.success("Deleted"));
    }

    @PostMapping("/")
    public ResponseEntity<Course> createCourse(@RequestBody CourseCreateRequest request) {
        return ResponseEntity.ok(courseService.createCourse(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable("id") UUID id, @RequestBody CourseCreateRequest request) {
        Course course = courseService.updateCourse(id, request);
        if (course == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(course);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable("id") UUID id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(MessageResponse.success("Deleted"));
    }
}
