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
    if (userId) fetchLearningPlans();
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
        await axios.put(`http://localhost:8080/api/user-learning-plans/share/${planToShare}`, {
          "visibility": "PUBLIC"
        }, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          },
          withCredentials: true,
        }
        );
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
      visibility: plan.visibility || 'PRIVATE'
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
      const dataToSend = {
        ...editFormData,
        imageUrl: editFormData.imageUrl?.trim() || ''
      };

      const response = await axios.put(`http://localhost:8080/api/user-learning-plans/${planId}`, dataToSend);
      setEditingPlan(null);
      showAlert('Plan updated successfully!', 'success');
      fetchLearningPlans();
    } catch (error) {
      console.error('Error updating learning plan:', error);
      if (error.response?.data) {
        const validationErrors = error.response.data;
        const errorMessages = Object.entries(validationErrors)
          .map(([field, message]) => `${field}: ${message}`)
          .join('\n');
        showAlert(errorMessages, 'error');
      } else {
        showAlert('Failed to update plan', 'error');
      }
    }
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingPlan(null);
  };

  const updatePhaseStatus = async (planId, phaseId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED';
      await axios.put(
        `http://localhost:8080/api/user-learning-plans/${planId}/phases/${phaseId}/status`,
        { status: newStatus }
      );
      
      // Update local state to reflect the change
      setMyLearningPlans(prevPlans => 
        prevPlans.map(plan => {
          if (plan.id === planId) {
            return {
              ...plan,
              phaseProgresses: plan.phaseProgresses.map(phase => {
                if (phase.phaseId === phaseId) {
                  return { ...phase, status: newStatus };
                }
                return phase;
              })
            };
          }
          return plan;
        })
      );
      
      // Also update viewingPlan if it's currently being viewed
      if (viewingPlan && viewingPlan.id === planId) {
        setViewingPlan(prev => ({
          ...prev,
          phaseProgresses: prev.phaseProgresses.map(phase => {
            if (phase.phaseId === phaseId) {
              return { ...phase, status: newStatus };
            }
            return phase;
          })
        }));
      }
      
      showAlert('Phase status updated!', 'success');
    } catch (error) {
      console.error('Error updating phase status:', error);
      showAlert('Failed to update phase status', 'error');
    }
  };

  const renderPhaseStatus = (status) => {
    return (
      <span className={`phase-status ${status.toLowerCase().replace('_', '-')}`}>
        {status === 'COMPLETED' ? '✓ Completed' : 
         status === 'IN_PROGRESS' ? '↻ In Progress' : '✗ Not Started'}
      </span>
    );
  };

  const calculateProgressPercentage = (phases) => {
    if (!phases || phases.length === 0) return 0;
    const completedCount = phases.filter(phase => phase.status === 'COMPLETED').length;
    return Math.round((completedCount / phases.length) * 100);
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
                      <label>Plan Name</label>
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
                      <label>Skills</label>
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
                      <label>Image URL</label>
                      <input
                        type="text"
                        name="imageUrl"
                        value={editFormData.imageUrl}
                        onChange={handleEditChange}
                        placeholder="Image URL"
                        className="edit-input"
                      />

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

                      <div className="progress-container">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${calculateProgressPercentage(plan.phaseProgresses)}%` }}
                          ></div>
                        </div>
                        <span className="progress-percentage">
                          {calculateProgressPercentage(plan.phaseProgresses)}% Complete
                        </span>
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
                <p><strong>Durationssdsds:</strong> {viewingPlan.duration}</p>
                <p><strong>Skills:</strong> {viewingPlan.skills}</p>
                <p><strong>Status:</strong> {viewingPlan.overallStatus || 'NOT_STARTED'}</p>
                <p><strong>Visibility:</strong> {viewingPlan.visibility || 'PRIVATE'}</p>
              </div>
              <div className="modal-description">
                <h4>Description</h4>
                <p>{viewingPlan.description}</p>
              </div>

              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${viewingPlan.progressPercentage || 0}%` }}
                  ></div>
                </div>
                <span className="progress-percentage">
                  {viewingPlan.progressPercentage || 0}% Complete
                </span>
              </div>

              <div className="phases-section">
                <h4>Learning Phases:</h4>
                {viewingPlan.phaseProgresses && viewingPlan.phaseProgresses.length > 0 ? (
                  <ul className="phases-list">
                    {viewingPlan.phaseProgresses.map((phase) => (
                      <li key={phase.phaseId} className="phase-item">
                        <div className="phase-info">
                          <span className="phase-title">Phase {phase.phaseId}</span>
                          {phase.topic && <span className="phase-topic">{phase.topic}</span>}
                          {phase.skill && <span className="phase-skill">{phase.skill}</span>}
                          {phase.phaseDescription && <p className="phase-description">{phase.phaseDescription}</p>}
                        </div>
                        <button
                          className={`phase-status-btn ${phase.status.toLowerCase().replace('_', '-')}`}
                          onClick={() => updatePhaseStatus(viewingPlan.id, phase.phaseId, phase.status)}
                        >
                          {renderPhaseStatus(phase.status)}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No phases available for this plan.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLearningPlansPage;