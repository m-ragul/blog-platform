package com.blog.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.blog.backend.dto.CategoryDTO;
import com.blog.backend.dto.PageResponse;
import com.blog.backend.dto.PostRequest;
import com.blog.backend.dto.PostResponse;
import com.blog.backend.dto.PostSummaryDTO;
import com.blog.backend.dto.TagDTO;
import com.blog.backend.dto.UserDTO;
import com.blog.backend.entity.Category;
import com.blog.backend.entity.Post;
import com.blog.backend.entity.PostStatus;
import com.blog.backend.entity.Tag;
import com.blog.backend.entity.User;
import com.blog.backend.exception.ResourceNotFoundException;
import com.blog.backend.exception.UnauthorizedException;
import com.blog.backend.repository.CategoryRepository;
import com.blog.backend.repository.PostRepository;
import com.blog.backend.repository.TagRepository;
import com.blog.backend.repository.UserRepository;
import com.blog.backend.security.UserDetailsImpl;
import com.blog.backend.util.SlugUtils;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private SlugUtils slugUtils;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    public PostResponse createPost(PostRequest request) {
        // Get current logged in user
        UserDetailsImpl userDetails = getCurrentUser();
        User author = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Generate unique slug
        String slug = slugUtils.generateSlug(request.getTitle());
        if (postRepository.existsBySlug(slug)) {
            slug = slugUtils.generateUniqueSlug(request.getTitle(), true);
        }

        // Create post
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setSlug(slug);
        post.setContent(request.getContent());
        post.setExcerpt(request.getExcerpt());
        post.setFeaturedImage(request.getFeaturedImage());
        post.setAuthor(author);
        post.setLikesCount(0);
        post.setCommentsCount(0);

        // Set status
        if (request.getStatus() != null && request.getStatus().equalsIgnoreCase("PUBLISHED")) {
            post.setStatus(PostStatus.PUBLISHED);
        } else {
            post.setStatus(PostStatus.DRAFT);
        }

        // Set category
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            post.setCategory(category);
        }

        // Set tags
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            List<Tag> tags = getOrCreateTags(request.getTags());
            post.setTags(tags);
        }

        Post savedPost = postRepository.save(post);
        return mapToPostResponse(savedPost);
    }

    public PostResponse getPostBySlug(String slug) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with slug: " + slug));
        return mapToPostResponse(post);
    }

    public PostResponse getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
        return mapToPostResponse(post);
    }

    public PageResponse<PostSummaryDTO> getAllPublishedPosts(int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<Post> posts = postRepository.findByStatus(PostStatus.PUBLISHED, pageable);
        return mapToPageResponse(posts);
    }

    public PageResponse<PostSummaryDTO> getPostsByUser(Long userId, int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by("createdAt").descending());
        Page<Post> posts = postRepository.findByAuthorId(userId, pageable);
        return mapToPageResponse(posts);
    }

    public PageResponse<PostSummaryDTO> getPostsByCategory(Long categoryId, int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by("createdAt").descending());
        Page<Post> posts = postRepository.findByCategoryId(categoryId, pageable);
        return mapToPageResponse(posts);
    }

    public PageResponse<PostSummaryDTO> searchPosts(String keyword, Long categoryId, int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by("createdAt").descending());
        Page<Post> posts;

        if (categoryId != null) {
            posts = postRepository.searchPostsByCategory(keyword, categoryId, pageable);
        } else {
            posts = postRepository.searchPosts(keyword, pageable);
        }

        return mapToPageResponse(posts);
    }

    @Transactional
    public PostResponse updatePost(Long id, PostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

        // Check if current user is the author
        UserDetailsImpl userDetails = getCurrentUser();
        if (!post.getAuthor().getId().equals(userDetails.getId())) {
            throw new UnauthorizedException("You are not authorized to update this post");
        }

        // Update fields
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setExcerpt(request.getExcerpt());
        post.setFeaturedImage(request.getFeaturedImage());

        // Update status
        if (request.getStatus() != null) {
            post.setStatus(PostStatus.valueOf(request.getStatus().toUpperCase()));
        }

        // Update category
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            post.setCategory(category);
        }

        // Update tags
        if (request.getTags() != null) {
            List<Tag> tags = getOrCreateTags(request.getTags());
            post.setTags(tags);
        }

        Post updatedPost = postRepository.save(post);
        return mapToPostResponse(updatedPost);
    }

    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

        // Check if current user is the author
        UserDetailsImpl userDetails = getCurrentUser();
        if (!post.getAuthor().getId().equals(userDetails.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this post");
        }

        postRepository.delete(post);
    }

    // ========================
    // Helper Methods
    // ========================

    private UserDetailsImpl getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserDetailsImpl) authentication.getPrincipal();
    }

    private List<Tag> getOrCreateTags(List<String> tagNames) {
    List<Tag> tags = new ArrayList<>();
    for (String tagName : tagNames) {
        String trimmedName = tagName.trim();
        if (trimmedName.isEmpty()) continue;
        
        String slug = slugUtils.generateSlug(trimmedName);
        
        // Try to find by name first, then by slug
        Tag tag = tagRepository.findByName(trimmedName)
                .or(() -> tagRepository.findBySlug(slug))
                .orElseGet(() -> {
                    Tag newTag = new Tag();
                    newTag.setName(trimmedName);
                    newTag.setSlug(slug);
                    return tagRepository.save(newTag);
                });
        tags.add(tag);
    }
    return tags;
}

    private PostResponse mapToPostResponse(Post post) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setTitle(post.getTitle());
        response.setSlug(post.getSlug());
        response.setContent(post.getContent());
        response.setExcerpt(post.getExcerpt());
        response.setFeaturedImage(post.getFeaturedImage());
        response.setLikesCount(post.getLikesCount());
        response.setCommentsCount(post.getCommentsCount());
        response.setStatus(post.getStatus().name());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());

        // Map author
        if (post.getAuthor() != null) {
            UserDTO authorDTO = new UserDTO();
            authorDTO.setId(post.getAuthor().getId());
            authorDTO.setUsername(post.getAuthor().getUsername());
            authorDTO.setEmail(post.getAuthor().getEmail());
            authorDTO.setAvatar(post.getAuthor().getAvatar());
            response.setAuthor(authorDTO);
        }

        // Map category
        if (post.getCategory() != null) {
            response.setCategory(modelMapper.map(post.getCategory(), CategoryDTO.class));
        }

        // Map tags
        if (post.getTags() != null) {
            response.setTags(post.getTags().stream()
                    .map(tag -> modelMapper.map(tag, TagDTO.class))
                    .collect(Collectors.toList()));
        }

        return response;
    }

    private PostSummaryDTO mapToPostSummaryDTO(Post post) {
        PostSummaryDTO summary = new PostSummaryDTO();
        summary.setId(post.getId());
        summary.setTitle(post.getTitle());
        summary.setSlug(post.getSlug());
        summary.setExcerpt(post.getExcerpt());
        summary.setFeaturedImage(post.getFeaturedImage());
        summary.setLikesCount(post.getLikesCount());
        summary.setCommentsCount(post.getCommentsCount());
        summary.setStatus(post.getStatus().name());
        summary.setCreatedAt(post.getCreatedAt());
        summary.setUpdatedAt(post.getUpdatedAt());

        // Map author
        if (post.getAuthor() != null) {
            UserDTO authorDTO = new UserDTO();
            authorDTO.setId(post.getAuthor().getId());
            authorDTO.setUsername(post.getAuthor().getUsername());
            authorDTO.setAvatar(post.getAuthor().getAvatar());
            summary.setAuthor(authorDTO);
        }

        // Map category
        if (post.getCategory() != null) {
            summary.setCategory(modelMapper.map(post.getCategory(), CategoryDTO.class));
        }

        // Map tags
        if (post.getTags() != null) {
            summary.setTags(post.getTags().stream()
                    .map(tag -> modelMapper.map(tag, TagDTO.class))
                    .collect(Collectors.toList()));
        }

        return summary;
    }

    private PageResponse<PostSummaryDTO> mapToPageResponse(Page<Post> posts) {
        List<PostSummaryDTO> content = posts.getContent().stream()
                .map(this::mapToPostSummaryDTO)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                posts.getNumber(),
                posts.getSize(),
                posts.getTotalElements(),
                posts.getTotalPages(),
                posts.isLast()
        );
    }
}