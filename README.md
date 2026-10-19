# AuthFlow - Beginner-Friendly React & Vite Auth Frontend

A clean, modern, responsive frontend application for User Registration, Login, and Demo Dashboard built with **React.js**, **Vite**, **JavaScript**, and **CSS**.

> **⚠️ Frontend-Only Demo Notice:**  
> This project operates entirely on the client side for testing, UI evaluation, and prototyping. User accounts, validation, and session states are simulated locally in browser memory (`localStorage`). No real backend server or MySQL database is connected yet. User passwords are not securely hashed or saved to a remote database.

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18 or newer recommended).

### 1. Install Dependencies
Open your terminal inside this project directory (`registration-login-frontend`) and run:
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

Vite will start the local server (typically at `http://localhost:3000` or `http://localhost:5173`). Open that URL in your browser to test the app!

### 3. Production Build
```bash
npm run build
```

---

## 📱 Features Included

1. **User Registration Page (`/register`)**
   - **Fields**: Full Name, Email Address, Phone Number, Password, Confirm Password.
   - **Real-Time & On-Submit Validations**:
     - Required field validation on all inputs.
     - Email format validation with regex.
     - Phone number validation (accepts 10–15 digits, international formats).
     - Password length (minimum 6 characters) and live strength indicator (Weak / Medium / Strong).
     - Confirm Password verification (must match password).
   - **Show / Hide Password Toggle**: Eye icon button on both password and confirm password fields.
   - **Direct Navigation**: Link to switch to the Login page.

2. **User Login Page (`/login`)**
   - **Fields**: Email Address, Password.
   - **Validation**: Email syntax and password requirement checks.
   - **Quick Demo Fill Button**: One-click button to load sample test credentials (`demo@example.com` / `Password123!`).
   - **Show / Hide Password Toggle**: Easy toggle button to inspect typed passwords.
   - **Direct Navigation**: Link to switch to the Sign Up page.

3. **Demo Dashboard Page (`/dashboard`)**
   - **Authenticated Profile View**: Displays full name, email, phone number, account creation timestamp, and simulated JWT session token.
   - **Explicit Frontend-Only Warning**: Prominent banner explaining that session data is only in browser memory.
   - **Spring Boot & MySQL Architecture Guide**: Interactive preview of the exact JSON payloads and Spring Boot endpoints.
   - **Logout Action**: Clears the session and returns to Login with a success alert.

4. **Responsive & Modern Design**
   - Clean glassmorphism styling with an indigo and violet gradient theme.
   - Fully responsive for mobile phones (<480px), tablets, and desktop displays.
   - Reusable components (`InputField`, `AlertBanner`, `DemoNotice`, `AuthCard`, `Navbar`).

---

## 📂 Project Structure

```
registration-login-frontend/
├── index.html                  # HTML template with Plus Jakarta Sans font
├── package.json                # Project dependencies and npm scripts
├── vite.config.js              # Vite bundler configuration
├── README.md                   # Documentation and instructions
├── public/
│   └── favicon.svg             # Application favicon
└── src/
    ├── main.jsx                # React root rendering entry point
    ├── App.jsx                 # App routing (React Router DOM) & layout wrapper
    ├── index.css               # Global CSS variables, resets, and utility classes
    ├── components/
    │   ├── common/
    │   │   ├── AlertBanner.jsx # Reusable error/success notification banners
    │   │   ├── AlertBanner.css
    │   │   ├── DemoNotice.jsx  # Frontend-only warning banner component
    │   │   ├── DemoNotice.css
    │   │   ├── InputField.jsx  # Reusable input field with show/hide password toggle
    │   │   ├── InputField.css
    │   │   ├── Navbar.jsx      # Top navigation bar with active links & user pill
    │   │   └── Navbar.css
    │   └── layout/
    │       ├── AuthCard.jsx    # Card container for auth forms
    │       └── AuthCard.css
    ├── context/
    │   └── AuthContext.jsx     # Global authentication state (user, login, register, logout)
    ├── pages/
    │   ├── Login.jsx           # Login page
    │   ├── Register.jsx        # Registration page
    │   ├── Dashboard.jsx       # Demo dashboard with profile and Spring Boot guide
    │   ├── NotFound.jsx        # 404 page for invalid URLs
    │   ├── AuthPages.css       # Shared styles for auth screens
    │   └── Dashboard.css       # Dashboard styles
    ├── services/
    │   └── authService.js      # Mock API authentication service (Spring Boot ready)
    └── utils/
        └── validation.js       # Reusable input validation functions
```

---

## 🔌 Connecting to Java Spring Boot & MySQL

This frontend is designed so you can connect it to a Java Spring Boot backend without rewriting the UI.

### 1. Expected Spring Boot Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Accepts registration details, hashes password, saves to MySQL |
| `POST` | `/api/auth/login` | Verifies credentials, returns JWT token |

### 2. Spring Boot Controller Example (`AuthController.java`)
```java
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // Allow Vite frontend
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        userService.registerUser(request);
        return ResponseEntity.ok(new ApiResponse("User registered successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        String jwt = jwtUtils.generateJwtToken(authentication);
        return ResponseEntity.ok(new JwtResponse(jwt, request.getEmail()));
    }
}
```

### 3. Swapping the Frontend to Real Backend Calls
In `src/services/authService.js`, replace the `localStorage` simulation with actual `fetch()` or `axios` calls:

```javascript
// Example Real Spring Boot Register Call:
export async function registerUser(userData) {
  const response = await fetch('http://localhost:8080/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }
  return await response.json();
}
```

---

## 🛠️ Testing the Application

1. **Test Registration**:
   - Go to `http://localhost:3000/register`.
   - Submit empty fields to verify the required-field validation error messages.
   - Type an invalid email (e.g. `test@`) to verify email-format validation.
   - Enter mismatched passwords to test the password-matching validation.
   - Fill valid inputs and submit. You will see a success message and be redirected to the demo dashboard.

2. **Test Login**:
   - Go to `http://localhost:3000/login`.
   - Click the **"Auto Fill"** button in the "Quick Demo Login" box to auto-populate sample credentials.
   - Click the **Eye icon** inside the password field to toggle password visibility.
   - Click **"Sign In"** to transition to the demo dashboard.

3. **Test Logout**:
   - Click the **"End Demo Session"** or **"Logout"** button in the top navbar. You will be logged out and returned to the Login page with a confirmation banner.
