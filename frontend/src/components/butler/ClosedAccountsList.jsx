import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const ClosedAccountsList = () => {
  const [closedAccounts, setClosedAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClosedAccounts();
  }, []);

  const fetchClosedAccounts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/butler/students');
      
      // Filter for closed accounts
      const closed = response.data.filter(student => student.messStatus === 'Closed');
      
      // Sort by lastRequestDate descending (most recent first)
      closed.sort((a, b) => {
        if (!a.lastRequestDate) return 1;
        if (!b.lastRequestDate) return -1;
        return new Date(b.lastRequestDate) - new Date(a.lastRequestDate);
      });

      setClosedAccounts(closed);
    } catch (err) {
      console.error("Error fetching closed accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm overflow-hidden mb-4">
      <div className="card-header bg-sidebar-dark text-white p-3 border-0 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold"><i className="bi bi-x-circle me-2"></i>Closed Mess Accounts</h5>
        <span className="badge bg-light text-dark fw-bold px-2 py-1 rounded-pill">
          {closedAccounts.length} Closed
        </span>
      </div>
      <div className="card-body p-0">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
            <span className="ms-2 small text-muted">Loading closed accounts...</span>
          </div>
        ) : closedAccounts.length === 0 ? (
          <div className="text-center py-4 text-muted small">
            <i className="bi bi-check-circle-fill text-success fs-4 d-block mb-2"></i>
            No accounts are currently closed.
          </div>
        ) : (
          <div className="table-responsive" style={{ maxHeight: '300px' }}>
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light position-sticky top-0 shadow-sm" style={{ zIndex: 1 }}>
                <tr>
                  <th className="small text-uppercase fw-bold text-dark px-4">Student</th>
                  <th className="small text-uppercase fw-bold text-dark text-center">Account #</th>
                  <th className="small text-uppercase fw-bold text-dark text-end px-4">Closed Since</th>
                </tr>
              </thead>
              <tbody>
                {closedAccounts.map(student => (
                  <tr key={student._id}>
                    <td className="fw-bold text-dark px-4">{student.name}</td>
                    <td className="text-center">
                      <span className="badge bg-light text-dark border fw-bold">{student.messAccount}</span>
                    </td>
                    <td className="text-end text-muted px-4">
                      {student.lastRequestDate 
                        ? new Date(student.lastRequestDate).toLocaleDateString(undefined, { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })
                        : <span className="fst-italic opacity-50">Unknown</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClosedAccountsList;
