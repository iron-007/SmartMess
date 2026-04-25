import React from 'react';
import ExtrasAndGuests from '../components/butler/ExtrasAndGuests';

const ButlerExtras = () => {
  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Extras & Guest Management</h2>
          <p className="text-muted small mb-0">Record and track additional consumption records.</p>
        </div>
        <div className="badge bg-primary px-3 py-2">Operational Panel</div>
      </div>

      <ExtrasAndGuests />
    </div>
  );
};

export default ButlerExtras;
