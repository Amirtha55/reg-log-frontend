/**
 * Utility functions for frontend form validation.
 * These rules can later be mirrored on the backend using Spring Boot Bean Validation (@NotBlank, @Email, @Size).
 */

// Regular expression for standard email validation
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Regular expression for general phone numbers (allows +, spaces, dashes, parentheses, 7 to 15 digits)
export const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

/**
 * Validates a Full Name string.
 * @param {string} name 
 * @returns {string|null} Error message or null if valid.
 */
export function validateFullName(name) {
  if (!name || !name.trim()) {
    return 'Full name is required.';
  }
  if (name.trim().length < 2) {
    return 'Full name must be at least 2 characters.';
  }
  return null;
}

/**
 * Validates an Email address.
 * @param {string} email 
 * @returns {string|null} Error message or null if valid.
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return 'Email address is required.';
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return 'Please enter a valid email address (e.g., alex@example.com).';
  }
  return null;
}

/**
 * Validates a Phone Number.
 * @param {string} phone 
 * @returns {string|null} Error message or null if valid.
 */
export function validatePhone(phone) {
  if (!phone || !phone.trim()) {
    return 'Phone number is required.';
  }
  // Strip non-digit characters to check digit count
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return 'Phone number must contain between 10 and 15 digits.';
  }
  if (!PHONE_REGEX.test(phone.trim())) {
    return 'Please enter a valid phone number (e.g., +1 555-0199 or 9876543210).';
  }
  return null;
}

/**
 * Validates Password requirements.
 * @param {string} password 
 * @returns {string|null} Error message or null if valid.
 */
export function validatePassword(password) {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long.';
  }
  return null;
}

/**
 * Validates Confirm Password against Password.
 * @param {string} confirmPassword 
 * @param {string} originalPassword 
 * @returns {string|null} Error message or null if valid.
 */
export function validateConfirmPassword(confirmPassword, originalPassword) {
  if (!confirmPassword) {
    return 'Please confirm your password.';
  }
  if (confirmPassword !== originalPassword) {
    return 'Passwords do not match.';
  }
  return null;
}

/**
 * Calculates a friendly password strength rating (Weak, Medium, Strong).
 * @param {string} password 
 * @returns {{ level: 'weak'|'medium'|'strong', score: number, label: string }}
 */
export function checkPasswordStrength(password) {
  if (!password) return { level: 'weak', score: 0, label: 'Too short' };
  
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { level: 'weak', score, label: 'Weak' };
  if (score <= 4) return { level: 'medium', score, label: 'Medium' };
  return { level: 'strong', score, label: 'Strong' };
}
