import React, { useState } from 'react';
import api from '../../utils/api';

const AccountManagement = ({ user, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);

  const handleRequest = async (type) => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await api.post(`/api/students/${user._id || user.id}/request-account-change`, {
        requestType: type,
        effectiveDate
      });
      
      setMessage({ type: 'success', text: response.data.message });
      onUpdate();
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Failed to submit request.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const isCooldownActive = () => {
    if (!user?.lastRequestDate) return false;
    const last = new Date(user.lastRequestDate);
    const now = new Date();
    const diffHours = (now - last) / (1000 * 60 * 60);
    return diffHours < 24;
  };

  const getRemainingCooldown = () => {
    if (!user?.lastRequestDate) return 0;
    const last = new Date(user.lastRequestDate);
    const now = new Date();
    const diffHours = (now - last) / (1000 * 60 * 60);
    return Math.ceil(24 - diffHours);
  };

  if (!user) return (
    <div className="glass-panel shadow-sm border-0 mb-3 animate-pulse-slow fade-in">
      <div className="card-body p-4 text-center">
        <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
      </div>
    </div>
  );

  const isOpen = user.messStatus === 'Open';

  return (
    <div className={`glass-panel shadow-sm mb-3 bg-white fade-in h-100 d-flex flex-column border-0 border-start border-5 ${isOpen ? 'border-success' : 'border-danger'}`} style={{ borderRadius: '12px' }}>
      <div className={`card-header border-bottom p-3 d-flex justify-content-between align-items-center ${isOpen ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`}>
        <h6 className={`mb-0 fw-bold ${isOpen ? 'text-success' : 'text-danger'}`}>
          <i className="bi bi-sliders me-2"></i>Account Control
        </h6>
        <span className={`badge rounded-pill ${isOpen ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: '0.7rem' }}>
          {isOpen ? 'Active' : 'Closed'}
        </span>
      </div>
      
      <div className="card-body p-3 flex-grow-1 d-flex flex-column">
        {message && (
          <div className={`alert alert-${message.type} small py-2 px-3 mb-3 border-0 rounded-3 d-flex align-items-center`}>
            <i className={`bi ${message.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
            {message.text}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label text-muted fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>Schedule Change Date</label>
          <div className="d-flex align-items-center gap-2">
            <input 
              type="date" 
              className="form-control form-control-sm bg-light border px-2 py-1 flex-grow-1"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              disabled={isCooldownActive()}
              style={{ borderRadius: '6px' }}
            />
          </div>
        </div>

        <div className="mt-auto">
          {isCooldownActive() ? (
            <div className="p-2 bg-light border rounded-3 d-flex align-items-center">
              <i className="bi bi-hourglass-split text-warning me-2"></i>
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                Cooldown: <strong className="text-dark">{getRemainingCooldown()}h remaining</strong>
              </small>
            </div>
          ) : (
            <button 
              className={`btn btn-sm w-100 fw-bold text-white ${isOpen ? 'btn-danger' : 'btn-success'}`} 
              onClick={() => handleRequest(isOpen ? 'Request_Close' : 'Request_Open')}
              disabled={loading}
              style={{ borderRadius: '6px' }}
            >
              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
              {isOpen ? 'Close Account' : 'Activate Account'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
