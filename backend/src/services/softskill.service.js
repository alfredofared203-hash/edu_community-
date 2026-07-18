const path = require('path');
const SoftSkill = require('../models/SoftSkill');
const SoftSkillSubmission = require('../models/SoftSkillSubmission');
const ApiError = require('../utils/ApiError');

const list = async () => SoftSkill.find().sort({ createdAt: -1 });

const create = async ({ body, userId }) => {
  return SoftSkill.create({ ...body, createdBy: userId });
};

const getSubmissions = async (skillId) => {
  const skill = await SoftSkill.findById(skillId);
  if (!skill) throw ApiError.notFound('المهارة غير موجودة');
  return SoftSkillSubmission.find({ skill: skillId })
    .populate('student', 'name email')
    .sort({ createdAt: -1 });
};

const submit = async ({ skillId, userId, file }) => {
  if (!file) throw ApiError.badRequest('يرجى رفع ملف البريزنتيشن');
  const skill = await SoftSkill.findById(skillId);
  if (!skill) throw ApiError.notFound('المهارة غير موجودة');

  // استبدال التسليم السابق إن وُجد
  const existing = await SoftSkillSubmission.findOne({ skill: skillId, student: userId });
  const fileUrl = `/uploads/${file.filename}`;

  if (existing) {
    existing.fileUrl = fileUrl;
    existing.grade = null;
    existing.feedback = '';
    existing.gradedBy = null;
    return existing.save();
  }
  return SoftSkillSubmission.create({ skill: skillId, student: userId, fileUrl });
};

const grade = async ({ submissionId, grade, feedback, teacherId }) => {
  const sub = await SoftSkillSubmission.findById(submissionId);
  if (!sub) throw ApiError.notFound('التسليم غير موجود');
  sub.grade = grade;
  sub.feedback = feedback ?? '';
  sub.gradedBy = teacherId;
  return sub.save();
};

// درجة الطالب في مهارة معينة
const myGrade = async ({ skillId, userId }) => {
  const sub = await SoftSkillSubmission.findOne({ skill: skillId, student: userId });
  return sub ? sub.grade : null;
};

module.exports = { list, create, getSubmissions, submit, grade, myGrade };
