from pathlib import Path


def replace_once(text, old, new, label):
    if new in text:
        return text
    if old not in text:
        raise SystemExit(f"Could not find {label}")
    return text.replace(old, new, 1)

# ---------------- QuoteForm: compact selected-system mode ----------------
p = Path('src/components/QuoteForm.jsx')
text = p.read_text(encoding='utf-8')
text = replace_once(
    text,
    'export const QuoteForm = ({ onDark = false, defaultService = "", defaultMessage = "", submitLabel = "Get Free Quote & Plan" }) => {',
    'export const QuoteForm = ({ onDark = false, defaultService = "", defaultMessage = "", submitLabel = "Get Free Quote", compact = false }) => {',
    'QuoteForm signature',
)
text = text.replace(
    "One of our team will call you shortly to arrange your free quote and plan.",
    "One of our team will call you shortly to confirm the details.",
)
old_email_suburb = '''      <div className="grid gap-5 sm:grid-cols-2">\n        <div>\n          <label htmlFor="q-email" className={labelClass}>Email (optional)</label>\n          <Input id="q-email" type="email" data-testid="quote-email-input" value={form.email}\n            onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" className={fieldClass} />\n        </div>\n        <div>\n          <label htmlFor="q-suburb" className={labelClass}>Suburb</label>\n          <Input id="q-suburb" data-testid="quote-suburb-input" value={form.suburb}\n            onChange={(e) => update("suburb", e.target.value)} placeholder="Enter your suburb" className={fieldClass} />\n        </div>\n      </div>\n'''
new_email_suburb = '''      {compact ? (\n        <div>\n          <label htmlFor="q-suburb" className={labelClass}>Suburb</label>\n          <Input id="q-suburb" data-testid="quote-suburb-input" value={form.suburb}\n            onChange={(e) => update("suburb", e.target.value)} placeholder="Enter your suburb" className={fieldClass} />\n        </div>\n      ) : (\n        <div className="grid gap-5 sm:grid-cols-2">\n          <div>\n            <label htmlFor="q-email" className={labelClass}>Email (optional)</label>\n            <Input id="q-email" type="email" data-testid="quote-email-input" value={form.email}\n              onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" className={fieldClass} />\n          </div>\n          <div>\n            <label htmlFor="q-suburb" className={labelClass}>Suburb</label>\n            <Input id="q-suburb" data-testid="quote-suburb-input" value={form.suburb}\n              onChange={(e) => update("suburb", e.target.value)} placeholder="Enter your suburb" className={fieldClass} />\n          </div>\n        </div>\n      )}\n'''
text = replace_once(text, old_email_suburb, new_email_suburb, 'QuoteForm email/suburb block')
old_service = '''      <div>\n        <label className={labelClass}>Service Required</label>\n        <Select value={form.service} onValueChange={(v) => update("service", v)}>\n          <SelectTrigger data-testid="quote-service-select"\n            className="h-12 rounded-sm border-0 border-b border-[#E5E5EA] bg-transparent px-0 text-[#1D1D1F] shadow-none focus:ring-0 data-[placeholder]:text-[#6E6E73]/60">\n            <SelectValue placeholder="Select a service" />\n          </SelectTrigger>\n          <SelectContent>\n            {SERVICE_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}\n          </SelectContent>\n        </Select>\n      </div>\n'''
new_service = '''      {!compact && (\n        <div>\n          <label className={labelClass}>Service Required</label>\n          <Select value={form.service} onValueChange={(v) => update("service", v)}>\n            <SelectTrigger data-testid="quote-service-select"\n              className="h-12 rounded-sm border-0 border-b border-[#E5E5EA] bg-transparent px-0 text-[#1D1D1F] shadow-none focus:ring-0 data-[placeholder]:text-[#6E6E73]/60">\n              <SelectValue placeholder="Select a service" />\n            </SelectTrigger>\n            <SelectContent>\n              {SERVICE_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}\n            </SelectContent>\n          </Select>\n        </div>\n      )}\n'''
text = replace_once(text, old_service, new_service, 'QuoteForm service block')
old_message = '''      <div>\n        <label htmlFor="q-message" className={labelClass}>Message (optional)</label>\n        <Textarea id="q-message" data-testid="quote-message-input" value={form.message}\n          onChange={(e) => update("message", e.target.value)} placeholder="Tell us a little about your home or the system you have in mind…"\n          className="min-h-24 rounded-sm border-0 border-b border-[#E5E5EA] bg-transparent px-0 text-[#1D1D1F] shadow-none focus-visible:border-[#C8A46A] focus-visible:ring-0 placeholder:text-[#6E6E73]/60" />\n      </div>\n'''
new_message = '''      {!compact && (\n        <div>\n          <label htmlFor="q-message" className={labelClass}>Message (optional)</label>\n          <Textarea id="q-message" data-testid="quote-message-input" value={form.message}\n            onChange={(e) => update("message", e.target.value)} placeholder="Tell us a little about your home or the system you have in mind…"\n            className="min-h-24 rounded-sm border-0 border-b border-[#E5E5EA] bg-transparent px-0 text-[#1D1D1F] shadow-none focus-visible:border-[#C8A46A] focus-visible:ring-0 placeholder:text-[#6E6E73]/60" />\n        </div>\n      )}\n'''
text = replace_once(text, old_message, new_message, 'QuoteForm message block')
text = text.replace('Photo of your space or unit (optional)', 'Upload photos for a more accurate quote (optional)')
p.write_text(text, encoding='utf-8')

