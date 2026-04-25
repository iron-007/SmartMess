import React from 'react';

const DuesSection = ({ dues }) => {

  return (
    <div className="glass-panel shadow-md border-0 mb-4 h-100 overflow-hidden">
      <div className="card-header text-white p-3 border-0" style={{ background: 'var(--brand-gradient)' }}>
        <h6 className="mb-0 fw-bold"><i className="bi bi-receipt me-2"></i>Current Month Bill Summary</h6>
      </div>
      <div className="card-body p-4 bg-white">
        <div className="bill-items mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="small text-muted">Daily Mess Bill</span>
            <span className="fw-bold text-dark">₹{dues.dailyMealsTotal?.toLocaleString()}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="small text-muted">Extra Items</span>
            <span className="fw-bold text-dark">₹{dues.extraTotal?.toLocaleString()}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="small text-muted">Guest Meals</span>
            <span className="fw-bold text-dark">₹{dues.guestTotal?.toLocaleString()}</span>
          </div>
          {dues.fineTotal > 0 && (
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-muted">System Fines</span>
              <span className="fw-bold text-dark">₹{dues.fineTotal?.toLocaleString()}</span>
            </div>
          )}
          {dues.paymentsTotal > 0 && (
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-success fw-bold"><i className="bi bi-check-circle me-1"></i>Payments Made</span>
              <span className="fw-bold text-success">-₹{dues.paymentsTotal?.toLocaleString()}</span>
            </div>
          )}
          {dues.rebateTotal > 0 && (
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-success fw-bold"><i className="bi bi-dash-circle me-1"></i>Manual Rebates</span>
              <span className="fw-bold text-success">-₹{dues.rebateTotal?.toLocaleString()}</span>
            </div>
          )}
          <hr className="my-2" />
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="small text-muted">Current Month Bill</span>
            <span className="fw-bold text-primary">₹{dues.currentMonthTotal?.toLocaleString()}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="small text-muted">Previous Dues</span>
            <span className="fw-bold text-danger">+ ₹{dues.previousDues?.toLocaleString()}</span>
          </div>
        </div>


        <div className="pt-3 border-top d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0 fw-bold text-dark">Total Payable</h5>
            <small className="text-muted extra-small">Includes all charges & rebates</small>
          </div>
          <h2 className="mb-0 fw-bold" style={{ color: 'var(--brand-primary)' }}>₹{dues.totalPayable?.toLocaleString()}</h2>
        </div>
      </div>
    </div>
  );
};

export default DuesSection;
