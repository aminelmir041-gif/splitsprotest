(() => {
  const overviewSummary = "Standard Clean $100: filters, covers, accessible coil surface, drain and operation check. Deep Clean $180 limited-time local offer: full indoor wash including coil, blower wheel and drain area.";
  const localFinePrint = "Limited-time local pricing for Bass Hill, Chester Hill and selected nearby suburbs. Standard wall-mounted split systems only. Two-for-$120 pricing applies to two Standard Cleans at the same property. Heavy contamination, difficult access or repairs are quoted separately and confirmed before work starts.";

  const replaceExactText = (from, to) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (node.nodeValue && node.nodeValue.trim() === from) node.nodeValue = node.nodeValue.replace(from, to);
    });
  };

  const replaceContainingText = (from, to) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (node.nodeValue && node.nodeValue.includes(from)) node.nodeValue = node.nodeValue.replace(from, to);
    });
  };

  const addOfferBadge = () => {
    const deepHeadings = [...document.querySelectorAll("h1,h2,h3,span,p,button")].filter((el) => el.textContent?.trim() === "Deep Clean");
    deepHeadings.forEach((el) => {
      const parent = el.parentElement;
      if (!parent || parent.querySelector("[data-splitspro-cleaning-offer]")) return;
      const badge = document.createElement("span");
      badge.dataset.splitsproCleaningOffer = "true";
      badge.textContent = "LIMITED TIME OFFER";
      badge.style.cssText = "display:inline-block;margin-left:8px;padding:4px 8px;border-radius:999px;background:#C8A46A;color:#0B0B0B;font-size:9px;font-weight:800;letter-spacing:.08em;vertical-align:middle";
      parent.appendChild(badge);
    });
  };

  const addStandardMultiUnitOption = () => {
    if (!location.pathname.includes("split-system-cleaning")) return;
    if (document.querySelector("[data-splitspro-standard-multi]")) return;

    const heading = [...document.querySelectorAll("h1,h2,h3,h4,span,p")].find((el) => {
      if (el.closest("[data-splitspro-plan-summary]")) return false;
      if (el.closest("[data-splitspro-standard-multi]")) return false;
      return el.textContent?.trim() === "Standard Clean";
    });
    if (!heading) return;

    let host = heading.parentElement;
    let current = heading.parentElement;
    for (let i = 0; current && i < 6; i += 1, current = current.parentElement) {
      const text = current.textContent || "";
      if (text.includes("Standard Clean") && (text.includes("$80") || text.includes("80")) && !text.includes("Deep Clean")) {
        host = current;
        break;
      }
    }
    if (!host) return;

    const details = document.createElement("details");
    details.dataset.splitsproStandardMulti = "true";
    details.style.cssText = "margin-top:14px;border:1px solid rgba(200,164,106,.38);border-radius:12px;background:rgba(200,164,106,.07);overflow:hidden;color:inherit";

    const summary = document.createElement("summary");
    summary.style.cssText = "cursor:pointer;list-style:none;padding:13px 14px;font-size:13px;font-weight:800;color:#DAB66E;display:flex;align-items:center;justify-content:space-between;gap:10px";
    summary.innerHTML = '<span>2 Standard Cleans — <strong>$120</strong> <span style="font-weight:600;color:rgba(255,255,255,.72)">(same property)</span></span><span style="font-size:16px">⌄</span>';

    const body = document.createElement("div");
    body.style.cssText = "padding:0 14px 14px;color:rgba(255,255,255,.78);font-size:12px;line-height:1.55";
    body.innerHTML = "Have two wall-mounted split systems at the same property? Book both Standard Cleans together for <strong style=\"color:#fff\">$120 total</strong>. If either unit needs heavy mould, slime, a blocked drain or a full internal wash, we’ll confirm the Deep Clean option before starting.";

    details.appendChild(summary);
    details.appendChild(body);
    host.appendChild(details);
  };

  const addPlanSummary = () => {
    if (!location.pathname.includes("split-system-cleaning")) return;
    if (document.querySelector("[data-splitspro-plan-summary]")) return;
    const target = [...document.querySelectorAll("h2,h3")].find((el) => el.textContent?.trim() === "Pick your clean.");
    if (!target) return;
    const box = document.createElement("div");
    box.dataset.splitsproPlanSummary = "true";
    box.style.cssText = "margin-top:18px;padding:18px;border:1px solid rgba(200,164,106,.35);border-radius:16px;background:rgba(255,255,255,.04);color:#fff;font-size:13px;line-height:1.65";
    box.innerHTML = '<strong style="color:#DAB66E">Standard Clean — $80</strong><br>Filters, covers, accessible coil surface, drain and operation check.<br><span style="color:#DAB66E;font-weight:700">2 Standard Cleans — $120 total at the same property</span><br><br><strong style="color:#DAB66E">Deep Clean — $180 limited-time offer</strong><br>Protective wash setup with a more thorough clean of the indoor coil, blower wheel and drain area.';
    target.parentElement?.appendChild(box);
  };

  const apply = () => {
    const path = location.pathname.replace(/\/+$/, "");

    if (path.endsWith("/cleaning")) {
      replaceExactText("From $99", "From $100");
      replaceExactText("$99 Refresh", "$100 Standard");
      replaceExactText("$300 Deep Clean", "$180 Deep Clean · Limited Offer");
      replaceContainingText(
        "Choose a quick Refresh Clean or go all-in with a Deep Clean for the coil, blower, drain and internal grime.",
        overviewSummary
      );
      replaceContainingText(
        "Two systems. Two proper cleaning pages.",
        "Split or ducted. See the service at a glance."
      );
      replaceContainingText(
        "No giant menu of random options. Pick the system you have and we’ll show you exactly what the clean includes and what it costs.",
        "Quickly compare split-system and ducted cleaning, see the starting price and know what each service covers before you book."
      );
    }

    if (path.endsWith("/split-system-cleaning")) {
      replaceExactText("Refresh Clean", "Standard Clean");
      replaceExactText("$99", "$80");
      replaceExactText("$100", "$80");
      replaceExactText("$300", "$180");
      replaceContainingText("For a unit that just needs a freshen-up", "For regular maintenance and a freshen-up");
      replaceContainingText("For the full fresh-start feeling", "A more thorough wash for built-up dirt and grime");
      replaceContainingText(
        "Less dust. Smoother airflow. No stale air-con smell. Bring back that fresh, crisp feeling every time you switch it on.",
        "Standard Clean $80, or 2 Standard Cleans for $120 at the same property. Step up to our $180 Deep Clean limited-time local offer for Bass Hill, Chester Hill and selected nearby suburbs."
      );
      replaceContainingText(
        "Standard wall-mounted split pricing. If your system needs anything outside a normal clean, we’ll confirm it with you first.",
        localFinePrint
      );
      addOfferBadge();
      addStandardMultiUnitOption();
      addPlanSummary();
    }
  };

  let lastPath = location.pathname;
  const observer = new MutationObserver(() => {
    if (location.pathname !== lastPath) lastPath = location.pathname;
    apply();
  });

  const start = () => {
    apply();
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    window.setInterval(apply, 1200);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
