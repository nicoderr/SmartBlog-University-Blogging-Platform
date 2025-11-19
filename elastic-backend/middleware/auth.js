const jwt = require('jsonwebtoken');
const supabase = require('../config/supabaseClient');

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Check if session exists and is not expired
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select('user_id, expires_at')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !sessions) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Verify JWT signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authenticateToken;