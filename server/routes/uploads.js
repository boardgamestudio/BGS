const express = require('express');
let multer;
try {
  multer = require('multer');
} catch (err) {
  // Multer is optional on startup — if missing, uploads will return an error instead of crashing the app.
  multer = null;
  console.warn('Optional dependency "multer" is not installed. Upload endpoint will return an error until multer is installed.');
}
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure upload directory exists (store uploads in server/assets/uploads)
const uploadDir = path.join(__dirname, '..', 'assets', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

let upload = null;

if (multer) {
  // Configure multer storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const safeName = file.originalname.replace(/\s+/g, '_');
      cb(null, `${Date.now()}_${safeName}`);
    }
  });

  upload = multer({ storage });

  // POST /uploads - accepts multipart/form-data with field "file"
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
} else {
  // Multer not installed — provide a graceful error for uploads instead of crashing the app
  router.post('/', (req, res) => {
    res.status(503).json({
      error: 'Uploads unavailable',
      message: 'File upload functionality is currently disabled because the server is missing the "multer" dependency. Install multer and restart the app to enable uploads.'
    });
  });
}

module.exports = router;
