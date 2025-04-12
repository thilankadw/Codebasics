package com.codebasics.codebasics.repository;

import com.codebasics.codebasics.model.LearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {
}
