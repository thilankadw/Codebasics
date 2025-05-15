import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import LearningPlanForm from '../../components/learningplan/LearningPlanForm';
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateLearningPlanPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [learningPlan, setLearningPlan] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchLearningPlan = async () => {
                try {
                } catch (error) {
                    console.error('Error fetching learning plan:', error);
                    toast.error('Error fetching learning plan.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Bounce,
                    });
                    // navigate('/');
                }
            };
            fetchLearningPlan();
        }

    }, [id, navigate]);

    const handleSubmit = async (learningPlan) => {
        const isUpdate = id !== undefined || id !== null;

        try {
            const response = isUpdate
                ? await axios.put(
                    `http://localhost:8080/api/learning-plan/update-learning-plan/${learningPlan.id}`,
                    learningPlan,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )
                : await axios.post(
                    'http://localhost:8080/api/learning-plan/create-learning-plan',
                    learningPlan,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

            toast.success(
                isUpdate ? 'Learning plan updated.' : 'Learning plan created.',
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                }
            );

            console.log('Learning plan created:', response.data);
            navigate('/');
        } catch (error) {
            console.error('Error submitting learning plan:', error);
            toast.error('Failed to submit learning plan. Please try again.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    };

    return (
        <div className="create-learning-plan-page">
            {
                id ? <LearningPlanForm initialData={learningPlan} onSubmit={handleSubmit} /> :
                    <LearningPlanForm onSubmit={handleSubmit} />
            }


        </div>
    );
};

export default CreateLearningPlanPage;