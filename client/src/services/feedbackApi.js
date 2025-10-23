import api from "./api.js";

export async function createFeedback(payload) {
  const { data } = await api.post("/feedback", payload);
  return data;
}

export async function updateFeedback(id, payload) {
  const { data } = await api.put(`/feedback/${id}`, payload);
  return data;
}

export async function getCollectorRatings(collectorId, params = {}) {
  const { data } = await api.get(`/feedback/collectors/${collectorId}/ratings`, { params });
  return data;
}
