package com.flittly.bankendspringboot.controller;

import com.flittly.bankendspringboot.dto.GeoFeatureCreateRequest;
import com.flittly.bankendspringboot.entity.GeographicFeature;
import com.flittly.bankendspringboot.service.GeoFeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/geo-features")
@RequiredArgsConstructor
public class GeoFeatureController {

    private final GeoFeatureService geoFeatureService;

    @GetMapping("/")
    public ResponseEntity<List<GeographicFeature>> getFeatures(
            @RequestParam(required = false) String featureType,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String gradeLevel,
            @RequestParam(required = false) String textbook,
            @RequestParam(required = false) String sourceType,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(defaultValue = "0") int offset) {
        return ResponseEntity.ok(geoFeatureService.getFeatures(featureType, region, gradeLevel, textbook, sourceType, category, limit, offset));
    }

    @GetMapping("/map-markers")
    public ResponseEntity<List<GeographicFeature>> getMapMarkers() {
        return ResponseEntity.ok(geoFeatureService.getAllWithCoordinates());
    }

    @GetMapping("/{feature_id}")
    public ResponseEntity<GeographicFeature> getFeatureById(@PathVariable("feature_id") UUID featureId) {
        GeographicFeature feature = geoFeatureService.getFeatureById(featureId);
        if (feature == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(feature);
    }

    @PostMapping("/")
    public ResponseEntity<GeographicFeature> createFeature(@RequestBody GeoFeatureCreateRequest request) {
        return ResponseEntity.ok(geoFeatureService.createFeature(request));
    }

    @GetMapping("/search/{query}")
    public ResponseEntity<List<GeographicFeature>> searchFeatures(
            @PathVariable("query") String query,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(geoFeatureService.searchFeatures(query, limit));
    }
}
