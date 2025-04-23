import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLearningPlanById, deleteLearningPlan } from '../../services/api';
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewLearningPlanPage.scss';

const ViewLearningPlanPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [learningPlan, setLearningPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLearningPlan = async () => {
            try {
            } catch (error) {
                console.error('Error fetching learning plan:', error);
                // navigate('/');
            }
        };
        
        fetchLearningPlan();
    }, [id, navigate]);

    const handleDelete = async () => {
        try {
            
        } catch (error) {
            console.error('Error deleting learning plan:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="view-learning-plan-page">
            <h1>{learningPlan.planName}</h1>
            <p>{learningPlan.description}</p>
            <div className="plan-meta">
                <span>Skills: {learningPlan.skills}</span>
                <span>Duration: {learningPlan.duration}</span>
            </div>
            
            {learningPlan.imageUrl && (
                <img src={learningPlan.imageUrl} alt={learningPlan.planName} className="plan-image" />
            )}
            
            <h2>Learning Phases</h2>
            <div className="phases-list">
                {learningPlan.phases.map((phase, index) => (
                    <div key={index} className="phase-card">
                        <h3>{phase.topic}</h3>
                        <p>{phase.description}</p>
                        <div className="phase-meta">
                            <span>Skill: {phase.skill}</span>
                            <span>Duration: {phase.duration}</span>
                        </div>
                        <div className="resources">
                            <h4>Resources:</h4>
                            <p>{phase.resources}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="actions">
                <button onClick={() => navigate(`/edit/${id}`)}>Edit</button>
                <button onClick={handleDelete} className="delete-btn">Delete</button>
                <button onClick={() => navigate('/')}>Back to List</button>
            </div>
        </div>
    );
};

export default ViewLearningPlanPage;