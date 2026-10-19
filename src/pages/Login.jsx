import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles, ArrowRight } from '../components/common/Icons';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/validation';
import { getDefaultDemoCredentials } from '../services/authService';
import AuthCard from '../components/layout/AuthCard';
import InputField from '../components/common/InputField';
import AlertBanner from '../components/common/AlertBanner';
import DemoNotice from '../components/common/DemoNotice';
import './AuthPages.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Form Fields State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Errors state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  // If redirected with a message (e.g. after logout or registration)
  useEffect(() => {
    if (location.state?.message) {
      setAlert({
        type: location.state.type || 'info',
        message: location.state.message
      });
      // Clear location state to avoid repeating message on reload
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // If already logged in, provide option or allow dashboard redirect
  useEffect(() => {
    if (isAuthenticated) {
      // If user navigates directly to /login while authenticated
    }
  }, [isAuthenticated]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field error on change if already touched
    if (touched[name]) {
      validateSingleField(name, value);
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
    if (name === 'email') {
      error = validateEmail(value);
    } else if (name === 'password') {
      error = validatePassword(value);
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));

    return error;
  };

  // Validate all fields before submission
  const validateForm = () => {
    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);

    const newErrors = {
      email: emailErr,
      password: passErr
    };

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    return !emailErr && !passErr;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    const isValid = validateForm();
    if (!isValid) {
      setAlert({
        type: 'error',
        message: 'Please resolve the highlighted validation errors.'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await login(formData.email, formData.password);
      
      setAlert({
        type: 'success',
        message: res.message || 'Login successful! Redirecting to dashboard...'
      });

      // Redirect to Dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 700);
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Failed to log in. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Demo Auto-Fill helper
  const handleQuickDemoFill = () => {
    const demo = getDefaultDemoCredentials();
    setFormData({
      email: demo.email,
      password: demo.password,
      rememberMe: true
    });
    setErrors({});
    setAlert({
      type: 'info',
      message: 'Demo credentials loaded! Click "Sign In" to proceed.'
    });
  };

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to your demo account to access the dashboard"
      icon={LogIn}
    >
      <DemoNotice />

      {alert && (
        <AlertBanner
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Quick Demo Autofill Widget */}
      <div className="demo-quick-fill-box">
        <div className="quick-fill-info">
          <span className="quick-fill-title">Quick Demo Login</span>
          <span className="quick-fill-desc">Load sample credentials in one click</span>
        </div>
        <button
          type="button"
          onClick={handleQuickDemoFill}
          className="btn-quick-fill"
          title="Fill demo email and password"
        >
          <Sparkles size={14} />
          Auto Fill
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {/* Email Field */}
        <InputField
          id="login-email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email ? errors.email : null}
          icon={Mail}
          required
          autoComplete="email"
          disabled={isSubmitting}
        />

        {/* Password Field */}
        <InputField
          id="login-password"
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password ? errors.password : null}
          icon={Lock}
          required
          autoComplete="current-password"
          disabled={isSubmitting}
        />

        {/* Remember Me Checkbox & Forgot Password Link */}
        <div className="form-options-row">
          <label className="remember-me-checkbox">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <span>Remember me</span>
          </label>

          <span
            className="forgot-password-link"
            style={{ cursor: 'pointer', opacity: 0.8 }}
            onClick={() =>
              setAlert({
                type: 'info',
                message: 'In this frontend demo, you can use the "Auto Fill" button or register a new test account.'
              })
            }
          >
            Forgot password?
          </span>
        </div>

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
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Navigation to Registration */}
      <div className="auth-switch-text">
        Don&apos;t have an account?{' '}
        <Link to="/register">Create an account</Link>
      </div>
    </AuthCard>
  );
}
