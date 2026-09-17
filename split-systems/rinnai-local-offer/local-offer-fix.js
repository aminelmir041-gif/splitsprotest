(() => {
  const exactPrices = {
    "2.5kW": "$1,400",
    "3.5kW": "$1,500",
    "5.0kW": "$1,750",
    "7.0kW": "$2,100",
    "7.1kW": "$2,100",
  };

  const localOfferAreas = [
    "Bankstown",
    "Bass Hill",
    "Chester Hill",
    "Yagoona",
    "Greenacre",
    "Georges Hall",
    "Condell Park",
    "Sefton",
    "Regents Park",
    "Villawood",
    "Granville",
    "Guildford",
    "Merrylands",
    "Auburn",
    "Lansvale",
    "Greystanes",
    "Surrounding suburbs",
  ];

  let daikinCoraImage = null;
  let coraImageLoadStarted = false;
  let redirectedHash = false;

  const extractCoraImage = (text) => {
    const marker = "data:image/webp;base64,UklGRoQIAABXRUJQVlA4IHgIAAAQbQCdASqKAno";
    const start = String(text || "").indexOf(marker);
    if (start < 0) return null;
    const match = String(text).slice(start).match(/^data:image\/webp;base64,[A-Za-z0-9+/=]+/);
    return match ? match[0] : null;
  };

  const loadDaikinCoraImage = async () => {
    if (coraImageLoadStarted || daikinCoraImage) return;
    coraImageLoadStarted = true;

    const sources = [
      "/src/lib/embedded/cora.js",
      "/static/js/main.7e36c733.js",
    ];

    for (const source of sources) {
      try {
        const response = await fetch(source, { cache: "force-cache" });
        if (!response.ok) continue;
        const text = await response.text();
        const found = extractCoraImage(text);
        if (found) {
          daikinCoraImage = found;
          scheduleFixes();
          return;
        }
      } catch (error) {
        // Try the next source.
      }
    }
  };

  const hideFieldByTestId = (testId) => {
    const el = document.querySelector(`[data-testid="${testId}"]`);
    if (!el) return;
    const field = el.closest("div");
    if (field && field.style.display !== "none") field.style.display = "none";
  };

  const normaliseOfferText = (value) => String(value)
    .replaceAll("$1,398", "$1,400")
    .replaceAll("$1,486", "$1,500")
    .replaceAll("$2,102", "$2,100")
    .replaceAll("7.0kW", "7.1kW");

  const normaliseTextNodes = (root) => {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const current = node.nodeValue || "";
      const normalised = normaliseOfferText(current);
      if (normalised !== current) node.nodeValue = normalised;
    });
  };

  const updateLocalOfferAreas = () => {
    const areaSection = document.querySelector('[data-testid="rinnai-local-areas-hero"]');
    if (!areaSection) return;
    const areaWrap = areaSection.querySelector("div");
    if (!areaWrap || areaWrap.dataset.expandedLocalAreas === "true") return;

    areaWrap.dataset.expandedLocalAreas = "true";
    areaWrap.replaceChildren();
    localOfferAreas.forEach((area) => {
      const span = document.createElement("span");
      span.className = "rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85";
      span.textContent = area;
      areaWrap.appendChild(span);
    });
  };

  // Keep the lead details consistent with the exact prices shown in the ad/page.
  const originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function patchedSend(body) {
    if (typeof body === "string" && body.includes("local") && body.includes("installed")) {
      body = normaliseOfferText(body);
    }
    return originalSend.call(this, body);
  };

  const applyFixes = () => {
    document.querySelectorAll('[data-testid^="price-row-rinnai-local-"]').forEach((row) => {
      const kwEl = row.querySelector("span > span.block");
      if (!kwEl) return;
      const originalKw = kwEl.textContent.trim();
      const price = exactPrices[originalKw];
      if (!price) return;

      if (originalKw === "7.0kW") kwEl.textContent = "7.1kW";

      const priceColumn = row.children[1];
      if (priceColumn) {
        Array.from(priceColumn.querySelectorAll("span")).forEach((span) => {
          const text = span.textContent.trim();
          if (/^Was\s+\$[\d,]+$/i.test(text)) {
            span.remove();
            return;
          }

          if (span.children.length === 0 && /^\$[\d,]+$/.test(text) && text !== price) {
            span.textContent = price;
          }
          if (span.children.length === 0 && text.includes("12% OFF")) {
            span.textContent = "LOCAL DEAL · Limited spots";
          }
        });
      }
    });

    updateLocalOfferAreas();

    // Use the exact same embedded Daikin Cora image used on the Cora section.
    const daikinLocalSection = document.getElementById("range-daikin-lite-local");
    if (daikinLocalSection) {
      if (!daikinCoraImage) loadDaikinCoraImage();
      if (daikinCoraImage) {
        daikinLocalSection.querySelectorAll("img").forEach((productImage) => {
          if (productImage.getAttribute("src") !== daikinCoraImage) {
            productImage.removeAttribute("srcset");
            productImage.setAttribute("src", daikinCoraImage);
            productImage.setAttribute("alt", "Daikin Cora indoor unit");
          }
        });
      }
    }

    normaliseTextNodes(document.body);

    document.querySelectorAll("span").forEach((span) => {
      if (span.children.length !== 0) return;
      const text = span.textContent.trim();
      if (text === "12% OFF") span.textContent = "LOCAL DEAL";
    });

    hideFieldByTestId("quote-email-input");
    hideFieldByTestId("quote-address-input");
    hideFieldByTestId("quote-date");
    hideFieldByTestId("quote-photo-btn");
    hideFieldByTestId("quote-photo-input");

    const submit = document.querySelector('[data-testid="quote-submit-btn"]');
    if (submit && submit.textContent.trim() !== "GET MY INSTALLED PRICE") {
      submit.textContent = "GET MY INSTALLED PRICE";
    }

    if (!redirectedHash && window.location.hash === "#range-pb-series") {
      const target = document.getElementById("range-rinnai-local");
      if (target) {
        redirectedHash = true;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `${window.location.pathname}#range-rinnai-local`);
      }
    }
  };

  let scheduled = false;
  const scheduleFixes = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      applyFixes();
    });
  };

  const observer = new MutationObserver(scheduleFixes);
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  document.addEventListener("DOMContentLoaded", scheduleFixes);
  window.addEventListener("load", scheduleFixes);
  scheduleFixes();
})();
