package com.flittly.bankendspringboot.controller;

import com.flittly.bankendspringboot.dto.PageResult;
import com.flittly.bankendspringboot.entity.Course;
import com.flittly.bankendspringboot.entity.CoursePackage;
import com.flittly.bankendspringboot.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/course-packages")
@RequiredArgsConstructor
public class CourseShopController {
    private final CourseService courseService;

    @GetMapping("/")
    public ResponseEntity<PageResult<CoursePackage>> getPackages(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "0") int offset) {
        return ResponseEntity.ok(courseService.getPackages(category, keyword, limit, offset));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<CoursePackage>> getFeatured() {
        return ResponseEntity.ok(courseService.getFeaturedPackages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CoursePackage> getPackageById(@PathVariable("id") UUID id) {
        CoursePackage pkg = courseService.getPackageById(id);
        if (pkg == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(pkg);
    }

    @GetMapping("/{id}/courses")
    public ResponseEntity<List<Course>> getPackageCourses(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(courseService.getCoursesByPackageId(id));
    }
}
