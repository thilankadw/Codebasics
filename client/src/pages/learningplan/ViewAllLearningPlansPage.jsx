import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LearningPlanPopup from '../../components/learningplan/LearningPlanPopup';
import './ViewAllLearningPlansPage.scss';
import axios from 'axios';
import { AuthContext } from "../../context/authContext";

const ViewAllLearningPlansPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [learningPlans, setLearningPlans] = useState([]);
  const { currentUser } = useContext(AuthContext);

  const handleViewPlan = (plan) => {
    setSelectedPlan(plan);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedPlan(null);
  };

  useEffect(() => {
    console.log("=============")
    console.log(currentUser.token)
    console.log("=============")
    const fetchLearningPlans = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/learning-plan/all-learning-plans', {
          headers: {
            Authorization: `Bearer ${currentUser.token}` 
          },
          withCredentials: true 
        });

        console.log('Fetched Learning Plans:', response.data);

        setLearningPlans(response.data);
      } catch (error) {
        console.error('Error fetching learning plans:', error);
      }
    };

    fetchLearningPlans();
  }, []);

  return (
    <div className="view-all-plans-page">
      <h1>All Learning Plans</h1>
      <div className="plans-grid">
        {learningPlans && learningPlans.map(plan => (
          <div key={plan.id} className="plan-card">
            {plan.imageUrl && <img src={plan.imageUrl} alt={plan.planName} className="plan-thumbnail" />}
            <h2>{plan.planName}</h2>
            <p>{plan.description}</p>
            <span>Skills: {plan.skills}</span>
            <span>Duration: {plan.duration}</span>
            <button onClick={() => handleViewPlan(plan)}>View Details</button>
          </div>
        ))}
      </div>

      {isPopupOpen && selectedPlan && (
        <LearningPlanPopup
          plan={selectedPlan}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default ViewAllLearningPlansPage;