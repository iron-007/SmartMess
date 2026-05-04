import React from 'react';

const DuesSection = ({ dues }) => {
  return (
    <div className="glass-panel shadow-sm border-0 mb-3 h-100 bg-white" style={{ borderRadius: '12px' }}>
      <div className="card-header border-bottom bg-transparent p-3">
        <h6 className="mb-0 fw-bold text-dark"><i className="bi bi-receipt me-2 text-primary"></i>Current Month Bill</h6>
      </div>
      <div className="card-body p-3">
        <div className="bg-light p-3 rounded-3 border">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted fw-medium" style={{ fontSize: '0.85rem' }}>Daily Mess Bill</span>
            <span className="fw-bold text-dark fs-6">₹{dues.dailyMealsTotal?.toLocaleString()}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted fw-medium" style={{ fontSize: '0.85rem' }}>Extra Items</span>
            <span className="fw-bold text-dark fs-6">₹{dues.extraTotal?.toLocaleString()}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted fw-medium" style={{ fontSize: '0.85rem' }}>Guest Meals</span>
            <span className="fw-bold text-dark fs-6">₹{dues.guestTotal?.toLocaleString()}</span>
          </div>
          {dues.fineTotal > 0 && (
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-danger fw-medium" style={{ fontSize: '0.85rem' }}>System Fines</span>
              <span className="fw-bold text-danger fs-6">+₹{dues.fineTotal?.toLocaleString()}</span>
            </div>
          )}
          {(dues.paymentsTotal > 0 || dues.rebateTotal > 0) && <hr className="my-2 border-secondary opacity-25" />}
          {dues.paymentsTotal > 0 && (
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-success fw-medium" style={{ fontSize: '0.85rem' }}>Payments Made</span>
              <span className="fw-bold text-success fs-6">-₹{dues.paymentsTotal?.toLocaleString()}</span>
            </div>
          )}
          {dues.rebateTotal > 0 && (
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-success fw-medium" style={{ fontSize: '0.85rem' }}>Manual Rebates</span>
              <span className="fw-bold text-success fs-6">-₹{dues.rebateTotal?.toLocaleString()}</span>
            </div>
          )}
          
          <hr className="my-2 border-secondary opacity-25" />
          
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="text-dark fw-bold" style={{ fontSize: '0.85rem' }}>Current Month Total</span>
            <span className="fw-bold text-primary fs-6">₹{dues.currentMonthTotal?.toLocaleString()}</span>
          </div>
          {dues.previousDues > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-2">
              <span className="text-danger fw-bold" style={{ fontSize: '0.85rem' }}>Previous Dues</span>
              <span className="fw-bold text-danger fs-6">+ ₹{dues.previousDues?.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
          <div>
            <span className="fw-bold text-dark d-block" style={{ fontSize: '0.9rem' }}>Total Payable</span>
          </div>
          <h4 className="mb-0 fw-bold text-primary">₹{dues.totalPayable?.toLocaleString()}</h4>
        </div>
      </div>
    </div>
  );
};

export default DuesSection;
