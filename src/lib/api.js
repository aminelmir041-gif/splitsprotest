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


export const getCleaningSlots = async (quantity = 1, limit = 70) => {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await api.get("/cleaning-slots", {
        params: { quantity, limit },
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

// Prefetch on the cleaning offer page and reuse on the next checkout route.
// This removes a duplicate Render cold-start request without trusting a
// cached amount at payment: /cleaning-checkout verifies the actual price.
const CLEANING_CONFIG_CACHE_KEY = "splitspro:cleaning-config:v4";
const CLEANING_CONFIG_TTL_MS = 300000;
let cleaningConfigInFlight = null;
export const getCachedCleaningCheckoutConfig = () => {
  try {
    const cached = JSON.parse(window.sessionStorage.getItem(CLEANING_CONFIG_CACHE_KEY) || "null");
    if (cached && cached.expires > Date.now() && cached.data && typeof cached.data === "object") return cached.data;
  } catch {}
  return null;
};

export const getCleaningCheckoutConfig = async () => {
  const cached = getCachedCleaningCheckoutConfig();
  if (cached) return cached;
  if (cleaningConfigInFlight) return cleaningConfigInFlight;
  cleaningConfigInFlight = (async () => {
    let lastError;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await api.get("/cleaning-checkout-config", {
          timeout: attempt === 0 ? 16000 : 35000,
          headers: { "Cache-Control": "no-cache" },
        });
        try {
          window.sessionStorage.setItem(CLEANING_CONFIG_CACHE_KEY, JSON.stringify({
            expires: Date.now() + CLEANING_CONFIG_TTL_MS,
            data: response.data,
          }));
        } catch {}
        return response.data;
      } catch (error) {
        lastError = error;
        if (error?.response?.status && error.response.status < 500) throw error;
        if (attempt === 0) await sleep(800);
      }
    }
    throw lastError;
  })().finally(() => { cleaningConfigInFlight = null; });
  return cleaningConfigInFlight;
};

export const submitBooking = (data) => api.post("/bookings", data).then((r) => r.data);
export const createBookingCheckout = (data) => api.post("/booking-checkout", data).then((r) => r.data);
export const getBookingPaymentStatus = (sessionId) =>
  api.get("/booking-payment-status", { params: { session_id: sessionId } }).then((r) => r.data);
export const getReviews = () => api.get("/reviews").then((r) => r.data);
export const uploadPhoto = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);
};
