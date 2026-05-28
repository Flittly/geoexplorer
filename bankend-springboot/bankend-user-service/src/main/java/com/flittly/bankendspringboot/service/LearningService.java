package com.flittly.bankendspringboot.service;

import com.flittly.bankendspringboot.dto.*;
import com.flittly.bankendspringboot.entity.*;
import com.flittly.bankendspringboot.mapper.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class LearningService {
    private final UserPurchaseMapper purchaseMapper;
    private final UserCourseProgressMapper progressMapper;
    private final CourseMapper courseMapper;
    private final CoursePackageMapper packageMapper;

    public List<MyCourseResponse> getMyCourses(UUID userId) {
        List<UserPurchase> purchases = purchaseMapper.findByUserId(userId, false);
        List<MyCourseResponse> responses = new ArrayList<>();
        for (UserPurchase purchase : purchases) {
            CoursePackage pkg = packageMapper.findById(purchase.getPackageId());
            if (pkg == null) continue;
            List<Course> courses = courseMapper.findByPackageId(purchase.getPackageId());
            int completedCount = progressMapper.countCompletedByPackage(userId, purchase.getPackageId());
            int totalCourses = courses.size();
            int progressPercent = totalCourses > 0 ? (completedCount * 100 / totalCourses) : 0;
            MyCourseResponse resp = new MyCourseResponse();
            resp.setPackageId(purchase.getPackageId());
            resp.setTitle(pkg.getTitle());
            resp.setCoverUrl(pkg.getCoverUrl());
            resp.setCourseCount(totalCourses);
            resp.setCompletedCount(completedCount);
            resp.setProgressPercent(progressPercent);
            resp.setPurchasedAt(purchase.getPurchasedAt());
            resp.setExpireAt(purchase.getExpireAt());
            List<CourseProgressItem> courseItems = new ArrayList<>();
            for (Course course : courses) {
                CourseProgressItem item = new CourseProgressItem();
                item.setCourseId(course.getId());
                item.setTitle(course.getTitle());
                item.setDuration(course.getDuration());
                UserCourseProgress progress = progressMapper.findByUserAndCourse(userId, course.getId());
                if (progress != null) {
                    item.setStatus(progress.getStatus());
                    item.setProgressPercent(progress.getProgressPercent());
                    item.setLastPosition(progress.getLastPosition());
                } else {
                    item.setStatus("NOT_STARTED");
                    item.setProgressPercent(0);
                    item.setLastPosition(0);
                }
                courseItems.add(item);
            }
            resp.setCourses(courseItems);
            responses.add(resp);
        }
        return responses;
    }

    public void updateProgress(UUID userId, LearningProgressRequest request) {
        UserCourseProgress progress = progressMapper.findByUserAndCourse(userId, request.getCourseId());
        if (progress == null) {
            Course course = courseMapper.findById(request.getCourseId());
            if (course == null) return;
            progress = new UserCourseProgress();
            progress.setId(UUID.randomUUID());
            progress.setUserId(userId);
            progress.setCourseId(request.getCourseId());
            progress.setPackageId(course.getPackageId());
            progress.setStatus("IN_PROGRESS");
            progress.setProgressPercent(request.getProgressPercent());
            progress.setLastPosition(request.getLastPosition());
            progress.setCreatedAt(LocalDateTime.now());
            progress.setUpdatedAt(LocalDateTime.now());
            progressMapper.insert(progress);
        } else {
            progressMapper.updateProgress(userId, request.getCourseId(), request.getProgressPercent(), request.getLastPosition());
        }
    }

    public void completeCourse(UUID userId, UUID courseId) {
        progressMapper.markCompleted(userId, courseId);
    }
}
