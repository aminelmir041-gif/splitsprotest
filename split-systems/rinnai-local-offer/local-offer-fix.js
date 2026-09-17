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
    if (field) field.style.display = "none";
  };

  const applyFixes = () => {
    document.querySelectorAll('[data-testid^="price-row-rinnai-local-"]').forEach((row) => {
      const kwEl = row.querySelector("span > span.block");
      if (!kwEl) return;
      const originalKw = kwEl.textContent.trim();
      const lookupKw = originalKw === "7.1kW" ? "7.1kW" : originalKw;
      const price = exactPrices[lookupKw];
      if (!price) return;

      if (originalKw === "7.0kW") kwEl.textContent = "7.1kW";

      const priceColumn = row.children[1];
      if (priceColumn) {
        Array.from(priceColumn.querySelectorAll("span")).forEach((span) => {
          const text = span.textContent.trim();
          if (/^\$[\d,]+$/.test(text)) span.textContent = price;
          if (text.includes("12% OFF")) span.textContent = "LOCAL DEAL · Limited spots";
        });
      }
    });

    document.querySelectorAll("span").forEach((span) => {
      const text = span.textContent.trim();
      if (text === "12% OFF") span.textContent = "LOCAL DEAL";
      if (text === "$2,102") span.textContent = "$2,100";
      if (text === "$1,398") span.textContent = "$1,400";
      if (text === "$1,486") span.textContent = "$1,500";
    });

    document.querySelectorAll('[data-testid="brand-selected-summary"]').forEach((summary) => {
      let text = summary.textContent;
      text = text.replace("$2,102", "$2,100").replace("$1,398", "$1,400").replace("$1,486", "$1,500");
      summary.textContent = text;
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

  const observer = new MutationObserver(applyFixes);
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  document.addEventListener("DOMContentLoaded", applyFixes);
  window.addEventListener("load", applyFixes);
  applyFixes();
})();
