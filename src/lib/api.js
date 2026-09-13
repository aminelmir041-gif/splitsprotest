import axios from "axios";
import { getAttribution } from "./attribution";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const submitQuote = (data) =>
  api.post("/quotes", { ...data, ...getAttribution() }).then((r) => r.data);
export const getReviews = () => api.get("/reviews").then((r) => r.data);
export const uploadPhoto = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);
};
