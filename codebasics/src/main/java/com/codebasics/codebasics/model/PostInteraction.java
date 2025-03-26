package com.codebasics.codebasics.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class PostInteraction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // User who interacted

    @Enumerated(EnumType.STRING)
    private InteractionType type; // Either REACTION or COMMENT

    private String content; // Can be a comment text or reaction type (e.g., "LIKE")

    private LocalDateTime timestamp = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    public PostInteraction() {}

    public PostInteraction(Long userId, InteractionType type, String content, Post post) {
        this.userId = userId;
        this.type = type;
        this.content = content;
        this.post = post;
    }

    // Getters and Setters
}
