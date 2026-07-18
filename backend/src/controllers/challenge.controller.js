const Challenge = require('../models/Challenge');
const ChallengeSubmission = require('../models/ChallengeSubmission');
const User = require('../models/User');

exports.getChallenges = async (req, res, next) => {
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
};

exports.getSubmissions = async (req, res, next) => {
    try {
        const subs = await ChallengeSubmission.find({ userId: req.user.id });
        res.json({ submissions: subs });
    } catch (e) { next(e); }
};

exports.submitChallenge = async (req, res, next) => {
    try {
        const { answer } = req.body;
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) return res.status(404).json({ error: 'التحدي غير موجود' });

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

        await User.findByIdAndUpdate(req.user.id, { $inc: { points: challenge.points } });

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
};