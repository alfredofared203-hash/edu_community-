const jwt = require('jsonwebtoken');

function socketAuth(socket, next) {
  const token =
    socket.handshake.auth?.token ||
    socket.handshake.query?.token;

  if (!token) {
    return next(new Error('يجب تسجيل الدخول أولاً'));
  }

  try {
    socket.user = jwt.verify(token, process.env.JWT_SECRET); 
    next();
  } catch (e) {
    next(new Error('توكن غير صالح أو منتهي'));
  }
}

module.exports = socketAuth;
