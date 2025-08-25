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
  console.log(`[DEBUG] GET /projects/:id route hit.`);
  try {
    const { id } = req.params;
    console.log(`[DEBUG] Attempting to fetch project with ID: ${id}`);
    
    const sql = `
      SELECT p.*, u.name as author_name, u.email as created_by_email 
      FROM projects p 
      LEFT JOIN users u ON p.created_by = u.id 
      WHERE p.id = ?
    `;
    
    const projects = await db.query(sql, [id]);
    console.log(`[DEBUG] Database query returned ${projects.length} results.`);
    
    if (projects.length === 0) {
      console.log(`[DEBUG] Project with ID ${id} not found. Returning 404.`);
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const project = {
      ...projects[0],
      tags: projects[0].tags ? JSON.parse(projects[0].tags) : [],
      created_by: projects[0].created_by_email
    };
    
    console.log(`[DEBUG] Sending project data for ID: ${id}`);
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

// PUT /api/projects/:id - Update existing project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated
    delete updateData.id;
    delete updateData.created_date;
    delete updateData.updated_date;
    delete updateData.created_by_email;
    delete updateData.author_name;
    
    // Convert tags to JSON if provided
    if (updateData.tags) {
      updateData.tags = JSON.stringify(updateData.tags);
    }
    
    // Build dynamic SQL update query
    const fields = Object.keys(updateData);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = Object.values(updateData);
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    const sql = `UPDATE projects SET ${setClause}, updated_date = NOW() WHERE id = ?`;
    values.push(id);
    
    const result = await db.query(sql, values);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Project updated successfully' 
    });
  } catch (error) {
    console.error('Project update error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

module.exports = router;
