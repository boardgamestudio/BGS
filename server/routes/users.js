const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/users - List all users
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
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST /api/users - Create new user
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
    res.status(500).json({ error: 'Failed to create user' });
  }
});

module.exports = router;
