import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './userlearningplan.css';
import { AuthContext } from '../../context/authContext';
import { Link } from 'react-router-dom';

const MyLearningPlansPage = () => {
    const { currentUser } = useContext(AuthContext);
  const [myLearningPlans, setMyLearningPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [viewingPlan, setViewingPlan] = useState(null);
  const [editFormData, setEditFormData] = useState({
    planName: '',
    description: '',
    skills: '',
    duration: '',
    imageUrl: '',
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [planToShare, setPlanToShare] = useState(null);

  useEffect(() => {
    setUserId(currentUser.id);
  }, [currentUser])

  useEffect(() => {
    if(userId) fetchLearningPlans();
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
      setMyLearningPlans(response.data);
    } catch (error) {
      console.error('Error fetching learning plans:', error);
      showAlert('Failed to load learning plans', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = (planId) => {
    setPlanToShare(planId);
    setShowShareModal(true);
  };

  const confirmShare = async () => {
    if (planToShare) {
      try {
        await axios.put(`http://localhost:8080/api/user-learning-plans/share/${planToShare}`, null, {
          params: { visibility: 'PUBLIC' }
        });
        showAlert('Plan shared successfully!', 'success');
        fetchLearningPlans();
      } catch (error) {
        console.error('Error sharing plan:', error);
        showAlert('Failed to share plan', 'error');
      }
    }
    setShowShareModal(false);
    setPlanToShare(null);
  };

  const cancelShare = () => {
    setShowShareModal(false);
    setPlanToShare(null);
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
  const validateEditForm = () => {
    const errors = [];

    if (!editFormData.planName.trim()) errors.push('Plan name is required.');
    if (!editFormData.description.trim()) errors.push('Description is required.');
    if (!editFormData.skills.trim()) errors.push('Skills are required.');
    if (!editFormData.duration.trim()) errors.push('Duration is required.');

    // if (
    //   editFormData.imageUrl &&
    //   !/^https:\/\/imagedelivery\.net\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+\/dirEntryThumbnail$/.test(editFormData.imageUrl)
    // ) {
    //   errors.push('Image URL must be in the format: https://imagedelivery.net/.../.../dirEntryThumbnail');
    // }
    return errors;
  };

  const handleUpdate = async (planId, e) => {
    e.stopPropagation();

    const errors = validateEditForm();
    if (errors.length > 0) {
      showAlert(errors.join(' '), 'error');
      return;
    }

    try {
      // Trim the imageUrl before sending
      const dataToSend = {
        ...editFormData,
        imageUrl: editFormData.imageUrl?.trim() || ''
      };
      
      console.log('Sending update request with data:', dataToSend);
      const response = await axios.put(`http://localhost:8080/api/user-learning-plans/${planId}`, dataToSend);
      setEditingPlan(null);
      showAlert('Plan updated successfully!', 'success');
      fetchLearningPlans();
    } catch (error) {
      console.error('Error updating learning plan:', error);
      if (error.response?.data) {
        const validationErrors = error.response.data;
        console.log('Validation errors:', validationErrors);
        const errorMessages = Object.entries(validationErrors)
          .map(([field, message]) => `${field}: ${message}`)
          .join('\n');
        showAlert(errorMessages, 'error');
      } else {
        showAlert('Failed to update plan', 'error');
      }
    }
  };

  const handleMilestoneToggle = (milestoneField) => {
    setEditFormData({
      ...editFormData,
      [milestoneField]: editFormData[milestoneField] === 'complete' ? 'incomplete' : 'complete'
    });
  };

  // const handleUpdate = async (planId, e) => {
  //   e.stopPropagation();
  //   try {
  //     await axios.put(`http://localhost:8080/api/user-learning-plans/${planId}`, editFormData);
  //     setEditingPlan(null);
  //     showAlert('Plan updated successfully!', 'success');
  //     fetchLearningPlans();
  //   } catch (error) {
  //     console.error('Error updating learning plan:', error);
  //     showAlert('Failed to update plan', 'error');
  //   }
  // };

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

      {/* Share Modal */}
      {showShareModal && (
        <div className="share-modal-overlay">
          <div className="share-modal">
            <h3>Share Learning Plan</h3>
            <p>Are you sure you want to share this plan publicly?</p>
            <div className="share-modal-buttons">
              <button onClick={cancelShare} className="cancel-share-btn">
                Cancel
              </button>
              <button onClick={confirmShare} className="confirm-share-btn">
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* My Learning Plans Section */}
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
                      <label>plan Name</label>
                      <input
                        type="text"
                        name="planName"
                        value={editFormData.planName}
                        onChange={handleEditChange}
                        placeholder="Plan Name"
                        className={`edit-input ${!editFormData.planName.trim() ? 'input-error' : ''}`}
                      />
                      <label>Description</label>
                      <textarea
                        name="description"
                        value={editFormData.description}
                        onChange={handleEditChange}
                        placeholder="Description"
                        className={`edit-input ${!editFormData.description.trim() ? 'input-error' : ''}`}
                      />
                      <label>skills</label>
                      <input
                        type="text"
                        name="skills"
                        value={editFormData.skills}
                        onChange={handleEditChange}
                        placeholder="Skills"
                        className={`edit-input ${!editFormData.skills.trim() ? 'input-error' : ''}`}
                      />
                      <label>Duration</label>
                      <input
                        type="text"
                        name="duration"
                        value={editFormData.duration}
                        onChange={handleEditChange}
                        placeholder="Duration"
                        className={`edit-input ${!editFormData.duration.trim() ? 'input-error' : ''}`}
                      />
                      <label>ImageUrl</label>
                      <input
                        type="text"
                        name="imageUrl"
                        value={editFormData.imageUrl}
                        onChange={handleEditChange}
                        placeholder="Image URL"
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
                          onClick={(e) => handleShare(plan.id)} 
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