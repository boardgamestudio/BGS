const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/design-diaries - List design diaries
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const published = req.query.published !== 'false'; // Default to true
    
    let whereClause = '';
    if (published) {
      whereClause = 'WHERE dd.is_published = 1';
    }
    
    const sql = `
      SELECT dd.*, u.name as author_name, u.email as author_email 
      FROM design_diaries dd 
      LEFT JOIN users u ON dd.author_id = u.id 
      ${whereClause}
      ORDER BY dd.created_date DESC 
      LIMIT ?
    `;
    
    const diaries = await db.query(sql, [limit]);
    
    // Parse JSON fields
    const formattedDiaries = diaries.map(diary => ({
      ...diary,
      tags: diary.tags ? JSON.parse(diary.tags) : []
    }));
    
    res.json(formattedDiaries);
  } catch (error) {
    console.error('Design diaries list error:', error);
    res.status(500).json({ error: 'Failed to fetch design diaries' });
  }
});

// POST /api/design-diaries - Create new design diary
router.post('/', async (req, res) => {
  try {
    const { title, content, author_id, is_published, featured, tags } = req.body;
    
    const sql = `
      INSERT INTO design_diaries (title, content, author_id, is_published, featured, tags) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const result = await db.query(sql, [
      title, content, author_id, is_published || false, featured || false, JSON.stringify(tags || [])
    ]);
    
    res.status(201).json({ 
      success: true, 
      id: result.insertId 
    });
  } catch (error) {
    console.error('Design diary creation error:', error);
    res.status(500).json({ error: 'Failed to create design diary' });
  }
});

module.exports = router;
