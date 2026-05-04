import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import moment from 'moment';

const ExtrasAndGuests = () => {
  const [students, setStudents] = useState([]);
  const [availableExtras, setAvailableExtras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    extras: [{ item: '', quantity: 1 }],
    guestMeals: 0,
    mealType: 'Lunch'
  });

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // History State
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [filters, setFilters] = useState({
    day: new Date().getDate().toString(),
    mealType: 'All'
  });

  // Determine current meal based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) setFormData(prev => ({ ...prev, mealType: 'Breakfast' }));
    else if (hour >= 11 && hour < 16) setFormData(prev => ({ ...prev, mealType: 'Lunch' }));
    else if (hour >= 16 && hour < 23) setFormData(prev => ({ ...prev, mealType: 'Dinner' }));
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, menuRes] = await Promise.all([
        api.get('/api/butler/students'),
        api.get('/api/menu/today')
      ]);
      
      setStudents(studentsRes.data);
      
      if (menuRes.data) {
        const extras = [];
        if (menuRes.data.breakfast?.extra) extras.push(menuRes.data.breakfast.extra);
        if (menuRes.data.lunch?.extra) extras.push(menuRes.data.lunch.extra);
        if (menuRes.data.dinner?.extra) extras.push(menuRes.data.dinner.extra);
        
        ['Milk', 'Egg', 'Chicken'].forEach(item => {
          if (!extras.includes(item)) extras.push(item);
        });
        setAvailableExtras(extras);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await api.get('/api/butler/consumption-history', {
        params: {
          day: filters.day,
          mealType: filters.mealType
        }
      });
      if (response.data.success) {
        setHistory(response.data.history);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [filters]);

  const addExtraRow = () => {
    setFormData({
      ...formData,
      extras: [...formData.extras, { item: '', quantity: 1 }]
    });
  };

  const removeExtraRow = (index) => {
    const newExtras = [...formData.extras];
    newExtras.splice(index, 1);
    setFormData({ ...formData, extras: newExtras });
  };

  const handleExtraChange = (index, field, value) => {
    const newExtras = [...formData.extras];
    newExtras[index][field] = value;
    setFormData({ ...formData, extras: newExtras });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId) return alert("Please select a student");
    
    setLoading(true);
    setMessage(null);
    try {
      await api.post('/api/butler/add-consumption', formData);
      setMessage({ type: 'success', text: 'Consumption logged successfully!' });
      setFormData(prev => ({
        ...prev,
        studentId: '',
        extras: [{ item: '', quantity: 1 }],
        guestMeals: 0
      }));
      setSearchTerm('');
      fetchHistory(); // Refresh history table
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to log consumption' });
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = moment().daysInMonth();
  const dayOptions = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());

  const groupedHistory = history.reduce((acc, current) => {
    const studentId = current.student?._id;
    const mealType = current.mealType;
    const key = `${studentId}-${mealType}`;

    if (!acc[key]) {
      acc[key] = {
        student: current.student,
        mealType: current.mealType,
        extras: [],
        guestCount: 0,
        totalAmount: 0
      };
    }

    acc[key].totalAmount += current.amount;
    if (current.type === 'Extra') {
      acc[key].extras.push(current.description.replace('Extra: ', ''));
    } else {
      acc[key].guestCount += 1;
    }

    return acc;
  }, {});

  const groupedArray = Object.values(groupedHistory);

  return (
    <div className="row g-4">
      {/* LEFT: Entry Form */}
      <div className="col-lg-5">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-header bg-primary text-white p-3 border-0">
            <h5 className="mb-0 fw-bold"><i className="bi bi-plus-circle me-2"></i>New Entry</h5>
          </div>
          <div className="card-body p-4">
            {message && <div className={`alert alert-${message.type} py-2 small`}>{message.text}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4 position-relative">
                <label className="form-label small fw-bold text-muted">Student</label>
                <input 
                  type="text"
                  className="form-control bg-light border-0 py-2"
                  placeholder="Search by Mess Account or Name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                    if (formData.studentId) setFormData({...formData, studentId: ''});
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setShowDropdown(false)}
                  required={!formData.studentId}
                />
                
                {showDropdown && searchTerm && (
                  <ul className="list-group position-absolute w-100 shadow-sm" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto', marginTop: '4px' }}>
                    {students
                      .filter(s => (s.messAccount && s.messAccount.toLowerCase().includes(searchTerm.toLowerCase())) || (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase())))
                      .map(s => (
                        <li 
                          key={s._id} 
                          className="list-group-item list-group-item-action border-0 border-bottom"
                          style={{ cursor: 'pointer' }}
                          onMouseDown={() => {
                            setFormData({...formData, studentId: s._id});
                            setSearchTerm(`${s.name} (${s.messAccount})`);
                            setShowDropdown(false);
                          }}
                        >
                          <div className="fw-bold text-dark">{s.name}</div>
                          <div className="small text-muted">{s.messAccount}</div>
                        </li>
                    ))}
                    {students.filter(s => (s.messAccount && s.messAccount.toLowerCase().includes(searchTerm.toLowerCase())) || (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase()))).length === 0 && (
                      <li className="list-group-item text-muted small border-0">No students found</li>
                    )}
                  </ul>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">Meal Category</label>
                <div className="d-flex gap-2">
                  {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
                    <button
                      key={meal}
                      type="button"
                      className={`btn flex-grow-1 py-2 fw-bold rounded-3 ${formData.mealType === meal ? 'btn-primary' : 'btn-outline-light text-dark'}`}
                      onClick={() => setFormData({ ...formData, mealType: meal })}
                    >
                      {meal}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label small fw-bold text-muted mb-0">Extras</label>
                  <button type="button" className="btn btn-sm btn-link text-primary p-0 fw-bold text-decoration-none" onClick={addExtraRow}>
                    + Add Item
                  </button>
                </div>
                
                {formData.extras.map((extra, index) => (
                  <div key={index} className="row g-2 mb-2 align-items-end">
                    <div className="col-7">
                      <select 
                        className="form-select form-select-sm bg-light border-0 py-2" 
                        value={extra.item}
                        onChange={(e) => handleExtraChange(index, 'item', e.target.value)}
                      >
                        <option value="">Select item...</option>
                        {availableExtras.map(item => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-4">
                      <input 
                        type="number" 
                        className="form-control form-control-sm bg-light border-0 py-2" 
                        placeholder="Qty"
                        value={extra.quantity}
                        onChange={(e) => handleExtraChange(index, 'quantity', e.target.value)}
                        min="1"
                      />
                    </div>
                    <div className="col-1 text-end">
                      <button type="button" className="btn btn-sm btn-outline-danger border-0 py-2 px-3 rounded-3" onClick={() => removeExtraRow(index)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">Guest Meals</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0 px-3"><i className="bi bi-people"></i></span>
                  <input 
                    type="number" 
                    className="form-control bg-light border-0 py-2" 
                    value={formData.guestMeals}
                    onChange={(e) => setFormData({...formData, guestMeals: parseInt(e.target.value) || 0})}
                    min="0"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm mt-2" disabled={loading}>
                {loading ? 'Logging...' : 'Confirm Entry'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* RIGHT: History Table */}
      <div className="col-lg-7">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-header bg-white p-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold text-dark"><i className="bi bi-clock-history me-2 text-primary"></i>Daily Log</h5>
            <div className="d-flex gap-2">
              <select 
                className="form-select form-select-sm border-0 bg-light fw-bold" 
                value={filters.day}
                onChange={(e) => setFilters({...filters, day: e.target.value})}
              >
                {dayOptions.map(d => (
                  <option key={d} value={d}>Day {d}</option>
                ))}
              </select>
              <select 
                className="form-select form-select-sm border-0 bg-light fw-bold" 
                value={filters.mealType}
                onChange={(e) => setFilters({...filters, mealType: e.target.value})}
              >
                <option value="All">All Meals</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
              </select>
            </div>
          </div>
          <div className="card-body p-0">
            {historyLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="small text-uppercase fw-bold text-muted ps-3">Student</th>
                      <th className="small text-uppercase fw-bold text-muted">Extras</th>
                      <th className="small text-uppercase fw-bold text-muted">Guests</th>
                      <th className="small text-uppercase fw-bold text-muted text-end pe-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedArray.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted">No records found for this selection.</td>
                      </tr>
                    ) : (
                      groupedArray.map((group, idx) => (
                        <tr key={idx}>
                          <td className="ps-3">
                            <div className="fw-bold text-dark">{group.student?.name}</div>
                            <div className="extra-small text-muted">{group.student?.messAccount}</div>
                          </td>
                          <td>
                            <div className="small fw-bold text-primary">
                              {group.extras.length > 0 ? group.extras.join(', ') : <span className="text-muted opacity-50 fw-normal italic">Not Taken</span>}
                            </div>
                          </td>
                          <td>
                            <div className="small fw-bold" style={{ color: '#d9a400' }}>
                              {group.guestCount > 0 ? `${group.mealType}(Qty: ${group.guestCount})` : <span className="text-muted opacity-50 fw-normal italic">Not Taken</span>}
                            </div>
                          </td>
                          <td className="text-end pe-3 fw-bold text-dark">
                            ₹{group.totalAmount.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="card-footer bg-white p-3 border-0">
             <small className="text-muted"><i className="bi bi-info-circle me-1"></i> Showing records for {moment().format('MMMM YYYY')}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtrasAndGuests;
