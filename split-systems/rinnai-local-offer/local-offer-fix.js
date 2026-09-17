(() => {
  const exactPrices = {
    "2.5kW": "$1,400",
    "3.5kW": "$1,500",
    "5.0kW": "$1,750",
    "7.0kW": "$2,100",
    "7.1kW": "$2,100",
  };

  let redirectedHash = false;

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
        // Remove only the crossed-out regular/"Was" price. Keep the live offer price.
        Array.from(priceColumn.querySelectorAll("span")).forEach((span) => {
          const text = span.textContent.trim();
          if (/^Was\s+\$[\d,]+$/i.test(text)) {
            span.remove();
            return;
          }

          // Only alter leaf spans so the layout and nested markup stay intact.
          if (span.children.length === 0 && /^\$[\d,]+$/.test(text) && text !== price) {
            span.textContent = price;
          }
          if (span.children.length === 0 && text.includes("12% OFF")) {
            span.textContent = "LOCAL DEAL · Limited spots";
          }
        });
      }
    });

    // Preserve the page structure while correcting any remaining old calculated prices.
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
