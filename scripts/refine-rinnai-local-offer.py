from pathlib import Path
import re

PATH = Path("src/pages/BrandPage.jsx")
text = PATH.read_text()

text = text.replace(
    "advertised single-storey back-to-back terms",
    "advertised ground-floor back-to-back terms",
)
text = text.replace(
    "qualifying single-storey back-to-back installations: units aligned vertically or horizontally, under 1 metre of pipework, one bend or less, outdoor unit on a wall bracket or floor, with standard electrical work included.",
    "qualifying ground-floor back-to-back installations: units aligned vertically or horizontally, under 2 metres of refrigeration pipework, one bend or less, outdoor unit on a wall bracket or floor, electrical run under 10 metres, with standard electrical work included.",
)

# Add local-sale feature rows so the local Rinnai and Daikin Lite sections do not
# inherit the PB/PX naming from the main Rinnai brand page.
if '"rinnai-local": [' not in text:
    text = text.replace(
        "const NON_DAIKIN_FEATURES = {\n",
        '''const NON_DAIKIN_FEATURES = {\n  "rinnai-local": [\n    { title: "Reverse Cycle", desc: "Heating and cooling from one split system for year-round comfort.", fallback: Thermometer },\n    { title: "Inverter Comfort", desc: "Variable-speed operation helps maintain a steadier room temperature.", fallback: Fan },\n    { title: "Wi-Fi Control", desc: "Smart control is available on the Rinnai system used for this local offer.", fallback: Wifi },\n    { title: "Local Installation Deal", desc: "Special supplied-and-installed pricing for qualifying local back-to-back jobs.", fallback: ShieldCheck },\n  ],\n  "daikin-lite-local": [\n    { title: "Reverse Cycle", desc: "Heating and cooling in one practical Daikin split system.", fallback: Thermometer },\n    { title: "Inverter Operation", desc: "Designed to adjust output as the room approaches the set temperature.", fallback: Fan },\n    { title: "R32 Refrigerant", desc: "Uses R32 refrigerant, as used across Daikin's current residential split range.", fallback: Droplets },\n    { title: "Local Installation Deal", desc: "Special supplied-and-installed pricing for qualifying local back-to-back jobs.", fallback: ShieldCheck },\n  ],\n''',
    )

# Local offer ranges: Rinnai first, Daikin Lite second. The PB and PX sections
# remain untouched on the normal Rinnai brand page but are not shown on this offer page.
if "const RINNAI_LOCAL_OFFER_RANGES" not in text:
    marker = '''const getRinnaiLocalSalePrice = (price) => {\n  const regular = Number(String(price).replace(/[^0-9.]/g, ""));\n  if (!Number.isFinite(regular)) return price;\n  const sale = Math.round(regular * RINNAI_LOCAL_SALE_FACTOR);\n  return `$${sale.toLocaleString("en-AU")}`;\n};\n'''
    local_ranges = marker + '''\nconst RINNAI_LOCAL_OFFER_RANGES = [\n  {\n    slug: "rinnai-local",\n    manufacturer: "Rinnai",\n    name: "Rinnai Split Systems",\n    displayName: "Rinnai Split Systems",\n    tabLabel: "Rinnai",\n    localBrand: "Rinnai",\n    blurb: "Our local Rinnai supplied-and-installed offer for straightforward ground-floor back-to-back installations. Choose the capacity that suits your room and claim the limited local price while spots are available.",\n    image: SPLIT_BRANDS.find((b) => b.slug === "rinnai")?.ranges?.[0]?.image,\n    prices: [\n      { kw: "2.5kW", price: "$1,590" },\n      { kw: "3.5kW", price: "$1,690" },\n      { kw: "5.0kW", price: "$1,990" },\n      { kw: "7.0kW", price: "$2,390" },\n    ],\n  },\n  {\n    slug: "daikin-lite-local",\n    manufacturer: "Daikin",\n    name: "Lite Series",\n    displayName: "Daikin Lite Series",\n    tabLabel: "Daikin Lite",\n    localBrand: "Daikin",\n    blurb: "A simple, dependable Daikin option for customers who want a recognised brand at a sharp local supplied-and-installed price. These prices use the same qualifying back-to-back installation conditions explained above.",\n    image: SPLIT_BRANDS.find((b) => b.slug === "daikin")?.image,\n    prices: [\n      { kw: "2.5kW", price: "$1,500", localOfferPrice: "$1,500" },\n      { kw: "3.5kW", price: "$1,700", localOfferPrice: "$1,700" },\n      { kw: "5.0kW", price: "$2,200", localOfferPrice: "$2,200" },\n      { kw: "7.0kW", price: "$2,600", localOfferPrice: "$2,600" },\n    ],\n  },\n];\n'''
    if marker not in text:
        raise SystemExit("Could not find Rinnai sale-price helper")
    text = text.replace(marker, local_ranges, 1)

# Use the two local-offer sections only on the local-offer route.
if "const displayRanges =" not in text:
    text = text.replace(
        '  const brand = SPLIT_BRANDS.find((b) => b.slug === (isRinnaiLocalOffer ? "rinnai" : slug));\n',
        '  const brand = SPLIT_BRANDS.find((b) => b.slug === (isRinnaiLocalOffer ? "rinnai" : slug));\n  const displayRanges = isRinnaiLocalOffer ? RINNAI_LOCAL_OFFER_RANGES : brand?.ranges || [];\n',
        1,
    )

