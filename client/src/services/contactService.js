import api from "./api.js";

export const submitContactForm = async (data) => {
  const response = await api.post("/support/contact", data);
  return response.data;
};
