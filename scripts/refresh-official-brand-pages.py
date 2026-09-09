from pathlib import Path
import re


def replace_once(text, old, new, label):
    if new in text:
        return text
    if old not in text:
        raise SystemExit(f"Could not find {label}")
    return text.replace(old, new, 1)


# -----------------------------------------------------------------------------
# Brand pages: official product media where stable, compact verified features,
# manufacturer feature artwork where exposed, and a shared brand selector.
# Daikin feature content is intentionally left unchanged.
# -----------------------------------------------------------------------------
p = Path("src/pages/BrandPage.jsx")
text = p.read_text(encoding="utf-8")

constants = r'''
// Official manufacturer media used where the public manufacturer site exposes a
// stable direct asset URL. Existing local product renders remain the fallback.
const OFFICIAL_PRODUCT_IMAGES = {
  "electric-ap": "https://www.mitsubishielectric.com.au/wp-content/uploads/2022/02/18OCT_MTBS_AP_AUS_image_03_0079_m-1920x1440-1-1200x900.png",
  "heavy-ciara": "https://www.mhiaa.com.au/wp-content/uploads/2024/01/MHIAA_Ciara_WebHeroImage_588x330px_06.26-1.jpg",
};

const NON_DAIKIN_FEATURES = {
  "pb-series": [
    {
      title: "Wi-Fi Control",
      desc: "Control the system remotely with Rinnai's supported NetHome Plus app.",
      icon: "https://www.rinnai.com.au/wp-content/uploads/ICO-logo-wifi-IMA.png",
      fallback: Wifi,
    },
    { title: "Quiet Operation", desc: "Low-noise operation designed to suit bedrooms and living spaces.", fallback: Fan },
    { title: "3D Airflow", desc: "Horizontal and vertical swing helps distribute air more evenly around the room.", fallback: Wind },
    { title: "Dehumidifying", desc: "Dry mode helps manage room humidity during hot, humid weather.", fallback: Droplets },
  ],
  "px-series": [
    {
      title: "Wi-Fi + Voice",
      desc: "App control plus Google Home and Amazon Alexa compatibility.",
      icon: "https://www.rinnai.com.au/wp-content/uploads/ICO-logo-wifi-IMA.png",
      fallback: Wifi,
    },
    { title: "Human Sensor", desc: "Detects when the room is empty and can reduce unnecessary energy use.", fallback: Eye },
    { title: "3D Airflow", desc: "Horizontal and vertical swing helps balance room temperature and comfort.", fallback: Wind },
    { title: "Humidity Control", desc: "Set and manage room humidity through Dry Mode on supported PX systems.", fallback: Droplets },
  ],
  "electric-ap": [
    {
      title: "Quiet Operation",
      desc: "Very low indoor sound levels make AP a strong choice for bedrooms and quiet spaces.",
      icon: "https://www.mitsubishielectric.com.au/wp-content/uploads/2025/08/quiet_operation.svg",
      fallback: Fan,
    },
    {
      title: "Night Mode",
      desc: "Reduces operating sound and dims indicator brightness for more comfortable night use.",
      icon: "https://www.mitsubishielectric.com.au/wp-content/uploads/2025/08/night_mode.svg",
      fallback: Star,
    },
    {
      title: "Built-In Wi-Fi",
      desc: "Compatible models include Wi-Fi control for remote operation and scheduling.",
      icon: "https://www.mitsubishielectric.com.au/wp-content/uploads/2025/07/built-in-wi-fi-control.svg",
      fallback: Wifi,
    },
    {
      title: "Dual Barrier Coating",
      desc: "A coating on key internal parts helps reduce dust and greasy dirt build-up.",
      icon: "https://www.mitsubishielectric.com.au/wp-content/uploads/2025/08/dual-barrier-coating-v1.svg",
      fallback: ShieldCheck,
    },
  ],
  "heavy-ciara": [
    {
      title: "Built-In Wi-Fi",
      desc: "Control Ciara from the supported app, with compatible voice-control options.",
      icon: "https://www.mhiaa.com.au/wp-content/uploads/2024/02/Feature-Icons_Built-in_Wi-Fi.svg",
      fallback: Wifi,
    },
    {
      title: "Allergen Clear Filter",
      desc: "MHI's filtration system is designed to capture and manage airborne contaminants on the filter.",
      icon: "https://www.mhiaa.com.au/wp-content/uploads/2024/02/Feature-Icons_RAC-Allergen-Clear-Filter.svg",
      fallback: Filter,
    },
    {
      title: "3D Auto Airflow",
      desc: "Automatically combines vertical and horizontal airflow for wider room coverage.",
      icon: "https://www.mhiaa.com.au/wp-content/uploads/2024/02/Feature-Icons_RAC-3d-Auto.svg",
      fallback: Wind,
    },
    {
      title: "Silent Operation",
      desc: "A dedicated quiet setting reduces sound for bedrooms and low-noise spaces.",
      icon: "https://www.mhiaa.com.au/wp-content/uploads/2024/02/Feature-Icons_Silent-Operation.svg",
      fallback: Fan,
    },
  ],
  "lifestyle-kmtc": [
    { title: "Human Sensor", desc: "Detects movement and can reduce output when the room is unoccupied.", fallback: Eye },
    { title: "Economy Mode", desc: "Limits peak power demand when full output is not required.", fallback: Leaf },
    { title: "Super Quiet", desc: "Reduces indoor fan speed for quieter operation in bedrooms and living areas.", fallback: Fan },
    { title: "Powerful Mode", desc: "Temporarily boosts output to bring the room toward set temperature faster.", fallback: Zap },
    { title: "Apple-Catechin Filter", desc: "Helps capture fine dust and microorganisms on the treated filter surface.", fallback: Filter },
    { title: "Blue Fin", desc: "A corrosion-resistant treatment helps protect the outdoor heat exchanger.", fallback: ShieldCheck },
  ],
  "geo-windfree": [
    { title: "WindFree Cooling", desc: "Maintains comfort by dispersing cool air through thousands of micro air holes.", fallback: Wind },
    { title: "AI Auto Cooling", desc: "Uses room conditions and usage patterns to help select a suitable operating mode.", fallback: Sparkles },
    { title: "SmartThings Wi-Fi", desc: "Built-in Wi-Fi connects the system to Samsung SmartThings for remote control.", fallback: Wifi },
    { title: "Quad-Care Filter", desc: "A multi-stage filter designed to capture fine airborne particles on the filter.", fallback: Filter },
    { title: "Freeze Wash", desc: "Freezes and defrosts the heat exchanger, then dries it as an automated cleaning cycle.", fallback: Droplets },
    { title: "Good Sleep", desc: "Adjusts temperature and airflow overnight with gentler WindFree operation.", fallback: Star },
  ],
};

const BrandSelectionBanner = ({ currentSlug }) => (
  <nav aria-label="Choose split system brand" data-testid="brand-selection-banner" className="border-b border-[#E5E5EA] bg-white">
    <div className="sp-container">
      <div className="-mx-6 flex snap-x snap-mandatory items-center gap-3 overflow-x-auto whitespace-nowrap px-6 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
        <span className="mr-1 shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-[#6E6E73]">Choose brand</span>
        {SPLIT_BRANDS.map((item) => {
          const active = item.slug === currentSlug;
          return active ? (
            <span key={item.slug} aria-current="page" className="snap-start shrink-0 rounded-full border border-[#C8A46A] bg-[#F3E9D2] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-[#0B0B0B]">
              {item.brand}
            </span>
          ) : (
            <Link key={item.slug} to={`/split-systems/${item.slug}`} data-testid={`brand-banner-${item.slug}`} className="group snap-start flex shrink-0 items-center gap-2 rounded-full border border-[#E5E5EA] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-[#0B0B0B] transition-all hover:border-[#C8A46A] hover:-translate-y-[1px]">
              {item.brand}<ArrowUpRight className="h-3.5 w-3.5 text-[#C8A46A]" />
            </Link>
          );
        })}
      </div>
    </div>
  </nav>
);
'''

