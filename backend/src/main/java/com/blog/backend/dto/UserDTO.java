package com.blog.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String bio;
    private String avatar;
    private String role;
    private LocalDateTime createdAt;
}