(() => {
  const BLOCKED_DATES = new Set(["2026-10-06", "2026-10-09"]);

  const labelForDate = (iso) => {
    const date = new Date(`${iso}T00:00:00`);
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    if (
      date.getFullYear() === tomorrow.getFullYear() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getDate() === tomorrow.getDate()
    ) return "Tomorrow";
    return date.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
  };

  const blockedLabels = () => new Set(Array.from(BLOCKED_DATES, labelForDate));

  const isBlockedSlotButton = (button) => {
    if (!(button instanceof HTMLButtonElement)) return false;
    const text = (button.textContent || "").replace(/\s+/g, " ").trim();
    if (!/Morning|Afternoon/.test(text)) return false;
    return Array.from(blockedLabels()).some((label) => text.startsWith(label));
  };

  const enforceBlackouts = () => {
    document.querySelectorAll(".booking-page-section button").forEach((button) => {
      if (isBlockedSlotButton(button)) {
        button.disabled = true;
        button.setAttribute("aria-disabled", "true");
        button.style.display = "none";
      }
    });
  };

  document.addEventListener("click", (event) => {
    const button = event.target.closest?.("button");
    if (button && isBlockedSlotButton(button)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  const observer = new MutationObserver(enforceBlackouts);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", enforceBlackouts);
  enforceBlackouts();
})();