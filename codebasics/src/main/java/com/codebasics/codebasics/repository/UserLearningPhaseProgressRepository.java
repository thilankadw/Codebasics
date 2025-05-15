package com.codebasics.codebasics.repository;

import com.codebasics.codebasics.model.UserLearningPhaseProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserLearningPhaseProgressRepository extends JpaRepository<UserLearningPhaseProgress, Long> {
    List<UserLearningPhaseProgress> findByUserLearningPlanId(Long userLearningPlanId);
    List<UserLearningPhaseProgress> findByLearningPlanPhaseId(Long learningPlanPhaseId);
    List<UserLearningPhaseProgress> findByStatus(String status);
}