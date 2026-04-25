import React from 'react';

const MyProfile = ({ user }) => {
  if (!user) return (
    <div className="glass-panel shadow-sm border-0 mb-4 animate-pulse-slow">
      <div className="card-body p-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    </div>
  );

  const profileFields = [
    { label: 'Full Name', value: user.name, icon: 'bi-person-fill' },
    { label: 'URN', value: user.urn || 'N/A', icon: 'bi-hash' },
    { label: 'CRN', value: user.crn || 'N/A', icon: 'bi-card-text' },
    { label: 'Department', value: user.department || 'N/A', icon: 'bi-building' },
    { label: 'Batch', value: user.batch || 'N/A', icon: 'bi-calendar-event' },
    { label: 'Mess Account', value: user.messAccount || 'N/A', icon: 'bi-wallet2' },
    { label: 'Hostel', value: user.hostel || 'N/A', icon: 'bi-house-door' },
    { label: 'Year', value: user.year ? `${user.year} Year` : 'N/A', icon: 'bi-mortarboard' }
  ];

  return (
    <div className="glass-panel shadow-md border-0 mb-4 fade-in h-100 d-flex flex-column position-relative overflow-hidden" style={{ borderRadius: '20px' }}>
      {/* Decorative Background Glow */}
      <div className="position-absolute top-0 start-0 w-100 h-100 opacity-25" style={{ background: 'radial-gradient(circle at top right, rgba(255,81,47,0.15) 0%, transparent 40%), radial-gradient(circle at bottom left, rgba(221,36,118,0.1) 0%, transparent 40%)', zIndex: 0, pointerEvents: 'none' }}></div>
      
      <div className="card-body p-4 p-lg-5 d-flex flex-column z-index-1">
        {/* Profile Hero Section */}
        <div className="d-flex align-items-center mb-5 pb-4 border-bottom border-light border-opacity-10 position-relative flex-wrap gap-4">
          <div className="position-relative">
             <div className="rounded-circle p-1 shadow-sm" style={{ background: 'var(--brand-gradient)' }}>
               <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '90px', height: '90px' }}>
                 <i className="bi bi-person-bounding-box fs-1" style={{ background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}></i>
               </div>
             </div>
             <div className="position-absolute bottom-0 end-0 bg-success border border-white border-2 rounded-circle shadow-sm" style={{ width: '22px', height: '22px' }} title="Verified User"></div>
          </div>
          <div>
            <h2 className="mb-1 fw-bold text-dark" style={{ letterSpacing: '-0.5px' }}>{user.name}</h2>
            <div className="d-flex flex-wrap gap-2 align-items-center mt-2">
              <span className="badge rounded-pill shadow-sm py-2 px-3 fw-bold" style={{ background: 'var(--brand-gradient)', color: 'white', letterSpacing: '1px' }}>
                {user.role?.toUpperCase() || 'STUDENT'}
              </span>
              <span className="text-muted small fw-medium d-flex align-items-center bg-white px-3 py-1 rounded-pill border shadow-sm">
                <i className="bi bi-envelope-at-fill me-2 text-primary opacity-75"></i> {user.email}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="row g-4 flex-grow-1">
          {profileFields.map((field, index) => (
            <div key={index} className="col-sm-6 col-md-6 col-lg-6">
              <div className="p-3 bg-white rounded-4 shadow-sm border border-light h-100 transition-all hover-lift-sm d-flex align-items-center">
                <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3 shadow-sm" style={{ width: '48px', height: '48px' }}>
                  <i className={`bi ${field.icon} fs-5`} style={{ color: 'var(--brand-primary)' }}></i>
                </div>
                <div>
                  <p className="text-muted small mb-0 fw-bold text-uppercase ls-1" style={{ fontSize: '0.7rem' }}>{field.label}</p>
                  <h6 className="mb-0 fw-bold text-dark mt-1" style={{ fontSize: '1rem' }}>{field.value}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-5 text-center">
           <small className="text-muted fw-medium bg-light px-4 py-2 rounded-pill border">
             <i className="bi bi-shield-fill-check me-2" style={{ color: 'var(--brand-secondary)' }}></i>
             Identity secured & verified by SmartMess System
           </small>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
