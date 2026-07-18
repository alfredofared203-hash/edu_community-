// utils/formatters.js

exports.formatPost = (p, commentsCount = 0) => ({
    id: p._id,
    user_id: p.userId ? p.userId._id : null,
    author_name: p.userId ? p.userId.name : 'مستخدم مجهول',
    author_role: p.userId ? p.userId.role : 'student',
    content: p.content,
    subject: p.subject,
    file_url: p.fileUrl,
    likes: p.likes ? p.likes.length : 0,
    liked_by: p.likes || [],
    comments: commentsCount,
    created_at: p.createdAt,
});

exports.formatComment = (c) => ({
    id: c._id,
    post_id: c.postId,
    user_id: c.userId ? c.userId._id : null,
    author_name: c.userId ? c.userId.name : 'مستخدم مجهول',
    author_role: c.userId ? c.userId.role : 'student',
    content: c.content,
    created_at: c.createdAt,
});