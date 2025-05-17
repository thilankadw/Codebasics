import React, { useState } from 'react';
import './LearningPlanPhaseForm.scss';
import { toast } from 'react-toastify';

const LearningPlanPhaseForm = ({ phase, onChange }) => {
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

            if (!response.ok) {
                throw new Error('Image upload failed');
            }

            const data = await response.json();
            onChange({ ...phase, imageUrl: data.secure_url });
            toast.success('Phase image uploaded successfully');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Phase image upload failed');
        } finally {
            setUploading(false);
        }
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...phase, [name]: value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        onChange({ ...phase, imageFile: file });
        
        await handleImageUpload(file);
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
                <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                {uploading && <span className="upload-status">Uploading...</span>}
                {phase.imageUrl && (
                    <div className="image-preview">
                        <img src={phase.imageUrl} alt="Phase Preview" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearningPlanPhaseForm;
