const ATTRIBUTION_KEY = "splitspro_attribution";

const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
];

const readStored = () => {
  try {
    const raw = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const store = (value) => {
  try {
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(value));
  } catch {
    // Tracking should never block a quote submission.
  }
};

export const getAttribution = () => {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const current = {};

  TRACKING_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) current[key] = value;
  });

  const stored = readStored();
  const merged = { ...stored, ...current };

  if (!stored.landing_page) {
    merged.landing_page = window.location.href;
  }
  if (!stored.referrer && document.referrer) {
    merged.referrer = document.referrer;
  }

  store(merged);

  return {
    ...merged,
    page_url: window.location.href,
    referrer: merged.referrer || document.referrer || "",
  };
};
