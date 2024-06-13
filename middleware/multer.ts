import multer from 'multer';

class MulterConfig {
  storage = multer.memoryStorage(); // Store files in memory

  multerConfig = multer({
    storage: this.storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
      } else {
        cb(new Error('Only JPEG, PNG files are allowed.'));
      }
    },
  }).single('image');
}

export default new MulterConfig().multerConfig;
