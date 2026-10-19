import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from '../components/common/Icons';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--danger-50)', color: 'var(--danger-600)', borderRadius: '50%', marginBottom: '1.25rem' }}>
        <AlertCircle size={36} />
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--neutral-900)' }}>Page Not Found</h1>
      <p style={{ color: 'var(--neutral-600)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/login" className="btn-primary" style={{ display: 'inline-flex', width: 'auto', textDecoration: 'none' }}>
        <ArrowLeft size={16} />
        <span>Return to Login</span>
      </Link>
    </div>
  );
}
