import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-wrapper">
          {/* Top Navigation */}
          <Navbar />

          {/* Main View Area */}
          <main className="main-content">
            <Routes>
              {/* Default redirects to /login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Demo Dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="app-footer">
            <p>
              AuthFlow &bull; Frontend-Only React &amp; Vite Application &bull; Designed for Java Spring Boot &amp; MySQL
            </p>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
