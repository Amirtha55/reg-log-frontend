import api from './api';

const STORAGE_USER_KEY = 'authflow_user';

/**
 * Extracts a clear, user-friendly error message from backend responses or network errors.
 * Handles Spring Boot validation errors (Map<String, String>), conflict/unauthorized messages,
 * and network connection issues.
 */
export function extractErrorMessage(error) {
  if (error.response && error.response.data) {
    const data = error.response.data;

    // Handle Spring Boot validation field errors: { errors: { email: "...", password: "..." } }
    if (data.errors && typeof data.errors === 'object') {
      const messages = Object.values(data.errors).filter(Boolean);
      if (messages.length > 0) {
        return messages.join('. ');
      }
    }

    // Handle standard backend error message
    if (data.message && typeof data.message === 'string') {
      return data.message;
    }
  }

  // Handle server connection failure / unreachable
  if (error.code === 'ERR_NETWORK' || (!error.response && error.request)) {
    return 'Unable to connect to backend server at http://localhost:8080. Please ensure the Spring Boot application is running.';
  }

  return error.message || 'An unexpected error occurred. Please try again.';
}

/**
 * Register a new user with the Spring Boot backend.
 * POST /api/auth/register
 * Request payload: { name, email, password }
 * Response payload: { success: boolean, message: string, user: { id, name, email, createdAt } }
 */
export async function registerUser({ name, email, password }) {
  try {
    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password
    };

    const response = await api.post('/api/auth/register', payload);
    return response.data;
  } catch (error) {
    const message = extractErrorMessage(error);
    const customError = new Error(message);
    customError.fieldErrors = error.response?.data?.errors || null;
    customError.status = error.response?.status;
    throw customError;
  }
}

/**
 * Authenticate a user with email and password via Spring Boot backend.
 * POST /api/auth/login
 * Request payload: { email, password }
 * Response payload: { success: boolean, message: string, user: { id, name, email, createdAt } }
 */
export async function loginUser(email, password) {
  try {
    const payload = {
      email: email.trim().toLowerCase(),
      password
    };

    const response = await api.post('/api/auth/login', payload);
    const data = response.data;

    // Store user session info (id, name, email, createdAt) without password
    if (data && data.user) {
      setCurrentUserSession(data.user);
    }

    return data;
  } catch (error) {
    const message = extractErrorMessage(error);
    const customError = new Error(message);
    customError.fieldErrors = error.response?.data?.errors || null;
    customError.status = error.response?.status;
    throw customError;
  }
}

/**
 * Get active user session from browser storage.
 * Note: Contains only safe public profile data (id, name, email, createdAt); passwords are never stored.
 */
export function getCurrentUser() {
  try {
    const data = localStorage.getItem(STORAGE_USER_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to parse current user from storage:', err);
    return null;
  }
}

/**
 * Save user profile in browser storage.
 */
export function setCurrentUserSession(user) {
  if (!user) return;
  // Ensure no password or sensitive credentials ever enter storage
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(safeUser));
}

/**
 * Terminate user session.
 */
export function logoutUser() {
  localStorage.removeItem(STORAGE_USER_KEY);
}
