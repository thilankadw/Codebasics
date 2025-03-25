package com.codebasics.codebasics.controller;

import com.codebasics.codebasics.model.ApiResponse;
import com.codebasics.codebasics.model.Post;
import com.codebasics.codebasics.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // Create a post
    @PostMapping("/create")
    public ResponseEntity<Post> createPost(@RequestParam Long userId,
                                           @RequestParam String description,
                                           @RequestParam MultipartFile[] files) throws Exception {
        // Log the files received
        System.out.println("Number of files: " + files.length);
        for (MultipartFile file : files) {
            System.out.println("Received file: " + file.getOriginalFilename());
        }

        // Ensure files are not more than 3
        if (files.length > 3) {

            return ResponseEntity.badRequest().body(null); // Return custom error response
        }



        Post createdPost = postService.createPost(userId, description, files);
        return ResponseEntity.ok(createdPost);
    }


    // Update a post
    @PutMapping("/update/{postId}")
    public ResponseEntity<Post> updatePost(@PathVariable Long postId,
                                           @RequestParam String description,
                                           @RequestParam(required = false) MultipartFile[] files) throws Exception {
        Post updatedPost = postService.updatePost(postId, description, files);
        return ResponseEntity.ok(updatedPost);
    }


    // Get all posts
    @GetMapping("")
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    // Get a post by ID
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    // Get posts by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getPostsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(postService.getPostsByUserId(userId));
    }

    // Delete a post
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}
