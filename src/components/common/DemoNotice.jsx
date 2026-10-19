import React from 'react';
import { Info, AlertTriangle } from './Icons';
import './DemoNotice.css';

/**
 * Reusable banner to clearly inform the user that this app
 * is a frontend-only demo and not connected to a live database yet.
 */
export default function DemoNotice({ variant = 'info', message }) {
  const isWarning = variant === 'warning';
  
  return (
    <div className={`demo-notice-container ${isWarning ? 'notice-warning' : 'notice-info'}`}>
      <div className="demo-notice-icon">
        {isWarning ? <AlertTriangle size={18} /> : <Info size={18} />}
      </div>
      <div className="demo-notice-content">
        <strong>Demo Authentication (Frontend Only)</strong>
        <p>
          {message ||
            'Data is stored only in temporary browser storage for demonstration. Passwords are not hashed securely, and no live database is connected yet.'}
        </p>
      </div>
    </div>
  );
}
