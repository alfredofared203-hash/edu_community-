// Cloudinary SDK setup. لو المفاتيح مش متضبطة، الـSDK بيفضل موجود لكن مش هنستخدمه
// (upload.service بيقرر يرفع سحابي ولا محلي بناءً على env.cloudinary.enabled).
const { v2: cloudinary } = require('cloudinary');
const env = require('./env');

if (env.cloudinary.enabled) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
  console.log('☁️  Cloudinary enabled');
} else {
  console.log('💾 Cloudinary not configured — files will be stored locally in /uploads');
}

module.exports = cloudinary;
