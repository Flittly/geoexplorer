package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.Course;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.UUID;

@Mapper
public interface CourseMapper {
    List<Course> findByPackageId(@Param("packageId") UUID packageId);
    Course findById(@Param("id") UUID id);
    int insert(Course course);
    int update(Course course);
    int deleteById(@Param("id") UUID id);
    int countByPackageId(@Param("packageId") UUID packageId);
}
