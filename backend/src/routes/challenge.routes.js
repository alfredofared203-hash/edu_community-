const router = require('express').Router();
const challengeController = require('../controllers/challenge.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', challengeController.getChallenges);
router.get('/submissions', authenticate, challengeController.getSubmissions);
router.post('/:id/submit', authenticate, challengeController.submitChallenge);

module.exports = router;