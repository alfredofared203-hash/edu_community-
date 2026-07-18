const multer = require('multer');
const fs = require('fs');


const dir = 'uploads';
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

<<<<<<< HEAD
=======
// أنواع الملفات المسموح بها (PDF / صور / فيديو)
const allowed = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'video/mp4',
  'video/webm',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];
>>>>>>> 11009bc8c152d1a6ced2bba8b1b6b8c0a515855c

module.exports = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

