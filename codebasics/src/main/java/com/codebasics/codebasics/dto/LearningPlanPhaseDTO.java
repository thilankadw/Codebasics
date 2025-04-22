package com.codebasics.codebasics.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearningPlanPhaseDTO {
    private Long id;
    private Long learningPlanId;
    private String topic;
    private String skill;
    private String description;
    private String duration;
    private String resources;
    private String imageUrl;
}