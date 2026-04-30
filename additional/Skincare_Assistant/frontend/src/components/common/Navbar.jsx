import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = token && token !== 'undefined' && token !== 'null';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar glass-card">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="text-gradient">Glow</span>Routine
        </Link>
        
        <div className="navbar-links">
          {isLoggedIn ? (
            <>
              <Link to="/routines" className="nav-link">My Routine</Link>
              <Link to="/profile" className="nav-link">Skin Profile</Link>
              <Link to="/recommendations" className="nav-link">Recommendations</Link>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
