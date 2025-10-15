import api from "./api.js";

export async function createRequest(payload) {
  const { data } = await api.post("/requests", payload);
  return data;
}

export async function listMyRequests() {
  const { data } = await api.get("/requests/mine");
  return data;
}

export async function updateRequest(id, payload) {
  const { data } = await api.patch(`/requests/${id}`, payload);
  return data;
}
