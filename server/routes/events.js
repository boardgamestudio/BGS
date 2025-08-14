const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/events - List all events
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const sort = req.query.sort || '-created_date';
    
    let orderBy = 'ORDER BY e.created_date DESC';
    if (sort === 'created_date') {
      orderBy = 'ORDER BY e.created_date ASC';
    }
    
    const sql = `
      SELECT e.*, u.name as organizer_name, u.email as created_by_email 
      FROM events e 
      LEFT JOIN users u ON e.created_by = u.id 
      ${orderBy} 
      LIMIT ?
    `;
    
    const events = await db.query(sql, [limit]);
    res.json(events);
  } catch (error) {
    console.error('Events list error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// POST /api/events - Create new event
router.post('/', async (req, res) => {
  try {
    const { title, description, date, time, location, event_type, max_participants, registration_required, created_by } = req.body;
    
    const sql = `
      INSERT INTO events (title, description, date, time, location, event_type, max_participants, registration_required, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await db.query(sql, [
      title, description, date, time, location, event_type, max_participants, registration_required, created_by
    ]);
    
    res.status(201).json({ 
      success: true, 
      id: result.insertId 
    });
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

module.exports = router;
