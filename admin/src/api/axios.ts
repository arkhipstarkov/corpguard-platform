import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8085/api", // - сменить если backend на другом порту
  timeout: 4000, // 4s — при longer fallback идёт в мок
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
