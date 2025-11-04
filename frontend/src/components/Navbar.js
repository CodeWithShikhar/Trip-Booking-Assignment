import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPlane } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaPlane className="logo-icon" />
          <span>Argo</span>
        </Link>
        
        <ul className="navbar-menu">
          <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
          {isAuthenticated && <li><NavLink to="/my-bookings" className={({ isActive }) => isActive ? 'active' : ''}>My Bookings</NavLink></li>}
          {isAuthenticated && <li><NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>Profile</NavLink></li>}
          {isAdmin && <li><NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''}>Admin</NavLink></li>}
        </ul>

        <div className="navbar-auth">
          {isAuthenticated ? (
            <>
              <div className="user-avatar">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.fullName} />
                ) : (
                  <div className="avatar-placeholder">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-link">Login</Link>
              <Link to="/signup" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
