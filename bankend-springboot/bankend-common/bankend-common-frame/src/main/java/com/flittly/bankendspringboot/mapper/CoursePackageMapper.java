package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.CoursePackage;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.UUID;

@Mapper
public interface CoursePackageMapper {
    List<CoursePackage> findByFilters(@Param("category") String category, @Param("keyword") String keyword,
                                      @Param("isActive") Boolean isActive, @Param("isFeatured") Boolean isFeatured,
                                      @Param("limit") int limit, @Param("offset") int offset);
    int countByFilters(@Param("category") String category, @Param("keyword") String keyword,
                       @Param("isActive") Boolean isActive, @Param("isFeatured") Boolean isFeatured);
    CoursePackage findById(@Param("id") UUID id);
    int insert(CoursePackage coursePackage);
    int update(CoursePackage coursePackage);
    int deleteById(@Param("id") UUID id);
    int updateCourseCount(@Param("id") UUID id, @Param("count") int count);
}
