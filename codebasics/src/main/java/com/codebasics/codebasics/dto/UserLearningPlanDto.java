package com.codebasics.codebasics.dto;

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
    private String milestone1;
    private String milestone2;
    private String milestone3;

    public UserLearningPlanDto() {
    }

    public UserLearningPlanDto(Long id, String planName, String description, String skills, 
                             String duration, String imageUrl, Long actualOwnerId, 
                             Long currentOwnerId, String visibility, Long originalPlanId,
                             String milestone1, String milestone2, String milestone3) {
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
        this.milestone1 = milestone1;
        this.milestone2 = milestone2;
        this.milestone3 = milestone3;
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