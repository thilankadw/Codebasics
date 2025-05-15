package com.codebasics.codebasics.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @Column(name = "learning_plan_id", nullable = false)
    private Long learningPlanId;

    @Pattern(regexp = "^(NOT_STARTED|IN_PROGRESS|COMPLETED)$",
            message = "Overall status must be one of: NOT_STARTED, IN_PROGRESS, COMPLETED")
    @Column(name = "overall_status", nullable = false)
    private String overallStatus = "NOT_STARTED";

    @Column(name = "subscription_date", nullable = true)
    private LocalDateTime subscriptionDate;

    @Column(name = "completion_date", nullable = true)
    private LocalDateTime completionDate;

    @Column(name = "last_activity_date")
    private LocalDateTime lastActivityDate;

    @OneToMany(mappedBy = "userLearningPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserLearningPhaseProgress> phaseProgresses = new ArrayList<>();

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

    public Long getLearningPlanId() {
        return learningPlanId;
    }

    public void setLearningPlanId(Long learningPlanId) {
        this.learningPlanId = learningPlanId;
    }

    public String getOverallStatus() {
        return overallStatus;
    }

    public void setOverallStatus(String overallStatus) {
        this.overallStatus = overallStatus;
        this.lastActivityDate = LocalDateTime.now();

        if ("COMPLETED".equals(overallStatus)) {
            this.completionDate = LocalDateTime.now();
        }
    }

    public LocalDateTime getSubscriptionDate() {
        return subscriptionDate;
    }

    public void setSubscriptionDate(LocalDateTime subscriptionDate) {
        this.subscriptionDate = subscriptionDate;
    }

    public LocalDateTime getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(LocalDateTime completionDate) {
        this.completionDate = completionDate;
    }

    public LocalDateTime getLastActivityDate() {
        return lastActivityDate;
    }

    public void setLastActivityDate(LocalDateTime lastActivityDate) {
        this.lastActivityDate = lastActivityDate;
    }

    public List<UserLearningPhaseProgress> getPhaseProgresses() {
        return phaseProgresses;
    }

    public void setPhaseProgresses(List<UserLearningPhaseProgress> phaseProgresses) {
        this.phaseProgresses = phaseProgresses;
    }

    public void addPhaseProgress(UserLearningPhaseProgress progress) {
        phaseProgresses.add(progress);
        progress.setUserLearningPlan(this);
    }

    public void removePhaseProgress(UserLearningPhaseProgress progress) {
        phaseProgresses.remove(progress);
        progress.setUserLearningPlan(null);
    }

    public double calculateOverallProgressPercentage() {
        if (phaseProgresses.isEmpty()) {
            return 0.0;
        }

        long completedPhases = phaseProgresses.stream()
                .filter(phase -> "COMPLETED".equals(phase.getStatus()))
                .count();

        return (double) completedPhases / phaseProgresses.size() * 100.0;
    }

    public void updateOverallStatus() {
        if (phaseProgresses.isEmpty()) {
            setOverallStatus("NOT_STARTED");
            return;
        }

        long completedPhases = phaseProgresses.stream()
                .filter(phase -> "COMPLETED".equals(phase.getStatus()))
                .count();

        long inProgressPhases = phaseProgresses.stream()
                .filter(phase -> "IN_PROGRESS".equals(phase.getStatus()))
                .count();

        if (completedPhases == phaseProgresses.size()) {
            setOverallStatus("COMPLETED");
        } else if (completedPhases > 0 || inProgressPhases > 0) {
            setOverallStatus("IN_PROGRESS");
        } else {
            setOverallStatus("NOT_STARTED");
        }
    }
}