package com.codebasics.codebasics.dto;

import lombok.*;

import java.util.List;

@Setter
@Getter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearningPlanDTO {
    private Long id;
    private Long ownerId;
    private String planName;
    private String description;
    private String skills;
    private String duration;
    private String imageUrl;
    private List<LearningPlanPhaseDTO> phases;

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

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public List<LearningPlanPhaseDTO> getPhases() {
        return phases;
    }

    public void setPhases(List<LearningPlanPhaseDTO> phases) {
        this.phases = phases;
    }
}
