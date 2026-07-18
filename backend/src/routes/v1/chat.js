const router = require('express').Router();
const { authenticate } = require('../../middleware/auth.middleware');
const { getMessageHistory } = require('../../controllers/chat/chat.controller');


router.get('/messages', authenticate, getMessageHistory);

module.exports = router;
