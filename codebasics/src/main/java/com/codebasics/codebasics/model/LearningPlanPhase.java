package com.codebasics.codebasics.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearningPlanPhase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "learningPlanId", nullable = false)
    private LearningPlan learningPlan;

    @Column(nullable = false)
    private String topic;

    @Column(nullable = false)
    private String skill;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String duration;

    @Column(nullable = false)
    private String resources;

    private String imageUrl;
}
