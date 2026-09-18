import coraUserImage from "/src/lib/embedded/cora.js";

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

  let redirectedHash = false;

  const hideFieldByTestId = (testId) => {
    const el = document.querySelector(`[data-testid="${testId}"]`);
    if (!el) return;
    const field = el.closest("div");
    if (field) field.style.display = "none";
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
    if (!areaWrap) return;

    const existing = Array.from(areaWrap.querySelectorAll("span")).map((s) => s.textContent.trim());
    if (existing.join("|") === localOfferAreas.join("|")) return;

    areaWrap.replaceChildren();
    localOfferAreas.forEach((area) => {
      const span = document.createElement("span");
      span.className = "rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85";
      span.textContent = area;
      areaWrap.appendChild(span);
    });
  };

  const removeWasPrices = () => {
    document.querySelectorAll("span").forEach((span) => {
      const text = span.textContent.trim();
      if (/^Was\s+\$[\d,]+$/i.test(text)) span.remove();
    });
  };

  const applyExactRinnaiPrices = () => {
    document.querySelectorAll('[data-testid^="price-row-rinnai-local-"]').forEach((row) => {
      const kwEl = row.querySelector("span > span.block");
      if (!kwEl) return;
      const originalKw = kwEl.textContent.trim();
      const price = exactPrices[originalKw];
      if (!price) return;

      if (originalKw === "7.0kW") kwEl.textContent = "7.1kW";

      const priceColumn = row.children[1];
      if (!priceColumn) return;
      Array.from(priceColumn.querySelectorAll("span")).forEach((span) => {
        const text = span.textContent.trim();
        if (span.children.length === 0 && /^\$[\d,]+$/.test(text) && text !== price) {
          span.textContent = price;
        }
        if (span.children.length === 0 && text.includes("12% OFF")) {
          span.textContent = "LOCAL DEAL · Limited spots";
        }
      });
    });
  };

  const replaceDaikinImage = () => {
    const section = document.getElementById("range-daikin-lite-local");
    if (!section) return;

    const imageWrap = section.querySelector('[data-testid="range-image-daikin-lite-local"]');
    const images = imageWrap ? imageWrap.querySelectorAll("img") : section.querySelectorAll("img");

    images.forEach((img) => {
      if (img.getAttribute("src") === coraUserImage) return;
      img.removeAttribute("srcset");
      img.removeAttribute("sizes");
      img.src = coraUserImage;
      img.alt = "Daikin Cora indoor unit";
      img.style.objectFit = "contain";
      img.style.objectPosition = "center";
    });
  };

  const originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function patchedSend(body) {
    if (typeof body === "string" && body.includes("local") && body.includes("installed")) {
      body = normaliseOfferText(body);
    }
    return originalSend.call(this, body);
  };

  const wireMetaTracking = () => {
    document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
      if (link.dataset.metaContactWired === "1") return;
      link.dataset.metaContactWired = "1";
      link.addEventListener("click", () => {
        if (typeof window.fbq === "function") {
          window.fbq("track", "Contact", {
            content_name: "Rinnai Local Split System Offer",
            contact_method: "phone",
          });
        }
      });
    });

    document.querySelectorAll('[data-testid="quote-success"]').forEach((success) => {
      if (success.dataset.metaLeadFired === "1") return;
      success.dataset.metaLeadFired = "1";
      if (typeof window.fbq === "function") {
        window.fbq("track", "Lead", {
          content_name: "Rinnai Local Split System Quote",
          content_category: "Split System Installation",
        });
      }
    });
  };

  const applyFixes = () => {
    applyExactRinnaiPrices();
    removeWasPrices();
    updateLocalOfferAreas();
    replaceDaikinImage();
    normaliseTextNodes(document.body);
    wireMetaTracking();

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
