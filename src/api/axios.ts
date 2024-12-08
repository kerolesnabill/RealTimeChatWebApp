import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default apiClient;
