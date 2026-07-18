const router = require('express').Router();
const leaderboardController = require('../controllers/leaderboard.controller');

router.get('/', leaderboardController.getStudentLeaderboard);
router.get('/schools', leaderboardController.getSchoolLeaderboard);

module.exports = router;