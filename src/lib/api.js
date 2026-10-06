import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://splitspro-leads.onrender.com";
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const submitQuote = (data) => api.post("/quotes", data).then((r) => r.data);

export const getBookingSlots = async (limit = 8) => {
  let lastError;

  // Render can cold-start after being idle. Retry transient failures so the
  // booking calendar does not get stranded on a spinner or a one-off 5xx.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await api.get("/booking-slots", {
        params: { limit },
        timeout: 35000,
        headers: { "Cache-Control": "no-cache" },
      });
      return response.data;
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;
      if (status && status < 500) throw error;
      if (attempt < 2) await sleep(1000 * (attempt + 1));
    }
  }

  throw lastError;
};

export const submitBooking = (data) => api.post("/bookings", data).then((r) => r.data);
export const getReviews = () => api.get("/reviews").then((r) => r.data);
export const uploadPhoto = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);
};