# ---------------- Rinnai pricing: match current advertised installed offer ----------------
p = Path('src/lib/data.js')
text = p.read_text(encoding='utf-8')
for old, new in [
    ('{ kw: "2.5kW", price: "$1,450" }', '{ kw: "2.5kW", price: "$1,350" }'),
    ('{ kw: "3.5kW", price: "$1,550" }', '{ kw: "3.5kW", price: "$1,500" }'),
    ('{ kw: "5.0kW", price: "$1,900" }', '{ kw: "5.0kW", price: "$1,850" }'),
    ('{ kw: "7.0kW", price: "$2,300" }', '{ kw: "7.0kW", price: "$2,200" }'),
    ('{ kw: "7.1kW", price: "$2,300" }', '{ kw: "7.1kW", price: "$2,200" }'),
]:
    text = text.replace(old, new)
p.write_text(text, encoding='utf-8')

# ---------------- BrandPage: price-first + social proof + simpler CTAs ----------------
p = Path('src/pages/BrandPage.jsx')
text = p.read_text(encoding='utf-8')
text = text.replace('import { PageHero, CTASection } from "../components/sections";', 'import { PageHero, GoogleRating } from "../components/sections";')
text = text.replace('import { SPLIT_BRANDS, FORM_TRUST_STRIP } from "../lib/data";', 'import { SPLIT_BRANDS, FORM_TRUST_STRIP, IMAGES, PHONE_TEL } from "../lib/data";')
text = text.replace('  const submitLabel = selected\n    ? `Book ${brand.brand} ${selected.rangeName} ${selected.kw}`\n    : `Get My ${brand.brand} Quote`;', '  const submitLabel = "Get This System Installed";')
anchor = '      <PageHero overline={brand.brand} title={brand.h1} sub={brand.tagline} image={brand.image} />\n\n'
quick = '''      <PageHero overline={brand.brand} title={brand.h1} sub={brand.tagline} image={brand.image} />\n\n      {/* Price first: ad visitors see cost, trust and the next step immediately */}\n      <section id="installed-prices" className="bg-white py-12 sm:py-16" data-testid="brand-price-first">\n        <div className="sp-container">\n          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">\n            <div>\n              <span className="overline text-[#C8A46A]">Installed Prices</span>\n              <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-[#0B0B0B] sm:text-4xl">{brand.brand} supplied &amp; installed</h2>\n              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6E6E73]">Standard back-to-back installation included. Choose a size below and we&apos;ll confirm the site details before work proceeds.</p>\n            </div>\n            <a href={PHONE_TEL} className="inline-flex items-center justify-center rounded-md border border-[#0B0B0B] px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#0B0B0B] transition-colors hover:bg-[#0B0B0B] hover:text-white">Call Now</a>\n          </div>\n\n          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">\n            {brand.ranges[0].prices.slice(0, 4).map((row) => (\n              <button key={row.kw} onClick={() => handleBook(brand.ranges[0].name, row)} className="group flex items-center justify-between gap-4 rounded-xl bg-[#F5F5F7] px-5 py-4 text-left transition-transform hover:-translate-y-0.5" data-testid={`quick-price-${row.kw.replace(/[^0-9a-z]/gi, "")}`}>\n                <span>\n                  <span className="block text-xs font-bold uppercase tracking-[0.12em] text-[#6E6E73]">{row.kw}</span>\n                  <span className="mt-1 block font-serif text-2xl text-[#0B0B0B]">{row.price}</span>\n                </span>\n                <ArrowUpRight className="h-5 w-5 text-[#C8A46A]" />\n              </button>\n            ))}\n          </div>\n\n          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-[#5F5F63]">\n            {["Standard installation included", "Fully licensed & insured", "Extras confirmed before work starts"].map((t) => (\n              <span key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-[#C8A46A]" /> {t}</span>\n            ))}\n          </div>\n\n          <div className="mt-8 grid gap-5 border-t border-[#E5E5EA] pt-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">\n            <div>\n              <GoogleRating />\n              <p className="mt-3 text-sm font-semibold text-[#1D1D1F]">Real installations · Fully licensed &amp; insured</p>\n            </div>\n            <div className="grid grid-cols-3 gap-3">\n              {[IMAGES.installDaikinGarage, IMAGES.installRinnaiWall, IMAGES.installDaikinOutdoor2].map((src, i) => (\n                <div key={i} className="overflow-hidden rounded-xl">\n                  <img src={src} alt={`SplitsPro split system installation ${i + 1}`} loading="lazy" className="aspect-[4/3] h-full w-full object-cover" />\n                </div>\n              ))}\n            </div>\n          </div>\n        </div>\n      </section>\n\n'''
text = replace_once(text, anchor, quick, 'BrandPage price-first section')
text = text.replace('Book Installation <ArrowUpRight className="h-4 w-4" />', 'Get This System Installed <ArrowUpRight className="h-4 w-4" />')
old_disclaimer = '''            <p className="mt-4 text-xs leading-relaxed text-[#6E6E73]" data-testid={`disclaimer-${range.slug}`}>\n              Standard back-to-back installation pricing. Additional pipework, electrical work, brackets or non-standard access may cost extra. Any additional costs are confirmed before work proceeds.\n            </p>\n'''
new_disclaimer = '''            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-[#5F5F63]" data-testid={`disclaimer-${range.slug}`}>\n              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[#C8A46A]" /> Standard installation included</span>\n              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-[#C8A46A]" /> Licensed &amp; insured</span>\n              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[#C8A46A]" /> Extras confirmed before work starts</span>\n              <span className="w-full font-normal text-[#6E6E73]">Additional pipework, electrical work, brackets or non-standard access may cost extra.</span>\n            </div>\n'''
text = replace_once(text, old_disclaimer, new_disclaimer, 'BrandPage disclaimer')
text = text.replace('<span className="overline text-[#C8A46A]">Book Installation</span>', '<span className="overline text-[#C8A46A]">Get This System Installed</span>')
text = text.replace('`Book your ${brand.brand} ${selected.rangeName} ${selected.kw}`', '`Get your ${brand.brand} ${selected.rangeName} ${selected.kw} installed`')
text = text.replace('`Book your ${brand.brand} installation`', '`Get your ${brand.brand} installed`')
text = text.replace('Send us your details and we&apos;ll be in touch to confirm your booking and site details. No obligation.', 'You&apos;ve already chosen the system. Just send your name, mobile and suburb. Photos are optional and help us confirm the installation faster.')
text = text.replace('                submitLabel={submitLabel}\n', '                submitLabel={submitLabel}\n                compact\n')
text = text.replace('\n      <CTASection />\n', '\n')
p.write_text(text, encoding='utf-8')

