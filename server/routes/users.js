const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /users - List all users
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const sort = req.query.sort || '-created_date';

    let orderBy = 'ORDER BY created_date DESC';
    if (sort === 'created_date') {
      orderBy = 'ORDER BY created_date ASC';
    }

    const sql = `
      SELECT id, email, name, profile_picture, bio, location, website, skills, created_date 
      FROM users 
      ${orderBy} 
      LIMIT ?
    `;

    const users = await db.query(sql, [limit]);

    // Parse JSON fields
    const formattedUsers = users.map(user => ({
      ...user,
      skills: user.skills ? JSON.parse(user.skills) : []
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error('Users list error:', error);
    res.status(500).json({ error: 'Failed to fetch users', message: 'Failed to fetch users' });
  }
});

// POST /users - Create new user
router.post('/', async (req, res) => {
  try {
    const { email, name, profile_picture, bio, location, website, skills } = req.body;

    const sql = `
      INSERT INTO users (email, name, profile_picture, bio, location, website, skills) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await db.query(sql, [
      email, name, profile_picture, bio, location, website, JSON.stringify(skills || [])
    ]);

    res.status(201).json({
      success: true,
      id: result.insertId
    });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ error: 'Failed to create user', message: 'Failed to create user' });
  }
});

// GET /users/me - Get current authenticated user profile
router.get('/me', async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Not authenticated', message: 'Not authenticated' });
    }

    const users = await db.query(
      `SELECT id, email, name, profile_picture, profile_banner, bio, location, website, skills,
              user_roles, languages, portfolio, work_experience, education,
              profile_visibility, show_in_marketplace, company_name, company_logo,
              company_description, services, contact_email, contact_number, company_website,
              twitter_url, facebook_url, linkedin_url, instagram_url, youtube_url,
              year_founded, employee_count, game_type_specialization, game_design_focus
       FROM users WHERE id = ?`,
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found', message: 'User not found' });
    }

    const user = users[0];

    // Parse JSON fields if present
    const parseIfJson = (val) => {
      if (!val) return [];
      try {
        return typeof val === 'string' ? JSON.parse(val) : val;
      } catch (e) {
        return val;
      }
    };

    user.skills = parseIfJson(user.skills);
    user.user_roles = parseIfJson(user.user_roles);
    user.languages = parseIfJson(user.languages);
    user.portfolio = parseIfJson(user.portfolio);
    user.work_experience = parseIfJson(user.work_experience);
    user.education = parseIfJson(user.education);
    user.services = parseIfJson(user.services);
    user.game_type_specialization = parseIfJson(user.game_type_specialization);
    user.game_design_focus = parseIfJson(user.game_design_focus);

    res.json(user);
  } catch (error) {
    console.error('Fetch /users/me error:', error);
    res.status(500).json({ error: 'Failed to fetch profile', message: 'Failed to fetch profile' });
  }
});

// PUT /users/me - Update current authenticated user profile
router.put('/me', async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Not authenticated', message: 'Not authenticated' });
    }

    const allowedFields = [
      'name', 'profile_picture', 'profile_banner', 'bio', 'location', 'website',
      'skills', 'user_roles', 'languages', 'portfolio', 'work_experience', 'education',
      'profile_visibility', 'show_in_marketplace', 'company_name', 'company_logo',
      'company_description', 'services', 'contact_email', 'contact_number',
      'company_website', 'twitter_url', 'facebook_url', 'linkedin_url',
      'instagram_url', 'youtube_url', 'year_founded', 'employee_count',
      'game_type_specialization', 'game_design_focus', 'display_name',
      'first_name', 'last_name', 'job_title', 'tagline'
    ];

    const updateDataRaw = {};
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updateDataRaw[key] = req.body[key];
      }
    }

    // Convert arrays/objects to JSON strings for storage
    const jsonFields = [
      'skills', 'user_roles', 'languages', 'portfolio', 'work_experience',
      'education', 'services', 'game_type_specialization', 'game_design_focus'
    ];

    const updateData = {};
    for (const [k, v] of Object.entries(updateDataRaw)) {
      if (jsonFields.includes(k)) {
        updateData[k] = JSON.stringify(v || []);
      } else if (typeof v === 'boolean') {
        updateData[k] = v ? 1 : 0;
      } else {
        updateData[k] = v;
      }
    }

    const fields = Object.keys(updateData);
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update', message: 'No valid fields to update' });
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(req.user.userId);

    const sql = `UPDATE users SET ${setClause}, updated_date = NOW() WHERE id = ?`;

    const result = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found', message: 'User not found' });
    }

    // Return updated user
    const updatedUsers = await db.query(
      `SELECT id, email, name, profile_picture, profile_banner, bio, location, website, skills,
              user_roles, languages, portfolio, work_experience, education,
              profile_visibility, show_in_marketplace, company_name, company_logo,
              company_description, services, contact_email, contact_number, company_website,
              twitter_url, facebook_url, linkedin_url, instagram_url, youtube_url,
              year_founded, employee_count, game_type_specialization, game_design_focus,
              display_name, first_name, last_name, job_title, tagline
       FROM users WHERE id = ?`,
      [req.user.userId]
    );

    const updatedUser = updatedUsers[0] || null;
    if (updatedUser) {
      // Parse JSON fields before returning
      const parseIfJson = (val) => {
        if (!val) return [];
        try {
          return typeof val === 'string' ? JSON.parse(val) : val;
        } catch (e) {
          return val;
        }
      };
      updatedUser.skills = parseIfJson(updatedUser.skills);
      updatedUser.user_roles = parseIfJson(updatedUser.user_roles);
      updatedUser.languages = parseIfJson(updatedUser.languages);
      updatedUser.portfolio = parseIfJson(updatedUser.portfolio);
      updatedUser.work_experience = parseIfJson(updatedUser.work_experience);
      updatedUser.education = parseIfJson(updatedUser.education);
      updatedUser.services = parseIfJson(updatedUser.services);
      updatedUser.game_type_specialization = parseIfJson(updatedUser.game_type_specialization);
      updatedUser.game_design_focus = parseIfJson(updatedUser.game_design_focus);
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update /users/me error:', error);
    res.status(500).json({ error: 'Failed to update profile', message: 'Failed to update profile' });
  }
});

module.exports = router;
