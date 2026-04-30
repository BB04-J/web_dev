import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="sidebar glass-card">
      <div className="sidebar-brand">
        <span className="text-gradient">Glow</span>Routine
      </div>
      
      <div className="sidebar-links">
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          📊 Dashboard
        </NavLink>
        <NavLink to="/routines" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          📋 My Routine
        </NavLink>
        <NavLink to="/guidance" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          ⚠️ Routine Guidance
        </NavLink>
        <NavLink to="/weekly-planner" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          📅 Weekly Planner
        </NavLink>
        <NavLink to="/profile" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          👤 Skin Profile
        </NavLink>
        <NavLink to="/recommendations" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          ✨ Recommendations
        </NavLink>
        <NavLink to="/ingredients" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          🔬 Ingredient Checker
        </NavLink>
        <NavLink to="/product-checker" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          🛡️ Product Checker
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="btn-logout-sidebar">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
