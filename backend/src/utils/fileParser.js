const fs = require('fs');
const path = require('path');
const AppError = require('./AppError');

// Try to load pdf-parse with different import styles
let pdfParse;
let pdfParseLoaded = false;

try {
  // Try CommonJS require (most common)
  const loaded = require('pdf-parse');
  // Check if it's a function or object with default
  if (typeof loaded === 'function') {
    pdfParse = loaded;
    pdfParseLoaded = true;
  } else if (loaded && typeof loaded.default === 'function') {
    pdfParse = loaded.default;
    pdfParseLoaded = true;
  } else if (loaded && typeof loaded.parse === 'function') {
    pdfParse = loaded.parse;
    pdfParseLoaded = true;
  } else {
    console.warn('pdf-parse loaded but not in expected format:', typeof loaded);
  }
} catch (e) {
  console.warn('pdf-parse not available:', e.message);
}

// Try to load mammoth
let mammoth;
let mammothLoaded = false;
try {
  const loaded = require('mammoth');
  if (loaded && typeof loaded.extractRawText === 'function') {
    mammoth = loaded;
    mammothLoaded = true;
  } else {
    mammoth = require('mammoth');
    mammothLoaded = true;
  }
} catch (e) {
  console.warn('mammoth not available:', e.message);
}

// Fallback PDF text extraction: try to read as plain text
const extractTextFromPDFFallback = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Remove null bytes, control characters, and PDF-specific markers
    let cleaned = content
      .replace(/\0/g, '')
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
      .replace(/<[^>]*>/g, '') // Remove HTML-like tags
      .replace(/[^\x20-\x7E\x0A\x0D]/g, '') // Keep only printable ASCII
      .split('\n')
      .filter(line => line.trim().length > 0 && !line.match(/^%PDF|^\/|^endobj|^stream|^endstream|^xref|^trailer|^startxref/))
      .join('\n');
    
    if (cleaned.trim().length > 0) {
      return cleaned;
    }
    return null;
  } catch (e) {
    return null;
  }
};

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
      return content;
    }

    // --- JSON files ---
    if (mimetype === 'application/json' || extension === '.json') {
      const content = fs.readFileSync(filePath, 'utf8');
      try {
        const parsed = JSON.parse(content);
        return JSON.stringify(parsed, null, 2);
      } catch (parseError) {
        throw new AppError('Invalid JSON file format', 400);
      }
    }

    // --- PDF files ---
    if (mimetype === 'application/pdf' || extension === '.pdf') {
      // Try with pdf-parse if available
      if (pdfParseLoaded) {
        try {
          const dataBuffer = fs.readFileSync(filePath);
          const data = await pdfParse(dataBuffer);
          if (data && data.text && data.text.trim().length > 0) {
            return data.text;
          }
        } catch (pdfError) {
          console.warn('pdf-parse failed, trying fallback:', pdfError.message);
        }
      }

      // Fallback: try to extract text directly
      const fallbackText = extractTextFromPDFFallback(filePath);
      if (fallbackText && fallbackText.trim().length > 0) {
        return fallbackText;
      }

      throw new AppError(
        'Could not extract text from PDF. Please ensure the PDF contains selectable text (not scanned images) or convert to .txt file.',
        400
      );
    }

    // --- Word documents (.docx) ---
    if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      extension === '.docx'
    ) {
      if (!mammothLoaded) {
        throw new AppError('DOCX parsing is not available. Please install mammoth: npm install mammoth', 400);
      }
      try {
        const dataBuffer = fs.readFileSync(filePath);
        const result = await mammoth.extractRawText({ buffer: dataBuffer });
        if (result.value && result.value.trim().length > 0) {
          return result.value;
        }
        throw new AppError('DOCX file appears to be empty or corrupted', 400);
      } catch (docxError) {
        throw new AppError(`Failed to parse DOCX: ${docxError.message}`, 400);
      }
    }

    // --- Word documents (.doc) - legacy format ---
    if (mimetype === 'application/msword' || extension === '.doc') {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const cleaned = content.replace(/\0/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
        if (cleaned.trim()) {
          return cleaned;
        }
        throw new AppError('Could not extract text from .doc file. Please convert to .docx or .txt.', 400);
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