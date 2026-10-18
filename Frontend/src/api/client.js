const TOKEN_KEY = "esire_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

const API = (import.meta.env.VITE_API_URL || "https://paangba.onrender.com").replace(/\/+$/, "");
async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  const language = localStorage.getItem("esire_language");
  if (language) headers["Accept-Language"] = language;

  const response = await fetch(`${API}${path}`, { ...options, headers });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { detail: text };
  }
  if (!response.ok) {
    const detail = data?.detail;
    const message = typeof detail === "string" ? detail : "Request failed";
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const api = {
  health: () => request("/api/health"),
  signup: (body) => request("/api/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  requestOtp: (phone) => request("/api/auth/otp/request", { method: "POST", body: JSON.stringify({ phone }) }),
  verifyOtp: (phone, otp) => request("/api/auth/otp/verify", { method: "POST", body: JSON.stringify({ phone, otp }) }),
  me: () => request("/api/me"),
  deleteAccount: () => request("/api/me", { method: "DELETE" }),
  updateLanguage: (language) => request("/api/me/language", { method: "PUT", body: JSON.stringify({ language }) }),
  updateProfile: (body) => request("/api/me/profile", { method: "PUT", body: JSON.stringify(body) }),
  dashboard: (debug = false) => request(`/api/dashboard${debug ? "?debug=true" : ""}`),
  scheme: (id) => request(`/api/schemes/${id}`),
  mySchemes: () => request("/api/my-schemes"),
  apply: (id) => request(`/api/schemes/${id}/apply`, { method: "POST" }),
  documents: () => request("/api/documents"),
  uploadDocument: (docType, file, markReady = true) => {
    const body = new FormData();
    body.append("doc_type", docType);
    body.append("mark_ready", markReady ? "true" : "false");
    if (file) body.append("file", file);
    return request("/api/documents/upload", { method: "POST", body });
  },
  setDocumentStatus: (docType, status) =>
    request(`/api/documents/${docType}/status?status=${encodeURIComponent(status)}`, { method: "POST" }),
  reevaluate: () => request("/api/match/reevaluate", { method: "POST" }),
};
