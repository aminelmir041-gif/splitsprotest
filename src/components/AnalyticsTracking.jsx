import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Google Analytics measurement ID belongs to SplitsPro and is public.
// A GitHub Actions variable may override this project default; no customer details are used.
const publicConfig = window.SPLITSPRO_ANALYTICS_CONFIG || {};
const gaId = (process.env.REACT_APP_GA4_MEASUREMENT_ID || publicConfig.ga4MeasurementId || "G-4QG9BF6FT0").trim();
const clarityId = (process.env.REACT_APP_CLARITY_PROJECT_ID || publicConfig.clarityProjectId || "").trim();
const validGa = /^G-[A-Z0-9]+$/i.test(gaId);
const validClarity = /^[a-z0-9]{5,32}$/i.test(clarityId);

// Never send payment-session IDs, checkout references or customer form data
// in GA4 virtual page URLs. Keep campaign parameters for attribution.
const analyticsUrl = (input) => {
  try {
    const url = new URL(input, window.location.origin);
    const safe = new URLSearchParams();
    for (const [name, value] of url.searchParams.entries()) {
      if (/^utm_(source|medium|campaign|term|content|id)$/i.test(name) || /^(gclid|gbraid|wbraid|gad_source)$/i.test(name)) safe.append(name, value.slice(0, 256));
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

  // A phone tap is a useful intent signal, not a confirmed sale or lead.
  // Delegation covers links inside every React route and landing page.
  useEffect(() => {
    const onPhoneClick = (event) => {
      const anchor = event.target?.closest?.('a[href^="tel:"]');
      if (!anchor || event.defaultPrevented) return;
      // A single custom event for Google Tag Manager's website-phone-click trigger.
      // This does not report a connected call and never changes the phone number.
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "splitspro_phone_click", page_path: window.location.pathname });
      if (validGa && typeof window.gtag === "function") {
        window.gtag("event", "click_to_call", { page_path: window.location.pathname });
      }
      if (validClarity && typeof window.clarity === "function") {
        window.clarity("event", "phone_click");
      }
    };
    // Bubble after the after-hours callback handler has had a chance to
    // block telephone navigation; a callback popup is not an actual call.
    document.addEventListener("click", onPhoneClick);
    return () => document.removeEventListener("click", onPhoneClick);
  }, []);

  useEffect(() => {
    if (validClarity && typeof window.clarity === "function") {
      window.clarity("set", "page_path", location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!validGa || typeof window.gtag !== "function") return;
    const current = analyticsUrl(window.location.href);
    if (current === lastPage.current) return;
    const previous = lastPage.current || (document.referrer ? analyticsUrl(document.referrer) : undefined);
    // The /workmanship React component immediately navigates to a standalone page.
    // Count its real destination only, not the redirect shell.
    if (location.pathname === "/workmanship") return;
    window.gtag("event", "page_view", {
      page_location: current,
      ...(previous ? { page_referrer: previous } : {}),
    });
    lastPage.current = current;
  }, [location.pathname, location.search]);
  return null;
}
