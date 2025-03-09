import axios from "axios";
import { API_BASE_URL } from "../constants/api.contants";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
