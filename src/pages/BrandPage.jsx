import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLenis } from "lenis/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Leaf,
  Eye,
  Wind,
  Thermometer,
  Filter,
  Fan,
  Zap,
  Wifi,
  ShieldCheck,
  Droplets,
  MoveHorizontal,
  Minimize2,
  Palette,
  ArrowDown,
  LayoutGrid,
  Sparkles,
  Star,
  Phone,
} from "lucide-react";
import { PageHero, GoogleRating } from "../components/sections";
import Reveal from "../components/Reveal";
import QuoteForm from "../components/QuoteForm";
import DaikinIntroEditorial from "../components/DaikinIntroEditorial";
import { SPLIT_BRANDS, FEATURED_REVIEW, PHONE_TEL } from "../lib/data";
import { DAIKIN_COMPACT_FEATURES, DAIKIN_STREAMER_FOOTNOTE } from "../lib/daikinCompactFeatures";

const DAIKIN_ICON_MAP = {
  leaf: Leaf,
  eye: Eye,
  wind: Wind,
  thermometer: Thermometer,
  filter: Filter,
  fan: Fan,
  zap: Zap,
  wifi: Wifi,
  shield: ShieldCheck,
  droplets: Droplets,
  arrows: MoveHorizontal,
  minimize: Minimize2,
  palette: Palette,
  arrowdown: ArrowDown,
  grid: LayoutGrid,
};


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

