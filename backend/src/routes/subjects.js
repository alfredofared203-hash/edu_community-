const express = require('express');
const Subject = require('../models/Subject');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.grade) filter.grade = req.query.grade;
  const subjects = await Subject.find(filter).sort({ name: 1 });
  res.json({ subjects });
});


router.post('/', authenticate, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { name, grade, description } = req.body;
    if (!name || !grade) return res.status(400).json({ error: 'اسم المادة والصف مطلوبين' });

    const subject = await Subject.create({ name, grade, description });
    res.status(201).json({ subject });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'حصل خطأ في السيرفر' });
  }
});

module.exports = router;
