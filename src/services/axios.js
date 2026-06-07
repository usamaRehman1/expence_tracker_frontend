import axios from "axios";

const api = axios.create({
  baseURL: "https://expence-tracker-backend-k60kn3lt4.vercel.app/api",
});

export default api;