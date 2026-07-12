const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Challenge = require('../models/Challenge');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.use(authenticate, authorize('admin'));

// Get system statistics for admin dashboard
router.get('/stats', async (req, res, next) => {
  try {
    const usersByRoleAgg = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);
    
    const usersByRole = usersByRoleAgg.map(u => ({
      role: u._id,
      count: String(u.count),
    }));

    const totalPosts = await Post.countDocuments();
    const activeChallenges = await Challenge.countDocuments({ active: true });

    res.json({
      usersByRole,
      totalPosts,
      activeChallenges,
    });
  } catch (e) { next(e); }
});

// List users for admin dashboard
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find()
      .select('name email role grade points createdAt')
      .sort({ createdAt: -1 })
      .limit(200);

    const formatted = users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      grade: u.grade,
      points: u.points,
      created_at: u.createdAt,
    }));

    res.json({ users: formatted });
  } catch (e) { next(e); }
});

// Delete a user
router.delete('/users/:id', async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
