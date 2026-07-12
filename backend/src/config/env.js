// Centralized, validated environment configuration.
// كل متغيرات البيئة في مكان واحد بدل ما تكون متناثرة في الكود.
require('dotenv').config();

const env = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/educommunity',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:8080',

  jwt: {
    accessSecret: process.env.JWT_SECRET || 'dev_access_secret_change_me',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me',
    accessExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    // لو الثلاثة موجودين نرفع على Cloudinary، غير كده نخزّن محلياً في /uploads
    get enabled() {
      return Boolean(this.cloudName && this.apiKey && this.apiSecret);
    },
  },

  maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024,
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
};

module.exports = env;
