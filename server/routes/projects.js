const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/projects - List all projects
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const sort = req.query.sort || '-created_date';
    
    let orderBy = 'ORDER BY p.created_date DESC';
    if (sort === 'created_date') {
      orderBy = 'ORDER BY p.created_date ASC';
    }
    
    const sql = `
      SELECT p.*, u.name as author_name, u.email as created_by_email 
      FROM projects p 
      LEFT JOIN users u ON p.created_by = u.id 
      WHERE p.status = 'published' 
      ${orderBy} 
      LIMIT ?
    `;
    
    const projects = await db.query(sql, [limit]);
    
    // Parse JSON fields and format response
    const formattedProjects = projects.map(project => ({
      ...project,
      tags: project.tags ? JSON.parse(project.tags) : [],
      created_by: project.created_by_email
    }));
    
    res.json(formattedProjects);
  } catch (error) {
    console.error('Projects list error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id - Get single project
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const sql = `
      SELECT p.*, u.name as author_name, u.email as created_by_email 
      FROM projects p 
      LEFT JOIN users u ON p.created_by = u.id 
      WHERE p.id = ?
    `;
    
    const projects = await db.query(sql, [id]);
    
    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const project = {
      ...projects[0],
      tags: projects[0].tags ? JSON.parse(projects[0].tags) : [],
      created_by: projects[0].created_by_email
    };
    
    res.json(project);
  } catch (error) {
    console.error('Project get error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST /api/projects - Create new project
router.post('/', async (req, res) => {
  try {
    const { title, description, content, image_url, tags, created_by } = req.body;
    
    const sql = `
      INSERT INTO projects (title, description, content, image_url, tags, created_by, status) 
      VALUES (?, ?, ?, ?, ?, ?, 'published')
    `;
    
    const result = await db.query(sql, [
      title, 
      description, 
      content, 
      image_url, 
      JSON.stringify(tags || []), 
      created_by
    ]);
    
    res.status(201).json({ 
      success: true, 
      id: result.insertId 
    });
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

module.exports = router;
