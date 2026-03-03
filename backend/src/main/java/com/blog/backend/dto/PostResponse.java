package com.blog.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostResponse {
    private Long id;
    private String title;
    private String slug;
    private String content;
    private String excerpt;
    private String featuredImage;
    private UserDTO author;
    private CategoryDTO category;
    private List<TagDTO> tags;
    private Integer likesCount;
    private Integer commentsCount;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}