text = text.replace(
    "const effectivePrice = isRinnaiLocalOffer ? getRinnaiLocalSalePrice(priceRow.price) : priceRow.price;",
    "const effectivePrice = isRinnaiLocalOffer ? (priceRow.localOfferPrice || getRinnaiLocalSalePrice(priceRow.price)) : priceRow.price;",
)
text = text.replace(
    "const sel = { rangeName: range.name, displayName: range.displayName || `${brand.brand} ${range.name}`, kw: priceRow.kw, price: effectivePrice, regularPrice: priceRow.price };",
    "const sel = { rangeName: range.name, displayName: range.displayName || `${brand.brand} ${range.name}`, localBrand: range.localBrand || brand.brand, kw: priceRow.kw, price: effectivePrice, regularPrice: priceRow.price };",
)
text = text.replace(
    "I'd like to claim the local Rinnai offer for ${selected.displayName} ${selected.kw}",
    "I'd like to claim the local ${selected.localBrand || \"Rinnai\"} offer for ${selected.displayName} ${selected.kw}",
)
text = text.replace(
    '"I\'d like to check eligibility for the local Rinnai back-to-back installation offer."',
    '"I\'d like to check eligibility for the local split-system back-to-back installation offer."',
)
text = text.replace('href="#range-pb-series"', 'href="#range-rinnai-local"')
text = text.replace(
    '"This local Rinnai sale uses the same PB Series and PX Series options shown on our main Rinnai page, with a limited-time discount on qualifying back-to-back installations. Choose your size below and book the offer."',
    '"Choose from our local Rinnai offer first, then compare the Daikin Lite local offer below. Both use the qualifying back-to-back installation conditions explained on this page, and availability is limited."',
)
text = text.replace("brand.ranges.length > 1", "displayRanges.length > 1")
text = text.replace("{brand.ranges.map((r) => (", "{displayRanges.map((r) => (")
text = text.replace("{brand.ranges.map((range, ri) => (", "{displayRanges.map((range, ri) => (")

# Put a visible limited-spots badge on each local sale section.
heading_old = '''              <span className="overline text-[#C8A46A]">{range.manufacturer || brand.brand}</span>\n              <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-[#0B0B0B] md:text-4xl text-balance">'''
heading_new = '''              <div className="flex flex-wrap items-center gap-3">\n                <span className="overline text-[#C8A46A]">{range.manufacturer || brand.brand}</span>\n                {isRinnaiLocalOffer && (\n                  <span className="rounded-full border border-[#C8A46A]/50 bg-[#F3E9D2] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#7B5A28]">Limited spots</span>\n                )}\n              </div>\n              <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-[#0B0B0B] md:text-4xl text-balance">'''
if heading_old in text:
    text = text.replace(heading_old, heading_new, 1)

# Daikin Lite prices are already the final local prices. Rinnai keeps its current
# percentage-off treatment, but both sections now clearly say Limited spots.
price_old = '''                    {isRinnaiLocalOffer ? (\n                      <span className="flex flex-col items-start">\n                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A8A8E] line-through">Was {row.price}</span>\n                        <span className="mt-1 font-serif text-2xl text-[#0B0B0B] sm:text-3xl">{getRinnaiLocalSalePrice(row.price)}</span>\n                        <span className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#B58C4E]">{RINNAI_LOCAL_DISCOUNT_LABEL} · Limited time</span>\n                      </span>\n                    ) : ('''
price_new = '''                    {isRinnaiLocalOffer ? (\n                      row.localOfferPrice ? (\n                        <span className="flex flex-col items-start">\n                          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A8A8E]">Local supplied &amp; installed</span>\n                          <span className="mt-1 font-serif text-2xl text-[#0B0B0B] sm:text-3xl">{row.localOfferPrice}</span>\n                          <span className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#B58C4E]">Limited spots</span>\n                        </span>\n                      ) : (\n                        <span className="flex flex-col items-start">\n                          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A8A8E] line-through">Was {row.price}</span>\n                          <span className="mt-1 font-serif text-2xl text-[#0B0B0B] sm:text-3xl">{getRinnaiLocalSalePrice(row.price)}</span>\n                          <span className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#B58C4E]">{RINNAI_LOCAL_DISCOUNT_LABEL} · Limited spots</span>\n                        </span>\n                      )\n                    ) : ('''
if price_old in text:
    text = text.replace(price_old, price_new, 1)

# The local offer page is now intentionally sales-first. If an older
# back-to-back explanation block is present, remove it instead of rebuilding it.
section_pattern = re.compile(
    r'''      \{isRinnaiLocalOffer && \(\n        <section className="[^"]*" data-testid="back-to-back-explained">.*?      \)\}\n\n''',
    re.S,
)
text = section_pattern.sub("", text, count=1)

PATH.write_text(text)
print("updated: Rinnai section first, Daikin Lite second, PB/PX hidden on local page, limited-spots messaging added")
