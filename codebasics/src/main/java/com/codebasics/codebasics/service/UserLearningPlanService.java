package com.codebasics.codebasics.service;

import com.codebasics.codebasics.dto.NotificationDTO;
import com.codebasics.codebasics.dto.UpdatePlanRequestDTO;
import com.codebasics.codebasics.model.*;
import com.codebasics.codebasics.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
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

    private final NotificationService notificationService;

    public UserLearningPlanService(
            UserLearningPlanRepository userLearningPlanRepository,
            LearningPlanRepository learningPlanRepository,
            LearningPlanPhaseRepository learningPlanPhaseRepository,
            UserRepository userRepository,
            UserLearningPhaseProgressRepository userLearningPhaseProgressRepository, NotificationService notificationService) {
        this.userLearningPlanRepository = userLearningPlanRepository;
        this.learningPlanRepository = learningPlanRepository;
        this.learningPlanPhaseRepository = learningPlanPhaseRepository;
        this.userRepository = userRepository;
        this.userLearningPhaseProgressRepository = userLearningPhaseProgressRepository;
        this.notificationService = notificationService;
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

        UserLearningPlan finalPlan = userLearningPlanRepository.save(savedPlan);

        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setRecipientUserId(actualOwner.getId());
        notificationDTO.setType("PLAN_SUBSCRIBED");
        notificationDTO.setMessage(user.getUsername() + " subscribed to your learning plan: " + finalPlan.getPlanName());
        notificationService.createNotification(notificationDTO);

        return finalPlan;
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

        UserLearningPlan updatedPlan = userLearningPlanRepository.save(plan);

        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setRecipientUserId(updatedPlan.getActualOwner().getId());
        notificationDTO.setType("PLAN_UPDATED");
        notificationDTO.setMessage("Your learning plan '" + updatedPlan.getPlanName() + "' was updated.");
        notificationService.createNotification(notificationDTO);

        return updatedPlan;
    }

    public void deletePlan(Long id) {
        UserLearningPlan plan = getPlanById(id);
        Long ownerId = plan.getActualOwner().getId();
        String planName = plan.getPlanName();

        userLearningPlanRepository.delete(plan);

        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setRecipientUserId(ownerId);
        notificationDTO.setType("PLAN_DELETED");
        notificationDTO.setMessage("Your learning plan '" + planName + "' was deleted.");
        notificationService.createNotification(notificationDTO);
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

        UserLearningPlan updatedPlan = userLearningPlanRepository.save(plan);

        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setRecipientUserId(updatedPlan.getActualOwner().getId());
        notificationDTO.setType("PLAN_VISIBILITY_UPDATED");
        notificationDTO.setMessage("Visibility for your learning plan '" + updatedPlan.getPlanName() + "' changed to " + visibility);
        notificationService.createNotification(notificationDTO);

        return updatedPlan;
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

        UserLearningPlan updatedPlan = userLearningPlanRepository.save(plan);

        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setRecipientUserId(updatedPlan.getActualOwner().getId());
        notificationDTO.setType("PHASE_PROGRESS_UPDATED");
        notificationDTO.setMessage("Phase progress updated to '" + status + "' for your learning plan '" + updatedPlan.getPlanName() + "'.");
        notificationService.createNotification(notificationDTO);

        return updatedPlan;
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