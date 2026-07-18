import { request, qs, tokenStore } from "./apiClient";

const api = {
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  getMe: () => request("/auth/me"),

  getSubjects: (grade) => request("/subjects" + (grade ? "?grade=" + encodeURIComponent(grade) : "")),
  createSubject: (body) => request("/subjects", { method: "POST", body: JSON.stringify(body) }),

  getMaterials: (params = {}) => request("/materials" + qs(params)),
  getMaterial: (id) => request("/materials/" + id),
  createMaterial: (formData) => request("/materials", { method: "POST", body: formData }),
  deleteMaterial: (id) => request("/materials/" + id, { method: "DELETE" }),

  getPosts: () => request("/posts"),
  createPost: (formData) => request("/posts", { method: "POST", body: formData }),
  likePost: (id) => request("/posts/" + id + "/like", { method: "POST" }),
  getComments: (id) => request("/posts/" + id + "/comments"),
  createComment: (id, content) => request("/posts/" + id + "/comments", { method: "POST", body: JSON.stringify({ content }) }),

  getChallenges: () => request("/challenges"),
  getSubmissions: () => request("/challenges/submissions"),
  submitChallenge: (id, answer) => request("/challenges/" + id + "/submit", { method: "POST", body: JSON.stringify({ answer }) }),

  getLeaderboard: (grade) => request("/leaderboard" + (grade ? "?grade=" + encodeURIComponent(grade) : "")),
  getSchools: () => request("/leaderboard/schools"),

  getTeachers: () => request("/teachers"),
  rateTeacher: (id, rating, comment) => request("/teachers/" + id + "/rate", { method: "POST", body: JSON.stringify({ rating, comment }) }),

  getAdminStats: () => request("/admin/stats"),
  getAdminUsers: () => request("/admin/users"),
  deleteUser: (userId) => request(`/admin/users/${userId}`, { method: "DELETE" }),
<<<<<<< HEAD

  getChatRooms: () => request("/v1/chat/rooms"),
  getRoomMessages: (room, params = {}) => request(`/v1/chat/${encodeURIComponent(room)}/messages${qs(params)}`),
=======
  // ===== Soft Skills (v1) =====
  getSoftSkills: () => request("/v1/softskills"),
  getSoftSkillSubmissions: (skillId) => request(`/v1/softskills/${skillId}/submissions`),
  submitPresentation: (skillId, formData) => request(`/v1/softskills/${skillId}/submit`, { method: "POST", body: formData }),
  gradeSubmission: (submissionId, data) => request(`/v1/softskills/submissions/${submissionId}/grade`, { method: "POST", body: JSON.stringify(data) })
>>>>>>> 11009bc8c152d1a6ced2bba8b1b6b8c0a515855c
};

export {
  api,
  tokenStore
};
