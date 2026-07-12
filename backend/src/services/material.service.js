const Material = require('../models/Material');
const ApiError = require('../utils/ApiError');
const { getPagination, buildMeta } = require('../utils/pagination');
const { uploadFile } = require('./upload.service');

const POPULATE = [
  { path: 'subject', select: 'name grade' },
  { path: 'uploadedBy', select: 'name role' },
];

const list = async (query) => {
  const { page, limit, skip } = getPagination(query);

  const filter = {};
  if (query.grade) filter.grade = query.grade;
  if (query.subject) filter.subject = query.subject;
  if (query.type) filter.type = query.type;
  if (query.isNextGrade !== undefined && query.isNextGrade !== '') {
    filter.isNextGrade = query.isNextGrade === 'true' || query.isNextGrade === true;
  }
  if (query.search) filter.title = { $regex: query.search, $options: 'i' };

  const [items, total] = await Promise.all([
    Material.find(filter).populate(POPULATE).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Material.countDocuments(filter),
  ]);

  return { items, meta: buildMeta(total, page, limit) };
};

const getById = async (id) => {
  const material = await Material.findById(id).populate(POPULATE);
  if (!material) throw ApiError.notFound('المادة التعليمية غير موجودة');
  return material;
};

const create = async ({ body, file, userId }) => {
  let fileUrl = body.fileUrl || null;
  let provider = body.fileUrl ? 'external' : 'local';

  if (file) {
    const uploaded = await uploadFile(file);
    fileUrl = uploaded.url;
    provider = uploaded.provider;
  }

  if (!fileUrl) throw ApiError.badRequest('يجب رفع ملف أو إدخال رابط للمحتوى');

  const material = await Material.create({
    title: body.title,
    description: body.description || '',
    subject: body.subject,
    grade: body.grade,
    type: body.type,
    fileUrl,
    provider,
    isNextGrade: body.isNextGrade === true || body.isNextGrade === 'true',
    uploadedBy: userId,
  });

  return material.populate(POPULATE);
};

const remove = async (id, user) => {
  const material = await Material.findById(id);
  if (!material) throw ApiError.notFound('المادة التعليمية غير موجودة');

  // الأدمن يحذف أي مادة، والمدرس يحذف مواده فقط
  if (user.role !== 'admin' && String(material.uploadedBy) !== String(user.id)) {
    throw ApiError.forbidden('لا يمكنك حذف مادة لم ترفعها');
  }
  await material.deleteOne();
  return material;
};

module.exports = { list, getById, create, remove };