const BrandPage = () => {
  const { slug } = useParams();
  const brand = SPLIT_BRANDS.find((b) => b.slug === slug);
  const lenis = useLenis();
  const [selected, setSelected] = useState(null);

  if (!brand) return <Navigate to="/split-systems" replace />;

  const handleBook = (range, priceRow) => {
    const sel = { rangeName: range.name, displayName: range.displayName || `${brand.brand} ${range.name}`, kw: priceRow.kw, price: priceRow.price };
    setSelected(sel);
    setTimeout(() => {
      const el = document.getElementById("book");
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { offset: -20 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const jumpToRange = (rangeSlug) => {
    const el = document.getElementById(`range-${rangeSlug}`);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -20 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectionMessage = selected
    ? `I'd like to book installation for ${selected.displayName} ${selected.kw} — advertised at ${selected.price} supplied & installed.`
    : "";

  const formKey = selected ? `${brand.slug}-${selected.displayName}-${selected.kw}` : `${brand.slug}-default`;
  const submitLabel = selected
    ? `Book ${selected.displayName} ${selected.kw}`
    : `Book ${brand.brand} Installation`;

  return (
    <>
      <Helmet>
        <title>{brand.metaTitle}</title>
        <meta name="description" content={brand.metaDesc} />
        <link rel="canonical" href={`https://splitspro.com.au/split-systems/${brand.slug}`} />
        <meta property="og:title" content={brand.metaTitle} />
        <meta property="og:description" content={brand.metaDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={brand.image} />
      </Helmet>

      <PageHero overline={brand.brand} title={brand.h1} sub={brand.tagline} image={brand.image} desktopBrand />

      <section className="border-b border-[#E8E6E1] bg-[#FBFAF8] py-5 sm:py-6" data-testid="brand-top-proof">
        <div className="sp-container">
          <div className="grid gap-5 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-8">
            <div>
              <GoogleRating />
              <p className="mt-2 text-[11px] font-medium text-[#6E6E73]">Verified customer feedback from SplitsPro&apos;s Google Business Profile.</p>
            </div>
            <div className="min-w-0 border-[#E5E5EA] lg:border-x lg:px-8">
              <div className="flex items-center gap-1">
                {Array.from({ length: FEATURED_REVIEW.rating || 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#FBBC04] text-[#FBBC04]" />
                ))}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#3A3A3C]">
                &ldquo;They were professional from the initial quote through to installation... The workmanship was clean, efficient and we couldn&apos;t be happier.&rdquo;
                <span className="ml-2 whitespace-nowrap text-xs font-semibold text-[#6E6E73]">— {FEATURED_REVIEW.name}, Google Review</span>
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <a href="#book" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0B0B0B] border border-[#C8A46A]/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-all hover:border-[#C8A46A]">Book Installation <ArrowUpRight className="h-4 w-4" /></a>
              <a href={PHONE_TEL} className="inline-flex items-center justify-center gap-2 rounded-md border border-[#0B0B0B]/15 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#0B0B0B]">Call Now <Phone className="h-4 w-4" /></a>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#E8E6E1] pt-4 text-xs font-semibold text-[#4E4E52]">
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#C8A46A]" /> Fully Licensed &amp; Insured</span>
            <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#C8A46A]" /> SplitsPro Workmanship Guarantee</span>
            <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#C8A46A]" /> Minimum 5-Year Manufacturer Warranty</span>
            <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#C8A46A]" /> Extras confirmed before work starts</span>
          </div>
        </div>
      </section>

      <BrandSelectionBanner currentSlug={brand.slug} />

      {/* Brand intro */}
      {brand.installEditorial ? (
        <DaikinIntroEditorial brand={brand} jumpToRange={jumpToRange} />
      ) : (
        <section className="bg-white py-14 sm:py-20" data-testid="brand-intro">
          <div className="sp-container">
            <Link to="/split-systems" data-testid="brand-back" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#C8A46A] link-line">
              <ArrowLeft className="h-4 w-4" /> Split System Air Conditioning
            </Link>
            <div className="mt-5 max-w-3xl">
              <p className="leading-relaxed text-[#6E6E73]">{brand.body}</p>
            </div>
            {brand.ranges.length > 1 && (
              <div className="mt-8 flex flex-wrap items-center gap-2" data-testid="range-tabs">
                {brand.ranges.map((r) => (
                  <button key={r.slug} onClick={() => jumpToRange(r.slug)} data-testid={`range-tab-${r.slug}`}
                    className="rounded-full border border-[#0B0B0B]/15 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0B0B0B] transition-all hover:border-[#C8A46A] hover:text-[#C8A46A]">
                    {r.tabLabel || r.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Ranges + pricing tables */}
      {brand.ranges.map((range, ri) => (
        <section
          key={range.slug}
          id={`range-${range.slug}`}
          data-testid={`range-${range.slug}`}
          className={`scroll-mt-24 py-16 sm:py-20 ${ri % 2 === 0 ? "bg-[#F5F5F7]" : "bg-white"}`}
        >
          <div className="sp-container">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-12">
            <div className="max-w-3xl">
              <span className="overline text-[#C8A46A]">{range.manufacturer || brand.brand}</span>
              <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-[#0B0B0B] md:text-4xl text-balance">
                {range.displayName || `${brand.brand} ${range.name}`}
              </h2>
              <p className="mt-4 leading-relaxed text-[#6E6E73]">{range.blurb}</p>

              {brand.slug === "daikin" && DAIKIN_COMPACT_FEATURES[range.slug] ? (
                <div className="mt-6" data-testid={`feature-details-${range.slug}`}>
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#008CCF]">Daikin key features</p>
                  <div className="grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3">
                    {DAIKIN_COMPACT_FEATURES[range.slug].map((feature) => {
                      const Icon = DAIKIN_ICON_MAP[feature.icon] || Sparkles;
                      return (
                        <div key={feature.title} className="flex min-w-0 items-start gap-2.5">
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#009FE3]/10 text-[#008CCF]">
                            <Icon className="h-4 w-4" strokeWidth={1.9} />
                          </span>
                          <div className="min-w-0">
                            <h3 className="text-[12px] font-bold leading-4 text-[#0B0B0B]">{feature.title}</h3>
                            <p className="mt-0.5 text-[11px] leading-[1.4] text-[#6E6E73]">{feature.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {(range.slug === "alira-x" || range.slug === "zena") && (
                    <p className="mt-4 max-w-2xl text-[10px] leading-[1.45] text-[#8A8A8E]">
                      {DAIKIN_STREAMER_FOOTNOTE}
                    </p>
                  )}
                </div>
              ) : (
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
              )}
            </div>
            {range.image && (
              <div
                className={`${range.slug === "zena" ? "w-full lg:col-span-2" : "mx-auto w-full max-w-2xl lg:mx-0 lg:justify-self-end"}`}
                data-testid={`range-image-${range.slug}`}
              >
                {range.slug === "zena" && range.gallery?.length >= 2 ? (
                  <div className="mt-2 grid gap-8 sm:grid-cols-2 sm:gap-10" data-testid="zena-two-finish-showcase">
                    {range.gallery.slice(0, 2).map((item, idx) => (
                      <figure key={`${range.slug}-large-${idx}`} className="m-0 flex min-h-[260px] flex-col items-center justify-center sm:min-h-[320px] lg:min-h-[360px]">
                        <img
                          src={item.src}
                          alt={item.alt}
                          loading="eager"
                          data-no-fallback="true"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                          className="zena-showcase-image block w-full object-contain"
                        />
                        <figcaption className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6E73]">{idx === 0 ? "Black Wood" : "White Hair Line"}</figcaption>
                      </figure>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="product-media-seamless flex min-h-[250px] items-center justify-center px-1 py-4 sm:min-h-[320px] lg:min-h-[380px]">
                      <img
                        src={OFFICIAL_PRODUCT_IMAGES[range.slug] || range.image}
                        alt={`${brand.brand} ${range.name} split system air conditioner`}
                        loading="lazy"
                        data-no-fallback="true"
                        onError={(e) => {
                          if (OFFICIAL_PRODUCT_IMAGES[range.slug] && e.currentTarget.dataset.officialFallback !== "true") {
                            e.currentTarget.dataset.officialFallback = "true";
                            e.currentTarget.src = range.image;
                          } else {
                            e.currentTarget.style.display = "none";
                          }
                        }}
                        className="product-unit-image block max-h-[340px] w-full object-contain sm:max-h-[410px] lg:max-h-[470px]"
                      />
                    </div>
                    {range.gallery?.length > 1 && (
                      <div className="mt-1 flex flex-wrap items-center justify-center gap-4 sm:gap-6" data-testid={`range-gallery-${range.slug}`}>
                        {range.gallery.slice(0, 3).map((item, idx) => (
                          <div key={`${range.slug}-${idx}`} className="product-thumb-seamless flex h-24 w-[44%] max-w-[190px] items-center justify-center sm:h-28 sm:w-[30%]">
                            <img
                              src={item.src}
                              alt={item.alt}
                              loading="lazy"
                              data-no-fallback="true"
                              onError={(e) => {
                          if (OFFICIAL_PRODUCT_IMAGES[range.slug] && e.currentTarget.dataset.officialFallback !== "true") {
                            e.currentTarget.dataset.officialFallback = "true";
                            e.currentTarget.src = range.image;
                          } else {
                            e.currentTarget.style.display = "none";
                          }
                        }}
                              className="product-unit-image h-full w-full object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-[#E5E5EA] py-3 text-xs text-[#5F5F63]" data-testid={`range-proof-${range.slug}`}>
              {ri % 3 === 0 && (
                <>
                  <span className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4 text-[#C8A46A]" /> Licensed &amp; insured installation</span>
                  <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#C8A46A]" /> Workmanship guarantee included</span>
                </>
              )}
              {ri % 3 === 1 && (
                <>
                  <span className="flex items-center gap-2 font-semibold"><Star className="h-4 w-4 fill-[#FBBC04] text-[#FBBC04]" /> 5-star customer feedback</span>
                  <span>&ldquo;Clean, efficient workmanship and a high standard of installation.&rdquo; — Google review</span>
                </>
              )}
              {ri % 3 === 2 && (
                <>
                  <span className="flex items-center gap-2 font-semibold"><Check className="h-4 w-4 text-[#C8A46A]" /> Minimum 5-year manufacturer warranty</span>
                  <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#C8A46A]" /> Any extras confirmed before work starts</span>
                </>
              )}
            </div>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.22em] text-[#6E6E73]">Supplied &amp; Installed</p>
            <div className="mt-3 overflow-hidden rounded-2xl border border-[#E5E5EA] bg-white soft-shadow-sm">
              {range.prices.map((row, i) => (
                <div
                  key={row.kw}
                  data-testid={`price-row-${range.slug}-${row.kw.replace(/[^0-9a-z]/gi, "")}`}
                  className={`grid gap-3 px-6 py-5 sm:grid-cols-[1fr_1fr_auto] sm:items-center sm:gap-8 ${i > 0 ? "border-t border-[#E5E5EA]" : ""}`}
                >
                  <span>
                    <span className="block font-serif text-xl text-[#0B0B0B] sm:text-2xl">{row.kw}</span>
                    {row.model && <span className="mt-1 block text-xs font-medium text-[#6E6E73]">Model {row.model}</span>}
                  </span>
                  <span className="font-serif text-xl text-[#0B0B0B] sm:text-2xl">{row.price}</span>
                  <button
                    onClick={() => handleBook(range, row)}
                    data-testid={`book-btn-${range.slug}-${row.kw.replace(/[^0-9a-z]/gi, "")}`}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0B0B0B] border border-[#C8A46A]/60 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#F8F7F5] transition-all hover:border-[#C8A46A] hover:text-[#E4CFA6] hover:-translate-y-[2px]"
                  >
                    Book Installation <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-[#6E6E73]" data-testid={`disclaimer-${range.slug}`}>
              Standard back-to-back installation pricing. Additional pipework, electrical work, brackets or non-standard access may cost extra. Any additional costs are confirmed before work proceeds.
            </p>
          </div>
        </section>
      ))}

      {/* Booking form — pre-filled with selection */}
      <section id="book" className="scroll-mt-24 bg-[#0B0B0B] py-24 sm:py-32" data-testid="brand-book-section">
        <div className="sp-container grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="overline text-[#C8A46A]">Book Installation</span>
            <h2 className="mt-5 font-serif text-4xl font-medium leading-tight tracking-tight text-white md:text-5xl text-balance">
              {selected
                ? `Book your ${selected.displayName} ${selected.kw}`
                : `Book your ${brand.brand} installation`}
            </h2>
            {selected && (
              <p className="mt-5 text-lg text-[#C8A46A]" data-testid="brand-selected-summary">
                {selected.price} · Supplied &amp; Installed
              </p>
            )}
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">
              A standard split-system installation is usually a small, contained job. You can normally keep using the rest of your home while we work.
            </p>
            <div className="mt-8 grid max-w-lg gap-5" data-testid="installation-reassurance">
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A46A]" />
                <div><p className="font-semibold text-white">Small work area</p><p className="mt-1 text-sm leading-relaxed text-white/60">We only need access around the indoor and outdoor unit positions, not your whole home.</p></div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A46A]" />
                <div><p className="font-semibold text-white">Minimal disruption</p><p className="mt-1 text-sm leading-relaxed text-white/60">You can normally carry on using the rest of the house while the installation is underway.</p></div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A46A]" />
                <div><p className="font-semibold text-white">Power stays on</p><p className="mt-1 text-sm leading-relaxed text-white/60">Only the necessary circuit is isolated for the electrical connection, usually for about 10–15 minutes on a standard job.</p></div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A46A]" />
                <div><p className="font-semibold text-white">Clean when we leave</p><p className="mt-1 text-sm leading-relaxed text-white/60">We manage the mess as we work, pack everything up and leave the installation area neat and tidy.</p></div>
              </div>
            </div>
          </div>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md sm:p-10" data-testid="brand-quote-card">
              <QuoteForm
                key={formKey}
                onDark
                defaultService="Split System Installation"
                defaultMessage={selectionMessage}
                submitLabel={submitLabel}
                compact
              />
              <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 pt-5">
                {[
                  "Minimum 5-Year Manufacturer Warranty",
                  "SplitsPro Workmanship Guarantee",
                  "Licensed & Insured",
                  "Standard installation pricing shown above",
                  "Any extras confirmed before work starts",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-1.5 text-xs font-medium text-white/70">
                    <Check className="h-3.5 w-3.5 text-[#C8A46A]" strokeWidth={2.5} /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sibling brand nav — compact */}
      <section className="bg-white py-14">
        <div className="sp-container flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2" data-testid="sibling-brands">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6E6E73]">Other brands:</span>
            {SPLIT_BRANDS.filter((b) => b.slug !== brand.slug).map((b) => (
              <Link key={b.slug} to={`/split-systems/${b.slug}`} data-testid={`brand-link-${b.slug}`}
                className="rounded-full border border-[#0B0B0B]/15 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0B0B0B] transition-all hover:border-[#C8A46A] hover:text-[#C8A46A]">
                {b.brand}
              </Link>
            ))}
          </div>
          <Link to="/split-systems" data-testid="brand-back-main" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#C8A46A] link-line">
            <ArrowLeft className="h-4 w-4" /> All split systems
          </Link>
        </div>
      </section>

      <section className="bg-[#0B0B0B] py-14" data-testid="brand-final-book-call">
        <div className="sp-container flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C8A46A]">Ready to install?</p>
            <p className="mt-2 font-serif text-2xl text-white">Book your {brand.brand} installation or call us now.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#book" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#C8A46A] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white">Book Installation <ArrowUpRight className="h-4 w-4" /></a>
            <a href={PHONE_TEL} className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white">Call Now <Phone className="h-4 w-4" /></a>
          </div>
        </div>
      </section>
    </>
  );
};

export default BrandPage;