if "const NON_DAIKIN_FEATURES = {" not in text:
    anchor = "const BrandPage = () => {"
    if anchor not in text:
        raise SystemExit("BrandPage component anchor not found")
    text = text.replace(anchor, constants + "\n" + anchor, 1)

# Add brand selector directly inside every manufacturer page.
if '<BrandSelectionBanner currentSlug={brand.slug} />' not in text:
    marker = '      {/* Brand intro */}'
    if marker not in text:
        raise SystemExit("Brand intro marker not found")
    text = text.replace(marker, '      <BrandSelectionBanner currentSlug={brand.slug} />\n\n' + marker, 1)

# Replace the large non-Daikin cards / bullet line with the same compact visual
# density used by Daikin, while keeping Daikin's own section untouched.
pattern = re.compile(
    r'''              \) : \(\n                <>\n                  \{range\.features && \(.*?                </>\n              \)\}''',
    re.S,
)
replacement = r'''              ) : (
                <div className="mt-6" data-testid={`feature-details-${range.slug}`}>
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6E6E73]">Key features</p>
                  <div className="grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3">
                    {(NON_DAIKIN_FEATURES[range.slug] || []).map((feature) => {
                      const Icon = feature.fallback || Sparkles;
                      return (
                        <div key={feature.title} className="flex min-w-0 items-start gap-2.5">
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E5E5EA] bg-white text-[#C8A46A]">
                            {feature.icon && (
                              <img
                                src={feature.icon}
                                alt=""
                                aria-hidden="true"
                                loading="lazy"
                                className="h-5 w-5 object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                  e.currentTarget.nextElementSibling?.classList.remove("hidden");
                                }}
                              />
                            )}
                            <Icon className={`h-4 w-4 ${feature.icon ? "hidden" : ""}`} strokeWidth={1.9} />
                          </span>
                          <div className="min-w-0">
                            <h3 className="text-[12px] font-bold leading-4 text-[#0B0B0B]">{feature.title}</h3>
                            <p className="mt-0.5 text-[11px] leading-[1.4] text-[#6E6E73]">{feature.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {range.note && (
                    <p className="mt-4 max-w-2xl text-[10px] leading-[1.45] text-[#8A8A8E]">{range.note}</p>
                  )}
                </div>
              )}'''
