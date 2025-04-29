import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create the uploads directory if it doesn't exist
const imagesDir = path.join(process.cwd(), 'public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `template-${uniqueSuffix}${ext}`);
  },
});

// File filter to only accept images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// Create the multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});

// Handle the upload request
export async function handleUpload(req: Request, res: Response) {
  try {
    // Use multer single file upload
    upload.single('file')(req, res, (err) => {
      if (err) {
        console.error('Upload error:', err);
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
          }
          return res.status(400).json({ message: `Upload error: ${err.message}` });
        }
        return res.status(400).json({ message: err.message });
      }

      // Get the uploaded file
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Return the file path relative to the public directory
      const relativePath = `/images/${file.filename}`;
      res.status(200).json({
        message: 'File uploaded successfully',
        filePath: relativePath,
        fileName: file.filename,
        fileSize: file.size,
      });
    });
  } catch (error: any) {
    console.error('Unexpected upload error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
}