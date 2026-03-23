import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ReportProvider } from './context/ReportContext'; 

// Pages & Components
import Signup from './assets/pages/Signup';
import Login from './assets/pages/Login';
import ProtectedRoute from './assets/Components/ProtectedRoute';
import CivicLensLanding from './assets/Components/CivicLensLanding';
import AuthorityDashboard from './assets/Components/AuthorityDashboard'; 
import AdminDashboard from './assets/pages/AdminDashboard';
import HelpPage from './assets/pages/HelpPage'; 
import AboutPage from './assets/pages/AboutPage'; 
import CommunityFeed from './assets/pages/CommunityFeed';
import Chatbot from './assets/Components/Chatbot/Chatbot'; // Import Chatbot

// User specific dashboard pages
import UserDashboard from './assets/pages/UserDashboard';
import UserAnalytics from './assets/pages/UserAnalytics';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <ReportProvider>
        <Router>
          {/* Chatbot is placed here so it persists across all routes. 
            The 'fixed' CSS classes in the Chatbot component will 
            keep it in the bottom-right corner.
          */}
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
                <ProtectedRoute allowedRole="Normal User">
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/user-stats" 
              element={
                <ProtectedRoute allowedRole="Normal User">
                  <UserAnalytics />
                </ProtectedRoute>
              } 
            />

            {/* --- Authority Routes --- */}
            <Route 
              path="/authority" 
              element={
                <ProtectedRoute allowedRole="Government Authority">
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
      </ReportProvider>
    </AuthProvider>
  );
}

export default App;