import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';
import DuesSection from '../components/student/DuesSection';
import ConsumptionGrid from '../components/student/ConsumptionGrid';
import TodayMenu from '../components/student/TodayMenu';
import NoticeFeed from '../components/student/NoticeFeed';
import WeeklyMenuSection from '../components/student/WeeklyMenuSection';
import AccountManagement from '../components/student/AccountManagement';
import MyProfile from '../components/student/MyProfile';

const StudentDashboard = () => {
  const [data, setData] = useState({
    dues: {},
    consumption: [],
    menu: null,
    weeklyMenu: null,
    notices: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      // Use allSettled to handle partial failures
      const results = await Promise.allSettled([
        api.get('/api/students/me/dues'),
        api.get('/api/students/me/consumption/monthly'),
        api.get('/api/menu/today'),
        api.get('/api/menu'),
        api.get('/api/notices'),
        api.get('/api/auth/me')
      ]);

      const [duesRes, consumptionRes, menuRes, weeklyMenuRes, noticesRes, userRes] = results;

      setData({
        dues: duesRes.status === 'fulfilled' ? duesRes.value.data : {},
        consumption: consumptionRes.status === 'fulfilled' ? (Array.isArray(consumptionRes.value.data) ? consumptionRes.value.data : []) : [],
        menu: menuRes.status === 'fulfilled' ? menuRes.value.data : null,
        weeklyMenu: weeklyMenuRes.status === 'fulfilled' ? weeklyMenuRes.value.data : null,
        notices: noticesRes.status === 'fulfilled' ? (noticesRes.value.data.notices || []) : [],
        user: userRes.status === 'fulfilled' ? userRes.value.data.user : JSON.parse(localStorage.getItem('user'))
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger mt-4" role="alert">
      {error}
    </div>
  );

  const location = useLocation();
  const currentPath = location.pathname;

  const getTitle = () => {
    if (currentPath.includes('/menu')) return "Mess Menu";
    if (currentPath.includes('/notices')) return "Notice Board";
    if (currentPath.includes('/profile')) return "Profile & Settings";
    if (currentPath.includes('/bill')) return "Billing & Consumption";
    return "Student Dashboard";
  };
  const getSubtitle = () => {
    if (currentPath.includes('/menu')) return "View today's menu and the weekly schedule.";
    if (currentPath.includes('/notices')) return "Stay updated with the latest mess announcements.";
    if (currentPath.includes('/profile')) return "Manage your personal details and mess account status.";
    if (currentPath.includes('/bill')) return "Detailed breakdown of your current month's charges and meal history.";
    return "Overview of your mess account.";
  };
  const getIcon = () => {
    if (currentPath.includes('/menu')) return "bi-calendar-week";
    if (currentPath.includes('/notices')) return "bi-megaphone";
    if (currentPath.includes('/profile')) return "bi-person-vcard";
    if (currentPath.includes('/bill')) return "bi-receipt";
    if (currentPath.includes('/account-control')) return "bi-sliders";
    return "bi-speedometer2";
  };

  let content = null;
  if (currentPath.includes('/menu')) {
    content = (
      <div className="row g-4 slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <div className="col-lg-12">
          <TodayMenu menu={data.menu} timings={data.weeklyMenu?.timings} />
        </div>
        <div className="col-12">
          <WeeklyMenuSection menu={data.weeklyMenu} />
        </div>
      </div>
    );
  } else if (currentPath.includes('/notices')) {
    content = (
      <div className="row g-4 slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <div className="col-12">
          <NoticeFeed notices={data.notices} />
        </div>
      </div>
    );
  } else if (currentPath.includes('/profile')) {
    content = (
      <div className="row g-4 slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <div className="col-lg-5 col-xl-4">
          <MyProfile user={data.user} />
        </div>
        <div className="col-lg-7 col-xl-8">
          <AccountManagement user={data.user} onUpdate={fetchData} />
        </div>
      </div>
    );
  } else if (currentPath.includes('/bill')) {
    content = (
      <div className="row g-4 slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <div className="col-xl-4 col-lg-5">
          <DuesSection dues={data.dues} />
        </div>
        <div className="col-xl-8 col-lg-7">
          <ConsumptionGrid consumption={data.consumption} />
        </div>
      </div>
    );
  } else {
    // Default Overview
    content = (
      <>
        <div className="row g-4 slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <div className="col-12">
            <MyProfile user={data.user} />
          </div>
          
          <div className="col-xl-4 col-lg-6">
            <TodayMenu menu={data.menu} timings={data.weeklyMenu?.timings} />
          </div>
          <div className="col-xl-4 col-lg-6">
            <DuesSection dues={data.dues} />
          </div>
          <div className="col-xl-4 col-lg-12">
            <AccountManagement user={data.user} onUpdate={fetchData} />
          </div>

          <div className="col-12">
            <NoticeFeed notices={data.notices} />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="container-fluid py-4 fade-in">
      <div className="row mb-4 align-items-center">
        <div className="col-12">
          <h2 className="fw-bold text-dark mb-1"><i className={`bi ${getIcon()} me-2 text-primary`}></i>{getTitle()}</h2>
          <p className="text-muted mb-0">{getSubtitle()}</p>
        </div>
      </div>

      {content}
    </div>
  );
};

export default StudentDashboard;
