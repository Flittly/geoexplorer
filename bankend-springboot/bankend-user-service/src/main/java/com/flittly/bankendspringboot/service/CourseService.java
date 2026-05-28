package com.flittly.bankendspringboot.service;

import com.flittly.bankendspringboot.dto.*;
import com.flittly.bankendspringboot.entity.Course;
import com.flittly.bankendspringboot.entity.CoursePackage;
import com.flittly.bankendspringboot.mapper.CourseMapper;
import com.flittly.bankendspringboot.mapper.CoursePackageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CoursePackageMapper packageMapper;
    private final CourseMapper courseMapper;

    public PageResult<CoursePackage> getPackages(String category, String keyword, int limit, int offset) {
        List<CoursePackage> data = packageMapper.findByFilters(category, keyword, true, null, limit, offset);
        int total = packageMapper.countByFilters(category, keyword, true, null);
        return new PageResult<>(data, total, limit, offset);
    }

    public List<CoursePackage> getFeaturedPackages() {
        return packageMapper.findByFilters(null, null, true, true, 10, 0);
    }

    public CoursePackage getPackageById(UUID id) {
        return packageMapper.findById(id);
    }

    public List<Course> getCoursesByPackageId(UUID packageId) {
        return courseMapper.findByPackageId(packageId);
    }

    public Course getCourseById(UUID id) {
        return courseMapper.findById(id);
    }

    public CoursePackage createPackage(CoursePackageCreateRequest request) {
        CoursePackage pkg = new CoursePackage();
        pkg.setId(UUID.randomUUID());
        pkg.setTitle(request.getTitle());
        pkg.setDescription(request.getDescription());
        pkg.setCoverUrl(request.getCoverUrl());
        pkg.setCategory(request.getCategory());
        pkg.setOriginalPrice(request.getOriginalPrice());
        pkg.setSellingPrice(request.getSellingPrice());
        pkg.setExpireDays(request.getExpireDays() != null ? request.getExpireDays() : 365);
        pkg.setCourseCount(0);
        pkg.setIsActive(true);
        pkg.setIsFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false);
        pkg.setCreatedAt(LocalDateTime.now());
        pkg.setUpdatedAt(LocalDateTime.now());
        packageMapper.insert(pkg);
        return pkg;
    }

    public CoursePackage updatePackage(UUID id, CoursePackageCreateRequest request) {
        CoursePackage pkg = packageMapper.findById(id);
        if (pkg == null) return null;
        pkg.setTitle(request.getTitle());
        pkg.setDescription(request.getDescription());
        pkg.setCoverUrl(request.getCoverUrl());
        pkg.setCategory(request.getCategory());
        pkg.setOriginalPrice(request.getOriginalPrice());
        pkg.setSellingPrice(request.getSellingPrice());
        pkg.setExpireDays(request.getExpireDays());
        pkg.setIsFeatured(request.getIsFeatured());
        packageMapper.update(pkg);
        return pkg;
    }

    public void deletePackage(UUID id) {
        packageMapper.deleteById(id);
    }

    public Course createCourse(CourseCreateRequest request) {
        Course course = new Course();
        course.setId(UUID.randomUUID());
        course.setPackageId(request.getPackageId());
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setVideoUrl(request.getVideoUrl());
        course.setCoverUrl(request.getCoverUrl());
        course.setDuration(request.getDuration());
        course.setOrderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : 0);
        course.setIsActive(true);
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());
        courseMapper.insert(course);
        int count = courseMapper.countByPackageId(request.getPackageId());
        packageMapper.updateCourseCount(request.getPackageId(), count);
        return course;
    }

    public Course updateCourse(UUID id, CourseCreateRequest request) {
        Course course = courseMapper.findById(id);
        if (course == null) return null;
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setVideoUrl(request.getVideoUrl());
        course.setCoverUrl(request.getCoverUrl());
        course.setDuration(request.getDuration());
        course.setOrderIndex(request.getOrderIndex());
        courseMapper.update(course);
        return course;
    }

    public void deleteCourse(UUID id) {
        Course course = courseMapper.findById(id);
        if (course != null) {
            courseMapper.deleteById(id);
            int count = courseMapper.countByPackageId(course.getPackageId());
            packageMapper.updateCourseCount(course.getPackageId(), count);
        }
    }
}
