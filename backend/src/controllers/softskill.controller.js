const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const service = require('../services/softskill.service');

exports.list = asyncHandler(async (req, res) => {
  const skills = await service.list();

  // لو الطالب: أضف درجته لكل مهارة
  if (req.user.role === 'student') {
    const withGrades = await Promise.all(
      skills.map(async (s) => {
        const grade = await service.myGrade({ skillId: s.id, userId: req.user.id });
        return { ...s.toJSON(), myGrade: grade };
      })
    );
    return sendSuccess(res, { data: { skills: withGrades } });
  }

  sendSuccess(res, { data: { skills } });
});

exports.create = asyncHandler(async (req, res) => {
  const skill = await service.create({ body: req.body, userId: req.user.id });
  sendSuccess(res, { statusCode: 201, message: 'تم إنشاء المهارة', data: { skill } });
});

exports.getSubmissions = asyncHandler(async (req, res) => {
  const submissions = await service.getSubmissions(req.params.skillId);
  const formatted = submissions.map((s) => ({
    id: s.id,
    studentName: s.student?.name,
    studentEmail: s.student?.email,
    fileUrl: s.fileUrl,
    grade: s.grade,
    feedback: s.feedback,
    submittedAt: s.createdAt,
  }));
  sendSuccess(res, { data: { submissions: formatted } });
});

exports.submit = asyncHandler(async (req, res) => {
  const submission = await service.submit({
    skillId: req.params.skillId,
    userId: req.user.id,
    file: req.file,
  });
  sendSuccess(res, { statusCode: 201, message: 'تم رفع البريزنتيشن', data: { submission } });
});

exports.grade = asyncHandler(async (req, res) => {
  const { grade, feedback } = req.body;
  const submission = await service.grade({
    submissionId: req.params.submissionId,
    grade: Number(grade),
    feedback,
    teacherId: req.user.id,
  });
  sendSuccess(res, { message: 'تم حفظ الدرجة', data: { submission } });
});
