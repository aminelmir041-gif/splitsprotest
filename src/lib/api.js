import axios from "axios";
import { getAttribution } from "./attribution";

const LEGACY_BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");
const RUNTIME_LEAD_URL =
  typeof window !== "undefined"
    ? (window.SPLITSPRO_LEAD_API_URL || "").replace(/\/$/, "")
    : "";

export const LEAD_API = RUNTIME_LEAD_URL || LEGACY_BACKEND_URL;

export const submitQuote = (data) => {
  if (!LEAD_API) {
    return Promise.reject(new Error("Lead service is not configured."));
  }
  return axios
    .post(`${LEAD_API}/api/quotes`, { ...data, ...getAttribution() })
    .then((response) => response.data);
};

export const getReviews = () => {
  if (!LEGACY_BACKEND_URL) return Promise.resolve([]);
  return axios.get(`${LEGACY_BACKEND_URL}/api/reviews`).then((response) => response.data);
};

export const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("Could not read photo."));
    reader.readAsDataURL(file);
  });
