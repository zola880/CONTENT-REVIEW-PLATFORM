const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AppError = require('../utils/AppError');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'file-' + uniqueSuffix + ext);
  },
});

// File filter – only allow text-based files
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'text/plain',           // .txt
    'text/markdown',        // .md
    'text/csv',             // .csv
    'application/json',     // .json
    'application/pdf',      // .pdf
    'application/msword',   // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  ];

  // Also allow by extension for cases where MIME type is not standard
  const allowedExtensions = ['.txt', '.md', '.csv', '.json', '.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new AppError(`File type not allowed. Allowed: ${allowedExtensions.join(', ')}`, 400), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter,
});

module.exports = upload;