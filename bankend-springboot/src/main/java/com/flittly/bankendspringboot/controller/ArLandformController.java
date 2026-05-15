package com.flittly.bankendspringboot.controller;

import com.flittly.bankendspringboot.dto.ArLandformCreateRequest;
import com.flittly.bankendspringboot.entity.ArLandform;
import com.flittly.bankendspringboot.service.ArLandformService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ar-landforms")
@RequiredArgsConstructor
public class ArLandformController {

    private final ArLandformService arLandformService;

    @GetMapping("/")
    public ResponseEntity<List<ArLandform>> getAllLandforms(
            @RequestParam(required = false) String landformType) {
        return ResponseEntity.ok(arLandformService.getAllLandforms(landformType));
    }

    @GetMapping("/{landform_id}")
    public ResponseEntity<ArLandform> getLandformById(@PathVariable("landform_id") UUID landformId) {
        ArLandform landform = arLandformService.getLandformById(landformId);
        if (landform == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(landform);
    }

    @PostMapping("/")
    public ResponseEntity<ArLandform> createLandform(@RequestBody ArLandformCreateRequest request) {
        return ResponseEntity.ok(arLandformService.createLandform(request));
    }
}