if "NON_DAIKIN_FEATURES[range.slug]" not in text:
    text, count = pattern.subn(replacement, text, count=1)
    if count != 1:
        raise SystemExit("Could not compact non-Daikin feature block")

# Use verified official indoor-unit media when a stable manufacturer asset exists;
# otherwise the existing locally hosted product render remains in place.
old_src = '                        src={range.image}\n'
new_src = '                        src={OFFICIAL_PRODUCT_IMAGES[range.slug] || range.image}\n'
if old_src in text and new_src not in text:
    text = text.replace(old_src, new_src, 1)

old_error = '                        onError={(e) => { e.currentTarget.style.display = "none"; }}\n'
new_error = '''                        onError={(e) => {
                          if (OFFICIAL_PRODUCT_IMAGES[range.slug] && e.currentTarget.dataset.officialFallback !== "true") {
                            e.currentTarget.dataset.officialFallback = "true";
                            e.currentTarget.src = range.image;
                          } else {
                            e.currentTarget.style.display = "none";
                          }
                        }}\n'''
# Target the product-image error handler only. Zena's gallery keeps its current handler.
product_pos = text.find(new_src)
if product_pos != -1:
    err_pos = text.find(old_error, product_pos)
    if err_pos != -1:
        text = text[:err_pos] + new_error + text[err_pos + len(old_error):]

p.write_text(text, encoding="utf-8")


# -----------------------------------------------------------------------------
# Quote form: compact booking forms also get an optional free-text message.
# -----------------------------------------------------------------------------
p = Path("src/components/QuoteForm.jsx")
text = p.read_text(encoding="utf-8")
compact_start = text.find('      {compact ? (')
compact_else = text.find('      ) : (', compact_start)
if compact_start == -1 or compact_else == -1:
    raise SystemExit("Compact QuoteForm branch not found")
compact_chunk = text[compact_start:compact_else]
if 'data-testid="quote-message-input"' not in compact_chunk:
    replacement = '''      {compact ? (\n        <div className="space-y-5">\n          <div className="grid gap-5 sm:grid-cols-2">\n            <div>\n              <label htmlFor="q-email" className={labelClass}>Email (optional)</label>\n              <Input id="q-email" type="email" data-testid="quote-email-input" value={form.email}\n                onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" className={fieldClass} />\n            </div>\n            <div>\n              <label htmlFor="q-suburb" className={labelClass}>Suburb</label>\n              <Input id="q-suburb" data-testid="quote-suburb-input" value={form.suburb}\n                onChange={(e) => update("suburb", e.target.value)} placeholder="Enter your suburb" className={fieldClass} />\n            </div>\n          </div>\n          <div>\n            <label htmlFor="q-message" className={labelClass}>Message (optional)</label>\n            <Textarea id="q-message" data-testid="quote-message-input" value={form.message}\n              onChange={(e) => update("message", e.target.value)} placeholder="Tell us what you want, the room size, preferred unit or any access details…"\n              className="min-h-20 rounded-sm border-0 border-b border-[#E5E5EA] bg-transparent px-0 text-[#1D1D1F] shadow-none focus-visible:border-[#C8A46A] focus-visible:ring-0 placeholder:text-[#6E6E73]/60" />\n          </div>\n        </div>\n'''
    text = text[:compact_start] + replacement + text[compact_else:]
