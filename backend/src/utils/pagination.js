// أدوات الـpagination الموحّدة: تقرأ page/limit من الـquery وتبني meta للاستجابة.
const getPagination = (query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100); // أقصى 100 لكل صفحة
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const buildMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit) || 1,
  hasNextPage: page * limit < total,
});

module.exports = { getPagination, buildMeta };
