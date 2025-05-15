package com.codebasics.codebasics.service;

import com.codebasics.codebasics.dto.UpdatePlanRequestDTO;
import com.codebasics.codebasics.model.*;
import com.codebasics.codebasics.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserLearningPlanService {
    private final UserLearningPlanRepository userLearningPlanRepository;
    private final LearningPlanRepository learningPlanRepository;
    private final UserRepository userRepository;

    public UserLearningPlanService(
            UserLearningPlanRepository userLearningPlanRepository,
            LearningPlanRepository learningPlanRepository,
            UserRepository userRepository) {
        this.userLearningPlanRepository = userLearningPlanRepository;
        this.learningPlanRepository = learningPlanRepository;
        this.userRepository = userRepository;
    }

    public List<UserLearningPlan> getAllPlans() {
        return userLearningPlanRepository.findAll();
    }

    public UserLearningPlan getPlanById(Long id) {
        return userLearningPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found with id: " + id));
    }

    public UserLearningPlan subscribeToPlan(Long planId, Long userId) {
        LearningPlan originalPlan = learningPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User originalOwner = originalPlan.getOwnerId();

        UserLearningPlan userPlan = new UserLearningPlan();
        userPlan.setPlanName(originalPlan.getPlanName());
        userPlan.setDescription(originalPlan.getDescription());
        userPlan.setSkills(originalPlan.getSkills());
        userPlan.setDuration(originalPlan.getDuration());
        String imageUrl = originalPlan.getImageUrl();
        userPlan.setImageUrl(imageUrl != null && !imageUrl.trim().isEmpty() ? imageUrl.trim() : null);
        userPlan.setActualOwner(originalOwner);
        userPlan.setCurrentOwner(user);
        userPlan.setVisibility("PRIVATE");
        userPlan.setOriginalPlanId(planId);
        userPlan.setMilestone1("incomplete");
        userPlan.setMilestone2("incomplete");
        userPlan.setMilestone3("incomplete");

        return userLearningPlanRepository.save(userPlan);
    }

    @Transactional
    public UserLearningPlan updatePlan(Long id, UpdatePlanRequestDTO request) {
        UserLearningPlan plan = userLearningPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found with id: " + id));

        plan.setPlanName(request.getPlanName());
        plan.setDescription(request.getDescription());
        plan.setSkills(request.getSkills());
        plan.setDuration(request.getDuration());
        plan.setImageUrl(request.getImageUrl() != null ? request.getImageUrl().trim() : "");
        plan.setLastActivityDate(LocalDateTime.now());

        return userLearningPlanRepository.save(plan);
    }

    private boolean isValidMilestoneStatus(String status) {
        return status != null && (status.equals("complete") || status.equals("incomplete"));
    }

    private boolean isValidVisibility(String visibility) {
        return visibility != null && (visibility.equals("PRIVATE") || visibility.equals("PUBLIC"));
    }

    public void deletePlan(Long id) {
        UserLearningPlan plan = getPlanById(id);
        userLearningPlanRepository.delete(plan);
    }

    public List<UserLearningPlan> getPlansByOwner(Long ownerId) {
        return userLearningPlanRepository.findByActualOwnerId(ownerId);
    }

    public List<UserLearningPlan> getPlansByCurrentOwner(Long currentOwnerId) {
        return userLearningPlanRepository.findByCurrentOwnerId(currentOwnerId);
    }

    public List<UserLearningPlan> getPlansByVisibility(String visibility) {
        return userLearningPlanRepository.findByVisibility(visibility);
    }

    public UserLearningPlan updateVisibility(Long id, String visibility) {
        UserLearningPlan plan = userLearningPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found with id: " + id));

        // If changing to PRIVATE, create a new copy for the recipient
        if (visibility.equals("PRIVATE")) {
            UserLearningPlan newPlan = new UserLearningPlan();
            newPlan.setPlanName(plan.getPlanName());
            newPlan.setDescription(plan.getDescription());
            newPlan.setSkills(plan.getSkills());
            newPlan.setDuration(plan.getDuration());
            newPlan.setImageUrl(plan.getImageUrl());
            newPlan.setActualOwner(plan.getActualOwner());
            newPlan.setCurrentOwner(plan.getCurrentOwner());
            newPlan.setVisibility(visibility);
            newPlan.setOriginalPlanId(plan.getOriginalPlanId());
            newPlan.setMilestone1(plan.getMilestone1());
            newPlan.setMilestone2(plan.getMilestone2());
            newPlan.setMilestone3(plan.getMilestone3());

            return userLearningPlanRepository.save(newPlan);
        }

        // For PUBLIC visibility, just update the existing plan
        plan.setVisibility(visibility);
        return userLearningPlanRepository.save(plan);
    }

    public List<UserLearningPlan> getPlansByCurrentOwnerAndVisibility(Long currentOwnerId, String visibility) {
        return userLearningPlanRepository.findByCurrentOwnerIdAndVisibility(currentOwnerId, visibility);
    }
}