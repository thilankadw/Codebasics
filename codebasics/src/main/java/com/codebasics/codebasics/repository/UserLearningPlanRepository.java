package com.codebasics.codebasics.repository;

import com.codebasics.codebasics.model.UserLearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserLearningPlanRepository extends JpaRepository<UserLearningPlan, Long> {
    List<UserLearningPlan> findByActualOwnerId(Long actualOwnerId);
    List<UserLearningPlan> findByCurrentOwnerId(Long currentOwnerId);
    List<UserLearningPlan> findByVisibility(String visibility);

}