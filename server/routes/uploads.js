const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure upload directory exists (store uploads in server/assets/uploads)
const uploadDir = path.join(__dirname, '..', 'assets', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Preserve original name but prefix with timestamp to avoid collisions
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}_${safeName}`);
  }
});

const upload = multer({ storage });

// POST /upload - accepts multipart/form-data with field "file"
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded', message: 'No file uploaded' });
    }

    // Build public URL for the uploaded file
    const host = process.env.FRONTEND_URL || `https://boardgamestudio.com`;
    // Files are stored under server/assets/uploads -> served as /assets/uploads/filename
    const fileUrl = `${host}/assets/uploads/${req.file.filename}`;

    res.json({
      success: true,
      file_url: fileUrl
    });
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ error: 'Upload failed', message: 'Upload failed' });
  }
});

module.exports = router;
