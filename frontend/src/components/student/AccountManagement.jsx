import React, { useState } from 'react';
import axios from 'axios';

const AccountManagement = ({ user, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);

  const handleRequest = async (type) => {
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await axios.post(`${API_URL}/api/students/${user._id || user.id}/request-account-change`, {
        requestType: type,
        effectiveDate
      }, {
        headers: { Authorization: `Bearer ${token}` }
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
    <div className="glass-panel shadow-md border-0 mb-4 animate-pulse-slow fade-in">
      <div className="card-body py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    </div>
  );

  const isOpen = user.messStatus === 'Open';

  return (
    <div className="glass-panel shadow-md border-0 mb-4 overflow-hidden fade-in h-100 d-flex flex-column">
      <div className="card-header border-0 bg-transparent p-4 pb-3 border-bottom border-light border-opacity-10">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold text-dark d-flex align-items-center">
            <span className="bg-primary bg-opacity-10 p-2 rounded-3 me-3 text-primary d-flex align-items-center justify-content-center shadow-sm">
              <i className="bi bi-sliders fs-5"></i>
            </span>
            Account Control
          </h5>
          <span className={`badge rounded-pill shadow-sm px-3 py-2 ${isOpen ? 'bg-success' : 'bg-danger'}`}>
            <i className={`bi ${isOpen ? 'bi-unlock-fill' : 'bi-lock-fill'} me-1`}></i>
            {isOpen ? 'Mess is Active' : 'Mess is Closed'}
          </span>
        </div>
      </div>
      
      <div className="card-body p-4 pt-4 flex-grow-1 d-flex flex-column">
        {/* Status Hero Card */}
        <div className={`p-4 rounded-4 mb-4 position-relative overflow-hidden transition-all hover-lift shadow-sm ${isOpen ? 'bg-success bg-opacity-10 border border-success border-opacity-25' : 'bg-danger bg-opacity-10 border border-danger border-opacity-25'}`}>
          <div className="position-absolute top-0 end-0 opacity-10 p-3" style={{ transform: 'translate(10%, -10%) scale(2.5)' }}>
            <i className={`bi ${isOpen ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}`}></i>
          </div>
          <div className="d-flex align-items-center position-relative z-index-1">
            <div className={`rounded-circle me-4 d-flex align-items-center justify-content-center shadow ${isOpen ? 'bg-gradient text-white shadow-glow' : 'bg-danger text-white'}`} style={{ width: '64px', height: '64px', background: isOpen ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
               <i className={`bi ${isOpen ? 'bi-check2' : 'bi-dash'} fs-1`}></i>
            </div>
            <div>
              <p className="mb-1 text-muted small fw-bold text-uppercase ls-1">Current Status</p>
              <h3 className={`mb-0 fw-bold ${isOpen ? 'text-success' : 'text-danger'}`} style={{ letterSpacing: '-0.5px' }}>
                {isOpen ? 'Active & Open' : 'Inactive & Closed'}
              </h3>
            </div>
          </div>
        </div>

        {message && (
          <div className={`alert alert-${message.type} small py-3 mb-4 border-0 rounded-4 shadow-sm d-flex align-items-center slide-up fw-medium`}>
            <i className={`bi ${message.type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger'} me-3 fs-4`}></i>
            {message.text}
          </div>
        )}

        <div className="mb-4 flex-grow-1">
          <label className="form-label small fw-bold text-dark mb-2 text-uppercase ls-1">Schedule Change Date</label>
          <div className="position-relative hover-lift-sm">
            <div className="position-absolute top-50 start-0 translate-middle-y ms-3 z-index-1">
              <i className="bi bi-calendar2-week text-primary fs-5"></i>
            </div>
            <input 
              type="date" 
              className="form-control form-control-lg border-0 shadow-sm modern-input transition-all"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              disabled={isCooldownActive()}
              style={{ paddingLeft: '3rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}
            />
          </div>
          <div className="d-flex align-items-center mt-3 text-muted small px-2">
            <i className="bi bi-info-circle-fill text-primary opacity-75 me-2"></i>
            <span>Changes applied instantly on the selected date.</span>
          </div>
        </div>

        <div className="d-grid mt-auto pt-3 border-top border-light border-opacity-10">
          {isCooldownActive() ? (
            <div className="p-4 bg-light border border-secondary border-opacity-25 rounded-4 d-flex align-items-center shadow-sm">
              <div className="bg-white rounded-circle p-3 shadow-sm me-4 d-flex align-items-center justify-content-center">
                <i className="bi bi-hourglass-split fs-4 text-warning animate-pulse-slow"></i>
              </div>
              <div>
                <h6 className="mb-1 fw-bold text-dark">Cooldown Active</h6>
                <p className="mb-0 small text-muted">
                  You can change your status again in <strong className="text-warning fs-6">{getRemainingCooldown()} hours</strong>.
                </p>
              </div>
            </div>
          ) : isOpen ? (
            <button 
              className="btn btn-lg fs-5 fw-bold rounded-4 py-3 shadow hover-lift transition-all position-relative overflow-hidden" 
              onClick={() => handleRequest('Request_Close')}
              disabled={loading}
              style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', color: 'white', border: 'none' }}
            >
              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-power me-2"></i>}
              Close My Account
            </button>
          ) : (
            <button 
              className="btn btn-lg fs-5 fw-bold rounded-4 py-3 shadow hover-lift transition-all position-relative overflow-hidden" 
              onClick={() => handleRequest('Request_Open')}
              disabled={loading}
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', color: 'white', border: 'none' }}
            >
              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-power me-2"></i>}
              Activate My Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
