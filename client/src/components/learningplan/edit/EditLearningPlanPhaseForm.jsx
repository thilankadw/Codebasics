import React, { useState } from 'react';
import './LearningPlanPhaseForm.scss';
import { toast } from 'react-toastify';

const EditLearningPlanPhaseForm = ({ phase, onChange }) => {
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (file) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
                { method: 'POST', body: formData }
            );

            const data = await response.json();
            onChange({ ...phase, imageUrl: data.secure_url });
        } catch (error) {
            toast.error('Image upload failed');
        } finally {
            setUploading(false);
        }
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...phase, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onChange({ ...phase, imageFile: file });
            handleImageUpload(file);
        }
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
                {uploading && <div className="upload-status">Uploading image...</div>}
                {phase.imageFile ? (
                    <div className="image-preview">
                        <img src={URL.createObjectURL(phase.imageFile)} alt="Phase Preview" />
                    </div>
                ) : phase.imageUrl && (
                    <div className="image-preview">
                        <img src={phase.imageUrl} alt="Phase Image" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditLearningPlanPhaseForm;