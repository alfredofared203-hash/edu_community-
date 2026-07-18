// عنوان الباك إند
const BASE_URL = "http://localhost:5000/api";

// دالة واحدة بنستخدمها في كل الطلبات للسيرفر
async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token"); // التوكن لو المستخدم مسجّل دخول
  const headers = {};

  // لو مش بنرفع ملف، نبعت البيانات كـ JSON
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  // لو فيه توكن، نبعته مع الطلب
  if (token) headers["Authorization"] = "Bearer " + token;

  const res = await fetch(BASE_URL + endpoint, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  // لو السيرفر رجّع خطأ، نرمي رسالة الخطأ
  if (!res.ok) throw new Error(data.error || "حصل خطأ");

  return data;
}

export const api = {
  // ===== الحسابات =====
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  getMe: () => request("/auth/me"),

  // ===== المواد الدراسية =====
  getSubjects: (grade) => request("/subjects" + (grade ? "?grade=" + encodeURIComponent(grade) : "")),
  createSubject: (body) => request("/subjects", { method: "POST", body: JSON.stringify(body) }),

  // ===== المواد التعليمية =====
  getMaterials: (params = {}) => {
    // نشيل القيم الفاضية ونحوّل الباقي لـ query string
    const clean = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
    );
    const qs = new URLSearchParams(clean).toString();
    return request("/materials" + (qs ? "?" + qs : ""));
  },
  getMaterial: (id) => request("/materials/" + id),
  createMaterial: (formData) => request("/materials", { method: "POST", body: formData }),
  deleteMaterial: (id) => request("/materials/" + id, { method: "DELETE" }),

  // ===== مسارات موجودة من قبل =====
  getPosts: () => request("/posts"),
  createPost: (formData) => request("/posts", { method: "POST", body: formData }),
  likePost: (id) => request("/posts/" + id + "/like", { method: "POST" }),
  getComments: (id) => request("/posts/" + id + "/comments"),
  createComment: (id, content) =>
    request("/posts/" + id + "/comments", { method: "POST", body: JSON.stringify({ content }) }),

  getChallenges: () => request("/challenges"),
  getSubmissions: () => request("/challenges/submissions"),
  submitChallenge: (id, answer) =>
    request("/challenges/" + id + "/submit", { method: "POST", body: JSON.stringify({ answer }) }),

  getLeaderboard: (grade) => request("/leaderboard" + (grade ? "?grade=" + encodeURIComponent(grade) : "")),
  getSchools: () => request("/leaderboard/schools"),

  getTeachers: () => request("/teachers"),
  rateTeacher: (id, rating, comment) =>
    request("/teachers/" + id + "/rate", { method: "POST", body: JSON.stringify({ rating, comment }) }),

  getAdminStats: () => request("/admin/stats"),
  getAdminUsers: () => request("/admin/users"),
  deleteUser: (id) => request("/admin/users/" + id, { method: "DELETE" }),
};
