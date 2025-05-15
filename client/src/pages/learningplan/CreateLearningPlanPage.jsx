import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LearningPlanForm from '../../components/learningplan/LearningPlanForm';
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../context/authContext';

const CreateLearningPlanPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);

    const handleSubmit = async (learningPlan) => {
        try {
            console.log("new learningplan")
            console.log(learningPlan)
            const response = await axios.post(
                'http://localhost:8080/api/learning-plan/create-learning-plan',
                learningPlan,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${currentUser.token}`
                    },
                    withCredentials: true
                }
            );

            toast.success('Learning plan created.', {
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
            <LearningPlanForm onSubmit={handleSubmit} />
        </div>
    );
};

export default CreateLearningPlanPage;
