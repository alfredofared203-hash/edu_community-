const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();


function makeToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name, grade: user.grade },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}


router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, grade, schoolCode, nationalId } = req.body;

  
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'الاسم والبريد وكلمة المرور مطلوبين' });
    }


    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: 'البريد مسجّل من قبل' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'student',
      grade,
      schoolCode,
      nationalId,
    });


    res.status(201).json({ user, token: makeToken(user) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'حصل خطأ في السيرفر' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user) return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });

    res.json({ user, token: makeToken(user) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'حصل خطأ في السيرفر' });
  }
});

router.get('/me', authenticate, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' });
  res.json({ user });
});

module.exports = router;
