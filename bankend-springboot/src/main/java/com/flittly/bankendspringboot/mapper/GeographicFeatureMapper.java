package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.GeographicFeature;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.UUID;

@Mapper
public interface GeographicFeatureMapper {
    List<GeographicFeature> findByFilters(@Param("featureType") String featureType, @Param("region") String region,
                                          @Param("limit") int limit, @Param("offset") int offset);
    GeographicFeature findById(@Param("id") UUID id);
    int insert(GeographicFeature feature);
    List<GeographicFeature> search(@Param("query") String query, @Param("limit") int limit);
}
