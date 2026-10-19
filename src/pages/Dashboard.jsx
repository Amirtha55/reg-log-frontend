import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck,
  Mail,
  Phone,
  Calendar,
  Key,
  Database,
  Server,
  LogOut,
  Copy,
  CheckCircle
} from '../components/common/Icons';
import { useAuth } from '../context/AuthContext';
import DemoNotice from '../components/common/DemoNotice';
import AlertBanner from '../components/common/AlertBanner';
import './Dashboard.css';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [copiedToken, setCopiedToken] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'spring'

  // If no user is logged in, show demo guest fallback with prompt to login
  const isGuest = !currentUser;

  const displayUser = currentUser || {
    fullName: 'Guest Demo User',
    email: 'guest@example.com',
    phone: '+1 555-000-0000',
    createdAt: new Date().toISOString(),
    token: 'demo-guest-token-preview',
    isDemoSession: true
  };

  const handleLogout = () => {
    logout();
    navigate('/login', {
      state: {
        type: 'info',
        message: 'You have been logged out of your demo session.'
      }
    });
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(displayUser.token || 'demo-token');
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const formattedDate = new Date(displayUser.createdAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-tag">
            <span className="live-dot"></span>
            Frontend-Only Session Active
          </div>
          <h1 className="hero-title">
            Welcome, <span className="gradient-text">{displayUser.fullName}</span>!
          </h1>
          <p className="hero-subtitle">
            You are successfully authenticated in <strong>Demo Mode</strong>. This session is simulated
            entirely within the React frontend.
          </p>
        </div>

        <div className="hero-actions">
          <button onClick={handleLogout} className="btn-outline-danger">
            <LogOut size={16} />
            <span>End Demo Session</span>
          </button>
        </div>
      </div>

      {/* Prominent Demo Notice */}
      <DemoNotice
        variant="warning"
        message="IMPORTANT: No backend server or MySQL database is connected yet. User credentials and session tokens are simulated locally in browser memory/localStorage for demonstration and UI testing only."
      />

      {isGuest && (
        <AlertBanner
          type="info"
          message="You are viewing the dashboard as a guest. Try logging in or creating a new account to test live state transition."
        />
      )}

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <UserCheck size={18} />
          <span>Demo User Profile</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'spring' ? 'active' : ''}`}
          onClick={() => setActiveTab('spring')}
        >
          <Server size={18} />
          <span>Spring Boot & MySQL Architecture</span>
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
                  <h2 className="dash-card-title">Submitted Profile Information</h2>
                  <p className="dash-card-desc">Information submitted during login/registration</p>
                </div>
              </div>
            </div>

            <div className="dash-card-body">
              <div className="profile-field-row">
                <span className="field-label">
                  <UserCheck size={16} /> Full Name:
                </span>
                <span className="field-value font-semibold">{displayUser.fullName}</span>
              </div>

              <div className="profile-field-row">
                <span className="field-label">
                  <Mail size={16} /> Email Address:
                </span>
                <span className="field-value">{displayUser.email}</span>
              </div>

              <div className="profile-field-row">
                <span className="field-label">
                  <Phone size={16} /> Phone Number:
                </span>
                <span className="field-value">{displayUser.phone}</span>
              </div>

              <div className="profile-field-row">
                <span className="field-label">
                  <Calendar size={16} /> Session Created:
                </span>
                <span className="field-value">{formattedDate}</span>
              </div>

              <div className="profile-field-row">
                <span className="field-label">
                  <Key size={16} /> Simulated JWT:
                </span>
                <div className="token-field">
                  <code>{displayUser.token}</code>
                  <button
                    onClick={handleCopyToken}
                    className="copy-token-btn"
                    title="Copy simulated token"
                  >
                    {copiedToken ? <CheckCircle size={14} color="#10b981" /> : <Copy size={14} />}
                  </button>
                </div>
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
                  <h2 className="dash-card-title">Frontend Features Verified</h2>
                  <p className="dash-card-desc">Working features in this React application</p>
                </div>
              </div>
            </div>

            <div className="dash-card-body">
              <ul className="feature-checklist">
                <li>
                  <CheckCircle size={18} className="check-icon" />
                  <div>
                    <strong>Responsive Layout</strong>
                    <span>Optimized for mobile phones, tablets, and desktop displays.</span>
                  </div>
                </li>
                <li>
                  <CheckCircle size={18} className="check-icon" />
                  <div>
                    <strong>Input Validation</strong>
                    <span>Real-time email format, phone digits, password match, and required fields.</span>
                  </div>
                </li>
                <li>
                  <CheckCircle size={18} className="check-icon" />
                  <div>
                    <strong>Show / Hide Password</strong>
                    <span>Integrated toggle eye on password & confirm password fields.</span>
                  </div>
                </li>
                <li>
                  <CheckCircle size={18} className="check-icon" />
                  <div>
                    <strong>Modular Architecture</strong>
                    <span>Reusable components, context API, and centralized auth service.</span>
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
              <h2>Java Spring Boot & MySQL Ready Architecture</h2>
              <p>
                This frontend is designed so you can immediately hook it up to a Spring Boot REST API
                by switching the mock promises in <code>src/services/authService.js</code> to standard <code>fetch()</code> calls.
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
  "fullName": "${displayUser.fullName}",
  "email": "${displayUser.email}",
  "phone": "${displayUser.phone}",
  "password": "UserSecurePassword123!"
}`}
              </pre>
            </div>

            {/* Login Endpoint */}
            <div className="endpoint-box">
              <div className="endpoint-title">
                <span className="http-method post">POST</span>
                <code>/api/auth/login</code>
              </div>
              <p className="endpoint-desc">Validates credentials with Spring Security and returns a JWT token for authorized requests.</p>
              
              <div className="code-snippet-header">JSON Payload Sent From React:</div>
              <pre className="code-block">
{`{
  "email": "${displayUser.email}",
  "password": "UserSecurePassword123!"
}`}
              </pre>
            </div>
          </div>

          <div className="spring-tips">
            <strong>Backend Integration Tip:</strong> Remember to configure <code>@CrossOrigin(origins = "http://localhost:3000")</code> on your Spring Boot controllers to permit requests from this Vite frontend development server.
          </div>
        </div>
      )}
    </div>
  );
}
