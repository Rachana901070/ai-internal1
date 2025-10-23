import api from "./api.js";

export async function createProof(formData, onProgress) {
  const { data } = await api.post("/proofs/upload", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
    timeout: 300000 // 5 minutes for large uploads
  });
  return data;
}

export async function getProofsByDonation(donationId) {
  const { data } = await api.get(`/proofs/${donationId}`);
  return data;
}
