import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Google Analytics measurement ID belongs to SplitsPro and is public.
// A GitHub Actions variable may override this project default; no customer details are used.
const gaId = (process.env.REACT_APP_GA4_MEASUREMENT_ID || "G-4QG9BF6FT0").trim();
const clarityId = (process.env.REACT_APP_CLARITY_PROJECT_ID || "").trim();
const validGa = /^G-[A-Z0-9]+$/i.test(gaId);
const validClarity = /^[a-z0-9]{5,32}$/i.test(clarityId);

// Never send payment-session IDs, checkout references or customer form data
// in GA4 virtual page URLs. Keep campaign parameters for attribution.
const analyticsUrl = (input) => {
  try {
    const url = new URL(input, window.location.origin);
    const safe = new URLSearchParams();
    for (const [name, value] of url.searchParams.entries()) {
      if (/^utm_(source|medium|campaign|term|content|id)$/i.test(name)) safe.append(name, value);
    }
    return url.origin + url.pathname + (safe.toString() ? "?" + safe : "");
  } catch {
    return window.location.origin + window.location.pathname;
  }
};

export default function AnalyticsTracking() {
  const location = useLocation();
  const lastPage = useRef("");

  useEffect(() => {
    if (validGa && !document.getElementById("splitspro-ga4-script")) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      // Pages are tracked manually on React Router changes, avoiding duplicates.
      window.gtag("config", gaId, { send_page_view: false });
      const script = document.createElement("script");
      script.id = "splitspro-ga4-script";
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(gaId);
      document.head.appendChild(script);
    }
    if (validClarity && !document.getElementById("splitspro-clarity-script")) {
      window.clarity = window.clarity || function () {
        (window.clarity.q = window.clarity.q || []).push(arguments);
      };
      const script = document.createElement("script");
      script.id = "splitspro-clarity-script";
      script.async = true;
      script.src = "https://www.clarity.ms/tag/" + encodeURIComponent(clarityId);
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!validGa || typeof window.gtag !== "function") return;
    const current = analyticsUrl(window.location.href);
    if (current === lastPage.current) return;
    const previous = lastPage.current || (document.referrer ? analyticsUrl(document.referrer) : undefined);
    window.gtag("event", "page_view", {
      page_location: current,
      ...(previous ? { page_referrer: previous } : {}),
    });
    lastPage.current = current;
  }, [location.pathname, location.search]);
  return null;
}