p.write_text(text, encoding="utf-8")


# -----------------------------------------------------------------------------
# HomeComfortPage: support a direct booking version of the early enquiry card.
# Other service pages remain unchanged.
# -----------------------------------------------------------------------------
p = Path("src/pages/HomeComfortPage.jsx")
text = p.read_text(encoding="utf-8")
old_sig = 'const HomeComfortPage = ({ slug, overline, title, sub, image, introImage, intro, features, imgPos = "object-center", seoBlocks = null, afterHero = null, extraFaqs = null, helmet = null }) => {'
new_sig = 'const HomeComfortPage = ({ slug, overline, title, sub, image, introImage, intro, features, imgPos = "object-center", seoBlocks = null, afterHero = null, extraFaqs = null, helmet = null, bookingForm = false }) => {'
text = replace_once(text, old_sig, new_sig, "HomeComfortPage bookingForm prop")

text = replace_once(
    text,
    '<Reveal><Overline>The Splits Pro Home Comfort Plan&trade;</Overline></Reveal>',
    '<Reveal><Overline>{bookingForm ? "Split System Installation" : "The Splits Pro Home Comfort Plan™"}</Overline></Reveal>',
    "reserve overline",
)
text = replace_once(
    text,
    '                Your home deserves more than just a quote\n',
    '                {bookingForm ? "Book your split system installation" : "Your home deserves more than just a quote"}\n',
    "reserve heading",
)
text = replace_once(
    text,
    '                Most companies simply measure your home and send you a price. We take the time to understand your home, your lifestyle and your comfort goals before recommending the right solution — then prepare a personalised plan with a fixed written quote.\n',
    '                {bookingForm\n                  ? "Tell us the room, preferred brand or system size if you know it, and your suburb. We’ll confirm suitability, installation details and the final price before locking in the job."\n                  : "Most companies simply measure your home and send you a price. We take the time to understand your home, your lifestyle and your comfort goals before recommending the right solution — then prepare a personalised plan with a fixed written quote."}\n',
    "reserve body",
)
text = replace_once(
    text,
    '<h3 className="font-serif text-2xl leading-snug text-[#1D1D1F]">Reserve Your Complimentary Home Comfort Plan&trade;</h3>',
    '<h3 className="font-serif text-2xl leading-snug text-[#1D1D1F]">{bookingForm ? "Book Your Split System Installation" : "Reserve Your Complimentary Home Comfort Plan™"}</h3>',
    "reserve form title",
)
text = replace_once(
    text,
    '                Book your personalised in-home consultation and receive your professionally prepared Home Comfort Plan&trade;, complete with expert recommendations and a fixed written quotation.\n',
    '                {bookingForm\n                  ? "Tell us what you want installed. If you already know the brand or size, add it in the optional message and we’ll confirm the job details with you."\n                  : "Book your personalised in-home consultation and receive your professionally prepared Home Comfort Plan™, complete with expert recommendations and a fixed written quotation."}\n',
    "reserve form body",
)
text = replace_once(
    text,
    '<QuoteForm defaultService={cfg.formService} submitLabel="Reserve My Home Comfort Plan" />',
    '<QuoteForm defaultService={cfg.formService} submitLabel={bookingForm ? "Request Installation Booking" : "Reserve My Home Comfort Plan"} compact={bookingForm} />',
    "reserve QuoteForm",
)
p.write_text(text, encoding="utf-8")


# -----------------------------------------------------------------------------
# Split Systems landing page: switch only this page to direct booking mode.
# -----------------------------------------------------------------------------
p = Path("src/pages/SplitSystems.jsx")
text = p.read_text(encoding="utf-8")
if '      bookingForm\n' not in text:
    old = '''  <HomeComfortPage\n    slug="split-systems"\n'''
    new = '''  <HomeComfortPage\n    slug="split-systems"\n    bookingForm\n'''
    text = replace_once(text, old, new, "SplitSystems bookingForm flag")
p.write_text(text, encoding="utf-8")

print("Official brand page refresh applied")
