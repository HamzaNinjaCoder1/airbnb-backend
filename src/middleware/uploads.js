import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadsDir = path.resolve('uploads');

if (!fs.existsSync(uploadsDir)) {
    try {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log('[multer] Created uploads directory at', uploadsDir);
    } catch (err) {
        console.error('[multer] Failed to create uploads directory', err);
    }
}

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, uploadsDir);
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif', '.bmp'];
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (!allowed.includes(ext)) {
        return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024, 
        files: 10
    }
});