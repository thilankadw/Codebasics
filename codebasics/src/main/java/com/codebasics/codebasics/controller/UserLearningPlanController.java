package com.codebasics.codebasics.controller;

import com.codebasics.codebasics.model.UserLearningPlan;
import com.codebasics.codebasics.dto.UserLearningPlanDto;
import com.codebasics.codebasics.service.UserLearningPlanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/user-learning-plans")
public class UserLearningPlanController {

    private final UserLearningPlanService userLearningPlanService;

    public UserLearningPlanController(UserLearningPlanService userLearningPlanService) {
        this.userLearningPlanService = userLearningPlanService;
    }

    @GetMapping
    public List<UserLearningPlan> getAllPlans() {
        return userLearningPlanService.getAllPlans();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserLearningPlan> getPlanById(@PathVariable Long id) {
        UserLearningPlan plan = userLearningPlanService.getPlanById(id);
        return ResponseEntity.ok(plan);
    }

    @PostMapping("/subscribe")
    public ResponseEntity<UserLearningPlanDto> subscribeToPlan(
            @RequestParam Long planId,
            @RequestParam Long userId) {
        UserLearningPlan subscribedPlan = userLearningPlanService.subscribeToPlan(planId, userId);
        UserLearningPlanDto dto = convertToDto(subscribedPlan);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    private UserLearningPlanDto convertToDto(UserLearningPlan plan) {
        UserLearningPlanDto dto = new UserLearningPlanDto();
        dto.setId(plan.getId());
        dto.setPlanName(plan.getPlanName());
        dto.setDescription(plan.getDescription());
        dto.setSkills(plan.getSkills());
        dto.setDuration(plan.getDuration());
        dto.setImageUrl(plan.getImageUrl());
        dto.setActualOwnerId(plan.getActualOwner() != null ? plan.getActualOwner().getId() : null);
        dto.setCurrentOwnerId(plan.getCurrentOwner() != null ? plan.getCurrentOwner().getId() : null);
        dto.setVisibility(plan.getVisibility());
        dto.setOriginalPlanId(plan.getOriginalPlanId());
        dto.setMilestone1(plan.getMilestone1());
        dto.setMilestone2(plan.getMilestone2());
        dto.setMilestone3(plan.getMilestone3());
        return dto;
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserLearningPlan> updatePlan(@PathVariable Long id, @RequestBody UserLearningPlan plan) {
        UserLearningPlan updatedPlan = userLearningPlanService.updatePlan(id, plan);
        return ResponseEntity.ok(updatedPlan);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        userLearningPlanService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/owner/{ownerId}")
    public List<UserLearningPlan> getPlansByOwner(@PathVariable Long ownerId) {
        return userLearningPlanService.getPlansByOwner(ownerId);
    }

    @GetMapping("/current-owner/{currentOwnerId}")
    public List<UserLearningPlan> getPlansByCurrentOwner(@PathVariable Long currentOwnerId) {
        return userLearningPlanService.getPlansByCurrentOwner(currentOwnerId);
    }

    @GetMapping("/visibility/{visibility}")
    public List<UserLearningPlan> getPlansByVisibility(@PathVariable String visibility) {
        return userLearningPlanService.getPlansByVisibility(visibility);
    }

    @PutMapping("/share/{id}")
    public ResponseEntity<UserLearningPlan> sharePlan(@PathVariable Long id) {
        UserLearningPlan updatedPlan = userLearningPlanService.updateVisibility(id, "PUBLIC");
        return ResponseEntity.ok(updatedPlan);
    }
}