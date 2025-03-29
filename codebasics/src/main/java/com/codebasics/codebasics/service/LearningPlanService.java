package com.codebasics.codebasics.service;

import com.codebasics.codebasics.dto.LearningPlanDTO;
import com.codebasics.codebasics.model.LearningPlan;
import com.codebasics.codebasics.repository.LearningPlanRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    @Autowired
    private ModelMapper modelMapper;

    public LearningPlanDTO createLearningPlan(LearningPlanDTO learningPlanDTO) {
        LearningPlan learningPlan = modelMapper.map(learningPlanDTO, LearningPlan.class);
        learningPlanRepository.save(learningPlan);
        return learningPlanDTO;
    }

    public List<LearningPlanDTO> getAlLearningPlans() {
        List<LearningPlan> learningPlansList = learningPlanRepository.findAll();
        return modelMapper.map(learningPlansList, new TypeToken<List<LearningPlanDTO>>(){}.getType());
    }

    public LearningPlanDTO updateLearningPlan(Long id, LearningPlanDTO learningPlanDTO) {
        Optional<LearningPlan> existingPlan = learningPlanRepository.findById(id);

        if (existingPlan.isEmpty()) {
            throw new RuntimeException("Learning Plan not found with id: " + id);
        }

        LearningPlan learningPlan = existingPlan.get();
        learningPlan.setPlanName(learningPlanDTO.getPlanName());
        learningPlan.setDescription(learningPlanDTO.getDescription());
        learningPlan.setSkills(learningPlanDTO.getSkills());
        learningPlan.setDuration(learningPlanDTO.getDuration());
        learningPlan.setImageUrl(learningPlanDTO.getImageUrl());

        learningPlanRepository.save(learningPlan);

        return modelMapper.map(learningPlan, LearningPlanDTO.class);
    }

    public LearningPlanDTO deleteLearningPlan(Long id) {
        Optional<LearningPlan> existingPlan = learningPlanRepository.findById(id);

        if (existingPlan.isEmpty()) {
            throw new RuntimeException("Learning Plan not found with id: " + id);
        }

        LearningPlan learningPlan = existingPlan.get();

        learningPlanRepository.deleteById(id);

        return modelMapper.map(learningPlan, LearningPlanDTO.class);
    }
}
