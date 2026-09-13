(() => {
  const splitSummary = "Standard Clean $100: filters, covers, accessible coil surface, drain and operation check. Deep Clean $180 limited-time local offer: full indoor wash including coil, blower wheel and drain area.";
  const localFinePrint = "Limited-time local pricing for Bass Hill, Chester Hill and selected nearby suburbs. Standard wall-mounted split systems only. Heavy contamination, difficult access or repairs are quoted separately and confirmed before work starts.";

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

  const addPlanSummary = () => {
    if (!location.pathname.includes("split-system-cleaning")) return;
    if (document.querySelector("[data-splitspro-plan-summary]")) return;
    const target = [...document.querySelectorAll("h2,h3")].find((el) => el.textContent?.trim() === "Pick your clean.");
    if (!target) return;
    const box = document.createElement("div");
    box.dataset.splitsproPlanSummary = "true";
    box.style.cssText = "margin-top:18px;padding:18px;border:1px solid rgba(200,164,106,.35);border-radius:16px;background:rgba(255,255,255,.04);color:#fff;font-size:13px;line-height:1.65";
    box.innerHTML = '<strong style="color:#DAB66E">Standard Clean — $100</strong><br>Filters, covers, accessible coil surface, drain and operation check.<br><br><strong style="color:#DAB66E">Deep Clean — $180 limited-time offer</strong><br>Protective wash setup with a more thorough clean of the indoor coil, blower wheel and drain area.';
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
        splitSummary
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
      replaceExactText("$99", "$100");
      replaceExactText("$300", "$180");
      replaceContainingText("For a unit that just needs a freshen-up", "For regular maintenance and a freshen-up");
      replaceContainingText("For the full fresh-start feeling", "A more thorough wash for built-up dirt and grime");
      replaceContainingText(
        "Less dust. Smoother airflow. No stale air-con smell. Bring back that fresh, crisp feeling every time you switch it on.",
        "Standard Clean $100 or step up to our $180 Deep Clean limited-time local offer for Bass Hill, Chester Hill and selected nearby suburbs."
      );
      replaceContainingText(
        "Standard wall-mounted split pricing. If your system needs anything outside a normal clean, we’ll confirm it with you first.",
        localFinePrint
      );
      addOfferBadge();
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
