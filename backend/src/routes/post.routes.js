const router = require('express').Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { authenticate } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');


router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'name role')
      .sort({ createdAt: -1 })
      .limit(50);
    
    const formattedPosts = await Promise.all(posts.map(async (p) => {
      const commentsCount = await Comment.countDocuments({ postId: p._id });
      return {
        id: p._id,
        user_id: p.userId ? p.userId._id : null,
        author_name: p.userId ? p.userId.name : 'مستخدم مجهول',
        author_role: p.userId ? p.userId.role : 'student',
        content: p.content,
        subject: p.subject,
        file_url: p.fileUrl,
        likes: p.likes.length,
        liked_by: p.likes,
        comments: commentsCount,
        created_at: p.createdAt,
      };
    }));
    
    res.json({ posts: formattedPosts });
  } catch (e) { next(e); }
});


router.post('/', authenticate, upload.single('file'), async (req, res, next) => {
  try {
    const { content, subject } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const postDoc = await Post.create({
      userId: req.user.id,
      content,
      subject: subject || null,
      fileUrl,
    });

    const populated = await postDoc.populate('userId', 'name role');

    const post = {
      id: populated._id,
      user_id: populated.userId ? populated.userId._id : null,
      author_name: populated.userId ? populated.userId.name : req.user.name,
      author_role: populated.userId ? populated.userId.role : req.user.role,
      content: populated.content,
      subject: populated.subject,
      file_url: populated.fileUrl,
      likes: 0,
      liked_by: [],
      comments: 0,
      created_at: populated.createdAt,
    };

    res.status(201).json({ post });
  } catch (e) { next(e); }
});


router.post('/:id/like', authenticate, async (req, res, next) => {
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
});


router.get('/:id/comments', async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.id })
      .populate('userId', 'name role')
      .sort({ createdAt: 1 });

    const formatted = comments.map(c => ({
      id: c._id,
      post_id: c.postId,
      user_id: c.userId ? c.userId._id : null,
      author_name: c.userId ? c.userId.name : 'مستخدم مجهول',
      author_role: c.userId ? c.userId.role : 'student',
      content: c.content,
      created_at: c.createdAt,
    }));
    res.json({ comments: formatted });
  } catch (e) { next(e); }
});


router.post('/:id/comments', authenticate, async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'التعليق فارغ' });

    const commentDoc = await Comment.create({
      postId: req.params.id,
      userId: req.user.id,
      content,
    });

    const comment = {
      id: commentDoc._id,
      post_id: commentDoc.postId,
      user_id: commentDoc.userId,
      author_name: req.user.name,
      content: commentDoc.content,
      created_at: commentDoc.createdAt,
    };

    res.status(201).json({ comment });
  } catch (e) { next(e); }
});

module.exports = router;
