import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from '../components/common/Icons';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/validation';
import AuthCard from '../components/layout/AuthCard';
import InputField from '../components/common/InputField';
import AlertBanner from '../components/common/AlertBanner';
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

  // If redirected with a message (e.g. after registration or logout) or prefilled email
  useEffect(() => {
    if (location.state?.message) {
      setAlert({
        type: location.state.type || 'info',
        message: location.state.message
      });
    }
    if (location.state?.email) {
      setFormData((prev) => ({
        ...prev,
        email: location.state.email
      }));
    }
    if (location.state?.message || location.state?.email) {
      // Clear location state so message is not repeated on manual reload
      window.history.replaceState({}, document.title);
    }
  }, [location]);

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
      if (err.fieldErrors) {
        setErrors((prev) => ({ ...prev, ...err.fieldErrors }));
      }
      setAlert({
        type: 'error',
        message: err.message || 'Failed to log in. Please check your credentials.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in with your email and password to access the dashboard"
      icon={LogIn}
    >
      {alert && (
        <AlertBanner
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

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

        {/* Remember Me Checkbox & Help Link */}
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
                message: 'Password reset is managed by the backend administrator. Please register a new account if needed.'
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
