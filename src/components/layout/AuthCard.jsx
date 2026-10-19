import React from 'react';
import './AuthCard.css';

/**
 * Reusable Auth Card Layout for Login & Registration screens.
 */
export default function AuthCard({ title, subtitle, icon: Icon, children }) {
  return (
    <div className="auth-card-container">
      <div className="auth-card">
        <div className="auth-card-header">
          {Icon && (
            <div className="auth-card-icon-bubble">
              <Icon size={26} />
            </div>
          )}
          <h1 className="auth-card-title">{title}</h1>
          {subtitle && <p className="auth-card-subtitle">{subtitle}</p>}
        </div>

        <div className="auth-card-body">
          {children}
        </div>
      </div>
    </div>
  );
}
