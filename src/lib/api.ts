import axios from "axios";

const api = axios.create({
  baseURL: "https://taskflow-backend-9bsg.vercel.app",
  withCredentials: true,
});

export default api;
