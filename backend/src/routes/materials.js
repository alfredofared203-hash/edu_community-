const express = require('express');
const Material = require('../models/Material');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const { grade, subject, type, search, isNextGrade } = req.query;

   
    const filter = {};
    if (grade) filter.grade = grade;
    if (subject) filter.subject = subject;
    if (type) filter.type = type;
    if (isNextGrade === 'true') filter.isNextGrade = true;
    if (search) filter.title = { $regex: search, $options: 'i' }; 

  
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const materials = await Material.find(filter)
      .populate('subject', 'name grade')     
      .populate('uploadedBy', 'name role')   
      .sort({ createdAt: -1 })              
      .skip(skip)
      .limit(limit);

    const total = await Material.countDocuments(filter);

    res.json({
      materials,
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
        hasNextPage: page * limit < total,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'حصل خطأ في السيرفر' });
  }
});


router.get('/:id', async (req, res) => {
  const material = await Material.findById(req.params.id)
    .populate('subject', 'name grade')
    .populate('uploadedBy', 'name role');
  if (!material) return res.status(404).json({ error: 'المادة غير موجودة' });
  res.json({ material });
});


router.post('/', authenticate, authorize('teacher', 'admin'), upload.single('file'), async (req, res) => {
  try {
    const { title, description, subject, grade, type, isNextGrade, fileUrl } = req.body;

    if (!title || !subject || !grade || !type) {
      return res.status(400).json({ error: 'العنوان والمادة والصف والنوع مطلوبين' });
    }


    let finalUrl = fileUrl;
    if (req.file) finalUrl = '/uploads/' + req.file.filename;
    if (!finalUrl) return res.status(400).json({ error: 'ارفع ملفاً أو أدخل رابطاً' });

    const material = await Material.create({
      title,
      description,
      subject,
      grade,
      type,
      fileUrl: finalUrl,
      isNextGrade: isNextGrade === 'true' || isNextGrade === true,
      uploadedBy: req.user.id,
    });

    res.status(201).json({ material });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'حصل خطأ في السيرفر' });
  }
});


router.delete('/:id', authenticate, authorize('teacher', 'admin'), async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) return res.status(404).json({ error: 'المادة غير موجودة' });

  if (req.user.role !== 'admin' && String(material.uploadedBy) !== req.user.id) {
    return res.status(403).json({ error: 'لا يمكنك حذف مادة لم ترفعها' });
  }

  await material.deleteOne();
  res.json({ message: 'تم حذف المادة' });
});

module.exports = router;
