import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export const getMobiles = (params = {}) => api.get("/mobiles", { params }).then((r) => r.data);
export const createMobile = (data) => api.post("/mobiles", data).then((r) => r.data);
export const updateMobile = (id, data) => api.put(`/mobiles/${id}`, data).then((r) => r.data);
export const deleteMobile = (id) => api.delete(`/mobiles/${id}`).then((r) => r.data);

export const errorMessage = (err) =>
  err.response?.data?.message || err.message || "Something went wrong";
