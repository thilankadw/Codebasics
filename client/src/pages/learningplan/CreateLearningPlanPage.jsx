import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LearningPlanForm from '../../components/learningplan/LearningPlanForm';

const CreateLearningPlanPage = () => {
    const navigate = useNavigate();

    const handleSubmit = async (learningPlan) => {
        try {
            const response = await axios.post(
                'http://localhost:8080/api/learning-plan/create-learning-plan',
                learningPlan,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
            );
            
            console.log('Learning plan created:', response.data);
            navigate('/'); 
        } catch (error) {
            console.error('Error creating learning plan:', error);
            alert('Failed to create learning plan. Please try again.');
        }
    };

    return (
        <div className="create-learning-plan-page">
            <LearningPlanForm onSubmit={handleSubmit} />
        </div>
    );
};

export default CreateLearningPlanPage;