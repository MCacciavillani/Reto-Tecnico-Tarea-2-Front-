import axios from "axios";
import { jwtDecode } from "jwt-decode";

const axiosCustom = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
});

axiosCustom.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const { exp }: { exp: number } = jwtDecode(token);
      const now = Date.now() / 1000;
      if (exp < now) {
        console.warn("⚠️ Token expirado, removiendo...");
        localStorage.removeItem("access_token");
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosCustom.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("⛔ Token inválido o expirado");
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosCustom;
