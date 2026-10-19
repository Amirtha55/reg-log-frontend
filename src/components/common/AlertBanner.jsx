import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from './Icons';
import './AlertBanner.css';

/**
 * Reusable alert banner for success, error, warning, or informational messages.
 */
export default function AlertBanner({ type = 'info', message, onClose }) {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 size={18} />,
    error: <AlertCircle size={18} />,
    warning: <AlertTriangle size={18} />,
    info: <Info size={18} />
  };

  return (
    <div className={`alert-banner alert-${type}`} role="alert" aria-live="polite">
      <span className="alert-icon">{icons[type] || icons.info}</span>
      <div className="alert-message">{message}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="alert-close-btn"
          aria-label="Dismiss message"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
