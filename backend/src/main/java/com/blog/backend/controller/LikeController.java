package com.blog.backend.controller;

import com.blog.backend.dto.LikeResponse;
import com.blog.backend.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PostMapping("/{postId}/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<LikeResponse> toggleLike(@PathVariable Long postId) {
        return ResponseEntity.ok(likeService.toggleLike(postId));
    }

    @GetMapping("/{postId}/like/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<LikeResponse> getLikeStatus(@PathVariable Long postId) {
        return ResponseEntity.ok(likeService.getLikeStatus(postId));
    }

    @GetMapping("/{postId}/likes/count")
    public ResponseEntity<Long> getLikesCount(@PathVariable Long postId) {
        return ResponseEntity.ok(likeService.getLikesCount(postId));
    }
}