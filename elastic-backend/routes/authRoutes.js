const express = require('express');
const {
  registerUser,
  loginUser,
  validateToken,
  logoutUser,
  getCurrentUser,
} = require('../controllers/AuthController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Protected routes
router.get('/validate', validateToken);
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router;