# ---------------- SplitSystems: rewrite as a price-first landing page ----------------
p = Path('src/pages/SplitSystems.jsx')
p.write_text(r'''import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowUpRight, Check, Phone, Ruler, ShieldCheck } from "lucide-react";
import { PageHero, GoogleRating, SectionHeading, ServiceReviews } from "../components/sections";
import Reveal from "../components/Reveal";
import { IMAGES, SPLIT_BRANDS, SPLIT_FAQS, PHONE_TEL } from "../lib/data";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "../components/ui/accordion";

const CANONICAL = "https://splitspro.com.au/split-systems";

const MAIN = [
  { slug: "rinnai", label: "Best Value" },
  { slug: "daikin", label: "Most Popular" },
  { slug: "mitsubishi-electric", label: "Premium" },
];

const money = (value = "") => Number(String(value).replace(/[^0-9.]/g, "")) || 0;
const fromPrice = (brand) => {
  const rows = brand.ranges.flatMap((r) => r.prices || []);
  const best = rows.reduce((min, row) => (!min || money(row.price) < money(min.price) ? row : min), null);
  return best?.price || "View prices";
};

const mainBrands = MAIN.map((item) => ({
  ...item,
  brand: SPLIT_BRANDS.find((b) => b.slug === item.slug),
})).filter((x) => x.brand);

const otherBrands = SPLIT_BRANDS.filter((b) => !MAIN.some((m) => m.slug === b.slug));

const SplitSystems = () => (
  <>
    <Helmet>
      <title>Split System Prices Sydney | Supplied & Installed | SplitsPro</title>
      <meta name="description" content="Compare split system supplied and installed prices from Rinnai, Daikin, Mitsubishi Electric, Mitsubishi Heavy Industries, Fujitsu and Samsung. Standard installation included, fully licensed and insured." />
      <link rel="canonical" href={CANONICAL} />
      <meta property="og:title" content="Split Systems Supplied & Installed from $1,350 | SplitsPro" />
      <meta property="og:description" content="See installed split system prices first. Choose Rinnai, Daikin, Mitsubishi Electric and more, then book your installation with SplitsPro." />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={IMAGES.splitLiving} />
    </Helmet>

    <PageHero
      overline="Split System Air Conditioning"
      title="Split Systems Supplied & Installed"
      sub="Installed prices from $1,350. Choose your brand and size, see exactly what standard installation includes, then get the system installed."
      image={IMAGES.splitLiving}
    />

    {/* Price first — this is the first decision point after an ad click */}
    <section id="split-prices" className="bg-white py-14 sm:py-20" data-testid="split-price-first">
      <div className="sp-container">
        <div className="max-w-3xl">
          <span className="overline text-[#C8A46A]">Installed Prices</span>
          <h2 className="mt-4 font-serif text-4xl font-medium leading-tight tracking-tight text-[#0B0B0B] sm:text-5xl">Split Systems Supplied &amp; Installed from $1,350</h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-[#6E6E73]">Coming from an ad? Choose the same brand below and you&apos;ll go straight to its installed prices. No consultation pitch before the price.</p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {mainBrands.map(({ brand, label }, i) => (
            <Reveal key={brand.slug} delay={i * 0.05}>
              <Link to={`/split-systems/${brand.slug}`} className="group flex h-full flex-col rounded-2xl bg-[#F5F5F7] p-7 transition-transform hover:-translate-y-1" data-testid={`main-brand-${brand.slug}`}>
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#C8A46A]">{label}</span>
                <h3 className="mt-3 font-serif text-3xl text-[#0B0B0B]">{brand.brand}</h3>
                <span className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6E73]">Supplied &amp; installed from</span>
                <span className="mt-1 font-serif text-4xl text-[#0B0B0B]">{fromPrice(brand)}</span>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-[#0B0B0B]">View Installed Prices <ArrowUpRight className="h-4 w-4 text-[#C8A46A]" /></span>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#4E4E52]">
          <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#C8A46A]" /> Standard installation included</span>
          <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#C8A46A]" /> Fully licensed &amp; insured</span>
          <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#C8A46A]" /> Extras confirmed before work starts</span>
        </div>

        <div className="mt-10 border-t border-[#E5E5EA] pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6E6E73]">More brands</p>
              <p className="mt-1 text-sm text-[#6E6E73]">Still available if you already know what you want.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {otherBrands.map((brand) => (
                <Link key={brand.slug} to={`/split-systems/${brand.slug}`} className="rounded-full border border-[#D6D6DA] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#1D1D1F] hover:border-[#C8A46A] hover:text-[#C8A46A]">{brand.brand}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Trust immediately after prices */}
    <section className="bg-[#F5F5F7] py-12 sm:py-16" data-testid="split-proof-high">
      <div className="sp-container grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
        <div>
          <GoogleRating />
          <h2 className="mt-5 font-serif text-3xl text-[#1D1D1F]">Real installations. Licensed &amp; insured.</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#6E6E73]">See the price first, then see the workmanship. These are real SplitsPro installations across Sydney.</p>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          {[
            { src: IMAGES.installRinnaiWall, alt: "Rinnai split system installed by SplitsPro" },
            { src: IMAGES.installDaikinGarage, alt: "Daikin split system installed by SplitsPro" },
            { src: IMAGES.installDaikinOutdoor2, alt: "Outdoor air conditioning unit installed by SplitsPro" },
          ].map((img) => (
            <div key={img.src} className="overflow-hidden rounded-xl">
              <img src={img.src} alt={img.alt} loading="lazy" className="aspect-[4/3] h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Free sizing help, without the Home Comfort Plan sales pitch */}
    <section className="bg-white py-16 sm:py-20" data-testid="split-sizing-simple">
      <div className="sp-container grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div>
          <span className="overline text-[#C8A46A]">Free Sizing Help</span>
          <h2 className="mt-4 font-serif text-4xl font-medium tracking-tight text-[#1D1D1F]">Not sure what size you need? We&apos;ll help you choose for free.</h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-[#6E6E73]">Room size, windows, insulation, sun and ceiling height all matter. You don&apos;t need to book a paid-style consultation for a bedroom split — send us the room details and we&apos;ll point you to the right kW size.</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#1D1D1F]">
            {["Room dimensions", "Windows & sun", "Ceiling height", "Insulation"].map((t) => <span key={t} className="flex items-center gap-2"><Ruler className="h-4 w-4 text-[#C8A46A]" /> {t}</span>)}
          </div>
        </div>
        <div className="rounded-2xl bg-[#0B0B0B] p-8 text-white">
          <p className="text-sm leading-relaxed text-white/70">Need an answer now?</p>
          <a href={PHONE_TEL} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#C8A46A] px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white"><Phone className="h-4 w-4" /> Call Now</a>
          <a href="#split-prices" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/25 px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white">View Installed Prices <ArrowUpRight className="h-4 w-4" /></a>
        </div>
      </div>
    </section>

    <section className="bg-[#F5F5F7] py-20 sm:py-24" data-testid="split-install-includes">
      <div className="sp-container">
        <SectionHeading overline="Standard Installation" title="Know what the advertised price means" sub="The headline price is for a standard back-to-back installation. If your job needs anything extra, we confirm it before work starts." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Indoor and outdoor unit installation",
            "Standard pipework and control cabling",
            "Testing and commissioning",
            "Neat unit positioning and pipework",
            "Work area cleaned when finished",
            "Any non-standard extras confirmed first",
          ].map((t) => (
            <div key={t} className="flex items-start gap-3 rounded-xl bg-white p-5"><Check className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A46A]" /><span className="text-sm font-medium text-[#1D1D1F]">{t}</span></div>
          ))}
        </div>
      </div>
    </section>

    <ServiceReviews category="split" light />

    <section className="bg-white py-20 sm:py-24" data-testid="split-faq">
      <div className="sp-container grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
        <SectionHeading overline="FAQ" title="Quick answers before you choose" />
        <Accordion type="single" collapsible className="w-full">
          {SPLIT_FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-[#E5E5EA]">
              <AccordionTrigger className="py-6 text-left font-serif text-xl font-normal text-[#1D1D1F] hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="pb-6 leading-relaxed text-[#6E6E73]">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>

    <section className="bg-[#0B0B0B] py-16 text-white" data-testid="split-final-cta">
      <div className="sp-container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C8A46A]">Ready to choose?</p>
          <h2 className="mt-2 font-serif text-3xl">Pick the system. See the price. Get it installed.</h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href="#split-prices" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#C8A46A] px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white">View Installed Prices <ArrowUpRight className="h-4 w-4" /></a>
          <a href={PHONE_TEL} className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white"><Phone className="h-4 w-4" /> Call Now</a>
        </div>
      </div>
    </section>
  </>
);

export default SplitSystems;
''', encoding='utf-8')

print('Split-system sales funnel upgrade applied')
