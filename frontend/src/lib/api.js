const BASE_URL = "http://localhost:5000/api";
const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";
const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (access, refresh) => {
    if (access) localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
};
const NO_REFRESH = ["/auth/login", "/auth/register", "/auth/refresh"];
async function tryRefresh() {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${BASE_URL}/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken })
    });
    if (!res.ok) return false;
    const json = await res.json();
    const newAccess = json?.data?.accessToken;
    if (!newAccess) return false;
    tokenStore.set(newAccess);
    return true;
  } catch {
    return false;
  }
}
async function request(endpoint, options = {}, isRetry = false) {
  const token = options.token ?? tokenStore.getAccess();
  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  if (response.status === 401 && !isRetry && !NO_REFRESH.some((p) => endpoint.includes(p))) {
    const refreshed = await tryRefresh();
    if (refreshed) return request(endpoint, options, true);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.error || "\u062D\u062F\u062B \u062E\u0637\u0623 \u0645\u0627");
  }
  if (data && typeof data === "object" && "success" in data && "data" in data) {
    return data.data;
  }
  return data;
}
const qs = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== void 0 && v !== null && v !== "")
  );
  const s = new URLSearchParams(clean).toString();
  return s ? `?${s}` : "";
};
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
