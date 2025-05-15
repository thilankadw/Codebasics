package com.codebasics.codebasics.controller;

import com.codebasics.codebasics.dto.UpdatePlanRequestDTO;
import com.codebasics.codebasics.model.UserLearningPlan;
import com.codebasics.codebasics.model.UserLearningPhaseProgress;
import com.codebasics.codebasics.model.LearningPlanPhase;
import com.codebasics.codebasics.dto.UserLearningPlanDto;
import com.codebasics.codebasics.service.UserLearningPlanService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/user-learning-plans")
public class UserLearningPlanController {

    private final UserLearningPlanService userLearningPlanService;

    public UserLearningPlanController(
            UserLearningPlanService userLearningPlanService) {
        this.userLearningPlanService = userLearningPlanService;
    }

    @GetMapping
    public List<UserLearningPlanDto> getAllPlans() {
        return userLearningPlanService.getAllPlans()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserLearningPlanDto> getPlanById(@PathVariable Long id) {
        UserLearningPlan plan = userLearningPlanService.getPlanById(id);
        UserLearningPlanDto dto = convertToDto(plan);
        return ResponseEntity.ok(dto);
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
        dto.setLearningPlanId(plan.getLearningPlanId());
        dto.setOverallStatus(plan.getOverallStatus());
        dto.setSubscriptionDate(plan.getSubscriptionDate());
        dto.setCompletionDate(plan.getCompletionDate());
        dto.setLastActivityDate(plan.getLastActivityDate());
        dto.setProgressPercentage(plan.calculateOverallProgressPercentage());

        // Convert phase progresses to DTOs
        List<UserLearningPlanDto.PhaseProgressDto> phaseProgressDtos = plan.getPhaseProgresses().stream()
                .map(progress -> {
                    UserLearningPlanDto.PhaseProgressDto progressDto = new UserLearningPlanDto.PhaseProgressDto();
                    progressDto.setId(progress.getId());
                    progressDto.setPhaseId(progress.getLearningPlanPhaseId());
                    progressDto.setStatus(progress.getStatus());
                    progressDto.setCompletionDate(progress.getCompletionDate());
                    progressDto.setLastUpdated(progress.getLastUpdated());

                    // Optionally fetch additional phase details if needed
//                    try {
//                        LearningPlanPhase phase = learningPlanPhaseService.getPhaseById(progress.getLearningPlanPhaseId());
//                        progressDto.setTopic(phase.getTopic());
//                        progressDto.setSkill(phase.getSkill());
//                        progressDto.setPhaseDescription(phase.getDescription());
//                        progressDto.setPhaseDuration(phase.getDuration());
//                    } catch (Exception e) {
//                        // Handle case where phase might not exist anymore
//                    }

                    return progressDto;
                })
                .collect(Collectors.toList());

        dto.setPhaseProgresses(phaseProgressDtos);

        return dto;
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlan(@PathVariable Long id, @Valid @RequestBody UpdatePlanRequestDTO request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            UserLearningPlan updatedPlan = userLearningPlanService.updatePlan(id, request);
            UserLearningPlanDto dto = convertToDto(updatedPlan);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        userLearningPlanService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/owner/{ownerId}")
    public List<UserLearningPlanDto> getPlansByOwner(@PathVariable Long ownerId) {
        return userLearningPlanService.getPlansByOwner(ownerId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/current-owner/{currentOwnerId}")
    public List<UserLearningPlanDto> getPlansByCurrentOwner(@PathVariable Long currentOwnerId) {
        return userLearningPlanService.getPlansByCurrentOwner(currentOwnerId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/visibility/{visibility}")
    public List<UserLearningPlanDto> getPlansByVisibility(@PathVariable String visibility) {
        return userLearningPlanService.getPlansByVisibility(visibility)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @PutMapping("/share/{id}")
    public ResponseEntity<UserLearningPlanDto> sharePlan(@PathVariable Long id, @RequestBody Map<String, String> visibilityUpdate) {
        String visibility = visibilityUpdate.get("visibility");
        UserLearningPlan updatedPlan = userLearningPlanService.updateVisibility(id, visibility);
        UserLearningPlanDto dto = convertToDto(updatedPlan);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{planId}/progress")
    public ResponseEntity<Double> getPlanProgress(@PathVariable Long planId) {
        double progress = userLearningPlanService.calculatePlanProgressPercentage(planId);
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/{planId}/phases")
    public ResponseEntity<List<UserLearningPlanDto.PhaseProgressDto>> getPlanPhases(@PathVariable Long planId) {
        UserLearningPlan plan = userLearningPlanService.getPlanById(planId);
        UserLearningPlanDto dto = convertToDto(plan);
        return ResponseEntity.ok(dto.getPhaseProgresses());
    }

    @PutMapping("/{planId}/phases/{phaseId}/status")
    public ResponseEntity<UserLearningPlanDto> updatePhaseStatus(
            @PathVariable Long planId,
            @PathVariable Long phaseId,
            @RequestBody Map<String, String> statusUpdate) {

        String status = statusUpdate.get("status");
        if (status == null || !status.matches("^(NOT_STARTED|IN_PROGRESS|COMPLETED)$")) {
            return ResponseEntity.badRequest().build();
        }

        UserLearningPlan updatedPlan = userLearningPlanService.updatePhaseProgress(planId, phaseId, status);
        UserLearningPlanDto dto = convertToDto(updatedPlan);
        return ResponseEntity.ok(dto);
    }
}