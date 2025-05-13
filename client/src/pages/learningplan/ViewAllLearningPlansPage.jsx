import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewAllLearningPlansPage.scss'; 

const dummyPlans = [
  {
    id: 1,
    planName: 'Frontend Development',
    description: 'Learn React, CSS, and frontend best practices',
    skills: 'HTML, CSS, JavaScript, React',
    duration: '3 months'
  },
  {
    id: 2,
    planName: 'Backend Development',
    description: 'Learn Node.js, Express, MongoDB',
    skills: 'Node.js, Express, MongoDB',
    duration: '2 months'
  }
];

const ViewAllLearningPlansPage = () => {
  const navigate = useNavigate();

  return (
    <div className="view-all-plans-page">
      <h1>All Learning Plans</h1>
      <div className="plans-grid">
        {dummyPlans.map(plan => (
          <div key={plan.id} className="plan-card">
            <h2>{plan.planName}</h2>
            <p>{plan.description}</p>
            <span>Skills: {plan.skills}</span>
            <span>Duration: {plan.duration}</span>
            <button onClick={() => navigate(`/view-learning-plan/${plan.id}`)}>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAllLearningPlansPage;
