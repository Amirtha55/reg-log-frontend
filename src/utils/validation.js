/**
 * Utility functions for form validation, mirroring Spring Boot Bean Validation
 * annotations (@NotBlank, @Email, @Size).
 */

// Regular expression for email validation
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates Name string (min 2, max 100 chars).
 * @param {string} name 
 * @returns {string|null} Error message or null if valid.
 */
export function validateName(name) {
  if (!name || !name.trim()) {
    return 'Name is required.';
  }
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 100) {
    return 'Name must be between 2 and 100 characters.';
  }
  return null;
}

// Alias for backwards compatibility
export const validateFullName = validateName;

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
 * Validates Password requirements (min 6, max 50 chars).
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
  if (password.length > 50) {
    return 'Password cannot exceed 50 characters.';
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
