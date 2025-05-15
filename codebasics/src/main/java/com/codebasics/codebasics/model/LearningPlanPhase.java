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

    @Column(name = "learning_plan_id", nullable = false)
    private Long learningPlanId;

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

    @Version
    private Long version;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLearningPlanId() {
        return learningPlanId;
    }

    public void setLearningPlanId(Long learningPlanId) {
        this.learningPlanId = learningPlanId;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getResources() {
        return resources;
    }

    public void setResources(String resources) {
        this.resources = resources;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
