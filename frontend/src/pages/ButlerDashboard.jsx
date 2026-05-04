import React from 'react';
import BillOverview from '../components/butler/BillOverview';
import MonthlyBreakdown from '../components/butler/MonthlyBreakdown';
import ClosedAccountsList from '../components/butler/ClosedAccountsList';

const ButlerDashboard = () => {
  return (
    <div className="p-4 fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Butler Command Center</h2>
          <p className="text-muted small mb-0">Monitor live attendance, manage bills, and track consumption.</p>
        </div>
        <div className="badge bg-primary px-3 py-2">Butler Role</div>
      </div>

      <div className="row g-4">
        <div className="col-lg-12">
          <MonthlyBreakdown />
        </div>
        <div className="col-lg-12">
          <ClosedAccountsList />
        </div>
        <div className="col-12">
           <BillOverview />
        </div>
      </div>
    </div>
  );
};

export default ButlerDashboard;
