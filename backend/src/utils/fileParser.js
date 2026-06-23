const fs = require('fs');
const path = require('path');
const AppError = require('./AppError');

/**
 * Extract text content from an uploaded file
 * @param {Object} file - Multer file object
 * @returns {Promise<string>} Extracted text content
 */
const extractTextFromFile = async (file) => {
  const filePath = file.path;
  const extension = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  try {
    // --- Plain text files ---
    if (mimetype === 'text/plain' || extension === '.txt') {
      return fs.readFileSync(filePath, 'utf8');
    }

    // --- Markdown files ---
    if (mimetype === 'text/markdown' || extension === '.md') {
      return fs.readFileSync(filePath, 'utf8');
    }

    // --- CSV files ---
    if (mimetype === 'text/csv' || extension === '.csv') {
      const content = fs.readFileSync(filePath, 'utf8');
      // Return CSV as text; the feedback service can analyze it
      return content;
    }

    // --- JSON files ---
    if (mimetype === 'application/json' || extension === '.json') {
      const content = fs.readFileSync(filePath, 'utf8');
      try {
        const parsed = JSON.parse(content);
        // Pretty print JSON for better readability
        return JSON.stringify(parsed, null, 2);
      } catch (parseError) {
        throw new AppError('Invalid JSON file format', 400);
      }
    }

    // --- PDF files ---
    if (mimetype === 'application/pdf' || extension === '.pdf') {
      try {
        const pdfParse = require('pdf-parse');
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text;
      } catch (pdfError) {
        throw new AppError(`Failed to parse PDF: ${pdfError.message}`, 400);
      }
    }

    // --- Word documents (.docx) ---
    if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      extension === '.docx'
    ) {
      try {
        const mammoth = require('mammoth');
        const dataBuffer = fs.readFileSync(filePath);
        const result = await mammoth.extractRawText({ buffer: dataBuffer });
        return result.value;
      } catch (docxError) {
        throw new AppError(`Failed to parse DOCX: ${docxError.message}`, 400);
      }
    }

    // --- Word documents (.doc) - legacy format ---
    if (mimetype === 'application/msword' || extension === '.doc') {
      // Note: .doc parsing is complex; we'll try to read as text
      // For production, consider using a library like 'textract'
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        // Remove null bytes and control characters
        return content.replace(/\0/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
      } catch (docError) {
        throw new AppError('Failed to extract text from .doc file. Please convert to .docx or .txt.', 400);
      }
    }

    // --- Unsupported file type ---
    throw new AppError(
      `Unsupported file type: ${extension || mimetype}. Allowed: .txt, .md, .csv, .json, .pdf, .doc, .docx`,
      400
    );

  } catch (error) {
    // Clean up file if extraction fails
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanupError) {
      // Ignore cleanup errors
    }
    throw error;
  }
};

module.exports = { extractTextFromFile };