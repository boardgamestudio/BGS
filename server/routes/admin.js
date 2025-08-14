const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(403).json({ error: 'Admin access required' });
  }
};

// Get dashboard stats
router.get('/dashboard/stats', requireAdmin, async (req, res) => {
  try {
    const stats = {};

    // Total users
    const totalUsers = await db.query('SELECT COUNT(*) as count FROM users');
    stats.totalUsers = totalUsers[0].count;

    // Active users (logged in last 30 days)
    const activeUsers = await db.query(
      'SELECT COUNT(*) as count FROM users WHERE last_login > DATE_SUB(NOW(), INTERVAL 30 DAY)'
    );
    stats.activeUsers = activeUsers[0].count;

    // New users this month
    const newUsers = await db.query(
      'SELECT COUNT(*) as count FROM users WHERE created_date > DATE_SUB(NOW(), INTERVAL 30 DAY)'
    );
    stats.newUsersThisMonth = newUsers[0].count;

    // Membership distribution
    const membershipStats = await db.query(
      'SELECT membership_tier, COUNT(*) as count FROM users GROUP BY membership_tier'
    );
    stats.membershipDistribution = membershipStats;

    // Content stats
    const projectCount = await db.query('SELECT COUNT(*) as count FROM projects');
    const jobCount = await db.query('SELECT COUNT(*) as count FROM jobs');
    const eventCount = await db.query('SELECT COUNT(*) as count FROM events');

    stats.content = {
      projects: projectCount[0].count,
      jobs: jobCount[0].count,
      events: eventCount[0].count
    };

    // Recent activity
    const recentActivity = await db.query(
      `SELECT al.*, u.name as user_name 
       FROM user_activity_log al 
       LEFT JOIN users u ON al.user_id = u.id 
       ORDER BY al.created_date DESC 
       LIMIT 10`
    );
    stats.recentActivity = recentActivity;

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get all users with pagination and filters
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, role, membershipTier } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params = [];

    if (search) {
      whereConditions.push('(name LIKE ? OR email LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      whereConditions.push('status = ?');
      params.push(status);
    }

    if (role) {
      whereConditions.push('user_role = ?');
      params.push(role);
    }

    if (membershipTier) {
      whereConditions.push('membership_tier = ?');
      params.push(membershipTier);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Get users
    const users = await db.query(
      `SELECT id, email, name, profile_picture, location, status, user_role, 
              membership_tier, membership_expires, last_login, login_count, created_date
       FROM users ${whereClause} 
       ORDER BY created_date DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    // Get total count for pagination
    const totalResult = await db.query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );
    const total = totalResult[0].total;

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get single user details
router.get('/users/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const users = await db.query(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's activity log
    const activity = await db.query(
      'SELECT * FROM user_activity_log WHERE user_id = ? ORDER BY created_date DESC LIMIT 50',
      [id]
    );

    // Get user's content
    const projects = await db.query('SELECT id, title, status, created_date FROM projects WHERE created_by = ?', [id]);
    const jobs = await db.query('SELECT id, title, status, created_date FROM jobs WHERE posted_by = ?', [id]);
    const events = await db.query('SELECT id, title, created_date FROM events WHERE created_by = ?', [id]);

    const userData = {
      ...users[0],
      activity,
      content: {
        projects,
        jobs,
        events
      }
    };

    res.json(userData);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// Update user
router.put('/users/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, status, user_role, membership_tier, membership_expires } = req.body;

    await db.query(
      `UPDATE users SET name = ?, email = ?, status = ?, user_role = ?, 
       membership_tier = ?, membership_expires = ? WHERE id = ?`,
      [name, email, status, user_role, membership_tier, membership_expires, id]
    );

    // Log admin activity
    await db.query(
      'INSERT INTO user_activity_log (user_id, action, target_type, target_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.userId, 'admin_user_updated', 'user', id, JSON.stringify({ name, status, user_role }), req.ip]
    );

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/users/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Don't allow admin to delete themselves
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await db.query('DELETE FROM users WHERE id = ?', [id]);

    // Log admin activity
    await db.query(
      'INSERT INTO user_activity_log (user_id, action, target_type, target_id, ip_address) VALUES (?, ?, ?, ?, ?)',
      [req.user.userId, 'admin_user_deleted', 'user', id, req.ip]
    );

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get system settings
router.get('/settings', requireAdmin, async (req, res) => {
  try {
    const settings = await db.query('SELECT * FROM admin_settings ORDER BY category, setting_key');
    
    // Group by category
    const groupedSettings = settings.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }
      acc[setting.category].push(setting);
      return acc;
    }, {});

    res.json(groupedSettings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update system setting
router.put('/settings/:key', requireAdmin, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    await db.query(
      'UPDATE admin_settings SET setting_value = ?, updated_by = ? WHERE setting_key = ?',
      [value, req.user.userId, key]
    );

    // Log admin activity
    await db.query(
      'INSERT INTO user_activity_log (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
      [req.user.userId, 'admin_setting_updated', JSON.stringify({ key, value }), req.ip]
    );

    res.json({ message: 'Setting updated successfully' });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

// Get user activity logs
router.get('/activity', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, userId, action } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params = [];

    if (userId) {
      whereConditions.push('al.user_id = ?');
      params.push(userId);
    }

    if (action) {
      whereConditions.push('al.action LIKE ?');
      params.push(`%${action}%`);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    const activity = await db.query(
      `SELECT al.*, u.name as user_name, u.email as user_email 
       FROM user_activity_log al 
       LEFT JOIN users u ON al.user_id = u.id 
       ${whereClause} 
       ORDER BY al.created_date DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json(activity);
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});

module.exports = router;
