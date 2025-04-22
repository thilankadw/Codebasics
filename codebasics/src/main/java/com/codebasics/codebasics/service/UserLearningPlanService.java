package com.codebasics.codebasics.service;

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
        userPlan.setImageUrl(originalPlan.getImageUrl());
        userPlan.setActualOwner(originalOwner);
        userPlan.setCurrentOwner(user);
        userPlan.setVisibility("PRIVATE");
        userPlan.setOriginalPlanId(planId);
        userPlan.setMilestone1("incomplete");
        userPlan.setMilestone2("incomplete");
        userPlan.setMilestone3("incomplete");
        
        return userLearningPlanRepository.save(userPlan);
    }

    public UserLearningPlan updatePlan(Long id, UserLearningPlan planDetails) {
        UserLearningPlan plan = userLearningPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found with id: " + id));
        
        plan.setPlanName(planDetails.getPlanName());
        plan.setDescription(planDetails.getDescription());
        plan.setSkills(planDetails.getSkills());
        plan.setDuration(planDetails.getDuration());
        plan.setImageUrl(planDetails.getImageUrl());
        plan.setVisibility(planDetails.getVisibility());
        plan.setMilestone1(planDetails.getMilestone1());
        plan.setMilestone2(planDetails.getMilestone2());
        plan.setMilestone3(planDetails.getMilestone3());
        
        return userLearningPlanRepository.save(plan);
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
        
        plan.setVisibility(visibility);
        return userLearningPlanRepository.save(plan);
    }
}