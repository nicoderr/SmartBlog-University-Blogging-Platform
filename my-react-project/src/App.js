import Blog from './components/views/Blog';
import Login from '../src/components/models/LoginFile';
import AdminDashboard from './components/controllers/AdminController';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Moderator from './components/models/Moderator';
import authService from './services/authService';
import { CircularProgress, Box } from '@mui/material';
import './App.css';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is still authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isValid = await authService.validateToken();
        if (isValid.valid) {
          setUserRole(authService.getUserRole());
        } else {
          // Token is invalid or expired - clear session
          await authService.logout();
          setUserRole(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (role) => {
    setUserRole(role);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUserRole(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={userRole ? <Blog userRole={userRole} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/admin" 
          element={userRole === "Administrator" ? <AdminDashboard /> : <Login onLogin={handleLogin} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
