import React, { useState, useEffect } from 'react';

const StudentDetailModal = ({ student, onClose }) => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    previousDues: student?.previousDues || 0,
    phone: student?.phone || '',
    department: student?.department || '',
    messAccount: student?.messAccount || ''
  });
  const [updating, setUpdating] = useState(false);
  const [consumption, setConsumption] = useState([]);
  const [fetchingConsumption, setFetchingConsumption] = useState(true);
  const [selectedDayData, setSelectedDayData] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/admin/students/${student._id}/attendance`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setAttendance(data.attendance);
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    if (student?._id) {
      fetchAttendance();
    }
  }, [student]);

  useEffect(() => {
    const fetchConsumption = async () => {
      setFetchingConsumption(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/admin/students/${student._id}/consumption`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setConsumption(data.consumption);
        }
      } catch (err) {
        console.error("Error fetching consumption:", err);
      } finally {
        setFetchingConsumption(false);
      }
    };

    if (student?._id) {
      fetchConsumption();
    }
  }, [student]);

  // Calendar Logic
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeks = [];
  let currentWeek = [];

  if (Array.isArray(consumption) && consumption.length > 0) {
    const firstDate = new Date(consumption[0].date);
    const firstDay = firstDate.getDay();

    for (let i = 0; i < firstDay; i++) {
      currentWeek.push(null);
    }

    consumption.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }
  }

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/admin/students/${student._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(editForm)
      });
      const data = await response.json();
      if (data.success) {
        alert("Student data updated successfully!");
        setIsEditing(false);
        // We update local state so the UI reflects changes without full reload
        student.previousDues = parseInt(editForm.previousDues);
        student.phone = editForm.phone;
        student.department = editForm.department;
        student.messAccount = editForm.messAccount;
      }
    } catch (err) {
      console.error("Update Error:", err);
      alert("Failed to update student.");
    } finally {
      setUpdating(false);
    }
  };

  if (!student) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
          <div className="modal-header bg-dark text-white py-3 px-4">
            <div className="d-flex align-items-center">
              <div className="bg-primary rounded-circle p-2 me-3 d-flex justify-content-center align-items-center" style={{width: '40px', height: '40px'}}>
                <i className="bi bi-person-fill fs-5"></i>
              </div>
              <div>
                <h5 className="modal-title fw-bold mb-0">{student.name}</h5>
                <small className="opacity-75">Account: {student.messAccount}</small>
              </div>
            </div>
            <div className="ms-auto d-flex gap-2 align-items-center">
              <button 
                className={`btn btn-sm ${isEditing ? 'btn-danger' : 'btn-outline-light'} rounded-pill px-3`}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel Edit' : <><i className="bi bi-pencil-square me-1"></i> Edit Profile</>}
              </button>
              <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose}></button>
            </div>
          </div>
          <div className="modal-body p-0">
            <div className="row g-0">
              {/* Left Column: Profile Info */}
              <div className="col-md-5 border-end bg-light p-4">
                <h6 className="text-uppercase small fw-bold text-muted mb-3">Student Profile</h6>
                <div className="d-flex flex-column gap-3">
                  
                  {isEditing ? (
                    <>
                      <div className="mb-2">
                        <label className="small text-muted d-block mb-1">Account Number</label>
                        <input 
                          type="text" 
                          className="form-control form-control-sm" 
                          value={editForm.messAccount}
                          onChange={(e) => setEditForm({...editForm, messAccount: e.target.value})}
                        />
                      </div>
                      <div className="mb-2">
                        <label className="small text-muted d-block mb-1">Department</label>
                        <input 
                          type="text" 
                          className="form-control form-control-sm" 
                          value={editForm.department}
                          onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                        />
                      </div>
                      <div className="mb-2">
                        <label className="small text-muted d-block mb-1">Phone Number</label>
                        <input 
                          type="text" 
                          className="form-control form-control-sm" 
                          value={editForm.phone}
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        />
                      </div>
                      <div className="bg-white p-3 rounded-3 border border-primary">
                        <label className="small text-primary fw-bold d-block mb-2"><i className="bi bi-currency-rupee"></i> Adjust Previous Dues</label>
                        <div className="input-group input-group-sm">
                          <span className="input-group-text">₹</span>
                          <input 
                            type="number" 
                            className="form-control fw-bold" 
                            value={editForm.previousDues}
                            onChange={(e) => setEditForm({...editForm, previousDues: e.target.value})}
                          />
                        </div>
                        <small className="text-muted extra-small mt-2 d-block">Changes reflect immediately in student's total bill.</small>
                      </div>
                      <button 
                        className="btn btn-primary w-100 mt-3 rounded-pill fw-bold"
                        onClick={handleUpdate}
                        disabled={updating}
                      >
                        {updating ? 'Saving...' : 'Save Changes'}
                      </button>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="small text-muted d-block mb-1">Department</label>
                        <span className="fw-semibold text-dark">{student.department || 'N/A'}</span>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <label className="small text-muted d-block mb-1">URN</label>
                          <span className="fw-semibold text-dark">{student.urn}</span>
                        </div>
                        <div className="col-6">
                          <label className="small text-muted d-block mb-1">CRN</label>
                          <span className="fw-semibold text-dark">{student.crn}</span>
                        </div>
                      </div>
                      <div>
                        <label className="small text-muted d-block mb-1">Phone Number</label>
                        <span className="fw-semibold text-dark">{student.phone}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="bg-white p-3 rounded-3 border">
                        <div className="d-flex justify-content-between mb-2">
                          <span className="small text-muted">Current Month Bill</span>
                          <span className="fw-bold text-primary">₹{student.currentMonthBill?.toLocaleString()}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="small text-muted">Previous Dues</span>
                          <span className={`fw-bold ${student.previousDues > 0 ? 'text-danger' : 'text-success'}`}>₹{student.previousDues?.toLocaleString()}</span>
                        </div>
                        <div className="d-flex justify-content-between border-top pt-2">
                          <span className="small fw-bold text-dark">Total Payable</span>
                          <span className="fw-bold text-dark">₹{(student.currentMonthBill + (student.previousDues || 0)).toLocaleString()}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Right Column: Attendance History */}
              <div className="col-md-7 p-4 bg-white">
                <h6 className="text-uppercase small fw-bold text-muted mb-3 d-flex justify-content-between align-items-center">
                  Recent Meal Attendance
                  <span className="badge bg-light text-dark border fw-normal">Last 50 Meals</span>
                </h6>
                
                <div className="attendance-scroll" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                      <p className="small text-muted mt-2">Loading attendance logs...</p>
                    </div>
                  ) : attendance.length === 0 ? (
                    <div className="text-center py-5 text-muted small">
                      <i className="bi bi-calendar-x d-block fs-3 mb-2 opacity-50"></i>
                      No live attendance records found.
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm table-hover mb-0">
                        <thead className="table-light sticky-top">
                          <tr className="small text-muted">
                            <th>Date</th>
                            <th>Meal</th>
                            <th className="text-end">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendance.map((record, idx) => (
                            <tr key={idx}>
                              <td className="small">{new Date(record.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</td>
                              <td>
                                <span className={`badge ${
                                  record.mealType === 'Breakfast' ? 'bg-info text-dark' : 
                                  record.mealType === 'Lunch' ? 'bg-warning text-dark' : 'bg-dark'
                                } small`}>
                                  {record.mealType}
                                </span>
                              </td>
                              <td className="text-end small text-muted">
                                {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                {/* Zone 3: Detailed Consumption Calendar */}
                <div className="mt-4 pt-4 border-top">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="text-uppercase small fw-bold text-muted mb-0">Monthly Consumption History</h6>
                    <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 fw-normal">Current Month</span>
                  </div>

                  {fetchingConsumption ? (
                    <div className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                    </div>
                  ) : (
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="table-responsive">
                          <table className="table table-bordered table-sm text-center mb-0" style={{ tableLayout: 'fixed' }}>
                            <thead className="bg-light">
                              <tr>
                                {daysOfWeek.map(day => <th key={day} className="py-2 extra-small text-muted text-uppercase">{day}</th>)}
                              </tr>
                            </thead>
                            <tbody>
                              {weeks.map((week, wIndex) => (
                                <tr key={wIndex}>
                                  {week.map((day, dIndex) => {
                                    if (!day) return <td key={dIndex} className="bg-light border-0"></td>;
                                    
                                    const isSelected = selectedDayData?.date === day.date;
                                    const isToday = new Date().toDateString() === new Date(day.date).toDateString();
                                    
                                    return (
                                      <td 
                                        key={dIndex} 
                                        className={`p-0 position-relative cursor-pointer transition-all ${isSelected ? 'bg-primary bg-opacity-10 border-primary' : (isToday ? 'border-primary border-2' : '')}`}
                                        style={{ height: '70px', cursor: 'pointer' }}
                                        onClick={() => setSelectedDayData(day)}
                                      >
                                        <div className="d-flex flex-column justify-content-between h-100 p-2">
                                          <div className="d-flex justify-content-between align-items-start">
                                            <span className={`fw-bold ${isSelected || isToday ? 'text-primary' : 'text-muted'}`} style={{ fontSize: '0.75rem' }}>{day.day}</span>
                                            {day.messStatus !== 'ND' && (
                                              <span 
                                                className="rounded-circle" 
                                                style={{ 
                                                  width: '8px', 
                                                  height: '8px', 
                                                  backgroundColor: day.messStatus === 'OPEN' ? '#28a745' : '#dc3545'
                                                }}
                                              ></span>
                                            )}
                                          </div>
                                          
                                          <div className="text-center">
                                            {day.dailyBill > 0 ? (
                                              <span className="fw-bold text-dark" style={{ fontSize: '0.8rem' }}>₹{day.dailyBill}</span>
                                            ) : (
                                              <span className="text-muted opacity-50" style={{ fontSize: '0.7rem' }}>—</span>
                                            )}
                                          </div>
 
                                          <div className="d-flex justify-content-center gap-1 mt-1">
                                            {day.guestMeals > 0 && <span className="badge bg-info text-dark p-0 d-flex justify-content-center align-items-center" style={{ width: '14px', height: '14px', fontSize: '0.6rem' }} title="Guests">G</span>}
                                            {day.extras.length > 0 && <span className="badge bg-warning text-dark p-0 d-flex justify-content-center align-items-center" style={{ width: '14px', height: '14px', fontSize: '0.6rem' }} title="Extras">E</span>}
                                          </div>
                                        </div>
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Day Detail Selection */}
                      {selectedDayData && (
                        <div className="col-12">
                          <div className="card border-0 bg-light rounded-3 animate__animated animate__fadeInUp" style={{ animationDuration: '0.3s' }}>
                            <div className="card-body p-3">
                              <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
                                <h6 className="mb-0 fw-bold small text-dark">
                                  <i className="bi bi-calendar-event me-2 text-primary"></i>
                                  Details for {new Date(selectedDayData.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                                </h6>
                                <button className="btn-close small" style={{ fontSize: '0.5rem' }} onClick={() => setSelectedDayData(null)}></button>
                              </div>
                              
                              <div className="row g-2">
                                <div className="col-6">
                                  <div className="bg-white p-2 rounded border-start border-3 border-primary">
                                    <span className="extra-small text-muted d-block">Mess Status</span>
                                    <span className={`fw-bold small ${selectedDayData.messStatus === 'OPEN' ? 'text-success' : 'text-danger'}`}>
                                      {selectedDayData.messStatus === 'ND' ? 'No Data' : selectedDayData.messStatus}
                                    </span>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="bg-white p-2 rounded border-start border-3 border-dark">
                                    <span className="extra-small text-muted d-block">Total Daily Bill</span>
                                    <span className="fw-bold small text-dark">₹{selectedDayData.dailyBill || 0}</span>
                                  </div>
                                </div>

                                {/* Extras Section */}
                                {selectedDayData.extras.length > 0 && (
                                  <div className="col-12 mt-2">
                                    <span className="extra-small fw-bold text-uppercase text-muted mb-1 d-block">Extras Consumed</span>
                                    <div className="bg-white p-2 rounded border">
                                      {selectedDayData.extras.map((ex, idx) => (
                                        <div key={idx} className="d-flex justify-content-between align-items-center small py-1 border-bottom last-child-border-0">
                                          <span>
                                            <span className={`badge ${
                                              ex.meal === 'Breakfast' ? 'bg-info text-dark' : 
                                              ex.meal === 'Lunch' ? 'bg-warning text-dark' : 
                                              ex.meal === 'Dinner' ? 'bg-dark text-white' : 'bg-light text-dark'
                                            } border me-2 extra-small fw-normal`}>
                                              {ex.meal || 'N/A'}
                                            </span>
                                            {ex.item.replace('Extra: ', '')}
                                          </span>
                                          <span className="fw-bold">₹{ex.amount}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Guests Section */}
                                {selectedDayData.guestDetails.length > 0 && (
                                  <div className="col-12 mt-2">
                                    <span className="extra-small fw-bold text-uppercase text-muted mb-1 d-block">Guest Meals</span>
                                    <div className="bg-white p-2 rounded border">
                                      {selectedDayData.guestDetails.map((g, idx) => (
                                        <div key={idx} className="d-flex justify-content-between align-items-center small py-1 border-bottom last-child-border-0">
                                          <span>
                                            <span className={`badge ${
                                              g.meal === 'Breakfast' ? 'bg-info text-dark' : 
                                              g.meal === 'Lunch' ? 'bg-warning text-dark' : 
                                              g.meal === 'Dinner' ? 'bg-dark text-white' : 'bg-light text-dark'
                                            } border me-2 extra-small fw-normal`}>
                                              {g.meal || 'N/A'}
                                            </span>
                                            <i className="bi bi-person-fill me-1 opacity-50"></i> Guest
                                          </span>
                                          <span className="fw-bold">₹{g.amount}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {selectedDayData.extras.length === 0 && selectedDayData.guestDetails.length === 0 && (
                                  <div className="col-12 mt-1">
                                    <p className="extra-small text-center text-muted italic p-2 bg-white rounded border">No extra items or guests on this day.</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="d-flex justify-content-center gap-3 mt-3">
                    <small className="text-muted extra-small"><i className="bi bi-circle-fill text-success me-1"></i> Open</small>
                    <small className="text-muted extra-small"><i className="bi bi-circle-fill text-danger me-1"></i> Closed</small>
                    <small className="text-muted extra-small"><i className="bi bi-circle-fill text-info me-1"></i> Guests</small>
                    <small className="text-muted extra-small"><i className="bi bi-circle-fill text-warning me-1"></i> Extras</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer border-top p-3 bg-light">
            <button type="button" className="btn btn-dark px-4 fw-bold rounded-pill" onClick={onClose}>Close Portal</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;