import axios from "axios";
const BACKEND_URL = "";
export const API = `${BACKEND_URL}/api`;
export const api = axios.create({ baseURL: API });
export const submitQuote = (data) => api.post("/quotes", data).then((r) => r.data);
export const getReviews = () => api.get("/reviews").then((r) => r.data);
export const uploadPhoto = (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);
};
