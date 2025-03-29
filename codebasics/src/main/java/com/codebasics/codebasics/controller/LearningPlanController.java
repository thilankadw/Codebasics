package com.codebasics.codebasics.controller;

import com.codebasics.codebasics.dto.LearningPlanDTO;
import com.codebasics.codebasics.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "api/learning-plan")
public class LearningPlanController {

    @Autowired
    private LearningPlanService learningPlanService;

    @PostMapping("/create-learning-plan")
    public ResponseEntity<LearningPlanDTO> createLearningPlan(@RequestBody LearningPlanDTO learningPlanDTO){
        return ResponseEntity.ok(learningPlanService.createLearningPlan(learningPlanDTO));
    }

    @GetMapping("/all-learning-plans")
    public ResponseEntity<List<LearningPlanDTO>> getAllLearningPlans(){
        return ResponseEntity.ok(learningPlanService.getAlLearningPlans());
    }

    @PutMapping("/update-learning-plan/{id}")
    public ResponseEntity<LearningPlanDTO> updateLearningPlan(@PathVariable Long id, @RequestBody LearningPlanDTO learningPlanDTO){
        return ResponseEntity.ok(learningPlanService.updateLearningPlan(id, learningPlanDTO));
    }

    @DeleteMapping("/delete-learning-plan/{id}")
    public ResponseEntity<LearningPlanDTO> deleteLearningPlan(@PathVariable Long id) {
        return ResponseEntity.ok(learningPlanService.deleteLearningPlan(id));
    }
}
