import React from 'react';

const WeeklyMenuSection = ({ menu }) => {
  if (!menu || !menu.menu) return null;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const meals = [
    { key: 'breakfast', display: 'Breakfast', icon: 'bi-sunrise text-warning' },
    { key: 'lunch', display: 'Lunch', icon: 'bi-sun text-info' },
    { key: 'dinner', display: 'Dinner', icon: 'bi-moon-stars text-primary' }
  ];

  return (
    <div className="glass-panel shadow-sm border-0 mb-3 fade-in bg-white" style={{ borderRadius: '12px' }}>
      <div className="card-header border-bottom bg-transparent p-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
        <h6 className="mb-0 fw-bold text-dark mb-2 mb-md-0"><i className="bi bi-calendar-week me-2 text-primary"></i>Weekly Meal Plan</h6>
        {menu.timings && (
          <div className="d-flex flex-wrap gap-2 text-muted" style={{ fontSize: '0.75rem' }}>
            <span className="bg-light px-2 py-1 rounded-2 border"><i className="bi bi-sunrise me-1"></i>{menu.timings.breakfast.start} - {menu.timings.breakfast.end}</span>
            <span className="bg-light px-2 py-1 rounded-2 border"><i className="bi bi-sun me-1"></i>{menu.timings.lunch.start} - {menu.timings.lunch.end}</span>
            <span className="bg-light px-2 py-1 rounded-2 border"><i className="bi bi-moon-stars me-1"></i>{menu.timings.dinner.start} - {menu.timings.dinner.end}</span>
          </div>
        )}
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table align-middle mb-0" style={{ fontSize: '0.85rem' }}>
            <thead className="bg-light">
              <tr className="text-uppercase fw-semibold text-muted" style={{ fontSize: '0.7rem' }}>
                <th style={{ width: '15%' }} className="ps-3 py-2 border-0">Day</th>
                <th style={{ width: '28%' }} className="py-2 border-0">Breakfast</th>
                <th style={{ width: '28%' }} className="py-2 border-0">Lunch</th>
                <th style={{ width: '29%' }} className="py-2 border-0">Dinner</th>
              </tr>
            </thead>
            <tbody>
              {days.map((day, index) => {
                const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;
                return (
                  <tr key={day} className={isToday ? 'bg-primary bg-opacity-10' : ''}>
                    <td className="fw-bold text-dark ps-3 py-2 border-bottom">
                      {day.substring(0, 3)} {isToday && <span className="badge bg-primary ms-1 py-1 px-1 rounded small" style={{ fontSize: '0.6rem' }}>Today</span>}
                    </td>
                    {meals.map(meal => (
                      <td key={`${day}-${meal.key}`} className="py-2 border-bottom">
                        <span className="text-dark d-block">{menu.menu[day][meal.key].item || '—'}</span>
                        {menu.menu[day][meal.key].extra && (
                          <span className="text-warning fw-semibold mt-1 d-block" style={{ fontSize: '0.7rem' }}>+ {menu.menu[day][meal.key].extra}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WeeklyMenuSection;
