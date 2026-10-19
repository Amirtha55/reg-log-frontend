import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from './Icons';
import './InputField.css';

/**
 * Reusable Form Input Component
 * Features:
 * - Label & required indicator
 * - Leading icon support
 * - Toggle visibility for password inputs
 * - Inline validation error message
 * - Helper text
 */
export default function InputField({
  id,
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  helperText,
  required = false,
  icon: Icon,
  autoComplete,
  disabled = false
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';

  // Toggle input type between 'password' and 'text'
  const computedType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`form-group ${error ? 'has-error' : ''}`}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required-star" aria-hidden="true">*</span>}
      </label>

      <div className="input-wrapper">
        {Icon && (
          <span className="input-leading-icon" aria-hidden="true">
            <Icon size={18} />
          </span>
        )}

        <input
          id={id}
          name={name}
          type={computedType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`form-input ${Icon ? 'with-icon' : ''} ${isPasswordField ? 'with-action' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        />

        {isPasswordField && (
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error ? (
        <div id={`${id}-error`} className="input-error-msg" role="alert">
          <AlertCircle size={14} className="input-error-icon" />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <div id={`${id}-helper`} className="input-helper-text">
          {helperText}
        </div>
      ) : null}
    </div>
  );
}
