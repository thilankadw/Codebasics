package com.codebasics.codebasics.service;

import com.codebasics.codebasics.model.*;
import com.codebasics.codebasics.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserLearningPlanService {
    private final UserLearningPlanRepository userLearningPlanRepository;
    private final LearningPlanRepository learningPlanRepository;
    private final LearningPlanPhaseRepository learningPlanPhaseRepository;
    private final UserRepository userRepository;
    private final UserLearningPhaseProgressRepository userLearningPhaseProgressRepository;

    public UserLearningPlanService(
            UserLearningPlanRepository userLearningPlanRepository,
            LearningPlanRepository learningPlanRepository,
            LearningPlanPhaseRepository learningPlanPhaseRepository,
            UserRepository userRepository,
            UserLearningPhaseProgressRepository userLearningPhaseProgressRepository) {
        this.userLearningPlanRepository = userLearningPlanRepository;
        this.learningPlanRepository = learningPlanRepository;
        this.learningPlanPhaseRepository = learningPlanPhaseRepository;
        this.userRepository = userRepository;
        this.userLearningPhaseProgressRepository = userLearningPhaseProgressRepository;
    }

    public List<UserLearningPlan> getAllPlans() {
        return userLearningPlanRepository.findAll();
    }

    public UserLearningPlan getPlanById(Long id) {
        return userLearningPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found with id: " + id));
    }

    @Transactional
    public UserLearningPlan subscribeToPlan(Long planId, Long userId) {
        LearningPlan originalPlan = learningPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User actualOwner = userRepository.findById(originalPlan.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Original plan owner not found"));

        UserLearningPlan userPlan = new UserLearningPlan();
        userPlan.setPlanName(originalPlan.getPlanName());
        userPlan.setDescription(originalPlan.getDescription());
        userPlan.setSkills(originalPlan.getSkills());
        userPlan.setDuration(originalPlan.getDuration());
        userPlan.setImageUrl(originalPlan.getImageUrl());
        userPlan.setActualOwner(actualOwner);
        userPlan.setCurrentOwner(user);
        userPlan.setVisibility("PRIVATE");
        userPlan.setOriginalPlanId(planId);
        userPlan.setLearningPlanId(planId);
        userPlan.setOverallStatus("NOT_STARTED");
        userPlan.setSubscriptionDate(LocalDateTime.now());
        userPlan.setLastActivityDate(LocalDateTime.now());

        UserLearningPlan savedPlan = userLearningPlanRepository.save(userPlan);

        List<LearningPlanPhase> phases = learningPlanPhaseRepository.findByLearningPlanId(planId);

        for (LearningPlanPhase phase : phases) {
            UserLearningPhaseProgress progress = new UserLearningPhaseProgress();
            progress.setUserLearningPlan(savedPlan);
            progress.setLearningPlanPhaseId(phase.getId());
            progress.setStatus("NOT_STARTED");
            progress.setLastUpdated(LocalDateTime.now());

            savedPlan.addPhaseProgress(progress);
        }

        return userLearningPlanRepository.save(savedPlan);
    }

    @Transactional
    public UserLearningPlan updatePlan(Long id, UserLearningPlan planDetails) {
        UserLearningPlan plan = userLearningPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found with id: " + id));

        plan.setPlanName(planDetails.getPlanName());
        plan.setDescription(planDetails.getDescription());
        plan.setSkills(planDetails.getSkills());
        plan.setDuration(planDetails.getDuration());
        plan.setImageUrl(planDetails.getImageUrl());
        plan.setVisibility(planDetails.getVisibility());
        plan.setLastActivityDate(LocalDateTime.now());

        return userLearningPlanRepository.save(plan);
    }

    public void deletePlan(Long id) {
        UserLearningPlan plan = getPlanById(id);
        userLearningPlanRepository.delete(plan);
    }

    public List<UserLearningPlan> getPlansByOwner(Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        return userLearningPlanRepository.findByActualOwner(owner);
    }

    public List<UserLearningPlan> getPlansByCurrentOwner(Long currentOwnerId) {
        User currentOwner = userRepository.findById(currentOwnerId)
                .orElseThrow(() -> new RuntimeException("Current owner not found"));
        return userLearningPlanRepository.findByCurrentOwner(currentOwner);
    }

    public List<UserLearningPlan> getPlansByVisibility(String visibility) {
        return userLearningPlanRepository.findByVisibility(visibility);
    }

    public UserLearningPlan updateVisibility(Long id, String visibility) {
        UserLearningPlan plan = userLearningPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found with id: " + id));

        plan.setVisibility(visibility);
        plan.setLastActivityDate(LocalDateTime.now());
        return userLearningPlanRepository.save(plan);
    }

    @Transactional
    public UserLearningPlan updatePhaseProgress(Long planId, Long phaseId, String status) {
        UserLearningPlan plan = userLearningPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("User learning plan not found with id: " + planId));

        UserLearningPhaseProgress phaseProgress = plan.getPhaseProgresses().stream()
                .filter(progress -> progress.getLearningPlanPhaseId().equals(phaseId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Phase progress not found for phase id: " + phaseId));

        phaseProgress.setStatus(status);

        plan.updateOverallStatus();
        plan.setLastActivityDate(LocalDateTime.now());

        return userLearningPlanRepository.save(plan);
    }

    public List<UserLearningPhaseProgress> getPhaseProgressesByPlanId(Long planId) {
        UserLearningPlan plan = userLearningPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("User learning plan not found with id: " + planId));

        return plan.getPhaseProgresses();
    }

    public double calculatePlanProgressPercentage(Long planId) {
        UserLearningPlan plan = userLearningPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("User learning plan not found with id: " + planId));

        return plan.calculateOverallProgressPercentage();
    }
}