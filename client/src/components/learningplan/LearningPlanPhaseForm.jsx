import React from 'react';
import './LearningPlanPhaseForm.scss';

const LearningPlanPhaseForm = ({ phase, onChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...phase, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        onChange({ ...phase, imageFile: file });
    };

    return (
        <div className="phase-form">
            <div className="form-group">
                <label>Topic</label>
                <input type="text" name="topic" value={phase.topic} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label>Skill</label>
                <input type="text" name="skill" value={phase.skill} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={phase.description} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label>Duration</label>
                <input type="text" name="duration" value={phase.duration} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label>Resources</label>
                <textarea name="resources" value={phase.resources} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label>Upload Image</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {phase.imageFile && (
                    <div className="image-preview">
                        <img src={URL.createObjectURL(phase.imageFile)} alt="Phase Preview" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearningPlanPhaseForm;
