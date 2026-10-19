import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogIn, UserPlus, LayoutDashboard, LogOut, Menu, X } from './Icons';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login', { state: { message: 'You have logged out successfully.' } });
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <NavLink to={isAuthenticated ? '/dashboard' : '/login'} className="navbar-brand" onClick={closeMenu}>
          <div className="brand-icon">
            <ShieldCheck size={22} />
          </div>
          <span className="brand-name">
            Auth<span className="brand-highlight">Flow</span>
          </span>
          <span className="demo-tag">DEMO</span>
        </NavLink>

        {/* Mobile Hamburger Toggle */}
        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Navigation Links */}
        <nav className={`navbar-nav ${mobileMenuOpen ? 'is-open' : ''}`}>
          <div className="nav-links-group">
            {!isAuthenticated ? (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </NavLink>

                <NavLink
                  to="/register"
                  className={({ isActive }) => `nav-link nav-link-cta ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <UserPlus size={16} />
                  <span>Sign Up</span>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </NavLink>

                <div className="user-badge" title={currentUser.email}>
                  <div className="user-avatar">
                    {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="user-name">{currentUser.fullName || 'Demo User'}</span>
                </div>

                <button type="button" onClick={handleLogout} className="logout-btn" title="Log out">
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
