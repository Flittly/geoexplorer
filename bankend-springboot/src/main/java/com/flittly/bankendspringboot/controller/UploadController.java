package com.flittly.bankendspringboot.controller;

import com.flittly.bankendspringboot.dto.MessageResponse;
import com.flittly.bankendspringboot.config.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(MessageResponse.error(ErrorCode.BAD_REQUEST));
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(MessageResponse.error(
                    ErrorCode.BAD_REQUEST.getCode(), "只能上传图片文件"));
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(MessageResponse.error(
                    ErrorCode.BAD_REQUEST.getCode(), "图片大小不能超过5MB"));
        }

        try {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String filename = UUID.randomUUID().toString() + extension;

            String dir = System.getProperty("user.dir") + File.separator + uploadDir + File.separator + "avatars";
            File dirFile = new File(dir);
            if (!dirFile.exists()) {
                dirFile.mkdirs();
            }

            File dest = new File(dirFile, filename);
            file.transferTo(dest);

            String url = "/uploads/avatars/" + filename;

            return ResponseEntity.ok(Map.of(
                    "url", url,
                    "filename", filename,
                    "success", true
            ));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(MessageResponse.error(
                    ErrorCode.INTERNAL_ERROR.getCode(), "文件上传失败"));
        }
    }
}
