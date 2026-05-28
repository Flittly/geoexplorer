package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.UserCourseProgress;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.UUID;

@Mapper
public interface UserCourseProgressMapper {
    List<UserCourseProgress> findByUserAndPackage(@Param("userId") UUID userId, @Param("packageId") UUID packageId);
    UserCourseProgress findByUserAndCourse(@Param("userId") UUID userId, @Param("courseId") UUID courseId);
    int insert(UserCourseProgress progress);
    int updateProgress(@Param("userId") UUID userId, @Param("courseId") UUID courseId,
                       @Param("progressPercent") int progressPercent, @Param("lastPosition") int lastPosition);
    int markCompleted(@Param("userId") UUID userId, @Param("courseId") UUID courseId);
    int countCompletedByPackage(@Param("userId") UUID userId, @Param("packageId") UUID packageId);
}
