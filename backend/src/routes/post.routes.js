// routes/post.routes.js
const router = require('express').Router();
const postController = require('../controllers/post.controller');
const { authenticate } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/', postController.getPosts);
router.post('/', authenticate, upload.single('file'), postController.createPost);
router.post('/:id/like', authenticate, postController.likePost);
router.get('/:id/comments', postController.getComments); // تحتاج لإنشاء دالة getComments في الـ Controller
router.post('/:id/comments', authenticate, postController.addComment);

module.exports = router;