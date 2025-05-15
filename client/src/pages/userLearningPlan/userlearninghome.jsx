import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './userlearningplan.css';
import { AuthContext } from '../../context/authContext';

const UserLearningPlanHome = () => {
   const { currentUser } = useContext(AuthContext);
  const [allLearningPlans, setAllLearningPlans] = useState([]);
  const [publicSharedPlans, setPublicSharedPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subscribedPlans, setSubscribedPlans] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);// Replace with actual user ID from your auth system
  const [durationFilter, setDurationFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');

  useEffect(() => {
    setCurrentUserId(currentUser.id);
  }, [currentUser])
  // Fetch all plans, public shared plans, and user's subscriptions
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all available learning plans
        const plansResponse = await axios.get('http://localhost:8080/api/learning-plan/all-learning-plans');
        setAllLearningPlans(plansResponse.data);
        
        // Fetch public shared plans
        const publicPlansResponse = await axios.get('http://localhost:8080/api/user-learning-plans/visibility/PUBLIC');
        setPublicSharedPlans(publicPlansResponse.data);
        
        // Fetch user's subscribed plans
        const userPlansResponse = await axios.get(`http://localhost:8080/api/user-learning-plans/current-owner/${currentUserId}`);
        
        // Extract original plan IDs from user's subscriptions
        const subscribedPlanIds = userPlansResponse.data.map(
          userPlan => userPlan.originalPlanId || userPlan.id
        );
        setSubscribedPlans(new Set(subscribedPlanIds));
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load learning plans. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
   if(currentUserId) fetchData();
  }, [currentUserId]);
 
  const handleSubscribe = async (planId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post(
        'http://localhost:8080/api/user-learning-plans/subscribe',
        null, // empty body
        {
          params: {
            planId: planId,
            userId: currentUserId
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Update UI based on response
      if (response.data && response.data.id) {
        setSubscribedPlans(prev => new Set(prev).add(planId));
        setError(null);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      if (error.response?.data) {
        const errorMessage = error.response.data.error || 'Subscription failed. Please try again.';
        setError(errorMessage);
      } else {
        setError('Subscription failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced filter function
  const filterPlans = (plans) => {
    if (!plans) return [];
    
    return plans.filter(plan => {
      // Text search filter
      const term = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        plan.planName.toLowerCase().includes(term) ||
        (plan.description && plan.description.toLowerCase().includes(term)) ||
        (plan.skills && plan.skills.toLowerCase().includes(term));

      // Duration filter
      const matchesDuration = durationFilter === 'all' || 
        (plan.duration && plan.duration.toLowerCase().includes(durationFilter));

      // Skills filter
      const matchesSkill = skillFilter === 'all' || 
        (plan.skills && plan.skills.toLowerCase().includes(skillFilter));

      return matchesSearch && matchesDuration && matchesSkill;
    });
  };

  // Render loading state
  if (isLoading && allLearningPlans.length === 0 && publicSharedPlans.length === 0) {
    return <div className="loading-spinner">Loading plans...</div>;
  }

  // Render error state
  if (error) {
    return (
      <div className="error-message">
        {error}
        <button onClick={() => setError(null)}>Try Again</button>
      </div>
    );
  }

  // Helper function to render plan cards
  const renderPlanCard = (plan, isPublicShared = false) => (
    <div key={plan.id} className="plan-card">
      {plan.imageUrl && (
        <img 
          src={plan.imageUrl} 
          alt={plan.planName} 
          className="plan-image"
          onError={(e) => {
            e.target.src = 'default-plan-image.png';
          }}
        />
      )}
      <div className="plan-content">
        <h3>{plan.planName}</h3>
        <div className="plan-meta">
          <span><strong>Duration:</strong> {plan.duration}</span>
          <span><strong>Skills:</strong> {plan.skills}</span>
          {isPublicShared && (
            <span className="visibility-badge">shared by: {plan.currentOwner?.name || 'Unknown'}</span>
          )}
        </div>
        <p className="plan-description">{plan.description}</p>
        {!isPublicShared && (
          <button
            className={`subscribe-btn ${
              subscribedPlans.has(plan.id) ? 'subscribed' : ''
            }`}
            onClick={() => handleSubscribe(plan.id)}
            disabled={subscribedPlans.has(plan.id) || isLoading}
          >
            {subscribedPlans.has(plan.id) 
              ? '✓ Subscribed' 
              : isLoading ? 'Processing...' : 'Subscribe'}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="learning-plan-container">
      {/* Search and Filter Bar */}
      <div className="search-container">
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search plans by name, description, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select 
            value={durationFilter} 
            onChange={(e) => setDurationFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Durations</option>
            <option value="3 month">3 Months</option>
            <option value="6 month">6 Months</option>
            <option value="1 year">1 Year</option>
          </select>

          <select 
            value={skillFilter} 
            onChange={(e) => setSkillFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Skills</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="javascript">JavaScript</option>
            <option value="react">React</option>
            <option value="node">Node.js</option>
          </select>

          {(searchTerm || durationFilter !== 'all' || skillFilter !== 'all') && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setDurationFilter('all');
                setSkillFilter('all');
              }} 
              className="clear-search-btn"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* All Learning Plans Section */}
      <div className="all-learning-plans">
        <h2>All Learning Plans</h2>
        
        {filterPlans(allLearningPlans).length === 0 ? (
          <div className="no-plans-message">
            {searchTerm ? 'No matching plans found.' : 'No learning plans available.'}
          </div>
        ) : (
          <div className="plans-grid">
            {filterPlans(allLearningPlans).map(plan => renderPlanCard(plan))}
          </div>
        )}
      </div>

      {/* Public Shared Plans Section */}
     <div className="public-shared-plans">
        <h2>Reshared Plans</h2>
        
        {filterPlans(publicSharedPlans).length === 0 ? (
          <div className="no-plans-message">
            {searchTerm ? 'No matching shared plans found.' : 'No publicly shared plans available.'}
          </div>
        ) : (
          <div className="plans-grid">
            {filterPlans(publicSharedPlans).map(plan => renderPlanCard(plan, true))}
          </div>
        )}
      </div>
    </div> 
  );
};

export default UserLearningPlanHome;