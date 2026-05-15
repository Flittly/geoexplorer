package com.flittly.bankendspringboot.service;

import com.flittly.bankendspringboot.dto.GeoFeatureCreateRequest;
import com.flittly.bankendspringboot.entity.GeographicFeature;
import com.flittly.bankendspringboot.mapper.GeographicFeatureMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GeoFeatureService {

    private final GeographicFeatureMapper geoFeatureMapper;

    public List<GeographicFeature> getFeatures(String featureType, String region, int limit, int offset) {
        return geoFeatureMapper.findByFilters(featureType, region, limit, offset);
    }

    public GeographicFeature getFeatureById(UUID featureId) {
        return geoFeatureMapper.findById(featureId);
    }

    public GeographicFeature createFeature(GeoFeatureCreateRequest request) {
        GeographicFeature feature = new GeographicFeature();
        feature.setId(UUID.randomUUID());
        feature.setName(request.getName());
        feature.setDescription(request.getDescription());
        feature.setFeatureType(request.getFeatureType());
        feature.setLatitude(request.getLatitude());
        feature.setLongitude(request.getLongitude());
        feature.setRegion(request.getRegion());
        feature.setImageUrl(request.getImageUrl());
        feature.setStats(request.getStats());
        feature.setIsActive(true);
        feature.setCreatedAt(LocalDateTime.now());

        geoFeatureMapper.insert(feature);
        return feature;
    }

    public List<GeographicFeature> searchFeatures(String query, int limit) {
        return geoFeatureMapper.search(query, limit);
    }
}
