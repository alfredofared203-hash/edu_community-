import { request, qs, tokenStore } from "./apiClient";

const api = {
  // ===== Auth (v1) =====
  login: (credentials) => request("/v1/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  register: (userData) => request("/v1/auth/register", { method: "POST", body: JSON.stringify(userData) }),
  getMe: () => request("/v1/auth/me"),
  logout: () => request("/v1/auth/logout", { method: "POST" }).catch(() => null),
  // ===== Subjects (v1) =====
  getSubjects: (grade) => request(`/v1/subjects${qs({ grade })}`),
  createSubject: (data) => request("/v1/subjects", { method: "POST", body: JSON.stringify(data) }),
  // ===== Materials (v1) =====
  getMaterials: (params = {}) => request(`/v1/materials${qs(params)}`),
  getMaterial: (id) => request(`/v1/materials/${id}`),
  createMaterial: (formData) => request("/v1/materials", { method: "POST", body: formData }),
  deleteMaterial: (id) => request(`/v1/materials/${id}`, { method: "DELETE" }),
  // ===== Posts (legacy) =====
  getPosts: () => request("/posts"),
  createPost: (formData) => request("/posts", { method: "POST", body: formData }),
  likePost: (postId) => request(`/posts/${postId}/like`, { method: "POST" }),
  getComments: (postId) => request(`/posts/${postId}/comments`),
  createComment: (postId, content) => request(`/posts/${postId}/comments`, { method: "POST", body: JSON.stringify({ content }) }),
  // ===== Challenges (legacy) =====
  getChallenges: () => request("/challenges"),
  getSubmissions: () => request("/challenges/submissions"),
  submitChallenge: (challengeId, answer) => request(`/challenges/${challengeId}/submit`, { method: "POST", body: JSON.stringify({ answer }) }),
  // ===== Leaderboard (legacy) =====
  getLeaderboard: (grade) => request(`/leaderboard${qs({ grade })}`),
  getSchools: () => request("/leaderboard/schools"),
  // ===== Teachers (legacy) =====
  getTeachers: () => request("/teachers"),
  rateTeacher: (teacherId, rating, comment) => request(`/teachers/${teacherId}/rate`, { method: "POST", body: JSON.stringify({ rating, comment }) }),
  // ===== Admin (legacy) =====
  getAdminStats: () => request("/admin/stats"),
  getAdminUsers: () => request("/admin/users"),
  deleteUser: (userId) => request(`/admin/users/${userId}`, { method: "DELETE" })
};

export {
  api,
  tokenStore
};
