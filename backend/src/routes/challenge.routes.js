const router = require('express').Router();
const Challenge = require('../models/Challenge');
const ChallengeSubmission = require('../models/ChallengeSubmission');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth.middleware');

// Get all active challenges
router.get('/', async (req, res, next) => {
  try {
    const challenges = await Challenge.find({ active: true }).sort({ endDate: 1 });
    const formatted = challenges.map(ch => ({
      id: ch._id,
      title: ch.title,
      description: ch.description,
      subject: ch.subject,
      grade: ch.grade,
      points: ch.points,
      start_date: ch.startDate,
      end_date: ch.endDate,
      active: ch.active,
    }));
    res.json({ challenges: formatted });
  } catch (e) { next(e); }
});

// Get submissions of the logged-in user
router.get('/submissions', authenticate, async (req, res, next) => {
  try {
    const subs = await ChallengeSubmission.find({ userId: req.user.id });
    res.json({ submissions: subs });
  } catch (e) { next(e); }
});

// Submit answer to a challenge
router.post('/:id/submit', authenticate, async (req, res, next) => {
  try {
    const { answer } = req.body;
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ error: 'التحدي غير موجود' });

    // Check duplicate submissions
    const duplicate = await ChallengeSubmission.findOne({
      challengeId: challenge._id,
      userId: req.user.id,
    });
    if (duplicate) return res.status(400).json({ error: 'لقد قمت بحل هذا التحدي مسبقاً' });

    const submissionDoc = await ChallengeSubmission.create({
      challengeId: challenge._id,
      userId: req.user.id,
      answer,
    });

    // Increment points
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { points: challenge.points },
    });

    res.status(201).json({
      submission: {
        id: submissionDoc._id,
        challenge_id: submissionDoc.challengeId,
        user_id: submissionDoc.userId,
        answer: submissionDoc.answer,
        submitted_at: submissionDoc.submittedAt,
      },
    });
  } catch (e) { next(e); }
});

module.exports = router;
