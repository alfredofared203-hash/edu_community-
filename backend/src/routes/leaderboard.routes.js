const router = require('express').Router();
const User = require('../models/User');

// Get top students leaderboard
router.get('/', async (req, res, next) => {
  try {
    const { grade } = req.query;
    const filter = { role: 'student' };
    if (grade) {
      filter.grade = grade;
    }

    const students = await User.find(filter)
      .select('name grade points badges')
      .sort({ points: -1 })
      .limit(100);

    const formatted = students.map(s => ({
      id: s._id,
      name: s.name,
      grade: s.grade,
      points: s.points,
      badges: s.badges,
    }));

    res.json({ leaderboard: formatted });
  } catch (e) { next(e); }
});

// Get top schools leaderboard
router.get('/schools', async (req, res, next) => {
  try {
    const schools = await User.aggregate([
      {
        $match: {
          role: 'student',
          schoolCode: { $ne: null, $exists: true, $ne: "" },
        },
      },
      {
        $group: {
          _id: '$schoolCode',
          students: { $sum: 1 },
          total_points: { $sum: '$points' },
        },
      },
      {
        $sort: { total_points: -1 },
      },
      {
        $limit: 50,
      },
    ]);

    const formatted = schools.map(s => ({
      school_code: s._id,
      students: s.students,
      total_points: s.total_points,
    }));

    res.json({ schools: formatted });
  } catch (e) { next(e); }
});

module.exports = router;
