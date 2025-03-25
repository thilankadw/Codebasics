package com.codebasics.codebasics.service;

import com.codebasics.codebasics.model.Post;
import com.codebasics.codebasics.model.User;
import com.codebasics.codebasics.repository.PostRepository;
import com.codebasics.codebasics.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Value("${upload.directory}") // Define upload directory in application.properties
    private String uploadDirectory;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    // Create a new post
    public Post createPost(String description, Long userId, List<MultipartFile> files) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (files.size() > 3) {
            throw new IllegalArgumentException("You can upload up to 3 photos or videos.");
        }

        List<String> mediaUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            String fileName = saveFile(file);
            mediaUrls.add(fileName);
        }

        Post post = new Post(description, user, mediaUrls);
        return postRepository.save(post);
    }

    // Update an existing post
    public Post updatePost(Long postId, String description, List<MultipartFile> files) throws IOException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        post.setDescription(description);

        if (files != null && !files.isEmpty()) {
            if (files.size() > 3) {
                throw new IllegalArgumentException("You can upload up to 3 photos or videos.");
            }

            List<String> mediaUrls = new ArrayList<>();
            for (MultipartFile file : files) {
                String fileName = saveFile(file);
                mediaUrls.add(fileName);
            }
            post.setMediaUrls(mediaUrls);
        }

        return postRepository.save(post);
    }

    // Save files to server
    private String saveFile(MultipartFile file) throws IOException {
        String fileName = System.currentTimeMillis() + "-" + file.getOriginalFilename();
        File dest = new File(uploadDirectory + "/" + fileName);
        file.transferTo(dest);
        return fileName;
    }

    // Fetch all posts
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // Fetch posts by a specific user
    public List<Post> getPostsByUserId(Long userId) {
        return postRepository.findByUserId(userId);
    }

    // Fetch a single post by ID
    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
    }

    // Delete a post
    public void deletePost(Long id) {
        if (!postRepository.existsById(id)) {
            throw new IllegalArgumentException("Post not found");
        }
        postRepository.deleteById(id);
    }
}
