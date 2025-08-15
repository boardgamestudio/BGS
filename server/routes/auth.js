const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const router = express.Router();
const db = require('../config/database');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// User registration
router.post('/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    console.log(`Register attempt for: ${email} from ${req.ip}`);

    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Email, name, and password are required', message: 'Email, name, and password are required' });
    }

    // Check if user already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists', message: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Insert new user
    const result = await db.query(
      `INSERT INTO users (email, name, password_hash, email_verification_token, status) 
       VALUES (?, ?, ?, ?, 'active')`,
      [email, name, passwordHash, verificationToken]
    );

    // Log activity
    await db.query(
      'INSERT INTO user_activity_log (user_id, action, ip_address) VALUES (?, ?, ?)',
      [result.insertId, 'user_registered', req.ip]
    );

    res.status(201).json({
      message: 'User registered successfully.',
      userId: result.insertId,
      verificationRequired: false
    });

    // TODO: Send verification email
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', message: 'Registration failed' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email} from ${req.ip}`);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required', message: 'Email and password are required' });
    }

    // Get user with password hash
    const users = await db.query(
      'SELECT id, email, name, password_hash, status, user_role, membership_tier FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials', message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check if account is active
    if (user.status !== 'active') {
      return res.status(401).json({ error: 'Account is not active', message: 'Account is not active' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials', message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.user_role,
        membershipTier: user.membership_tier
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Update login stats
    await db.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP, login_count = login_count + 1 WHERE id = ?',
      [user.id]
    );

    // Create session record
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await db.query(
      'INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)',
      [user.id, sessionToken, req.ip, req.get('User-Agent'), expiresAt]
    );

    // Log activity
    await db.query(
      'INSERT INTO user_activity_log (user_id, action, ip_address) VALUES (?, ?, ?)',
      [user.id, 'user_login', req.ip]
    );

    console.log(`Login successful for user id: ${user.id} from ${req.ip}`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.user_role,
        membershipTier: user.membership_tier
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', message: 'Login failed' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const users = await db.query(
      `SELECT id, email, name, profile_picture, bio, location, website, skills, 
              status, user_role, membership_tier, membership_expires, created_date 
       FROM users WHERE id = ?`,
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const { name, bio, location, website, skills } = req.body;

    await db.query(
      `UPDATE users SET name = ?, bio = ?, location = ?, website = ?, skills = ? 
       WHERE id = ?`,
      [name, bio, location, website, JSON.stringify(skills), req.user.userId]
    );

    // Log activity
    await db.query(
      'INSERT INTO user_activity_log (user_id, action, ip_address) VALUES (?, ?, ?)',
      [req.user.userId, 'profile_updated', req.ip]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Profile update failed' });
  }
});

// Logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Remove session if provided
    const sessionToken = req.headers['x-session-token'];
    if (sessionToken) {
      await db.query('DELETE FROM user_sessions WHERE session_token = ?', [sessionToken]);
    }

    // Log activity
    await db.query(
      'INSERT INTO user_activity_log (user_id, action, ip_address) VALUES (?, ?, ?)',
      [req.user.userId, 'user_logout', req.ip]
    );

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Request password reset
router.post('/request-password-reset', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const users = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      // Don't reveal if email exists
      return res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // 1 hour expiry

    await db.query(
      'UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE email = ?',
      [resetToken, resetExpires, email]
    );

    // TODO: Send password reset email

    res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'Password reset request failed' });
  }
});

module.exports = router;
