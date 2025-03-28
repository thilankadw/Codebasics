package com.codebasics.codebasics.controller;

import com.codebasics.codebasics.model.Admin;
import com.codebasics.codebasics.model.Post;
import com.codebasics.codebasics.model.User;
import com.codebasics.codebasics.repository.AdminRepository;
import com.codebasics.codebasics.repository.PostRepository;
import com.codebasics.codebasics.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    // 1️⃣ Admin Registration
    @PostMapping("/register")
    public ResponseEntity<String> registerAdmin(@RequestBody Admin admin) {
        adminRepository.save(admin);
        return ResponseEntity.ok("Admin registered successfully");
    }

    // 2️⃣ Get All Posts
    @GetMapping("/posts")
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postRepository.findAll());
    }

    // 3️⃣ Delete Post
    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable Long postId) {
        postRepository.deleteById(postId);
        return ResponseEntity.ok("Post deleted successfully");
    }

    // 4️⃣ Get All Users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // 5️⃣ Delete User
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        userRepository.deleteById(userId);
        return ResponseEntity.ok("User deleted successfully");
    }
}
