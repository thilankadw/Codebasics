package com.codebasics.codebasics.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class UserLearningPlanDto {
    private Long id;
    private String planName;
    private String description;
    private String skills;
    private String duration;
    private String imageUrl;
    private Long actualOwnerId;
    private Long currentOwnerId;
    private String visibility;
    private Long originalPlanId;
    private Long learningPlanId;
    private String overallStatus;
    private LocalDateTime subscriptionDate;
    private LocalDateTime completionDate;
    private LocalDateTime lastActivityDate;
    private List<PhaseProgressDto> phaseProgresses = new ArrayList<>();
    private double progressPercentage;

    public UserLearningPlanDto() {
    }

    public UserLearningPlanDto(Long id, String planName, String description, String skills,
                               String duration, String imageUrl, Long actualOwnerId,
                               Long currentOwnerId, String visibility, Long originalPlanId,
                               Long learningPlanId, String overallStatus,
                               LocalDateTime subscriptionDate, LocalDateTime completionDate,
                               LocalDateTime lastActivityDate) {
        this.id = id;
        this.planName = planName;
        this.description = description;
        this.skills = skills;
        this.duration = duration;
        this.imageUrl = imageUrl;
        this.actualOwnerId = actualOwnerId;
        this.currentOwnerId = currentOwnerId;
        this.visibility = visibility;
        this.originalPlanId = originalPlanId;
        this.learningPlanId = learningPlanId;
        this.overallStatus = overallStatus;
        this.subscriptionDate = subscriptionDate;
        this.completionDate = completionDate;
        this.lastActivityDate = lastActivityDate;
    }

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

    public Long getActualOwnerId() {
        return actualOwnerId;
    }

    public void setActualOwnerId(Long actualOwnerId) {
        this.actualOwnerId = actualOwnerId;
    }

    public Long getCurrentOwnerId() {
        return currentOwnerId;
    }

    public void setCurrentOwnerId(Long currentOwnerId) {
        this.currentOwnerId = currentOwnerId;
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

    public List<PhaseProgressDto> getPhaseProgresses() {
        return phaseProgresses;
    }

    public void setPhaseProgresses(List<PhaseProgressDto> phaseProgresses) {
        this.phaseProgresses = phaseProgresses;
    }

    public double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    // Inner DTO class for phase progress
    public static class PhaseProgressDto {
        private Long id;
        private Long phaseId;
        private String status;
        private LocalDateTime completionDate;
        private LocalDateTime lastUpdated;

        // Additional fields from LearningPlanPhase that might be useful
        private String topic;
        private String skill;
        private String phaseDescription;
        private String phaseDuration;

        public PhaseProgressDto() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getPhaseId() {
            return phaseId;
        }

        public void setPhaseId(Long phaseId) {
            this.phaseId = phaseId;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public LocalDateTime getCompletionDate() {
            return completionDate;
        }

        public void setCompletionDate(LocalDateTime completionDate) {
            this.completionDate = completionDate;
        }

        public LocalDateTime getLastUpdated() {
            return lastUpdated;
        }

        public void setLastUpdated(LocalDateTime lastUpdated) {
            this.lastUpdated = lastUpdated;
        }

        public String getTopic() {
            return topic;
        }

        public void setTopic(String topic) {
            this.topic = topic;
        }

        public String getSkill() {
            return skill;
        }

        public void setSkill(String skill) {
            this.skill = skill;
        }

        public String getPhaseDescription() {
            return phaseDescription;
        }

        public void setPhaseDescription(String phaseDescription) {
            this.phaseDescription = phaseDescription;
        }

        public String getPhaseDuration() {
            return phaseDuration;
        }

        public void setPhaseDuration(String phaseDuration) {
            this.phaseDuration = phaseDuration;
        }
    }
}