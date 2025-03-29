package com.codebasics.codebasics.controller;

import com.codebasics.codebasics.dto.PostInteractionDTO;
import com.codebasics.codebasics.service.PostInteractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/post-reaction")
public class PostInteractionController {

    @Autowired
    private PostInteractionService postInteractionService;

    @PostMapping("/create-post-interaction")
    public ResponseEntity<PostInteractionDTO> createPostInteraction(@RequestBody PostInteractionDTO postInteractionDTO) {
        return ResponseEntity.ok(postInteractionService.createPostInteraction(postInteractionDTO));
    }

    @GetMapping("/all-post-interactions")
    public ResponseEntity<List<PostInteractionDTO>> getAllPostInteractions() {
        return ResponseEntity.ok(postInteractionService.getAllPostInteractions());
    }

    @GetMapping("/post-interaction/{id}")
    public ResponseEntity<PostInteractionDTO> getPostInteractionById(@PathVariable Long id) {
        Optional<PostInteractionDTO> postInteraction = postInteractionService.getPostInteractionById(id);
        return postInteraction.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/update-post-interaction/{id}")
    public ResponseEntity<PostInteractionDTO> updatePostInteraction(@PathVariable Long id, @RequestBody PostInteractionDTO postInteractionDTO) {
        return ResponseEntity.ok(postInteractionService.updatePostInteraction(id, postInteractionDTO));
    }

    @DeleteMapping("/delete-post-interaction/{id}")
    public ResponseEntity<String> deletePostInteraction(@PathVariable Long id) {
        postInteractionService.deletePostInteraction(id);
        return ResponseEntity.ok("Post Interaction with ID " + id + " has been deleted.");
    }
}
