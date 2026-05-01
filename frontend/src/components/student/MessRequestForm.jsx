import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import moment from 'moment-timezone';

const MessRequestForm = ({ onUpdate, timings }) => {
  const [formData, setFormData] = useState({
    date: '',
    action: 'CLOSE',
    mealType: 'Breakfast'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Auto-pickup first available meal from server
  useEffect(() => {
    const fetchNextMeal = async () => {
    try {
      // Include targetDate in query if it exists
      const url = formData.date 
        ? `/api/students/me/next-available-meal?targetDate=${formData.date}`
        : `/api/students/me/next-available-meal`;

      const response = await api.get(url);
        
        if (response.data.success) {
          setFormData(prev => ({
            ...prev,
            date: response.data.date,
            mealType: response.data.mealType
          }));
        }
      } catch (err) {
        console.error("Failed to fetch next available meal:", err);
      }
    };

    fetchNextMeal();
  }, [timings, formData.date]); // Re-fetch whenever date or timings change

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await api.post(`/api/students/me/mess-request`, formData);
      setMessage({ type: 'success', text: response.data.message });
      onUpdate(); // Refresh data
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Failed to submit request.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 mb-4 h-100">
      <div className="card-body">
        <h5 className="card-title fw-bold text-primary mb-4">Request Mess ON/OFF</h5>
        {message && (
          <div className={`alert alert-${message.type} small py-2 mb-3`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small">Select Date</label>
            <input 
              type="date" 
              className="form-control" 
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label small">Action</label>
            <select 
              className="form-select" 
              value={formData.action}
              onChange={(e) => setFormData({ ...formData, action: e.target.value })}
            >
              <option value="CLOSE">Close Mess (OFF)</option>
              <option value="OPEN">Open Mess (ON)</option>
            </select>
          </div>
          {/* Meal Type - Hidden from UI but kept in state for auto-pickup */}
          <div className="mb-4">
            <div className="p-2 bg-light rounded border text-center">
              <span className="small text-muted d-block">Target Meal (Auto-picked)</span>
              <span className="fw-bold text-dark">
                {formData.mealType} 
                {timings?.[formData.mealType.toLowerCase()] && (
                  <span className="ms-2 text-primary small">({timings[formData.mealType.toLowerCase()].start})</span>
                )}
              </span>
            </div>
            <small className="text-muted d-block mt-2" style={{ fontSize: '0.7rem' }}>
              * Enforcing 24-hour advance notice based on mess timings.
            </small>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-100 fw-bold" 
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessRequestForm;
