package com.codebasics.codebasics.service;

import com.codebasics.codebasics.dto.LearningPlanDTO;
import com.codebasics.codebasics.dto.LearningPlanPhaseDTO;
import com.codebasics.codebasics.model.LearningPlan;
import com.codebasics.codebasics.model.LearningPlanPhase;
import com.codebasics.codebasics.model.User;
import com.codebasics.codebasics.repository.LearningPlanPhaseRepository;
import com.codebasics.codebasics.repository.LearningPlanRepository;
import com.codebasics.codebasics.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    @Autowired
    private LearningPlanPhaseRepository learningPlanPhaseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @PostConstruct
    public void configureModelMapper() {
        modelMapper.createTypeMap(LearningPlanDTO.class, LearningPlan.class)
                .addMappings(mapper -> mapper.skip(LearningPlan::setId));
    }

    public LearningPlanDTO createLearningPlan(LearningPlanDTO learningPlanDTO) {
        if (!userRepository.existsById(learningPlanDTO.getOwnerId())) {
            throw new RuntimeException("User not found with ID: " + learningPlanDTO.getOwnerId());
        }

        LearningPlan learningPlan = modelMapper.map(learningPlanDTO, LearningPlan.class);
        learningPlan = learningPlanRepository.save(learningPlan);

        if (learningPlanDTO.getPhases() != null) {
            LearningPlan finalLearningPlan = learningPlan;
            List<LearningPlanPhase> phases = learningPlanDTO.getPhases().stream()
                    .map(phaseDTO -> {
                        LearningPlanPhase phase = modelMapper.map(phaseDTO, LearningPlanPhase.class);
                        phase.setLearningPlanId(finalLearningPlan.getId());
                        return phase;
                    })
                    .collect(Collectors.toList());
            learningPlanPhaseRepository.saveAll(phases);
        }

        return getLearningPlanWithPhases(learningPlan.getId());
    }


    public List<LearningPlanDTO> getAllLearningPlans() {
        List<LearningPlan> learningPlans = learningPlanRepository.findAll();
        return learningPlans.stream()
                .map(plan -> getLearningPlanWithPhases(plan.getId()))
                .collect(Collectors.toList());
    }

    public LearningPlanDTO updateLearningPlan(Long id, LearningPlanDTO learningPlanDTO) {
        Optional<LearningPlan> existingPlan = learningPlanRepository.findById(id);

        if (existingPlan.isEmpty()) {
            throw new RuntimeException("Learning Plan not found with id: " + id);
        }

        LearningPlan learningPlan = existingPlan.get();
        modelMapper.map(learningPlanDTO, learningPlan);
        learningPlanRepository.save(learningPlan);

        if (learningPlanDTO.getPhases() != null) {
            learningPlanPhaseRepository.deleteByLearningPlanId(id);
            List<LearningPlanPhase> phases = learningPlanDTO.getPhases().stream()
                    .map(phaseDTO -> {
                        LearningPlanPhase phase = modelMapper.map(phaseDTO, LearningPlanPhase.class);
                        phase.setLearningPlanId(id);
                        return phase;
                    })
                    .collect(Collectors.toList());

            learningPlanPhaseRepository.saveAll(phases);
        }

        return getLearningPlanWithPhases(id);
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

    public LearningPlanDTO getLearningPlanWithPhases(Long id) {
        LearningPlan learningPlan = learningPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Learning Plan not found"));

        List<LearningPlanPhase> phases = learningPlanPhaseRepository.findByLearningPlanId(id);

        LearningPlanDTO dto = modelMapper.map(learningPlan, LearningPlanDTO.class);
        dto.setPhases(modelMapper.map(phases, new TypeToken<List<LearningPlanPhaseDTO>>(){}.getType()));

        return dto;
    }
}
