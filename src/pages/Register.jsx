import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, UserPlus, ArrowRight } from '../components/common/Icons';
import { useAuth } from '../context/AuthContext';
import {
  validateFullName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
  checkPasswordStrength
} from '../utils/validation';
import AuthCard from '../components/layout/AuthCard';
import InputField from '../components/common/InputField';
import AlertBanner from '../components/common/AlertBanner';
import DemoNotice from '../components/common/DemoNotice';
import './AuthPages.css';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Form Fields State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  // Errors state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  // Password strength calculation
  const passwordStrength = checkPasswordStrength(formData.password);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue
    }));

    // If touched, re-validate immediately for real-time feedback
    if (touched[name]) {
      validateSingleField(name, fieldValue);
    }

    // If changing password, also revalidate confirmPassword if already touched
    if (name === 'password' && touched.confirmPassword) {
      const confirmErr = validateConfirmPassword(formData.confirmPassword, value);
      setErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
    }
  };

  // Handle Field Blur (mark touched and validate)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateSingleField(name, value);
  };

  // Validate a single field
  const validateSingleField = (name, value) => {
    let error = null;

    switch (name) {
      case 'fullName':
        error = validateFullName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(value, formData.password);
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));

    return error;
  };

  // Validate entire form before submission
  const validateForm = () => {
    const nameErr = validateFullName(formData.fullName);
    const emailErr = validateEmail(formData.email);
    const phoneErr = validatePhone(formData.phone);
    const passErr = validatePassword(formData.password);
    const confirmErr = validateConfirmPassword(formData.confirmPassword, formData.password);

    const newErrors = {
      fullName: nameErr,
      email: emailErr,
      phone: phoneErr,
      password: passErr,
      confirmPassword: confirmErr
    };

    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true
    });

    return !nameErr && !emailErr && !phoneErr && !passErr && !confirmErr;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    const isValid = validateForm();
    if (!isValid) {
      setAlert({
        type: 'error',
        message: 'Please resolve the highlighted validation errors before proceeding.'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      setAlert({
        type: 'success',
        message: res.message || 'Registration successful! Taking you to the dashboard...'
      });

      // Redirect to dashboard after a brief delay so user sees success feedback
      setTimeout(() => {
        navigate('/dashboard');
      }, 900);
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Create Account"
      subtitle="Register a test profile to explore the frontend dashboard"
      icon={UserPlus}
    >
      <DemoNotice />

      {alert && (
        <AlertBanner
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {/* Full Name */}
        <InputField
          id="reg-fullname"
          name="fullName"
          type="text"
          label="Full Name"
          placeholder="e.g. John Doe"
          value={formData.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.fullName ? errors.fullName : null}
          icon={User}
          required
          autoComplete="name"
          disabled={isSubmitting}
        />

        {/* Email Address */}
        <InputField
          id="reg-email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="e.g. john@example.com"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email ? errors.email : null}
          icon={Mail}
          required
          autoComplete="email"
          disabled={isSubmitting}
        />

        {/* Phone Number */}
        <InputField
          id="reg-phone"
          name="phone"
          type="tel"
          label="Phone Number"
          placeholder="e.g. +1 555-0199 or 9876543210"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.phone ? errors.phone : null}
          icon={Phone}
          required
          autoComplete="tel"
          disabled={isSubmitting}
        />

        {/* Password */}
        <InputField
          id="reg-password"
          name="password"
          type="password"
          label="Password"
          placeholder="At least 6 characters"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password ? errors.password : null}
          icon={Lock}
          required
          autoComplete="new-password"
          disabled={isSubmitting}
        />

        {/* Password Strength Meter */}
        {formData.password && (
          <div className="password-strength-container" aria-live="polite">
            <div className="password-strength-bars">
              <span
                className={`strength-bar ${
                  passwordStrength.score >= 1 ? `active-${passwordStrength.level}` : ''
                }`}
              ></span>
              <span
                className={`strength-bar ${
                  passwordStrength.score >= 3 ? `active-${passwordStrength.level}` : ''
                }`}
              ></span>
              <span
                className={`strength-bar ${
                  passwordStrength.score >= 5 ? `active-${passwordStrength.level}` : ''
                }`}
              ></span>
            </div>
            <div className="password-strength-label">
              <span>Password Strength:</span>
              <span className={`strength-text ${passwordStrength.level}`}>
                {passwordStrength.label}
              </span>
            </div>
          </div>
        )}

        {/* Confirm Password */}
        <InputField
          id="reg-confirm-password"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Re-enter password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.confirmPassword ? errors.confirmPassword : null}
          icon={Lock}
          required
          autoComplete="new-password"
          disabled={isSubmitting}
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner" aria-hidden="true"></span>
              <span>Registering Profile...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Navigation to Login */}
      <div className="auth-switch-text">
        Already have an account?{' '}
        <Link to="/login">Sign in here</Link>
      </div>
    </AuthCard>
  );
}
