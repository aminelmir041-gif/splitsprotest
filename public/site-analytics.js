(function () {
  "use strict";
  var config = window.SPLITSPRO_ANALYTICS_CONFIG || {};
  var gaId = String(config.ga4MeasurementId || "G-4QG9BF6FT0").trim();
  var clarityId = String(config.clarityProjectId || "").trim();
  var gaEnabled = /^G-[A-Z0-9]+$/i.test(gaId);
  var clarityEnabled = /^[a-z0-9]{5,32}$/i.test(clarityId);

  // Prevent payment tokens, email addresses and form answers in URL queries from
  // being passed to Google Analytics. Preserve campaign/ad-click attribution.
  function safeUrl(value) {
    try {
      var url = new URL(value, window.location.origin);
      var allowed = new URLSearchParams();
      url.searchParams.forEach(function (v, key) {
        if (/^utm_(source|medium|campaign|term|content|id)$/i.test(key) ||
            /^(gclid|gbraid|wbraid|gad_source)$/i.test(key)) {
          allowed.append(key, v.slice(0, 256));
        }
      });
      return url.origin + url.pathname + (allowed.toString() ? "?" + allowed.toString() : "");
    } catch (_) {
      return window.location.origin + window.location.pathname;
    }
  }

  if (gaEnabled) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", gaId, { send_page_view: false });
    var gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(gaId);
    document.head.appendChild(gaScript);
    // When embedded within the React /our-approach route, the outer page
    // already sends the page_view. Still measure direct taps inside the iframe.
    if (window.self === window.top) {
      window.gtag("event", "page_view", {
        page_location: safeUrl(window.location.href),
        page_title: document.title
      });
    }
  }

  if (clarityEnabled && window.self === window.top) {
    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    var clarityScript = document.createElement("script");
    clarityScript.async = true;
    clarityScript.src = "https://www.clarity.ms/tag/" + encodeURIComponent(clarityId);
    document.head.appendChild(clarityScript);
  }

  document.addEventListener("click", function (event) {
    var anchor = event.target && event.target.closest && event.target.closest('a[href^="tel:"]');
    if (!anchor) return;
    if (gaEnabled && typeof window.gtag === "function") {
      window.gtag("event", "click_to_call", { page_path: window.location.pathname });
    }
    if (clarityEnabled && typeof window.clarity === "function") {
      window.clarity("event", "phone_click");
    }
  }, true);
})();
