import coraUserImage from "/src/lib/embedded/cora.js";

(() => {
  const RINNAI_PRICES = {
    "2.5kW": "$1,450",
    "3.5kW": "$1,550",
    "5.0kW": "$1,900",
    "7.0kW": "$2,300",
    "7.1kW": "$2,300",
  };

  const DAIKIN_PRICES = {
    "2.5kW": "$1,700",
    "3.5kW": "$1,900",
    "5.0kW": "$2,300",
    "7.0kW": "$2,700",
    "7.1kW": "$2,700",
  };

  const localOfferAreas = [
    "Sydney Metro",
    "Western Sydney",
    "South West Sydney",
    "Inner West",
    "Eastern Suburbs",
    "Northern Sydney",
    "Sutherland Shire",
    "Macarthur",
    "Central Coast",
    "Wollongong",
  ];

  let currentSelection = null;
  let redirectedHash = false;

  const findLeafText = (root, pattern) =>
    Array.from((root || document).querySelectorAll("*")).find(
      (el) => el.children.length === 0 && pattern.test((el.textContent || "").trim())
    );

  const textNodes = (root) => {
    const out = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) out.push(walker.currentNode);
    return out;
  };

  const normaliseVisibleCopy = (root = document.body) => {
    if (!root) return;
    textNodes(root).forEach((node) => {
      let t = node.nodeValue || "";

      t = t
        .replaceAll("Rinnai & Daikin Split System Local Installation Sale", "Rinnai & Daikin Cora Split System Installed Specials")
        .replaceAll("Limited-time Rinnai & Daikin supplied & installed back-to-back sale.", "Installed within 7 days — Installation Guarantee. Supplied & installed with no more to pay on qualifying standard installations.")
        .replaceAll("Daikin Lite Series", "Daikin Cora")
        .replaceAll("Daikin Lite", "Daikin Cora")
        .replaceAll("Lite Series", "Cora")
        .replaceAll("under 2 metres", "up to 3 metres")
        .replaceAll("Under 2 metres", "Up to 3 metres")
        .replaceAll("Under 2m pipe", "Up to 3m pipe")
        .replaceAll("under two metres", "up to three metres")
        .replaceAll("Choose from our local Rinnai offer first, then compare the Daikin Lite local offer below.", "Choose from our Rinnai installed specials first, then compare the Daikin Cora specials below.")
        .replaceAll("What the local price includes", "What the installed price includes")
        .replaceAll("advertised local sale", "advertised installed price");

      if (/%\s*OFF/i.test(t)) t = t.replace(/\b\d+%\s*OFF\b/gi, "INSTALLED SPECIAL");

      if (t !== node.nodeValue) node.nodeValue = t;
    });
  };

  const removeDiscountLanguage = () => {
    document.querySelectorAll("span, p, div").forEach((el) => {
      if (el.children.length !== 0) return;
      const t = (el.textContent || "").trim();
      if (/^Was\s+\$[\d,]+$/i.test(t)) {
        el.remove();
        return;
      }
      if (/\b\d+%\s*OFF\b/i.test(t)) {
        el.textContent = t.replace(/\b\d+%\s*OFF\b/gi, "INSTALLED SPECIAL");
      }
    });
  };

  const updateHero = () => {
    const h1 = Array.from(document.querySelectorAll("h1")).find((el) =>
      /Rinnai.*Daikin.*(?:Local Installation Sale|Installed Specials)/i.test(el.textContent || "")
    );

    if (h1) {
      h1.textContent = "Rinnai & Daikin Cora Split System Installed Specials";
      const wrap = h1.parentElement;
      if (wrap && !wrap.querySelector('[data-local-7-day-hero="1"]')) {
        const badge = document.createElement("div");
        badge.dataset.local7DayHero = "1";
        badge.textContent = "INSTALLED WITHIN 7 DAYS — INSTALLATION GUARANTEE";
        Object.assign(badge.style, {
          display: "inline-flex",
          marginTop: "14px",
          padding: "9px 14px",
          borderRadius: "999px",
          background: "#C8A46A",
          color: "#0B0B0B",
          fontSize: "12px",
          fontWeight: "900",
          letterSpacing: ".08em",
          textTransform: "uppercase",
        });
        wrap.appendChild(badge);
      }
    }

    const sub = findLeafText(document, /^Limited-time Rinnai.*Daikin supplied/i);
    if (sub) {
      sub.textContent = "Installed within 7 days — Installation Guarantee. Supplied & installed with no more to pay on qualifying standard installations.";
    }
  };

  const updateOfferStrip = () => {
    const strip = document.querySelector('[data-testid="rinnai-local-offer-strip"]');
    if (!strip) return;

    const product = findLeafText(strip, /Rinnai supplied\s*&\s*installed/i);
    if (product) product.textContent = "7.0kW Rinnai supplied & installed";

    const price = findLeafText(strip, /^(Now\s+)?\$[\d,]+$/i);
    if (price) price.textContent = "$2,300";

    strip.querySelectorAll("span").forEach((span) => {
      const t = (span.textContent || "").trim();
      if (/^Was\s+\$/i.test(t)) span.remove();
      if (/\b\d+%\s*OFF\b/i.test(t)) span.remove();
    });

    const priceWrap = product?.parentElement;
    if (priceWrap && !priceWrap.querySelector('[data-no-more-to-pay-strip="1"]')) {
      const noMore = document.createElement("span");
      noMore.dataset.noMoreToPayStrip = "1";
      noMore.textContent = "NO MORE TO PAY*";
      Object.assign(noMore.style, {
        display: "inline-flex",
        alignItems: "center",
        padding: "7px 11px",
        borderRadius: "999px",
        background: "#C8A46A",
        color: "#0B0B0B",
        fontSize: "11px",
        fontWeight: "900",
        letterSpacing: ".09em",
      });

      const guarantee = document.createElement("span");
      guarantee.dataset.localInstallGuarantee = "1";
      guarantee.textContent = "INSTALLED WITHIN 7 DAYS — GUARANTEED";
      Object.assign(guarantee.style, {
        display: "inline-flex",
        alignItems: "center",
        padding: "7px 11px",
        borderRadius: "999px",
        border: "1px solid rgba(255,255,255,.25)",
        background: "rgba(255,255,255,.08)",
        color: "#fff",
        fontSize: "11px",
        fontWeight: "800",
        letterSpacing: ".07em",
      });

      priceWrap.append(noMore, guarantee);
    }

    const info = Array.from(strip.querySelectorAll("p")).find((p) =>
      /Sale prices are for|standard installation conditions|non-standard work/i.test(p.textContent || "")
    );
    if (info) {
      info.textContent =
        "No more to pay applies to the standard installation conditions explained below. Pipe runs over 3 metres and other non-standard work are quoted before the job proceeds.";
    }
  };

  const updateLocalOfferAreas = () => {
    const areaSection = document.querySelector('[data-testid="rinnai-local-areas-hero"]');
    if (!areaSection) return;
    const areaWrap = Array.from(areaSection.querySelectorAll("div")).find((div) => div.querySelector("span"));
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

  const addLocalAreaEligibilityNote = () => {
    const areaSection = document.querySelector('[data-testid="rinnai-local-areas-hero"]');
    if (!areaSection || areaSection.querySelector('[data-local-area-eligibility-note="1"]')) return;

    const note = document.createElement("div");
    note.dataset.localAreaEligibilityNote = "1";
    Object.assign(note.style, {
      margin: "0 0 14px",
      padding: "14px 16px",
      border: "1px solid rgba(225,193,132,.35)",
      borderRadius: "10px",
      background: "rgba(225,193,132,.08)",
      color: "#fff",
    });

    note.innerHTML =
      '<div style="font-weight:800;font-size:15px;line-height:1.35;margin-bottom:5px">Servicing Sydney, the Central Coast and Wollongong.</div>' +
      '<div style="font-size:13px;line-height:1.45;color:rgba(255,255,255,.78)">Send us your suburb to confirm installation availability.</div>';

    const areaWrap = Array.from(areaSection.querySelectorAll("div")).find((div) => div.querySelector("span"));
    if (areaWrap) areaSection.insertBefore(note, areaWrap);
    else areaSection.prepend(note);
  };

  const getKw = (row) => {
    const kw = Array.from(row.querySelectorAll("span")).find((s) =>
      /^\d+(?:\.\d+)?kW$/i.test((s.textContent || "").trim())
    );
    return kw ? kw.textContent.trim() : "";
  };

  const rewritePriceColumn = (row, price) => {
    const priceColumn = row.children[1];
    if (!priceColumn || !price) return;

    priceColumn.innerHTML = "";
    const wrapper = document.createElement("span");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "flex-start";

    const label = document.createElement("span");
    label.textContent = "SUPPLIED & INSTALLED";
    Object.assign(label.style, {
      fontSize: "10px",
      fontWeight: "800",
      letterSpacing: ".14em",
      textTransform: "uppercase",
      color: "#8A8A8E",
    });

    const amount = document.createElement("span");
    amount.textContent = price;
    Object.assign(amount.style, {
      marginTop: "4px",
      fontFamily: "Georgia, serif",
      fontSize: "30px",
      lineHeight: "1.05",
      color: "#0B0B0B",
    });

    const noMore = document.createElement("span");
    noMore.textContent = "NO MORE TO PAY*";
    Object.assign(noMore.style, {
      marginTop: "6px",
      fontSize: "11px",
      fontWeight: "900",
      letterSpacing: ".12em",
      textTransform: "uppercase",
      color: "#9A733A",
    });

    wrapper.append(label, amount, noMore);
    priceColumn.appendChild(wrapper);
  };

  const addSevenDayBadge = (row) => {
    if (!row || row.querySelector('[data-seven-day-unit-badge="1"]')) return;
    const unitColumn = row.children[0];
    if (!unitColumn) return;

    const badge = document.createElement("span");
    badge.dataset.sevenDayUnitBadge = "1";
    badge.textContent = "INSTALLED WITHIN 7 DAYS — GUARANTEED";
    Object.assign(badge.style, {
      display: "inline-flex",
      alignItems: "center",
      marginTop: "8px",
      padding: "5px 9px",
      borderRadius: "999px",
      border: "1px solid rgba(200,164,106,.55)",
      background: "#FFF8E8",
      color: "#7B5A28",
      fontSize: "10px",
      lineHeight: "1.2",
      fontWeight: "900",
      letterSpacing: ".07em",
      textTransform: "uppercase",
    });
    unitColumn.appendChild(badge);
  };

  const wireSelection = (row, brand, kw, price) => {
    addSevenDayBadge(row);
    const btn = row.querySelector("button");
    if (!btn || btn.dataset.localPriceWired === "1") return;
    btn.dataset.localPriceWired = "1";
    btn.addEventListener(
      "click",
      () => {
        currentSelection = { brand, kw, price };
      },
      true
    );
  };

  const applyPrices = () => {
    document.querySelectorAll('[data-testid^="price-row-rinnai-local-"]').forEach((row) => {
      const kw = getKw(row);
      const price = RINNAI_PRICES[kw];
      rewritePriceColumn(row, price);
      wireSelection(row, "Rinnai Split Systems", kw, price);
    });

    document.querySelectorAll('[data-testid^="price-row-daikin-lite-local-"]').forEach((row) => {
      const kw = getKw(row);
      const price = DAIKIN_PRICES[kw];
      rewritePriceColumn(row, price);
      wireSelection(row, "Daikin Cora", kw, price);
    });

    const summary = document.querySelector('[data-testid="brand-selected-summary"]');
    if (summary && currentSelection?.price) {
      summary.textContent = `${currentSelection.price} · Supplied & Installed · Installed within 7 days · No more to pay*`;
    }
  };

  const updateRinnaiFeatures = () => {
    const features = document.querySelector('[data-testid="feature-details-rinnai-local"]');
    if (!features) return;

    let box = features.querySelector('[data-rinnai-warranty-highlight="1"]');
    if (!box) {
      box = document.createElement("div");
      box.dataset.rinnaiWarrantyHighlight = "1";
      Object.assign(box.style, {
        margin: "0 0 20px",
        padding: "18px 20px",
        border: "2px solid #C8A46A",
        borderRadius: "14px",
        background: "#FFF8E8",
      });
      box.innerHTML =
        '<div style="font-size:11px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:#8F6A34">Rinnai installed special</div>' +
        '<div style="margin-top:4px;font-size:34px;line-height:1;font-weight:950;color:#0B0B0B">7-YEAR WARRANTY</div>' +
        '<div style="margin-top:8px;font-size:13px;line-height:1.45;color:#5F5F63">Big warranty protection plus our 7-day installation guarantee on eligible standard installs.</div>';
      const title = features.querySelector("p");
      if (title?.nextSibling) features.insertBefore(box, title.nextSibling);
      else features.appendChild(box);
    }

    const grid = features.querySelector(".grid");
    if (grid && !grid.querySelector('[data-rinnai-local-extra="1"]')) {
      const extra = document.createElement("div");
      extra.dataset.rinnaiLocalExtra = "1";
      extra.innerHTML =
        '<div style="font-size:12px;font-weight:800;color:#0B0B0B">7-Day Installation Guarantee</div>' +
        '<div style="margin-top:3px;font-size:11px;line-height:1.4;color:#6E6E73">Eligible standard installs completed within 7 days.</div>' +
        '<div style="margin-top:10px;font-size:12px;font-weight:800;color:#0B0B0B">No More To Pay*</div>' +
        '<div style="margin-top:3px;font-size:11px;line-height:1.4;color:#6E6E73">Advertised installed price for qualifying standard installations.</div>';
      grid.appendChild(extra);
    }
  };

  const updateDaikinSection = () => {
    const section = document.getElementById("range-daikin-lite-local");
    if (!section) return;

    textNodes(section).forEach((node) => {
      const t = node.nodeValue || "";
      const n = t
        .replaceAll("Daikin Lite Series", "Daikin Cora")
        .replaceAll("Daikin Lite", "Daikin Cora")
        .replaceAll("Lite Series", "Cora");
      if (n !== t) node.nodeValue = n;
    });

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

    const features = section.querySelector('[data-testid="feature-details-daikin-lite-local"]');
    if (features && !features.querySelector('[data-daikin-cora-offer-features="1"]')) {
      features.innerHTML = "";
      const wrap = document.createElement("div");
      wrap.dataset.daikinCoraOfferFeatures = "1";
      wrap.innerHTML = `
        <div style="font-size:10px;font-weight:900;letter-spacing:.2em;text-transform:uppercase;color:#008CCF;margin-bottom:14px">Daikin Cora key features</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px">
          <div style="border:1px solid #E5E5EA;border-radius:12px;padding:14px;background:#fff">
            <div style="font-size:14px;font-weight:900;color:#0B0B0B">5-Year Warranty</div>
            <div style="margin-top:4px;font-size:12px;line-height:1.4;color:#6E6E73">Daikin manufacturer warranty for long-term peace of mind.</div>
          </div>
          <div style="border:1px solid #E5E5EA;border-radius:12px;padding:14px;background:#fff">
            <div style="font-size:14px;font-weight:900;color:#0B0B0B">7-Day Installation Guarantee</div>
            <div style="margin-top:4px;font-size:12px;line-height:1.4;color:#6E6E73">Eligible standard installations completed within 7 days.</div>
          </div>
          <div style="border:1px solid #E5E5EA;border-radius:12px;padding:14px;background:#fff">
            <div style="font-size:14px;font-weight:900;color:#0B0B0B">Blue Fin Anti-Corrosive Coating</div>
            <div style="margin-top:4px;font-size:12px;line-height:1.4;color:#6E6E73">Added outdoor heat-exchanger protection suited to coastal areas.</div>
          </div>
          <div style="border:1px solid #C8A46A;border-radius:12px;padding:14px;background:#FFF8E8">
            <div style="font-size:14px;font-weight:900;color:#0B0B0B">No More To Pay*</div>
            <div style="margin-top:4px;font-size:12px;line-height:1.4;color:#6E6E73">The advertised installed price applies to qualifying standard installations.</div>
          </div>
        </div>
      `;
      features.appendChild(wrap);
    }
  };

  const updateDisclaimers = () => {
    const copy =
      "*No more to pay applies to qualifying standard installations including up to 3 metres of refrigeration pipework and standard electrical installation. Pipe runs over 3 metres, switchboard upgrades, difficult access, asbestos-related work and other non-standard requirements are quoted before proceeding.";

    [
      '[data-testid="disclaimer-rinnai-local"]',
      '[data-testid="disclaimer-daikin-lite-local"]',
    ].forEach((selector) => {
      const el = document.querySelector(selector);
      if (el) {
        el.textContent = copy;
        el.style.fontSize = "11px";
        el.style.lineHeight = "1.45";
        el.style.color = "#77777B";
      }
    });

    document.querySelectorAll('[data-testid="back-to-back-explained"] *').forEach((el) => {
      if (el.children.length !== 0) return;
      const t = (el.textContent || "").trim();
      if (/under 2 metres/i.test(t)) el.textContent = t.replace(/under 2 metres/gi, "up to 3 metres");
      if (/Under 2m pipe/i.test(t)) el.textContent = t.replace(/Under 2m pipe/gi, "Up to 3m pipe");
    });
  };

  const hideFieldByTestId = (testId) => {
    const el = document.querySelector(`[data-testid="${testId}"]`);
    if (!el) return;
    const field = el.closest("div");
    if (field) field.style.display = "none";
  };

  const patchRequestBody = (body) => {
    if (typeof body !== "string") return body;
    let next = body
      .replaceAll("Daikin Lite Series", "Daikin Cora")
      .replaceAll("Daikin Lite", "Daikin Cora");

    if (currentSelection?.price && currentSelection?.kw) {
      next = next.replace(/\$[\d,]+(?=\s*(?:supplied|installed|%C2%B7|·|$))/gi, currentSelection.price);
      next = next.replace(/Rinnai Split Systems\s+\d+(?:\.\d+)?kW/gi, `${currentSelection.brand} ${currentSelection.kw}`);
      next = next.replace(/Daikin (?:Lite Series|Cora)\s+\d+(?:\.\d+)?kW/gi, `${currentSelection.brand} ${currentSelection.kw}`);
    }

    return next;
  };

  if (!XMLHttpRequest.prototype.__splitsProLocalOfferPatched) {
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function patchedSend(body) {
      return originalSend.call(this, patchRequestBody(body));
    };
    XMLHttpRequest.prototype.__splitsProLocalOfferPatched = true;
  }

  const wireMetaTracking = () => {
    document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
      if (link.dataset.metaContactWired === "1") return;
      link.dataset.metaContactWired = "1";
      link.addEventListener("click", () => {
        if (typeof window.fbq === "function") {
          window.fbq("track", "Contact", {
            content_name: "Rinnai & Daikin Cora Installed Specials",
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
          content_name: "Split System Installed Specials",
          content_category: "Split System Installation",
        });
      }
    });
  };

  const applyFixes = () => {
    normaliseVisibleCopy();
    removeDiscountLanguage();
    updateHero();
    updateOfferStrip();
    updateLocalOfferAreas();
    addLocalAreaEligibilityNote();
    applyPrices();
    updateRinnaiFeatures();
    updateDaikinSection();
    updateDisclaimers();
    wireMetaTracking();

    hideFieldByTestId("quote-email-input");
    hideFieldByTestId("quote-address-input");
    hideFieldByTestId("quote-date");
    hideFieldByTestId("quote-photo-btn");
    hideFieldByTestId("quote-photo-input");

    const submit = document.querySelector('[data-testid="quote-submit-btn"]');
    if (submit && submit.textContent.trim() !== "GET MY INSTALLED PRICE") {
      submit.textContent = "GET MY INSTALLED PRICE";
    }

    if (!redirectedHash && (window.location.hash === "#range-pb-series" || window.location.hash.startsWith("#range-rinnai-local"))) {
      const target = document.getElementById("range-rinnai-local");
      if (target) {
        redirectedHash = true;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (window.location.hash === "#range-pb-series") {
          history.replaceState(null, "", `${window.location.pathname}#range-rinnai-local`);
        }
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
