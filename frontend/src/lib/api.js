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
  },
};

const NO_REFRESH = ["/auth/login", "/auth/register", "/auth/refresh"];

async function tryRefresh() {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;

    const json = await res.json();
    const newAccess = json?.data?.accessToken;
    const newRefresh = json?.data?.refreshToken;

    if (!newAccess) return false;
    tokenStore.set(newAccess, newRefresh);
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
    throw new Error(data.message || data.error || "حدث خطأ ما");
  }

  if (data && typeof data === "object" && "success" in data && "data" in data) {
    return data.data;
  }

  return data;
}

const qs = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );
  const s = new URLSearchParams(clean).toString();
  return s ? `?${s}` : "";
};

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

  getChatRooms: () => request("/v1/chat/rooms"),
  getRoomMessages: (room, params = {}) => request(`/v1/chat/${encodeURIComponent(room)}/messages${qs(params)}`),
};

export { api, tokenStore };
