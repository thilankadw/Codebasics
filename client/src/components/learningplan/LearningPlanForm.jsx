import React, { useState } from 'react';
import LearningPlanPhaseForm from './LearningPlanPhaseForm';
import './LearningPlanForm.scss';

const LearningPlanForm = ({ initialData = {}, onSubmit }) => {
    const [learningPlan, setLearningPlan] = useState({
        planName: initialData.planName || '',
        description: initialData.description || '',
        skills: initialData.skills || '',
        duration: initialData.duration || '',
        imageUrl: initialData.imageUrl || '',
        ownerId: initialData.ownerId || 1,
        phases: initialData.phases || []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLearningPlan(prev => ({
            ...prev,
            [name]: value
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
                    imageUrl: ''
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

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(learningPlan);
    };

    return (
        <form onSubmit={handleSubmit} className="learning-plan-form">
            <div className="form-header">
                <h2>{initialData.id ? 'Edit Learning Plan' : 'Create New Learning Plan'}</h2>
                <p>Fill in the details below to {initialData.id ? 'update' : 'create'} your learning plan</p>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label>Plan Name</label>
                    <input
                        type="text"
                        name="planName"
                        value={learningPlan.planName}
                        onChange={handleChange}
                        placeholder="Enter plan name"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Duration</label>
                    <input
                        type="text"
                        name="duration"
                        value={learningPlan.duration}
                        onChange={handleChange}
                        placeholder="e.g., 8 weeks"
                        required
                    />
                </div>
                
                <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={learningPlan.description}
                        onChange={handleChange}
                        placeholder="Describe the learning plan objectives"
                        rows="4"
                        required
                    />
                </div>
                
                <div className="form-group full-width">
                    <label>Skills</label>
                    <input
                        type="text"
                        name="skills"
                        value={learningPlan.skills}
                        onChange={handleChange}
                        placeholder="List relevant skills (comma separated)"
                    />
                </div>
                
                <div className="form-group full-width">
                    <label>Image URL</label>
                    <div className="image-url-input">
                        <input
                            type="text"
                            name="imageUrl"
                            value={learningPlan.imageUrl}
                            onChange={handleChange}
                            placeholder="Paste image URL for your plan"
                        />
                        {learningPlan.imageUrl && (
                            <div className="image-preview">
                                <img src={learningPlan.imageUrl} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="phases-section">
                <div className="section-header">
                    <h3>Learning Phases</h3>
                    <button
                        type="button"
                        onClick={addPhase}
                        className="add-phase-btn"
                    >
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
                                    <button
                                        type="button"
                                        onClick={() => removePhase(index)}
                                        className="remove-phase-btn"
                                        aria-label="Remove phase"
                                    >
                                        &times;
                                    </button>
                                </div>
                                <LearningPlanPhaseForm
                                    phase={phase}
                                    onChange={(updatedPhase) => handlePhaseChange(index, updatedPhase)}
                                />
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