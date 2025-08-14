const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/jobs - List all jobs
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const sort = req.query.sort || '-created_date';
    
    let orderBy = 'ORDER BY j.created_date DESC';
    if (sort === 'created_date') {
      orderBy = 'ORDER BY j.created_date ASC';
    }
    
    const sql = `
      SELECT j.*, u.name as poster_name, u.email as posted_by_email 
      FROM jobs j 
      LEFT JOIN users u ON j.posted_by = u.id 
      WHERE j.status = 'active' 
      ${orderBy} 
      LIMIT ?
    `;
    
    const jobs = await db.query(sql, [limit]);
    res.json(jobs);
  } catch (error) {
    console.error('Jobs list error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// POST /api/jobs - Create new job
router.post('/', async (req, res) => {
  try {
    const { title, description, company, location, type, salary_range, requirements, posted_by } = req.body;
    
    const sql = `
      INSERT INTO jobs (title, description, company, location, type, salary_range, requirements, posted_by, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `;
    
    const result = await db.query(sql, [
      title, description, company, location, type, salary_range, requirements, posted_by
    ]);
    
    res.status(201).json({ 
      success: true, 
      id: result.insertId 
    });
  } catch (error) {
    console.error('Job creation error:', error);
    res.status(500).json({ error: 'Failed to create job posting' });
  }
});

module.exports = router;
