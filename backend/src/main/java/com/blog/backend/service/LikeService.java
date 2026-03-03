package com.blog.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.blog.backend.dto.LikeResponse;
import com.blog.backend.entity.Like;
import com.blog.backend.entity.Post;
import com.blog.backend.entity.User;
import com.blog.backend.exception.ResourceNotFoundException;
import com.blog.backend.repository.LikeRepository;
import com.blog.backend.repository.PostRepository;
import com.blog.backend.repository.UserRepository;
import com.blog.backend.security.UserDetailsImpl;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public LikeResponse toggleLike(Long postId) {
        UserDetailsImpl userDetails = getCurrentUser();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        Optional<Like> existingLike = likeRepository.findByPostIdAndUserId(postId, userDetails.getId());

        boolean liked;
        if (existingLike.isPresent()) {
            // Unlike
            likeRepository.delete(existingLike.get());
            post.setLikesCount(Math.max(0, post.getLikesCount() - 1));
            liked = false;
        } else {
            // Like
            Like like = new Like();
            like.setPost(post);
            like.setUser(user);
            likeRepository.save(like);
            post.setLikesCount(post.getLikesCount() + 1);
            liked = true;
        }

        postRepository.save(post);
        long likesCount = likeRepository.countByPostId(postId);

        return new LikeResponse(liked, likesCount);
    }

    public LikeResponse getLikeStatus(Long postId) {
        UserDetailsImpl userDetails = getCurrentUser();
        boolean liked = likeRepository.existsByPostIdAndUserId(postId, userDetails.getId());
        long likesCount = likeRepository.countByPostId(postId);
        return new LikeResponse(liked, likesCount);
    }

    public long getLikesCount(Long postId) {
        return likeRepository.countByPostId(postId);
    }

    private UserDetailsImpl getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserDetailsImpl) authentication.getPrincipal();
    }
}