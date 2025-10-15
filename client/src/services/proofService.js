import api from "./api.js";

export async function createProof(payload) {
  const { data } = await api.post("/proofs", payload);
  return data;
}

export async function getProofsByDonation(donationId) {
  const { data } = await api.get(`/proofs/${donationId}`);
  return data;
}
