package com.codebasics.codebasics.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "user_learning_plans")
public class UserLearningPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Plan name is required")
    @Size(min = 3, max = 100, message = "Plan name must be between 3 and 100 characters")
    @Column(nullable = false)
    private String planName;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "Skills are required")
    @Size(min = 3, max = 500, message = "Skills must be between 3 and 500 characters")
    @Column(columnDefinition = "TEXT")
    private String skills;

    @NotBlank(message = "Duration is required")
    @Size(min = 2, max = 50, message = "Duration must be between 2 and 50 characters")
    private String duration;

    @Pattern(regexp = "^(https?://[^\\s]+)?$", message = "Invalid image URL format")
    @Column(nullable = true)
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "actual_owner_id")
    @JsonBackReference
    private User actualOwner;

    @ManyToOne
    @JoinColumn(name = "current_owner_id")
    @JsonBackReference
    private User currentOwner;

    @Pattern(regexp = "^(PRIVATE|PUBLIC)$", message = "Visibility must be either PRIVATE or PUBLIC")
    private String visibility;

    @Column(name = "original_plan_id")
    private Long originalPlanId;

    @Pattern(regexp = "^(complete|incomplete)$", message = "Milestone status must be either complete or incomplete")
    private String milestone1;

    @Pattern(regexp = "^(complete|incomplete)$", message = "Milestone status must be either complete or incomplete")
    private String milestone2;

    @Pattern(regexp = "^(complete|incomplete)$", message = "Milestone status must be either complete or incomplete")
    private String milestone3;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public User getActualOwner() {
        return actualOwner;
    }

    public void setActualOwner(User actualOwner) {
        this.actualOwner = actualOwner;
    }

    public User getCurrentOwner() {
        return currentOwner;
    }

    public void setCurrentOwner(User currentOwner) {
        this.currentOwner = currentOwner;
    }

    public String getVisibility() {
        return visibility;
    }

    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }

    public Long getOriginalPlanId() {
        return originalPlanId;
    }

    public void setOriginalPlanId(Long originalPlanId) {
        this.originalPlanId = originalPlanId;
    }

    public String getMilestone1() {
        return milestone1;
    }

    public void setMilestone1(String milestone1) {
        this.milestone1 = milestone1;
    }

    public String getMilestone2() {
        return milestone2;
    }

    public void setMilestone2(String milestone2) {
        this.milestone2 = milestone2;
    }

    public String getMilestone3() {
        return milestone3;
    }

    public void setMilestone3(String milestone3) {
        this.milestone3 = milestone3;
    }
}