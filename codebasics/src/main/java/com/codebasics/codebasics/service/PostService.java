package com.codebasics.codebasics.service;

import com.codebasics.codebasics.model.Post;
import com.codebasics.codebasics.model.User;
import com.codebasics.codebasics.repository.PostRepository;
import com.codebasics.codebasics.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.Tika;

import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.mp4.MP4Parser;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
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
    public Post createPost(Long userId, String description, MultipartFile[] files) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (files.length > 3) {
            throw new RuntimeException("You can upload a maximum of 3 media files per post.");
        }

        List<String> mediaUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            String filePath = uploadDirectory + file.getOriginalFilename();
            File destinationFile = new File(filePath);
            file.transferTo(destinationFile);

            if (isVideoFile(file)) {
                if (!isValidVideoDuration(destinationFile)) {
                    throw new RuntimeException("Videos must be 30 seconds or less.");
                }
            }
            mediaUrls.add(filePath);
        }

        Post post = new Post();
        post.setUser(user);
        post.setDescription(description);
        post.setMediaUrls(mediaUrls);
        return postRepository.save(post);
    }

    private boolean isVideoFile(MultipartFile file) {
        String mimeType = new Tika().detect(file.getOriginalFilename());
        return mimeType.startsWith("video/");
    }

    private boolean isValidVideoDuration(File videoFile) throws Exception {
        Metadata metadata = new Metadata();
        FileInputStream inputstream = new FileInputStream(videoFile);
        BodyContentHandler handler = new BodyContentHandler();
        MP4Parser MP4Parser = new MP4Parser();
        MP4Parser.parse(inputstream, handler, metadata, new ParseContext());

        String durationStr = metadata.get("xmpDM:duration");
        if (durationStr != null) {
            double durationMs = Double.parseDouble(durationStr);
            return durationMs <= 30000; // 30 seconds in milliseconds
        }
        return false;
    }

    // Update an existing post
    public Post updatePost(Long postId, String description, MultipartFile[] files) throws Exception {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        post.setDescription(description);

        if (files != null && files.length > 0) {
            if (files.length > 3) {
                throw new RuntimeException("You can upload a maximum of 3 media files per post.");
            }

            List<String> mediaUrls = new ArrayList<>();
            for (MultipartFile file : files) {
                String filePath = uploadDirectory + file.getOriginalFilename();
                File destinationFile = new File(filePath);
                file.transferTo(destinationFile);

                if (isVideoFile(file)) {
                    if (!isValidVideoDuration(destinationFile)) {
                        throw new RuntimeException("Videos must be 30 seconds or less.");
                    }
                }
                mediaUrls.add(filePath);
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
