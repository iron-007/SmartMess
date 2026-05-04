import React from 'react';
import { useLocation } from 'react-router-dom';

const NoticeFeed = ({ notices }) => {
  const location = useLocation();
  const isNoticePage = location.pathname.includes('/notices');

  return (
    <div className="glass-panel shadow-sm border-0 h-100 fade-in bg-white" style={{ borderRadius: '12px' }}>
      <div className="card-header border-bottom bg-transparent p-3">
         <h6 className="mb-0 fw-bold text-dark"><i className="bi bi-megaphone me-2 text-warning"></i>Notice Board</h6>
      </div>
      <div className="card-body p-3">
        {(!notices || notices.length === 0) ? (
          <div className="text-center text-muted py-4">
            <i className="bi bi-inbox fs-3 mb-2 opacity-50 d-block"></i>
            <small>No active notices.</small>
          </div>
        ) : (
          <div className="overflow-auto pe-1" style={{ maxHeight: isNoticePage ? 'calc(100vh - 220px)' : '450px' }}>
            <div className="d-flex flex-column gap-3">
              {notices.map((notice, index) => (
                <div key={index} className="p-3 bg-white" style={{ border: '1px solid #94a3b8', borderRadius: '6px' }}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem', color: '#0f172a' }}>{notice.title}</h6>
                    {notice.priority === 'High' && <span className="badge bg-danger ms-2 rounded-1 px-2 py-1" style={{ fontSize: '0.6rem' }}>High</span>}
                  </div>
                  <div className="mb-2" style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    <i className="bi bi-calendar3 me-1"></i>
                    {new Date(notice.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <p className="mb-0 fw-medium" style={{ fontSize: '0.85rem', color: '#334155', whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                    {notice.content}
                  </p>
                  {notice.attachmentUrl && (
                    <a 
                      href={`http://localhost:5000/${notice.attachmentUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="d-inline-flex align-items-center mt-3 text-primary fw-semibold"
                      style={{ fontSize: '0.75rem', textDecoration: 'none' }}
                    >
                      <i className="bi bi-paperclip me-1"></i> View Attachment
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeFeed;
