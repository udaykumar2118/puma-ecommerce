import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://puma-backend-oqw8.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
});

// attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;