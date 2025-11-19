// Authentication Service - Handles all auth API calls
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const authService = {
  // Register a new user
  register: async (email, password, role = 'User') => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token in sessionStorage (cleared on browser close)
      if (data.token) {
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('userEmail', data.user.email);
        sessionStorage.setItem('userRole', data.user.role);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const token = sessionStorage.getItem('authToken');

      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Clear session storage
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('userRole');

      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Clear session anyway
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('userRole');
      throw error;
    }
  },

  // Validate token
  validateToken: async () => {
    try {
      const token = sessionStorage.getItem('authToken');

      if (!token) {
        return { valid: false };
      }

      const response = await fetch(`${API_URL}/api/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userRole');
        return { valid: false };
      }

      return data;
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const token = sessionStorage.getItem('authToken');

      if (!token) {
        return null;
      }

      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Get token from session storage
  getToken: () => {
    return sessionStorage.getItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!sessionStorage.getItem('authToken');
  },

  // Get user role from session storage
  getUserRole: () => {
    return sessionStorage.getItem('userRole');
  },

  // Get user email from session storage
  getUserEmail: () => {
    return sessionStorage.getItem('userEmail');
  },
};

export default authService;
