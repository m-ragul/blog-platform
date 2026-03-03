package com.blog.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class CommentResponse {
    private Long id;
    private String content;
    private UserDTO author;
    private Long postId;
    private Long parentCommentId;
    private List<CommentResponse> replies;
    private LocalDateTime createdAt;
}