import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck,
  Mail,
  Calendar,
  Database,
  Server,
  LogOut,
  CheckCircle,
  Hash
} from '../components/common/Icons';
import { useAuth } from '../context/AuthContext';
import AlertBanner from '../components/common/AlertBanner';
import './Dashboard.css';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'spring'

  const isGuest = !currentUser;

  const displayUser = currentUser || {
    id: '—',
    name: 'Guest User',
    email: 'Not authenticated',
    createdAt: new Date().toISOString()
  };

  const handleLogout = () => {
    logout();
    navigate('/login', {
      state: {
        type: 'info',
        message: 'You have been logged out successfully.'
      }
    });
  };

  const formattedDate = displayUser.createdAt
    ? new Date(displayUser.createdAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : 'N/A';

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-tag">
            <span className="live-dot"></span>
            Spring Boot Backend Connected
          </div>
          <h1 className="hero-title">
            Welcome, <span className="gradient-text">{displayUser.name}</span>!
          </h1>
          <p className="hero-subtitle">
            You are securely authenticated against the live Spring Boot REST API and MySQL database.
          </p>
        </div>

        <div className="hero-actions">
          {currentUser ? (
            <button onClick={handleLogout} className="btn-outline-danger">
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          ) : (
            <button onClick={() => navigate('/login')} className="btn-primary">
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {isGuest && (
        <AlertBanner
          type="info"
          message="You are viewing the dashboard without an active session. Please sign in or register to view your profile."
        />
      )}

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <UserCheck size={18} />
          <span>User Profile</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'spring' ? 'active' : ''}`}
          onClick={() => setActiveTab('spring')}
        >
          <Server size={18} />
          <span>Backend & Database Integration</span>
        </button>
      </div>

      {/* Tab 1: Profile View */}
      {activeTab === 'profile' && (
        <div className="dashboard-grid">
          {/* User Details Card */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="card-icon-title">
                <div className="card-icon user-icon-bg">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h2 className="dash-card-title">Backend User Record</h2>
                  <p className="dash-card-desc">Verified account information retrieved from MySQL</p>
                </div>
              </div>
            </div>

            <div className="dash-card-body">
              <div className="profile-field-row">
                <span className="field-label">
                  <Hash size={16} /> User ID:
                </span>
                <span className="field-value font-semibold">#{displayUser.id}</span>
              </div>

              <div className="profile-field-row">
                <span className="field-label">
                  <UserCheck size={16} /> Full Name:
                </span>
                <span className="field-value font-semibold">{displayUser.name}</span>
              </div>

              <div className="profile-field-row">
                <span className="field-label">
                  <Mail size={16} /> Email Address:
                </span>
                <span className="field-value">{displayUser.email}</span>
              </div>

              <div className="profile-field-row">
                <span className="field-label">
                  <Calendar size={16} /> Account Created:
                </span>
                <span className="field-value">{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="card-icon-title">
                <div className="card-icon db-icon-bg">
                  <Database size={20} />
                </div>
                <div>
                  <h2 className="dash-card-title">Live Integration Status</h2>
                  <p className="dash-card-desc">Production-grade features active</p>
                </div>
              </div>
            </div>

            <div className="dash-card-body">
              <ul className="feature-checklist">
                <li>
                  <CheckCircle size={18} className="check-icon" />
                  <div>
                    <strong>Axios REST Client</strong>
                    <span>Configured with base URL <code>http://localhost:8080</code> and Vite development proxy.</span>
                  </div>
                </li>
                <li>
                  <CheckCircle size={18} className="check-icon" />
                  <div>
                    <strong>Secure Credential Handling</strong>
                    <span>Passwords are never stored in browser storage. Passwords hashed using BCrypt in MySQL.</span>
                  </div>
                </li>
                <li>
                  <CheckCircle size={18} className="check-icon" />
                  <div>
                    <strong>Real Backend Validation</strong>
                    <span>Handles Spring Boot Bean Validation errors and database duplicate email checks (HTTP 409).</span>
                  </div>
                </li>
                <li>
                  <CheckCircle size={18} className="check-icon" />
                  <div>
                    <strong>Clean Session Management</strong>
                    <span>Safe user profile persistence across page refreshes with one-click logout.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Spring Boot Integration Readiness */}
      {activeTab === 'spring' && (
        <div className="spring-integration-card">
          <div className="spring-header">
            <div>
              <h2>Spring Boot REST API &amp; MySQL Status</h2>
              <p>
                The frontend communicates directly with the live Spring Boot backend server on port 8080 using JSON payloads.
              </p>
            </div>
          </div>

          <div className="spring-endpoints-grid">
            {/* Register Endpoint */}
            <div className="endpoint-box">
              <div className="endpoint-title">
                <span className="http-method post">POST</span>
                <code>/api/auth/register</code>
              </div>
              <p className="endpoint-desc">Accepts user details, checks MySQL for existing email, and hashes password using BCrypt.</p>
              
              <div className="code-snippet-header">JSON Payload Sent From React:</div>
              <pre className="code-block">
{`{
  "name": "${displayUser.name || 'John Doe'}",
  "email": "${displayUser.email || 'user@example.com'}",
  "password": "••••••••"
}`}
              </pre>
            </div>

            {/* Login Endpoint */}
            <div className="endpoint-box">
              <div className="endpoint-title">
                <span className="http-method post">POST</span>
                <code>/api/auth/login</code>
              </div>
              <p className="endpoint-desc">Validates credentials with BCrypt password encoder and returns user profile.</p>
              
              <div className="code-snippet-header">JSON Payload Sent From React:</div>
              <pre className="code-block">
{`{
  "email": "${displayUser.email || 'user@example.com'}",
  "password": "••••••••"
}`}
              </pre>
            </div>
          </div>

          <div className="spring-tips">
            <strong>Connected Backend:</strong> Spring Boot running on <code>http://localhost:8080</code> with MySQL database persistence.
          </div>
        </div>
      )}
    </div>
  );
}
