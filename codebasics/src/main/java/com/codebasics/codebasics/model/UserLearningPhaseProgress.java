package com.codebasics.codebasics.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "user_learning_phase_progress")
public class UserLearningPhaseProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_learning_plan_id", nullable = false)
    private UserLearningPlan userLearningPlan;

    @NotNull(message = "Learning plan phase ID is required")
    @Column(name = "learning_plan_phase_id", nullable = false)
    private Long learningPlanPhaseId;

    @Pattern(regexp = "^(NOT_STARTED|IN_PROGRESS|COMPLETED)$",
            message = "Status must be one of: NOT_STARTED, IN_PROGRESS, COMPLETED")
    @Column(nullable = false)
    private String status = "NOT_STARTED";

    @Column(name = "completion_date", nullable = true)
    private java.time.LocalDateTime completionDate;

    @Column(name = "last_updated", nullable = true)
    private java.time.LocalDateTime lastUpdated;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserLearningPlan getUserLearningPlan() {
        return userLearningPlan;
    }

    public void setUserLearningPlan(UserLearningPlan userLearningPlan) {
        this.userLearningPlan = userLearningPlan;
    }

    public Long getLearningPlanPhaseId() {
        return learningPlanPhaseId;
    }

    public void setLearningPlanPhaseId(Long learningPlanPhaseId) {
        this.learningPlanPhaseId = learningPlanPhaseId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        this.lastUpdated = java.time.LocalDateTime.now();

        if ("COMPLETED".equals(status)) {
            this.completionDate = java.time.LocalDateTime.now();
        }
    }

    public java.time.LocalDateTime getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(java.time.LocalDateTime completionDate) {
        this.completionDate = completionDate;
    }

    public java.time.LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(java.time.LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}