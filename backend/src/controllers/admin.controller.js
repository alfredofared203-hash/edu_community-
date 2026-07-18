const User = require('../models/User');
const Post = require('../models/Post');
const Challenge = require('../models/Challenge');

exports.getSystemStats = async (req, res, next) => {
    try {
        const usersByRoleAgg = await User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]);
        const usersByRole = usersByRoleAgg.map(u => ({ role: u._id, count: String(u.count) }));
        const totalPosts = await Post.countDocuments();
        const activeChallenges = await Challenge.countDocuments({ active: true });

        res.json({ usersByRole, totalPosts, activeChallenges });
    } catch (e) { next(e); }
};

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('name email role grade points createdAt').sort({ createdAt: -1 }).limit(200);
        res.json({ users: users.map(u => ({
            id: u._id, name: u.name, email: u.email, role: u.role, 
            grade: u.grade, points: u.points, created_at: u.createdAt 
        }))});
    } catch (e) { next(e); }
};

exports.deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ ok: true });
    } catch (e) { next(e); }
};