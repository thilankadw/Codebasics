package com.codebasics.codebasics.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearningPlanDTO {
    private Long id;
    private String planName;
    private String description;
    private String skills;
    private String duration;
    private String imageUrl;
    private Long ownerId;
    private List<LearningPlanPhaseDTO> phases;

    public List<LearningPlanPhaseDTO> getPhases() {
        return phases;
    }

    public void setPhases(List<LearningPlanPhaseDTO> phases) {
        this.phases = phases;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public Long getId() {
        return id;
    }

    public String getPlanName() {
        return planName;
    }

    public String getDescription() {
        return description;
    }

    public String getSkills() {
        return skills;
    }

    public String getDuration() {
        return duration;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Long getOwnerId() {
        return ownerId;
    }
}
