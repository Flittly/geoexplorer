package com.flittly.bankendspringboot.service;

import com.flittly.bankendspringboot.dto.ArLandformCreateRequest;
import com.flittly.bankendspringboot.entity.ArLandform;
import com.flittly.bankendspringboot.entity.enums.LandformType;
import com.flittly.bankendspringboot.mapper.ArLandformMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ArLandformService {

    private final ArLandformMapper arLandformMapper;

    public List<ArLandform> getAllLandforms(String landformType) {
        return arLandformMapper.findAll(landformType);
    }

    public ArLandform getLandformById(UUID landformId) {
        return arLandformMapper.findById(landformId);
    }

    public ArLandform createLandform(ArLandformCreateRequest request) {
        ArLandform landform = new ArLandform();
        landform.setId(UUID.randomUUID());
        landform.setName(request.getName());
        landform.setDescription(request.getDescription());
        landform.setType(LandformType.valueOf(request.getType()));
        landform.setImageUrl(request.getImageUrl());
        landform.setElevation(request.getElevation());
        landform.setIsActive(true);
        landform.setCreatedAt(LocalDateTime.now());

        arLandformMapper.insert(landform);
        return landform;
    }
}
