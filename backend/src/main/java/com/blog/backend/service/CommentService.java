package com.blog.backend.service;

import com.blog.backend.dto.CommentRequest;
import com.blog.backend.dto.CommentResponse;
import com.blog.backend.dto.UserDTO;
import com.blog.backend.entity.Comment;
import com.blog.backend.entity.Post;
import com.blog.backend.entity.User;
import com.blog.backend.exception.ResourceNotFoundException;
import com.blog.backend.exception.UnauthorizedException;
import com.blog.backend.repository.CommentRepository;
import com.blog.backend.repository.PostRepository;
import com.blog.backend.repository.UserRepository;
import com.blog.backend.security.UserDetailsImpl;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    public CommentResponse addComment(Long postId, CommentRequest request) {
        UserDetailsImpl userDetails = getCurrentUser();
        User author = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setPost(post);
        comment.setAuthor(author);

        // Handle reply
        if (request.getParentCommentId() != null) {
            Comment parentComment = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
            comment.setParentComment(parentComment);
        }

        Comment savedComment = commentRepository.save(comment);

        // Update post comments count
        post.setCommentsCount(post.getCommentsCount() + 1);
        postRepository.save(post);

        return mapToCommentResponse(savedComment);
    }

    public List<CommentResponse> getCommentsByPost(Long postId) {
        postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        List<Comment> rootComments = commentRepository.findRootCommentsByPostId(postId);
        return rootComments.stream()
                .map(this::mapToCommentResponseWithReplies)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        UserDetailsImpl userDetails = getCurrentUser();
        if (!comment.getAuthor().getId().equals(userDetails.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this comment");
        }

        // Update post comments count
        Post post = comment.getPost();
        post.setCommentsCount(Math.max(0, post.getCommentsCount() - 1));
        postRepository.save(post);

        commentRepository.delete(comment);
    }

    // ========================
    // Helper Methods
    // ========================

    private UserDetailsImpl getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserDetailsImpl) authentication.getPrincipal();
    }

    private CommentResponse mapToCommentResponse(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setPostId(comment.getPost().getId());
        response.setCreatedAt(comment.getCreatedAt());

        if (comment.getParentComment() != null) {
            response.setParentCommentId(comment.getParentComment().getId());
        }

        UserDTO authorDTO = new UserDTO();
        authorDTO.setId(comment.getAuthor().getId());
        authorDTO.setUsername(comment.getAuthor().getUsername());
        authorDTO.setAvatar(comment.getAuthor().getAvatar());
        response.setAuthor(authorDTO);

        return response;
    }

    private CommentResponse mapToCommentResponseWithReplies(Comment comment) {
        CommentResponse response = mapToCommentResponse(comment);

        List<Comment> replies = commentRepository.findRepliesByParentId(comment.getId());
        if (!replies.isEmpty()) {
            response.setReplies(replies.stream()
                    .map(this::mapToCommentResponseWithReplies)
                    .collect(Collectors.toList()));
        }

        return response;
    }
}