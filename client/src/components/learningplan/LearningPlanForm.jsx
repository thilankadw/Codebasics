import React, { useState } from 'react';
import LearningPlanPhaseForm from './LearningPlanPhaseForm';
import './LearningPlanForm.scss';

const LearningPlanForm = ({ initialData = {}, onSubmit }) => {
    const [learningPlan, setLearningPlan] = useState({
        planName: initialData.planName || '',
        description: initialData.description || '',
        skills: initialData.skills || '',
        duration: initialData.duration || '',
        imageFile: null,
        ownerId: initialData.ownerId || 1,
        phases: initialData.phases || []
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLearningPlan(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setLearningPlan(prev => ({
            ...prev,
            imageFile: file
        }));
    };

    const handlePhaseChange = (index, phase) => {
        const updatedPhases = [...learningPlan.phases];
        updatedPhases[index] = phase;
        setLearningPlan(prev => ({
            ...prev,
            phases: updatedPhases
        }));
    };

    const addPhase = () => {
        setLearningPlan(prev => ({
            ...prev,
            phases: [
                ...prev.phases,
                {
                    topic: '',
                    skill: '',
                    description: '',
                    duration: '',
                    resources: '',
                    imageFile: null
                }
            ]
        }));
    };

    const removePhase = (index) => {
        setLearningPlan(prev => ({
            ...prev,
            phases: prev.phases.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!learningPlan.planName.trim()) newErrors.planName = 'Plan name is required';
        if (!learningPlan.duration.trim()) newErrors.duration = 'Duration is required';
        if (!learningPlan.description.trim()) newErrors.description = 'Description is required';

        learningPlan.phases.forEach((phase, i) => {
            if (!phase.topic || !phase.skill || !phase.description || !phase.duration || !phase.resources) {
                newErrors[`phase-${i}`] = 'All phase fields are required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        onSubmit(learningPlan);
    };

    return (
        <form onSubmit={handleSubmit} className="learning-plan-form">
            <div className="form-header">
                <h2>{initialData.id ? 'Edit Learning Plan' : 'Create New Learning Plan'}</h2>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label>Plan Name</label>
                    <input
                        type="text"
                        name="planName"
                        value={learningPlan.planName}
                        onChange={handleChange}
                        required
                    />
                    {errors.planName && <span className="error">{errors.planName}</span>}
                </div>

                <div className="form-group">
                    <label>Duration</label>
                    <input
                        type="text"
                        name="duration"
                        value={learningPlan.duration}
                        onChange={handleChange}
                        required
                    />
                    {errors.duration && <span className="error">{errors.duration}</span>}
                </div>

                <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={learningPlan.description}
                        onChange={handleChange}
                        rows="4"
                        required
                    />
                    {errors.description && <span className="error">{errors.description}</span>}
                </div>

                <div className="form-group full-width">
                    <label>Skills</label>
                    <input
                        type="text"
                        name="skills"
                        value={learningPlan.skills}
                        onChange={handleChange}
                        placeholder="Comma separated skills"
                    />
                </div>

                <div className="form-group full-width">
                    <label>Upload Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {learningPlan.imageFile && (
                        <div className="image-preview">
                            <img
                                src={URL.createObjectURL(learningPlan.imageFile)}
                                alt="Preview"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="phases-section">
                <div className="section-header">
                    <h3>Learning Phases</h3>
                    <button type="button" onClick={addPhase} className="add-phase-btn">
                        <span>+</span> Add Phase
                    </button>
                </div>

                {learningPlan.phases.length === 0 ? (
                    <div className="empty-state">
                        <p>No phases added yet. Click "Add Phase" to get started.</p>
                    </div>
                ) : (
                    <div className="phases-list">
                        {learningPlan.phases.map((phase, index) => (
                            <div key={index} className="phase-card">
                                <div className="phase-card-header">
                                    <span className="phase-number">Phase {index + 1}</span>
                                    <button type="button" onClick={() => removePhase(index)} className="remove-phase-btn">
                                        &times;
                                    </button>
                                </div>
                                <LearningPlanPhaseForm
                                    phase={phase}
                                    onChange={(updatedPhase) => handlePhaseChange(index, updatedPhase)}
                                />
                                {errors[`phase-${index}`] && <span className="error">{errors[`phase-${index}`]}</span>}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="form-actions">
                <button type="submit" className="submit-btn">
                    {initialData.id ? 'Update Plan' : 'Create Plan'}
                </button>
            </div>
        </form>
    );
};

export default LearningPlanForm;
