/**
 * Auth Service (Demo / Frontend-Only Mode)
 *
 * NOTE: Currently this service simulates asynchronous API network calls
 * using browser `localStorage` and `setTimeout`. It is intentionally organized
 * so it can be directly swapped with a Java Spring Boot REST API.
 *
 * Future Spring Boot REST Endpoints:
 * - POST http://localhost:8080/api/auth/register
 * - POST http://localhost:8080/api/auth/login
 * - GET  http://localhost:8080/api/auth/me
 */

const STORAGE_USERS_KEY = 'authflow_demo_users';
const STORAGE_CURRENT_USER_KEY = 'authflow_demo_current_user';

// Pre-seeded demo account for easy testing
const DEFAULT_DEMO_USER = {
  fullName: 'Sarah Jenkins',
  email: 'demo@example.com',
  phone: '+1 (555) 019-2834',
  password: 'Password123!',
  createdAt: new Date().toISOString()
};

/**
 * Initialize mock users storage if not present.
 */
function getStoredUsers() {
  const data = localStorage.getItem(STORAGE_USERS_KEY);
  if (!data) {
    const initialUsers = [DEFAULT_DEMO_USER];
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  }
  try {
    return JSON.parse(data);
  } catch (err) {
    console.error('Error parsing stored users:', err);
    return [DEFAULT_DEMO_USER];
  }
}

/**
 * Register a new user in demo storage.
 *
 * In Spring Boot, this will send:
 * await fetch('http://localhost:8080/api/auth/register', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify(userData)
 * });
 */
export async function registerUser({ fullName, email, phone, password }) {
  // Simulate network latency (400ms)
  await new Promise((resolve) => setTimeout(resolve, 400));

  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  // Check if email already exists
  const existingUser = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existingUser) {
    throw new Error('An account with this email address already exists.');
  }

  const newUser = {
    fullName: fullName.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    password, // Stored in demo mode only. In Spring Boot, BCrypt will hash this.
    createdAt: new Date().toISOString(),
    demoToken: 'demo-jwt-token-' + Math.random().toString(36).substring(2)
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

  // Automatically sign in the user for immediate dashboard viewing
  const sessionUser = {
    fullName: newUser.fullName,
    email: newUser.email,
    phone: newUser.phone,
    createdAt: newUser.createdAt,
    token: newUser.demoToken,
    isDemoSession: true
  };

  localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(sessionUser));

  return {
    success: true,
    message: 'Registration successful! (Demo mode: stored locally in browser)',
    user: sessionUser
  };
}

/**
 * Authenticate a user with email and password in demo storage.
 *
 * In Spring Boot, this will send:
 * await fetch('http://localhost:8080/api/auth/login', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email, password })
 * });
 */
export async function loginUser(email, password) {
  // Simulate network latency (400ms)
  await new Promise((resolve) => setTimeout(resolve, 400));

  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user || user.password !== password) {
    throw new Error('Invalid email or password. Please verify your credentials.');
  }

  const sessionUser = {
    fullName: user.fullName,
    email: user.email,
    phone: user.phone || 'N/A',
    createdAt: user.createdAt,
    token: user.demoToken || 'demo-jwt-token-' + Math.random().toString(36).substring(2),
    isDemoSession: true
  };

  localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(sessionUser));

  return {
    success: true,
    message: 'Login successful! Welcome back.',
    user: sessionUser
  };
}

/**
 * Get currently active user from demo session.
 */
export function getCurrentUser() {
  const data = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Log out user by removing session storage.
 */
export function logoutUser() {
  localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
}

/**
 * Get default credentials for quick demo testing.
 */
export function getDefaultDemoCredentials() {
  return {
    email: DEFAULT_DEMO_USER.email,
    password: DEFAULT_DEMO_USER.password,
    fullName: DEFAULT_DEMO_USER.fullName,
    phone: DEFAULT_DEMO_USER.phone
  };
}
