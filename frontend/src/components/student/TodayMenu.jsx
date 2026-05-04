import React from 'react';

const TodayMenu = ({ menu, timings }) => {
  if (!menu) return (
    <div className="glass-panel shadow-sm border-0 mb-3 h-100 p-4 text-center d-flex flex-column justify-content-center align-items-center bg-white rounded-3">
      <i className="bi bi-calendar-x fs-3 text-muted mb-2"></i>
      <small className="text-muted fw-medium">No menu available for today.</small>
    </div>
  );

  const mealItems = [
    { type: 'Breakfast', icon: 'bi-sunrise text-warning', data: menu.breakfast, time: timings?.breakfast },
    { type: 'Lunch', icon: 'bi-sun text-info', data: menu.lunch, time: timings?.lunch },
    { type: 'Dinner', icon: 'bi-moon-stars text-primary', data: menu.dinner, time: timings?.dinner }
  ];

  return (
    <div className="glass-panel shadow-sm border-0 mb-3 h-100 bg-white" style={{ borderRadius: '12px' }}>
      <div className="card-header border-bottom bg-transparent p-3">
        <h6 className="mb-0 fw-bold text-dark"><i className="bi bi-calendar-check me-2 text-primary"></i>Today's Menu</h6>
      </div>
      <div className="card-body p-3">
        <div className="d-flex flex-column gap-2">
          {mealItems.map(meal => (
            <div key={meal.type} className="p-2 px-3 rounded-3 bg-light border d-flex flex-column flex-sm-row justify-content-between align-items-sm-center">
              <div>
                <span className="fw-bold d-block text-dark" style={{ fontSize: '0.85rem' }}>
                  <i className={`bi ${meal.icon} me-2`}></i>
                  {meal.type}
                </span>
                <span className="text-dark fw-medium mt-1 d-block" style={{ fontSize: '0.9rem' }}>
                  {meal.data?.item || 'Not set'}
                </span>
              </div>
              <div className="d-flex flex-column align-items-sm-end mt-2 mt-sm-0">
                {meal.data?.extra && <span className="badge bg-warning text-dark px-2 py-1 rounded-pill mb-1" style={{ fontSize: '0.65rem' }}>+ {meal.data.extra}</span>}
                {meal.time && (
                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                    <i className="bi bi-clock me-1"></i>{meal.time.start} - {meal.time.end}
                  </small>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodayMenu;
