// خدمة الرفع: ترفع على Cloudinary لو مضبوط، وإلا تخزّن محلياً في /uploads.
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const env = require('../config/env');

async function uploadFile(file) {
  if (!file) return null;

  if (env.cloudinary.enabled) {
    const isVideo = file.mimetype.startsWith('video');
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'educommunity/materials',
      resource_type: isVideo ? 'video' : 'auto',
    });
    // نحذف الملف المؤقت من القرص بعد الرفع السحابي
    fs.unlink(file.path, () => {});
    return { url: result.secure_url, provider: 'cloudinary', publicId: result.public_id };
  }

  // التخزين المحلي: الملف موجود بالفعل على القرص من multer
  return { url: `/uploads/${file.filename}`, provider: 'local', publicId: null };
}

module.exports = { uploadFile };
