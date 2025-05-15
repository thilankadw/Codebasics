import React, { useContext } from 'react';
import axios from 'axios'; // <-- Import axios
import './LearningPlanPopup.scss';
import { AuthContext } from '../../context/authContext';
import { toast, Bounce } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LearningPlanPopup = ({ plan, onClose }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!plan) return null;

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/learning-plan/delete-learning-plan/${plan.id}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          },
          withCredentials: true
        }
      );
      toast.success('Learning Plan deleted successfully.', {
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
      onClose();
    } catch (error) {
      console.error('Error deleting learning plan:', error);
      toast.error('Failed to delete the learning plan.', {
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

  const handleSubscribe = async (planId) => {
    console.log("=======Plan ID=======")
    console.log(plan.id)
    console.log(currentUser.id)
    try {
      const response = await axios.post(
        `http://localhost:8080/api/user-learning-plans/subscribe?planId=${plan.id}&userId=${currentUser.id}`,
        {}, // empty body
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${plan.id.token}`
          },
          withCredentials: true
        }
      );

      if (response.data && response.data.id) {
        toast.success('Successfully enrolled in the plan..', {
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

    } catch (error) {
      console.error('Subscription error:', error.response?.data || error.message);
      toast.error('Failed to enroll in the learning plan.', {
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

  const handleUpdate = () => {
    navigate(`/update-learning-plan/${plan.id}`)
    onClose()
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h2>{plan.planName}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="popup-body">
          <div className="plan-details">
            <div className="plan-image">
              {plan.imageUrl && <img src={plan.imageUrl} alt={plan.planName} />}
            </div>
            <div className="plan-info">
              <p><strong>Description:</strong> {plan.description}</p>
              <p><strong>Skills:</strong> {plan.skills}</p>
              <p><strong>Duration:</strong> {plan.duration}</p>
            </div>
          </div>

          <div className="phases-section">
            <h3>Learning Phases</h3>
            {plan.phases && plan.phases.length > 0 ? (
              <div className="phases-list">
                {plan.phases.map(phase => (
                  <div key={phase.id} className="phase-card">
                    <div className="phase-header">
                      <h4>{phase.topic}</h4>
                      {phase.imageUrl && <img src={phase.imageUrl} alt={phase.topic} />}
                    </div>
                    <div className="phase-details">
                      <p><strong>Skill:</strong> {phase.skill}</p>
                      <p><strong>Description:</strong> {phase.description}</p>
                      <p><strong>Duration:</strong> {phase.duration}</p>
                      <p><strong>Resources:</strong> {phase.resources}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No phases available for this learning plan.</p>
            )}
          </div>
        </div>

        <div className="popup-footer">

          {
            currentUser.id === plan.ownerId ?
              <>
                <button className="secondary-button" onClick={handleDelete}>Delete</button>
                <button className="secondary-button" onClick={handleUpdate}>Update Plan</button>
              </>
              :
              <button className="enroll-button" onClick={handleSubscribe}>Enroll in Plan</button>
          }

        </div>
      </div>
    </div>
  );
};

export default LearningPlanPopup;
