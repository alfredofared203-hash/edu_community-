const jwt = require('jsonwebtoken');


function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'يجب تسجيل الدخول أولاً' });
  }
  try {
    const token = header.split(' ')[1];          
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();                                       
  } catch (e) {
    res.status(401).json({ error: 'توكن غير صالح أو منتهي' });
  }
}
function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'لا تملك صلاحية لهذا الإجراء' });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
