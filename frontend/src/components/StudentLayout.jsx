import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import "../App.css";

const StudentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    document.title = "SmartMess | Student";
  }, []);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get('/api/notices');

        const activeNotices = res.data?.notices || [];

        // Find the most recently created notice (assuming the first one or we can sort)
        // Usually APIs return newest first, but let's be safe and use the first one's ID or createdAt.
        const latestNotice = activeNotices.length > 0 ? activeNotices[0] : null;
        const latestId = latestNotice ? latestNotice._id : null;

        // If the user is on the Notice Board, mark as read
        if (location.pathname.includes('/notices')) {
          if (latestId) {
            localStorage.setItem('lastSeenNoticeId', latestId);
          }
          setHasUnread(false);
        } else {
          // Otherwise, check if the latest ID matches what we've seen
          const lastSeenId = localStorage.getItem('lastSeenNoticeId');
          if (latestId && latestId !== lastSeenId) {
            setHasUnread(true);
          } else {
            setHasUnread(false);
          }
        }
      } catch (err) {
        console.error("Failed to fetch notices for badge:", err);
      }
    };

    fetchNotices();
  }, [location.pathname]); // refresh on navigation

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname.includes(path) ? "active" : "";

  return (
    <div className="bg-light min-vh-100">

      {/* --- THE SIDEBAR --- */}
      <aside className="admin-sidebar shadow-lg">
        {/* Brand/Logo */}
        <div className="sidebar-brand mb-3 border-bottom border-light border-opacity-10">
          <i className="bi bi-hexagon-fill"></i>
          <span className="link-text fs-4 fw-bold text-white ms-2">SmartMess</span>
        </div>

        {/* Navigation Links */}
        <nav className="d-flex flex-column gap-1">
          <Link to="/student/dashboard" className={`sidebar-link ${isActive('/student/dashboard')}`}>
            <i className="bi bi-speedometer2"></i>
            <span className="link-text">Overview</span>
          </Link>

          <Link to="/student/menu" className={`sidebar-link ${isActive('/student/menu')}`}>
            <i className="bi bi-calendar-week"></i>
            <span className="link-text">Mess Menu</span>
          </Link>

          <Link to="/student/bill" className={`sidebar-link ${isActive('/student/bill')}`}>
            <i className="bi bi-receipt"></i>
            <span className="link-text">Billing & Consumption</span>
          </Link>

          <Link to="/student/profile" className={`sidebar-link ${isActive('/student/profile')}`}>
            <i className="bi bi-person-gear"></i>
            <span className="link-text">Profile & Settings</span>
          </Link>

          <Link to="/student/notices" className={`sidebar-link ${isActive('/student/notices')}`}>
            <div className="position-relative d-inline-block">
              <i className="bi bi-megaphone"></i>
              {hasUnread && (
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle animate-pulse-slow shadow-sm" style={{ transform: 'translate(-30%, -30%) !important' }}>
                  <span className="visually-hidden">unread notices</span>
                </span>
              )}
            </div>
            <span className="link-text ms-1">Notice Board</span>
          </Link>
        </nav>
      </aside>

      {/* --- THE MAIN CONTENT AREA --- */}
      <div className="admin-main-wrapper">

        {/* The Top Navbar */}
        <header className="admin-top-nav d-flex justify-content-between align-items-center px-4">
          <div className="d-flex flex-column">
            <h4 className="m-0 fs-5 fw-bold nav-title">Student Portal</h4>
            <small className="text-muted fw-medium mt-1">Welcome back, {user.name}</small>
          </div>

          <div className="d-flex align-items-center gap-4">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-light rounded-circle d-flex align-items-center justify-content-center border" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-mortarboard-fill text-secondary fs-5"></i>
              </div>
              <div className="d-flex flex-column">
                <span className="fw-bold text-dark lh-1">{user.name}</span>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Student</span>
              </div>
            </div>

            <button onClick={handleLogout} className="btn btn-logout rounded-pill px-4 fw-semibold">
              Logout <i className="bi bi-box-arrow-right ms-1"></i>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content Renders Here */}
        <main className="p-4 flex-grow-1 overflow-auto w-100">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default StudentLayout;
