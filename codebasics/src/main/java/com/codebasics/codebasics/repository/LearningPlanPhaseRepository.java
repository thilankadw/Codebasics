package com.codebasics.codebasics.repository;

import com.codebasics.codebasics.model.LearningPlanPhase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningPlanPhaseRepository extends JpaRepository<LearningPlanPhase, Long> {
    List<LearningPlanPhase> findByLearningPlanId(Long learningPlanId);
    void deleteByLearningPlanId(Long learningPlanId);
}