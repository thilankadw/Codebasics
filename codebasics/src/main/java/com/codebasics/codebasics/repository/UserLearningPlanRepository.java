package com.codebasics.codebasics.repository;

import com.codebasics.codebasics.model.User;
import com.codebasics.codebasics.model.UserLearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserLearningPlanRepository extends JpaRepository<UserLearningPlan, Long> {
    List<UserLearningPlan> findByVisibility(String visibility);
    List<UserLearningPlan> findByActualOwner(User actualOwner);
    List<UserLearningPlan> findByCurrentOwner(User currentOwner);
    List<UserLearningPlan> findByOriginalPlanId(Long originalPlanId);
    List<UserLearningPlan> findByLearningPlanId(Long learningPlanId);
    List<UserLearningPlan> findByOverallStatus(String overallStatus);
}