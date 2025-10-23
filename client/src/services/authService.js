import api from "./api.js";

export async function register(payload) {
  const { data } = await api.post("/auth/register", payload);
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
}

export async function login(credentials) {
  const { data } = await api.post("/auth/login", credentials);
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
}

export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data;
}


