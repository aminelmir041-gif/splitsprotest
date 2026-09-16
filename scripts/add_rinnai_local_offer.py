from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise RuntimeError(f"Could not find patch anchor: {label}")
    return text.replace(old, new, 1)


brand_path = Path("src/pages/BrandPage.jsx")
text = brand_path.read_text(encoding="utf-8")

if "RINNAI_LOCAL_SALE_FACTOR" not in text:
    text = replace_once(
        text,
        "const BrandSelectionBanner = ({ currentSlug }) => (",
        '''const RINNAI_LOCAL_SALE_FACTOR = 1750 / 1990;\nconst RINNAI_LOCAL_DISCOUNT_LABEL = "12% OFF";\n\nconst getRinnaiLocalSalePrice = (price) => {\n  const regular = Number(String(price).replace(/[^0-9.]/g, ""));\n  if (!Number.isFinite(regular)) return price;\n  const sale = Math.round(regular * RINNAI_LOCAL_SALE_FACTOR);\n  return `$${sale.toLocaleString("en-AU")}`;\n};\n\nconst BrandSelectionBanner = ({ currentSlug }) => (''',
        "local sale helpers",
    )

    text = replace_once(
        text,
        '''const BrandPage = () => {\n  const { slug } = useParams();\n  const brand = SPLIT_BRANDS.find((b) => b.slug === slug);''',
        '''const BrandPage = ({ offerMode = null }) => {\n  const { slug } = useParams();\n  const isRinnaiLocalOffer = offerMode === "rinnai-local";\n  const brand = SPLIT_BRANDS.find((b) => b.slug === (isRinnaiLocalOffer ? "rinnai" : slug));''',
        "BrandPage offer mode",
    )

    text = replace_once(
        text,
        '''  const handleBook = (range, priceRow) => {\n    const sel = { rangeName: range.name, displayName: range.displayName || `${brand.brand} ${range.name}`, kw: priceRow.kw, price: priceRow.price };''',
        '''  const handleBook = (range, priceRow) => {\n    const effectivePrice = isRinnaiLocalOffer ? getRinnaiLocalSalePrice(priceRow.price) : priceRow.price;\n    const sel = { rangeName: range.name, displayName: range.displayName || `${brand.brand} ${range.name}`, kw: priceRow.kw, price: effectivePrice, regularPrice: priceRow.price };''',
        "sale booking price",
    )

    text = replace_once(
        text,
        '''  const selectionMessage = selected\n    ? `I'd like to book installation for ${selected.displayName} ${selected.kw} — advertised at ${selected.price} supplied & installed.`\n    : "";''',
        '''  const selectionMessage = selected\n    ? isRinnaiLocalOffer\n      ? `I'd like to claim the local Rinnai offer for ${selected.displayName} ${selected.kw} — ${selected.price} supplied & installed on the advertised single-storey back-to-back terms. My suburb is within the local offer area.`\n      : `I'd like to book installation for ${selected.displayName} ${selected.kw} — advertised at ${selected.price} supplied & installed.`\n    : isRinnaiLocalOffer\n      ? "I'd like to check eligibility for the local Rinnai back-to-back installation offer near Bass Hill Plaza."\n      : "";''',
        "offer selection message",
    )

    text = replace_once(
        text,
        '''  const submitLabel = selected\n    ? `Book ${selected.displayName} ${selected.kw}`\n    : `Book ${brand.brand} Installation`;''',
        '''  const submitLabel = selected\n    ? isRinnaiLocalOffer\n      ? `Claim ${selected.displayName} ${selected.kw} Offer`\n      : `Book ${selected.displayName} ${selected.kw}`\n    : isRinnaiLocalOffer\n      ? "Check My Local Rinnai Offer"\n      : `Book ${brand.brand} Installation`;\n\n  const pageTitle = isRinnaiLocalOffer\n    ? "Rinnai Split System Local Sale | Bankstown, Bass Hill & Chester Hill | SplitsPro"\n    : brand.metaTitle;\n  const pageDescription = isRinnaiLocalOffer\n    ? "Limited-time local Rinnai split system sale for selected suburbs around Bankstown, Bass Hill and Chester Hill. Supplied and installed back-to-back by licensed SplitsPro technicians."\n    : brand.metaDesc;\n  const canonicalUrl = isRinnaiLocalOffer\n    ? "https://splitspro.com.au/split-systems/rinnai-local-offer"\n    : `https://splitspro.com.au/split-systems/${brand.slug}`;''',
        "offer metadata variables",
    )

    text = replace_once(
        text,
        '''        <title>{brand.metaTitle}</title>\n        <meta name="description" content={brand.metaDesc} />\n        <link rel="canonical" href={`https://splitspro.com.au/split-systems/${brand.slug}`} />\n        <meta property="og:title" content={brand.metaTitle} />\n        <meta property="og:description" content={brand.metaDesc} />''',
        '''        <title>{pageTitle}</title>\n        <meta name="description" content={pageDescription} />\n        <link rel="canonical" href={canonicalUrl} />\n        <meta property="og:title" content={pageTitle} />\n        <meta property="og:description" content={pageDescription} />''',
        "offer metadata",
    )

    text = replace_once(
        text,
        '''      <PageHero overline={brand.brand} title={brand.h1} sub={brand.tagline} image={brand.image} desktopBrand />\n\n      <section className="border-b border-[#E8E6E1] bg-[#FBFAF8] py-5 sm:py-6" data-testid="brand-top-proof">''',
        '''      <PageHero\n        overline={isRinnaiLocalOffer ? "Rinnai · Local Special" : brand.brand}\n        title={isRinnaiLocalOffer ? "Rinnai Split System Local Installation Sale" : brand.h1}\n        sub={isRinnaiLocalOffer ? "Limited-time supplied & installed back-to-back pricing for selected local suburbs around Bass Hill Plaza." : brand.tagline}\n        image={brand.image}\n        desktopBrand\n      />\n\n      {isRinnaiLocalOffer && (\n        <section className="border-b border-[#D8C59E] bg-[#0B0B0B] py-7 text-white" data-testid="rinnai-local-offer-strip">\n          <div className="sp-container grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">\n            <div>\n              <div className="flex flex-wrap items-center gap-3">\n                <span className="rounded-full border border-[#C8A46A]/60 bg-[#C8A46A]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#E4CFA6]">Limited Time Local Offer</span>\n                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Bankstown · Bass Hill · Chester Hill · nearby suburbs</span>\n              </div>\n              <div className="mt-4 flex flex-wrap items-end gap-x-5 gap-y-2">\n                <p className="font-serif text-2xl text-white sm:text-3xl">5.0kW Rinnai supplied &amp; installed</p>\n                <span className="text-sm text-white/45 line-through">Was $1,990</span>\n                <span className="font-serif text-4xl text-[#E4CFA6]">Now $1,750</span>\n                <span className="rounded-full bg-[#C8A46A] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-[#0B0B0B]">{RINNAI_LOCAL_DISCOUNT_LABEL}</span>\n              </div>\n              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70">\n                Local sale pricing applies to qualifying single-storey back-to-back installations in selected suburbs roughly within 25 minutes of Bass Hill Plaza. Enter your suburb below and we&apos;ll confirm eligibility before booking.\n              </p>\n            </div>\n            <a href="#range-pb-series" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#C8A46A] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#0B0B0B]">See Local Sale Prices <ArrowDown className="h-4 w-4" /></a>\n          </div>\n        </section>\n      )}\n\n      <section className="border-b border-[#E8E6E1] bg-[#FBFAF8] py-5 sm:py-6" data-testid="brand-top-proof">''',
        "local offer strip",
    )

    text = replace_once(
        text,
        '''              <p className="mt-2 text-sm leading-relaxed text-[#3A3A3C]">\n                &ldquo;They were professional from the initial quote through to installation... The workmanship was clean, efficient and we couldn&apos;t be happier.&rdquo;\n                <span className="ml-2 whitespace-nowrap text-xs font-semibold text-[#6E6E73]">— {FEATURED_REVIEW.name}, Google Review</span>\n              </p>''',
        '''              <p className="mt-2 text-sm leading-relaxed text-[#3A3A3C]">\n                {isRinnaiLocalOffer ? (\n                  <>\n                    &ldquo;Very happy with the 5kW Rinnai installation. The team was professional.&rdquo;\n                    <span className="ml-2 whitespace-nowrap text-xs font-semibold text-[#6E6E73]">— Leilani R., Ashcroft NSW · Google Review</span>\n                  </>\n                ) : (\n                  <>\n                    &ldquo;They were professional from the initial quote through to installation... The workmanship was clean, efficient and we couldn&apos;t be happier.&rdquo;\n                    <span className="ml-2 whitespace-nowrap text-xs font-semibold text-[#6E6E73]">— {FEATURED_REVIEW.name}, Google Review</span>\n                  </>\n                )}\n              </p>''',
        "local review",
    )

    text = replace_once(
        text,
        '''      <BrandSelectionBanner currentSlug={brand.slug} />''',
        '''      {!isRinnaiLocalOffer && <BrandSelectionBanner currentSlug={brand.slug} />}''',
        "hide brand selector on landing page",
    )

    text = replace_once(
        text,
        '''              <p className="leading-relaxed text-[#6E6E73]">{brand.body}</p>''',
        '''              <p className="leading-relaxed text-[#6E6E73]">\n                {isRinnaiLocalOffer\n                  ? "This local Rinnai sale uses the same PB Series and PX Series options shown on our main Rinnai page, with a limited-time discount for qualifying back-to-back installs close to our Bass Hill base. Choose your size below, then send your suburb and we will confirm the offer applies before the job is booked."\n                  : brand.body}\n              </p>''',
        "offer intro copy",
    )

    text = replace_once(
        text,
        '''      {/* Ranges + pricing tables */}''',
        '''      {isRinnaiLocalOffer && (\n        <section className="border-y border-[#E8E6E1] bg-[#FBFAF8] py-14 sm:py-18" data-testid="back-to-back-explained">\n          <div className="sp-container grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-14">\n            <div>\n              <span className="overline text-[#C8A46A]">What the local price includes</span>\n              <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-[#0B0B0B] sm:text-4xl">Back-to-back installation, clearly defined.</h2>\n              <p className="mt-4 max-w-2xl leading-relaxed text-[#6E6E73]">For this sale, a back-to-back installation means a simple single-storey layout with the indoor and outdoor units positioned in a straight line vertically or horizontally.</p>\n              <div className="mt-7 grid gap-3 sm:grid-cols-2">\n                {[\n                  "Indoor and outdoor units aligned vertically or horizontally",\n                  "Under 1 metre of refrigeration pipework",\n                  "One bend or less in the pipe route",\n                  "Outdoor unit on a wall bracket or on the floor",\n                  "Standard electrical work for the installation included",\n                  "Single-storey property",\n                ].map((item) => (\n                  <div key={item} className="flex items-start gap-3 rounded-xl border border-[#E5E5EA] bg-white p-4">\n                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#C8A46A]" />\n                    <span className="text-sm font-medium leading-relaxed text-[#3A3A3C]">{item}</span>\n                  </div>\n                ))}\n              </div>\n              <p className="mt-5 text-xs leading-relaxed text-[#6E6E73]">Standard electrical work is included for the qualifying installation. Switchboard defects, upgrades, asbestos-related work or other site conditions outside the standard installation are discussed and approved before any extra work proceeds.</p>\n            </div>\n            <div className="rounded-2xl border border-[#E5E5EA] bg-white p-6 soft-shadow-sm">\n              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A46A]">Local offer area</p>\n              <h3 className="mt-3 font-serif text-2xl text-[#0B0B0B]">Around Bass Hill Plaza</h3>\n              <p className="mt-3 text-sm leading-relaxed text-[#6E6E73]">Bankstown, Bass Hill and Chester Hill are the core sale area, plus selected nearby suburbs roughly within 25 minutes&apos; drive of Bass Hill Plaza.</p>\n              <div className="mt-5 flex flex-wrap gap-2">\n                {["Bankstown", "Bass Hill", "Chester Hill", "Yagoona", "Greenacre", "Georges Hall", "Condell Park", "Sefton", "Regents Park", "Villawood"].map((area) => (\n                  <span key={area} className="rounded-full border border-[#E5E5EA] bg-[#FBFAF8] px-3 py-1.5 text-xs font-semibold text-[#4E4E52]">{area}</span>\n                ))}\n              </div>\n              <a href="#book" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#0B0B0B] border border-[#C8A46A]/60 px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white">Check My Suburb <ArrowUpRight className="h-4 w-4" /></a>\n            </div>\n          </div>\n        </section>\n      )}\n\n      {/* Ranges + pricing tables */}''',
        "back-to-back section",
    )

    text = replace_once(
        text,
        '''                  <span className="font-serif text-xl text-[#0B0B0B] sm:text-2xl">{row.price}</span>''',
        '''                  <span className="text-[#0B0B0B]">\n                    {isRinnaiLocalOffer ? (\n                      <span className="flex flex-col items-start">\n                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A8A8E] line-through">Was {row.price}</span>\n                        <span className="mt-1 font-serif text-2xl text-[#0B0B0B] sm:text-3xl">{getRinnaiLocalSalePrice(row.price)}</span>\n                        <span className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#B58C4E]">{RINNAI_LOCAL_DISCOUNT_LABEL} · Limited time</span>\n                      </span>\n                    ) : (\n                      <span className="font-serif text-xl sm:text-2xl">{row.price}</span>\n                    )}\n                  </span>''',
        "sale prices",
    )

    text = replace_once(
        text,
        '''                    Book Installation <ArrowUpRight className="h-4 w-4" />''',
        '''                    {isRinnaiLocalOffer ? "Claim Local Offer" : "Book Installation"} <ArrowUpRight className="h-4 w-4" />''',
        "sale button",
    )

    text = replace_once(
        text,
        '''            <p className="mt-4 text-xs leading-relaxed text-[#6E6E73]" data-testid={`disclaimer-${range.slug}`}>\n              Standard back-to-back installation pricing. Additional pipework, electrical work, brackets or non-standard access may cost extra. Any additional costs are confirmed before work proceeds.\n            </p>''',
        '''            <p className="mt-4 text-xs leading-relaxed text-[#6E6E73]" data-testid={`disclaimer-${range.slug}`}>\n              {isRinnaiLocalOffer\n                ? "Local sale pricing is for qualifying single-storey back-to-back installations: units aligned vertically or horizontally, under 1 metre of pipework, one bend or less, outdoor unit on a wall bracket or floor, with standard electrical work included. Any non-standard work is confirmed before work proceeds."\n                : "Standard back-to-back installation pricing. Additional pipework, electrical work, brackets or non-standard access may cost extra. Any additional costs are confirmed before work proceeds."}\n            </p>''',
        "offer disclaimer",
    )

    text = replace_once(
        text,
        '''                : `Book your ${brand.brand} installation`}''',
        '''                : isRinnaiLocalOffer\n                  ? "Claim your local Rinnai installation offer"\n                  : `Book your ${brand.brand} installation`}''',
        "offer booking heading",
    )

    text = replace_once(
        text,
        '''                  "Standard installation pricing shown above",''',
        '''                  isRinnaiLocalOffer ? "Local back-to-back sale pricing shown above" : "Standard installation pricing shown above",''',
        "offer trust bullet",
    )

    brand_path.write_text(text, encoding="utf-8")


app_path = Path("src/App.js")
app = app_path.read_text(encoding="utf-8")
if 'path="/split-systems/rinnai-local-offer"' not in app:
    app = replace_once(
        app,
        '''          <Route path="/split-systems/mitsubishi-heavy-industries" element={<Navigate to="/split-systems/mitsubishi" replace />} />\n          <Route path="/split-systems/:slug" element={<BrandPage />} />''',
        '''          <Route path="/split-systems/mitsubishi-heavy-industries" element={<Navigate to="/split-systems/mitsubishi" replace />} />\n          <Route path="/split-systems/rinnai-local-offer" element={<BrandPage offerMode="rinnai-local" />} />\n          <Route path="/split-systems/:slug" element={<BrandPage />} />''',
        "Rinnai local offer route",
    )
    app_path.write_text(app, encoding="utf-8")

print("Rinnai local offer patch applied")
