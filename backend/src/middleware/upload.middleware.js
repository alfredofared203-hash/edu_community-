const multer = require('multer');
const fs = require('fs');


const dir = 'uploads';
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});


module.exports = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

