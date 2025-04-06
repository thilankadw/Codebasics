import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './userlearningplan.css';

const MyLearningPlansPage = () => {
  const [myLearningPlans, setMyLearningPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState('2');
  const [editingPlan, setEditingPlan] = useState(null);
  const [viewingPlan, setViewingPlan] = useState(null);
  const [editFormData, setEditFormData] = useState({
    planName: '',
    description: '',
    skills: '',
    duration: '',
    imageUrl: '',
    visibility: 'PRIVATE',
    milestone1: 'incomplete',
    milestone2: 'incomplete',
    milestone3: 'incomplete'
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  useEffect(() => {
    fetchLearningPlans();
  }, [userId]);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ ...alert, show: false });
    }, 3000);
  };

  const fetchLearningPlans = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/user-learning-plans/current-owner/${userId}`);
      const transformedPlans = response.data.map(plan => ({
        id: plan.id,
        planName: plan.planName,
        description: plan.description,
        skills: plan.skills,
        duration: plan.duration,
        imageUrl: plan.imageUrl,
        visibility: plan.visibility || 'PRIVATE',
        milestone1: plan.milestone1 || 'incomplete',
        milestone2: plan.milestone2 || 'incomplete',
        milestone3: plan.milestone3 || 'incomplete'
      }));
      setMyLearningPlans(transformedPlans);
    } catch (error) {
      console.error('Error fetching learning plans:', error);
      showAlert('Failed to load learning plans', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (planId, e) => {
    e.stopPropagation();
    try {
      await axios.put(`http://localhost:8080/api/user-learning-plans/share/${planId}`);
      showAlert('Plan shared successfully!', 'success');
      fetchLearningPlans();
    } catch (error) {
      console.error('Error sharing plan:', error);
      showAlert('Failed to share plan', 'error');
    }
  };

  const fetchPlanDetails = async (planId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/user-learning-plans/${planId}`);
      setViewingPlan(response.data);
    } catch (error) {
      console.error('Error fetching plan details:', error);
      showAlert('Failed to load plan details', 'error');
    }
  };

  const handleCardClick = (planId) => {
    fetchPlanDetails(planId);
  };

  const handleCloseView = () => {
    setViewingPlan(null);
  };

  const handleDelete = async (planId, e) => {
    e.stopPropagation();
    setPlanToDelete(planId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (planToDelete) {
      try {
        await axios.delete(`http://localhost:8080/api/user-learning-plans/${planToDelete}`);
        showAlert('Plan deleted successfully!', 'success');
        fetchLearningPlans();
      } catch (error) {
        console.error('Error deleting learning plan:', error);
        showAlert('Failed to delete plan', 'error');
      }
    }
    setShowDeleteConfirm(false);
    setPlanToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setPlanToDelete(null);
  };

  const handleEdit = (plan, e) => {
    e.stopPropagation();
    setEditingPlan(plan.id);
    setEditFormData({
      planName: plan.planName,
      description: plan.description,
      skills: plan.skills,
      duration: plan.duration,
      imageUrl: plan.imageUrl,
      visibility: plan.visibility || 'PRIVATE',
      milestone1: plan.milestone1 || 'incomplete',
      milestone2: plan.milestone2 || 'incomplete',
      milestone3: plan.milestone3 || 'incomplete'
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleMilestoneToggle = (milestoneField) => {
    setEditFormData({
      ...editFormData,
      [milestoneField]: editFormData[milestoneField] === 'complete' ? 'incomplete' : 'complete'
    });
  };

  const handleUpdate = async (planId, e) => {
    e.stopPropagation();
    try {
      await axios.put(`http://localhost:8080/api/user-learning-plans/${planId}`, editFormData);
      setEditingPlan(null);
      showAlert('Plan updated successfully!', 'success');
      fetchLearningPlans();
    } catch (error) {
      console.error('Error updating learning plan:', error);
      showAlert('Failed to update plan', 'error');
    }
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingPlan(null);
  };

  const renderMilestoneStatus = (status) => {
    return (
      <span className={`milestone-status ${status}`}>
        {status === 'complete' ? '✓ Completed' : '✗ Incomplete'}
      </span>
    );
  };

  return (
    <div className="learning-plan-container">
      {/* Alert Notification */}
      {alert.show && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
          <button 
            className="alert-close" 
            onClick={() => setAlert({ ...alert, show: false })}
          >
            ×
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this learning plan?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="delete-confirm-buttons">
              <button onClick={cancelDelete} className="cancel-delete-btn">
                Cancel
              </button>
              <button onClick={confirmDelete} className="confirm-delete-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="my-learning-plans">
        <h2>My Learning Plans</h2>
        {isLoading ? (
          <div className="loading-spinner">Loading your plans...</div>
        ) : myLearningPlans.length === 0 ? (
          <div className="no-plans-message">You don't have any learning plans yet.</div>
        ) : (
          <div className="plans-grid">
            {myLearningPlans.map((plan) => (
              <div 
                key={plan.id} 
                className="plan-card" 
                onClick={() => handleCardClick(plan.id)}
              >
                {plan.imageUrl && (
                  <div className="plan-image-container">
                    <img src={plan.imageUrl} alt={plan.planName} className="plan-image" />
                  </div>
                )}
                
                <div className="plan-content">
                  {editingPlan === plan.id ? (
                    <div className="edit-form" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        name="planName"
                        value={editFormData.planName}
                        onChange={handleEditChange}
                        className="edit-input"
                      />
                      <textarea
                        name="description"
                        value={editFormData.description}
                        onChange={handleEditChange}
                        className="edit-textarea"
                      />
                      <input
                        type="text"
                        name="skills"
                        value={editFormData.skills}
                        onChange={handleEditChange}
                        className="edit-input"
                      />
                      <input
                        type="text"
                        name="duration"
                        value={editFormData.duration}
                        onChange={handleEditChange}
                        className="edit-input"
                      />
                      <input
                        type="text"
                        name="imageUrl"
                        value={editFormData.imageUrl}
                        onChange={handleEditChange}
                        className="edit-input"
                      />
                      
                      <div className="milestone-editor">
                        <h4>Milestones:</h4>
                        <h6>click milestone to change the status</h6>
                        <div className="milestone-item">
                          <label>Milestone 1:</label>
                          <button 
                            className={`milestone-toggle ${editFormData.milestone1}`}
                            onClick={() => handleMilestoneToggle('milestone1')}
                            type="button"
                          >
                            {editFormData.milestone1 === 'complete' ? '✓ Completed' : '✗ Incomplete'}
                          </button>
                        </div>
                        <div className="milestone-item">
                          <label>Milestone 2:</label>
                          <button 
                            className={`milestone-toggle ${editFormData.milestone2}`}
                            onClick={() => handleMilestoneToggle('milestone2')}
                            type="button"
                          >
                            {editFormData.milestone2 === 'complete' ? '✓ Completed' : '✗ Incomplete'}
                          </button>
                        </div>
                        <div className="milestone-item">
                          <label>Milestone 3:</label>
                          <button 
                            className={`milestone-toggle ${editFormData.milestone3}`}
                            onClick={() => handleMilestoneToggle('milestone3')}
                            type="button"
                          >
                            {editFormData.milestone3 === 'complete' ? '✓ Completed' : '✗ Incomplete'}
                          </button>
                        </div>
                      </div>
                      
                      <div className="edit-buttons">
                        <button onClick={(e) => handleUpdate(plan.id, e)} className="save-btn">
                          Save
                        </button>
                        <button onClick={handleCancelEdit} className="cancel-btn">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="plan-title">{plan.planName}</h3>
                      <div className="plan-meta">
                        <span className="duration"><strong>Duration:</strong> {plan.duration}</span>
                        <span className="skills"><strong>Skills:</strong> {plan.skills}</span>
                        <span className="visibility"><strong>Status:</strong> {plan.visibility}</span>
                      </div>
                      <p className="plan-description">{plan.description}</p>
                      
                      <div className="milestones-display">
                        <h4>Progress:</h4>
                        <div className="milestone-item">
                          <span>Milestone 1:</span>
                          {renderMilestoneStatus(plan.milestone1)}
                        </div>
                        <div className="milestone-item">
                          <span>Milestone 2:</span>
                          {renderMilestoneStatus(plan.milestone2)}
                        </div>
                        <div className="milestone-item">
                          <span>Milestone 3:</span>
                          {renderMilestoneStatus(plan.milestone3)}
                        </div>
                      </div>
                      
                      <div className="plan-actions" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={(e) => handleEdit(plan, e)} 
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={(e) => handleDelete(plan.id, e)} 
                          className="delete-btn"
                        >
                          Delete
                        </button>
                        <button 
                          onClick={(e) => handleShare(plan.id, e)} 
                          className="share-btn"
                          disabled={plan.visibility === 'PUBLIC'}
                        >
                          {plan.visibility === 'PUBLIC' ? 'Shared' : 'Share'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Plan Detail Modal */}
      {viewingPlan && (
        <div className="plan-modal-overlay">
          <div className="plan-modal">
            <button className="close-modal" onClick={handleCloseView}>×</button>
            
            {viewingPlan.imageUrl && (
              <div className="modal-image-container">
                <img src={viewingPlan.imageUrl} alt={viewingPlan.planName} className="modal-image" />
              </div>
            )}
            
            <div className="modal-content">
              <h3>{viewingPlan.planName}</h3>
              <div className="modal-meta">
                <p><strong>Duration:</strong> {viewingPlan.duration}</p>
                <p><strong>Skills:</strong> {viewingPlan.skills}</p>
                <p><strong>Actual Owner:</strong> {viewingPlan.actualOwner?.name || 'Unknown'}</p>
                <p><strong>Visibility:</strong> {viewingPlan.visibility || 'PRIVATE'}</p>
              </div>
              <div className="modal-description">
                <h4>Description</h4>
                <p>{viewingPlan.description}</p>
              </div>
              
              <div className="milestones-display">
                <h3>Progress:</h3>
                <div className="milestone-item">
                  <span>Milestone 1:</span>
                  {renderMilestoneStatus(viewingPlan.milestone1 || 'incomplete')}
                </div>
                <div className="milestone-item">
                  <span>Milestone 2:</span>
                  {renderMilestoneStatus(viewingPlan.milestone2 || 'incomplete')}
                </div>
                <div className="milestone-item">
                  <span>Milestone 3:</span>
                  {renderMilestoneStatus(viewingPlan.milestone3 || 'incomplete')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLearningPlansPage;