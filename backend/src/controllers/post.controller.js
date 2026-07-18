// controllers/post.controller.js
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { formatPost, formatComment } = require('../utils/formatters');

// جلب جميع المنشورات
exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find()
            .populate('userId', 'name role')
            .sort({ createdAt: -1 })
            .limit(50);

        const formattedPosts = await Promise.all(posts.map(async (p) => {
            const count = await Comment.countDocuments({ postId: p._id });
            return formatPost(p, count);
        }));

        res.json({ posts: formattedPosts });
    } catch (e) { next(e); }
};

// إنشاء منشور جديد
exports.createPost = async (req, res, next) => {
    try {
        const postDoc = await Post.create({
            userId: req.user.id,
            content: req.body.content,
            subject: req.body.subject || null,
            fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
        });

        const populated = await postDoc.populate('userId', 'name role');
        res.status(201).json({ post: formatPost(populated) });
    } catch (e) { next(e); }
};

// الإعجاب / إلغاء الإعجاب بمنشور
exports.likePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'المنشور غير موجود' });

        const index = post.likes.indexOf(req.user.id);
        if (index > -1) {
            post.likes.splice(index, 1); // Unlike
        } else {
            post.likes.push(req.user.id); // Like
        }
        await post.save();
        res.json({ ok: true, likes: post.likes.length, liked: index === -1 });
    } catch (e) { next(e); }
};

// جلب التعليقات لمنشور معين
exports.getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ postId: req.params.id })
            .populate('userId', 'name role')
            .sort({ createdAt: 1 });

        res.json({ comments: comments.map(formatComment) });
    } catch (e) { next(e); }
};

// إضافة تعليق على منشور
exports.addComment = async (req, res, next) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ error: 'التعليق فارغ' });

        const commentDoc = await Comment.create({
            postId: req.params.id,
            userId: req.user.id,
            content,
        });

        const populated = await commentDoc.populate('userId', 'name role');
        res.status(201).json({ comment: formatComment(populated) });
    } catch (e) { next(e); }
};