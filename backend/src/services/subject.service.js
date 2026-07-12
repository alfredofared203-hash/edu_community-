const Subject = require('../models/Subject');
const ApiError = require('../utils/ApiError');

const list = async (filter = {}) => {
  const q = {};
  if (filter.grade) q.grade = filter.grade;
  return Subject.find(q).sort({ name: 1 });
};

const create = async (payload) => Subject.create(payload);

const remove = async (id) => {
  const subject = await Subject.findByIdAndDelete(id);
  if (!subject) throw ApiError.notFound('المادة الدراسية غير موجودة');
  return subject;
};

module.exports = { list, create, remove };
