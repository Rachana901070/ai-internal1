import api from "./api.js";

export async function listDonations(params = {}) {
  const { data } = await api.get("/donations", { params });
  return data;
}

export async function createDonation(payload) {
  const { data } = await api.post("/donations", payload);
  return data;
}

export async function updateDonation(id, payload) {
  const { data } = await api.patch(`/donations/${id}`, payload);
  return data;
}

export async function deleteDonation(id) {
  const { data } = await api.delete(`/donations/${id}`);
  return data;
}
