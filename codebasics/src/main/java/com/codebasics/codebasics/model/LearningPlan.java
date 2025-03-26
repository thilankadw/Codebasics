package com.codebasics.codebasics.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearningPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.ALL, optional = false)
    private User ownerId;

    @Column(nullable = false, unique = true)
    private String planName;

    @Column(nullable = false)
    private String description;

    private String skills;

    @Column(nullable = false)
    private String duration;

    private String imageUrl;
}
