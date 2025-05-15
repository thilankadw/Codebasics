import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../context/authContext';
import EditLearningPlanForm from '../../components/learningplan/edit/EditLearningPlanForm';

const EditLearningPlanPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { currentUser } = useContext(AuthContext);
    const [learningPlanData, setLearningPlanData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLearningPlan = async () => {
            try {
                if (id) {
                    const response = await axios.get(
                        `http://localhost:8080/api/learning-plan/${id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${currentUser.token}`
                            },
                            withCredentials: true
                        }
                    );
                    setLearningPlanData(response.data);
                }
            } catch (err) {
                console.error('Error fetching learning plan:', err);
                setError('Failed to fetch learning plan details');
                toast.error('Failed to fetch learning plan details', {
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
            } finally {
                setLoading(false);
            }
        };

        fetchLearningPlan();
    }, [id, currentUser.token]);

    const handleSubmit = async (learningPlan) => {
        try {
            let response;
            
            if (id) {
                response = await axios.put(
                    `http://localhost:8080/api/learning-plan/update-learning-plan/${id}`,
                    learningPlan,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${currentUser.token}`
                        },
                        withCredentials: true
                    }
                );
                
                toast.success('Learning plan updated successfully.', {
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
            } else {
                response = await axios.post(
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
                
                toast.success('Learning plan created successfully.', {
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

            console.log('Learning plan operation successful:', response.data);
            navigate('/');
        } catch (error) {
            console.error('Error submitting learning plan:', error);
            toast.error(`Failed to ${id ? 'update' : 'create'} learning plan. Please try again.`, {
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

    if (loading && id) {
        return <div className="loading">Loading learning plan details...</div>;
    }

    if (error && id) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="edit-learning-plan-page">
            <EditLearningPlanForm 
                initialData={learningPlanData || {}} 
                onSubmit={handleSubmit} 
                isEdit={!!id}
            />
        </div>
    );
};

export default EditLearningPlanPage;