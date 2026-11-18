// Internal costing assumptions: keep these figures off customer-facing pages.
// Supplier unit prices were recorded including GST; validate tax treatment on all inputs
// before relying on these indicative prices as a guaranteed realised margin.
export const DAIKIN_WHOLESALE_COST = Object.freeze({
  "7.1": 2747.06,
  "8.5": 3206.38,
  "10": 3457.72,
  "12.5": 3977.26,
  "14": 4540.97,
  "16": 5003.49,
  "20": 5493.32,
  "25": 6777.36,
});

export const DUCTED_CREW_LABOUR = 1400;
export const DUCTED_BASE_MATERIALS = 1900; // Original four-zone / six-outlet supply allowance
export const DUCTED_EXTRA_OUTLET = 300;
export const TARGET_GROSS_MARGIN = 0.30;

// Essential: 2 zones / up to 6 outlets. Reuse the six-outlet material allowance
// conservatively until a separate two-zone bill of materials is confirmed.
// Comfort: 4 zones / up to 8 outlets, two extra outlets above the six-outlet baseline.
// Premium: 6 zones / up to 10 outlets. Do not publish a guessed 30% margin price
// until the six-zone controller, dampers, duct and labour are completely costed.
export const daikinInstalledPrice = (size, packageId) => {
  const unitCost = DAIKIN_WHOLESALE_COST[String(size)];
  if (unitCost == null || packageId === "premium") return null;
  if (packageId !== "essential" && packageId !== "comfort") return null;
  const extraOutlets = packageId === "comfort" ? 2 : 0;
  const totalCost = unitCost + DUCTED_CREW_LABOUR + DUCTED_BASE_MATERIALS
    + extraOutlets * DUCTED_EXTRA_OUTLET;
  // Round UP, never down, so display-price rounding doesn't reduce the target margin.
  return Math.ceil((totalCost / (1 - TARGET_GROSS_MARGIN)) / 10) * 10;
};

export const daikinPriceLabel = (size, packageId) => {
  const price = daikinInstalledPrice(size, packageId);
  return price == null ? "Price on request" : "$" + price.toLocaleString("en-AU");
};
