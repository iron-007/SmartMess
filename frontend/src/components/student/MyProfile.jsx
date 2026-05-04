import React from 'react';

const MyProfile = ({ user }) => {
  if (!user) return (
    <div className="glass-panel shadow-sm border-0 mb-3 animate-pulse-slow">
      <div className="card-body p-4 text-center">
        <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
      </div>
    </div>
  );

  const profileFields = [
    { label: 'URN', value: user.urn || 'N/A', icon: 'bi-hash' },
    { label: 'CRN', value: user.crn || 'N/A', icon: 'bi-card-text' },
    { label: 'Department', value: user.department || 'N/A', icon: 'bi-building' },
    { label: 'Batch', value: user.batch || 'N/A', icon: 'bi-calendar-event' },
    { label: 'Mess Account', value: user.messAccount || 'N/A', icon: 'bi-wallet2' },
    { label: 'Hostel', value: user.hostel || 'N/A', icon: 'bi-house-door' },
  ];

  return (
    <div className="glass-panel shadow-sm border-0 mb-3 fade-in h-100 bg-white" style={{ borderRadius: '12px' }}>
      <div className="card-body p-3 p-md-4">
        {/* Profile Header (Compact) */}
        <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
          <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3 border shadow-sm" style={{ width: '48px', height: '48px' }}>
            <i className="bi bi-person-fill fs-3 text-secondary"></i>
          </div>
          <div className="flex-grow-1">
            <h5 className="mb-0 fw-bold text-dark">{user.name}</h5>
            <div className="d-flex align-items-center mt-1">
              <span className="badge bg-dark rounded-pill py-1 px-2 me-2" style={{ fontSize: '0.65rem' }}>
                {user.role?.toUpperCase() || 'STUDENT'}
              </span>
              <small className="text-muted"><i className="bi bi-envelope-fill me-1"></i>{user.email}</small>
            </div>
          </div>
        </div>

        {/* Compact Details Grid */}
        <div className="row g-2">
          {profileFields.map((field, index) => (
            <div key={index} className="col-6 col-md-4">
              <div className="d-flex flex-column p-2 bg-light rounded-3 border h-100">
                <span className="text-muted fw-semibold text-uppercase" style={{ fontSize: '0.65rem' }}>
                  <i className={`bi ${field.icon} me-1`}></i>{field.label}
                </span>
                <span className="fw-bold text-dark text-truncate mt-1" style={{ fontSize: '0.85rem' }}>{field.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
