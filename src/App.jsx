import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// Pages & Components
import Signup from './pages/Signup';
import Login from './pages/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import CivicLensLanding from './Components/CivicLensLanding';
import AuthorityDashboard from './Components/AuthorityDashboard';
import AdminDashboard from './pages/AdminDashboard';
import HelpPage from './pages/HelpPage';
import AboutPage from './pages/AboutPage';
import CommunityFeed from './pages/CommunityFeed';
import Chatbot from './Components/Chatbot/Chatbot'; // Import Chatbot

// User specific dashboard pages
import UserDashboard from './pages/UserDashboard';
import UserAnalytics from './pages/UserAnalytics';

import './App.css';

function App({ installPWA }) {
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const show = () => setCanInstall(true);
    const hide = () => setCanInstall(false);

    window.addEventListener("pwa-install-available", show);
    window.addEventListener("pwa-install-response", hide);

    return () => {
      window.removeEventListener("pwa-install-available", show);
      window.removeEventListener("pwa-install-response", hide);
    };
  }, []);
  return (

    <Router>
      {canInstall && (
        <button
          onClick={installPWA}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            padding: "10px 16px",
            background: "#111",
            color: "white",
            borderRadius: "8px",
            border: "none",
            zIndex: 9999,
          }}
        >
          Install App
        </button>
      )}
      <Chatbot />
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<CivicLensLanding />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/community" element={<CommunityFeed />} />

        {/* --- Citizen/Normal User Routes --- */}
        <Route
          path="/user-home"
          element={
            <ProtectedRoute allowedRole="civilian">
              <>
                <UserDashboard />
                <Chatbot />

              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-stats"
          element={
            <ProtectedRoute allowedRole="civilian">
              <><UserAnalytics />
                <Chatbot />
              </>
            </ProtectedRoute>
          }
        />

        {/* --- Authority Routes --- */}
        <Route
          path="/authority"
          element={
            <ProtectedRoute allowedRole="Authority">
              <AuthorityDashboard />
            </ProtectedRoute>
          }
        />

        {/* --- Admin Route --- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* --- Catch All Redirect --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>

  );
}

export default App;