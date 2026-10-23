// A local display fallback while the live checkout service responds.
// The server remains the source of truth for payment and available dates.
export const scheduledCleaningPrice = (when = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(when);
  const value = (type) => Number(parts.find((part) => part.type === type)?.value);
  const sydneyDay = Date.UTC(value("year"), value("month") - 1, value("day"));
  const firstThursday = Date.UTC(2026, 9, 22);
  const steps = Math.min(4, Math.max(0, Math.floor((sydneyDay - firstThursday) / (7 * 86400000))));
  return 220 + steps * 20;
};
