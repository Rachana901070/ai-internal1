import api from "./api.js";

export async function getAdminStats() {
  const { data } = await api.get("/admin/stats");
  return data;
}

export async function getAdminDonations() {
  const { data } = await api.get("/admin/donations");
  return data;
}

export async function getAdminUsers() {
  const { data } = await api.get("/admin/users");
  return data;
}

export async function getAdminFeedback() {
  const { data } = await api.get("/admin/feedback");
  return data;
}

export async function getAdminAnalytics() {
  const { data } = await api.get("/admin/analytics");
  return data;
}
