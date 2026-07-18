const { getMessages } = require('../../services/chat/chat.service');


async function getMessageHistory(req, res) {
  const { grade, page = 1, limit = 20 } = req.query;

  if (!grade) {
    return res.status(400).json({ error: 'يجب تحديد الصف الدراسي' });
  }

  try {
    const result = await getMessages({
      grade,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result); 
  } catch (e) {
    console.error('خطأ في جلب سجل الرسائل:', e.message);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الرسائل' });
  }
}

module.exports = { getMessageHistory };
