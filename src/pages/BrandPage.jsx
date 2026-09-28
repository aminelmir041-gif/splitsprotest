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

const RINNAI_LOCAL_HERO_IMAGE = "data:image/webp;base64,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";

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
  "rinnai-local": [
    { title: "7-Year Warranty", desc: "Seven years of warranty cover on this Rinnai installed special for extra peace of mind.", fallback: ShieldCheck, highlight: true },
    { title: "2-Day Installation Guarantee", desc: "Eligible standard installations booked from this offer are installed within 2 days.", fallback: Zap },
    { title: "Wi-Fi Control", desc: "Smart control is available on the Rinnai system used for this offer.", fallback: Wifi },
    { title: "No More To Pay*", desc: "The advertised price is the installed price for qualifying standard installations.", fallback: Check },
  ],
  "daikin-lite-local": [
    { title: "5-Year Warranty", desc: "Daikin manufacturer warranty for long-term peace of mind.", fallback: ShieldCheck },
    { title: "2-Day Installation Guarantee", desc: "Eligible standard installations booked from this offer are installed within 2 days.", fallback: Zap },
    { title: "Blue Fin Anti-Corrosive Coating", desc: "Added outdoor heat-exchanger protection suited to coastal environments.", fallback: ShieldCheck },
    { title: "No More To Pay*", desc: "The advertised price is the installed price for qualifying standard installations.", fallback: Check },
  ],
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

const RINNAI_LOCAL_SALE_FACTOR = 1750 / 1990;
const RINNAI_LOCAL_DISCOUNT_LABEL = "12% OFF";

const getRinnaiLocalSalePrice = (price) => {
  const regular = Number(String(price).replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(regular)) return price;
  const sale = Math.round(regular * RINNAI_LOCAL_SALE_FACTOR);
  return `$${sale.toLocaleString("en-AU")}`;
};

const RINNAI_LOCAL_OFFER_RANGES = [
  {
    slug: "rinnai-local",
    manufacturer: "Rinnai",
    name: "Rinnai Split Systems",
    displayName: "Rinnai Split Systems",
    tabLabel: "Rinnai",
    localBrand: "Rinnai",
    blurb: "Rinnai supplied-and-installed special pricing available Sydney-wide, plus the Central Coast and Wollongong. Choose the capacity that suits your room and book while installation spots are available.",
    image: SPLIT_BRANDS.find((b) => b.slug === "rinnai")?.ranges?.[0]?.image,
    prices: [
      { kw: "2.5kW", price: "$1,450", localOfferPrice: "$1,450" },
      { kw: "3.5kW", price: "$1,550", localOfferPrice: "$1,550" },
      { kw: "5.0kW", price: "$1,900", localOfferPrice: "$1,900" },
      { kw: "7.0kW", price: "$2,300", localOfferPrice: "$2,300" },
    ],
  },
  {
    slug: "daikin-lite-local",
    manufacturer: "Daikin",
    name: "Cora",
    displayName: "Daikin Cora",
    tabLabel: "Daikin Cora",
    localBrand: "Daikin",
    blurb: "Daikin Cora supplied and installed at a clear special price Sydney-wide, plus the Central Coast and Wollongong, with a 2-day installation guarantee, 5-year warranty and Blue Fin anti-corrosive coating for added protection in coastal areas.",
    image: SPLIT_BRANDS.find((b) => b.slug === "daikin")?.ranges?.find((r) => r.slug === "cora")?.image,
    prices: [
      { kw: "2.5kW", price: "$1,550", localOfferPrice: "$1,550" },
      { kw: "3.5kW", price: "$1,750", localOfferPrice: "$1,750" },
      { kw: "5.0kW", price: "$2,150", localOfferPrice: "$2,150" },
      { kw: "7.0kW", price: "$2,550", localOfferPrice: "$2,550" },
    ],
  },
];

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

const BrandPage = ({ offerMode = null }) => {
  const { slug } = useParams();
  const isRinnaiLocalOffer = offerMode === "rinnai-local";
  const brand = SPLIT_BRANDS.find((b) => b.slug === (isRinnaiLocalOffer ? "rinnai" : slug));
  const displayRanges = isRinnaiLocalOffer ? RINNAI_LOCAL_OFFER_RANGES : brand?.ranges || [];
  const lenis = useLenis();
  const [selected, setSelected] = useState(null);
  const [activeOfferSlug, setActiveOfferSlug] = useState("rinnai-local");
  const activeOfferRange = isRinnaiLocalOffer
    ? (displayRanges.find((range) => range.slug === activeOfferSlug) || displayRanges[0])
    : null;

  if (!brand) return <Navigate to="/split-systems" replace />;

  const handleBook = (range, priceRow) => {
    const effectivePrice = isRinnaiLocalOffer ? (priceRow.localOfferPrice || getRinnaiLocalSalePrice(priceRow.price)) : priceRow.price;
    const sel = { rangeName: range.name, displayName: range.displayName || `${brand.brand} ${range.name}`, localBrand: range.localBrand || brand.brand, kw: priceRow.kw, price: effectivePrice, regularPrice: priceRow.price };
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
    ? isRinnaiLocalOffer
      ? `I'd like to book the ${selected.localBrand || "Rinnai"} installed special for ${selected.displayName} ${selected.kw} — ${selected.price} supplied & installed on the advertised standard installation terms.`
      : `I'd like to book installation for ${selected.displayName} ${selected.kw} — advertised at ${selected.price} supplied & installed.`
    : isRinnaiLocalOffer
      ? "I'd like to book one of the advertised Rinnai or Daikin Cora supplied-and-installed specials for my area."
      : "";

  const formKey = selected ? `${brand.slug}-${selected.displayName}-${selected.kw}` : `${brand.slug}-default`;
  const submitLabel = selected
    ? isRinnaiLocalOffer
      ? `Claim ${selected.displayName} ${selected.kw} Offer`
      : `Book ${selected.displayName} ${selected.kw}`
    : isRinnaiLocalOffer
      ? "Book My Installation"
      : `Book ${brand.brand} Installation`;

  const pageTitle = isRinnaiLocalOffer
    ? "Rinnai & Daikin Cora Installed Specials | Sydney-Wide, Central Coast & Wollongong | SplitsPro"
    : brand.metaTitle;
  const pageDescription = isRinnaiLocalOffer
    ? "Rinnai and Daikin Cora split-system specials available Sydney-wide, plus the Central Coast and Wollongong, with supplied-and-installed pricing, a 2-day installation guarantee and clear standard-install conditions."
    : brand.metaDesc;
  const canonicalUrl = isRinnaiLocalOffer
    ? "https://splitspro.com.au/split-systems/rinnai-local-offer"
    : `https://splitspro.com.au/split-systems/${brand.slug}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={brand.image} />
      </Helmet>

      <PageHero
        overline={isRinnaiLocalOffer ? "Rinnai & Daikin Cora · Fast, Reliable Installation" : brand.brand}
        title={isRinnaiLocalOffer ? "When the heat takes over, get your home back — without turning your life upside down." : brand.h1}
        sub={isRinnaiLocalOffer ? "Reliable installation. Minimal disruption. 5-star rated. Installations within 2 days. Sydney, Central Coast & Wollongong." : brand.tagline}
        image={isRinnaiLocalOffer ? RINNAI_LOCAL_HERO_IMAGE : brand.image}
        desktopBrand
      />







      {!isRinnaiLocalOffer && (
        <>
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
                  {isRinnaiLocalOffer ? (
                    <>
                      &ldquo;Very happy with the 5kW Rinnai installation. The team was professional.&rdquo;
                      <span className="ml-2 whitespace-nowrap text-xs font-semibold text-[#6E6E73]">— Leilani R., Ashcroft NSW · Google Review</span>
                    </>
                  ) : (
                    <>
                      &ldquo;They were professional from the initial quote through to installation... The workmanship was clean, efficient and we couldn&apos;t be happier.&rdquo;
                      <span className="ml-2 whitespace-nowrap text-xs font-semibold text-[#6E6E73]">— {FEATURED_REVIEW.name}, Google Review</span>
                    </>
                  )}
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
        </>
      )}

      {isRinnaiLocalOffer && (
        <>
          <section className="bg-white py-14 sm:py-20" data-testid="local-offer-story">
            <div className="sp-container">
              <div className="mx-auto max-w-5xl">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#C8A46A]">A hassle-free way to install split systems</p>
                <h2 className="mt-4 max-w-4xl font-serif text-4xl font-medium leading-[1.06] tracking-tight text-[#0B0B0B] sm:text-5xl lg:text-6xl">
                  You pick the system. We handle the rest.
                </h2>
                <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#55555A]">
                  No chasing an aircon installer, then an electrician, then finding out the “from” price did not include the bits your home actually needs. Our standard installed price includes the unit, labour, standard electrical work, a standard wall bracket or suitable floor placement, and up to 3 metres of pipework.
                </p>

                <p className="mt-10 max-w-4xl font-serif text-3xl leading-tight text-[#0B0B0B] sm:text-4xl">
                  Installations within 2 days. A standard install takes just a few hours. Get it sorted now — and beat the summer rush.
                </p>

                <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4 border-y border-[#E5E5EA] py-6 text-sm font-semibold text-[#3A3A3C]">
                  <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-[#C8A46A]" /> Installations within 2 days</span>
                  <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#C8A46A]" /> Standard electricals included</span>
                  <span className="flex items-center gap-2"><MoveHorizontal className="h-4 w-4 text-[#C8A46A]" /> Up to 3m pipework</span>
                  <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#C8A46A]" /> Installation guarantee</span>
                  <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#C8A46A]" /> Manufacturer warranty</span>
                </div>

                <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#C8A46A]">Comfort without the compromise</p>
                    <h3 className="mt-3 font-serif text-3xl font-medium leading-tight text-[#0B0B0B] sm:text-4xl">
                      Premium units — not stripped-back bargain boxes.
                    </h3>
                    <p className="mt-5 text-base leading-relaxed text-[#5F5F63]">
                      Depending on the model, you get Wi-Fi control, inverter power-saving operation, dry / humidity-control modes, quiet operation and smarter airflow — features designed to make the system easier and cheaper to live with, not just cheaper to buy.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-6 border-l-0 border-[#E5E5EA] lg:border-l lg:pl-10">
                    <div><Wifi className="h-5 w-5 text-[#C8A46A]" /><p className="mt-2 font-semibold text-[#0B0B0B]">Smart Wi-Fi</p><p className="mt-1 text-xs leading-relaxed text-[#6E6E73]">Control supported models from your phone.</p></div>
                    <div><Leaf className="h-5 w-5 text-[#C8A46A]" /><p className="mt-2 font-semibold text-[#0B0B0B]">Power saving</p><p className="mt-1 text-xs leading-relaxed text-[#6E6E73]">Inverter operation adjusts output instead of running flat-out.</p></div>
                    <div><Droplets className="h-5 w-5 text-[#C8A46A]" /><p className="mt-2 font-semibold text-[#0B0B0B]">Dry mode</p><p className="mt-1 text-xs leading-relaxed text-[#6E6E73]">Helps manage sticky summer humidity.</p></div>
                    <div><Fan className="h-5 w-5 text-[#C8A46A]" /><p className="mt-2 font-semibold text-[#0B0B0B]">Quiet airflow</p><p className="mt-1 text-xs leading-relaxed text-[#6E6E73]">Comfort without turning the room into a wind tunnel.</p></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#F8F7F4] py-14 sm:py-20" data-testid="local-offer-proof">
            <div className="sp-container">
              <div className="mx-auto max-w-5xl">
                <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#C8A46A]">Why trust us with your home?</p>
                    <h2 className="mt-4 font-serif text-4xl font-medium leading-tight tracking-tight text-[#0B0B0B] sm:text-5xl">Don&apos;t take our word for it. Look at the work.</h2>
                    <div className="mt-6"><GoogleRating /></div>
                    <div className="mt-5 grid gap-5 md:grid-cols-[1fr_220px] md:items-end">
                      <div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-[#FBBC04] text-[#FBBC04]" />)}
                        </div>
                        <blockquote className="mt-4 max-w-xl text-lg leading-relaxed text-[#3A3A3C]">
                          &ldquo;Very happy with the 5kW Rinnai installation. The team was professional.&rdquo;
                        </blockquote>
                        <p className="mt-2 text-sm font-semibold text-[#6E6E73]">— Leilani R., Ashcroft NSW · Google Review</p>
                      </div>
                      <div className="relative flex min-h-[220px] items-end justify-center md:justify-end">
                        <div className="pointer-events-none absolute bottom-2 right-0 h-[78%] w-[92%] rounded-full bg-[#FFD84D]/45 blur-3xl" aria-hidden="true" />
                        <img
                          src={`${process.env.PUBLIC_URL || ""}/landing/rinnai-google-dog.webp`}
                          alt="Beat the summer rush with a team you can trust"
                          loading="lazy"
                          data-no-fallback="true"
                          className="relative z-10 -mb-2 w-full max-w-[285px] object-contain md:max-w-[315px] md:translate-x-3"
                          style={{ filter: "brightness(1.14) saturate(1.24) contrast(1.08) drop-shadow(0 18px 24px rgba(11,11,11,0.24))" }}
                        />
                      </div>
                    </div>

                    <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#3A3A3C]">
                      <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#C8A46A]" /> Fully licensed &amp; insured</span>
                      <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#C8A46A]" /> Workmanship guarantee</span>
                      <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#C8A46A]" /> 7-year Rinnai / 5-year Daikin warranty</span>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <figure className="m-0 overflow-hidden rounded-[22px]">
                      <img
                        src={brand.installEditorial?.primary?.src}
                        alt={brand.installEditorial?.primary?.alt || "SplitsPro Rinnai outdoor installation"}
                        loading="lazy"
                        data-no-fallback="true"
                        className="aspect-[4/5] w-full object-cover"
                      />
                    </figure>
                    <figure className="m-0 overflow-hidden rounded-[22px] sm:translate-y-8">
                      <img
                        src={brand.installEditorial?.secondary?.src}
                        alt={brand.installEditorial?.secondary?.alt || "SplitsPro Rinnai indoor installation"}
                        loading="lazy"
                        data-no-fallback="true"
                        className="aspect-[4/5] w-full object-cover"
                      />
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white py-14 sm:py-20" data-testid="local-offer-market-check">
            <div className="sp-container">
              <div className="mx-auto max-w-5xl">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#C8A46A]">Then we checked the market</p>
                <h2 className="mt-4 max-w-4xl font-serif text-4xl font-medium leading-tight tracking-tight text-[#0B0B0B] sm:text-5xl">
                  Same brands. Same size class. Very different numbers.
                </h2>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#5F5F63]">
                  These are current advertised installed examples we found online. Different installers use different models, inclusions and site conditions — so this is a price check, not a claim that every quote is identical.
                </p>

                <div className="mt-10 grid gap-10 border-y border-[#E5E5EA] py-8 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#6E6E73]">Rinnai 7kW installed</p>
                    <p className="mt-3 text-lg text-[#6E6E73]">Other advertised example</p>
                    <p className="font-serif text-4xl text-[#6E6E73] line-through">$2,799</p>
                    <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-[#8F6A34]">SplitsPro</p>
                    <p className="font-serif text-5xl text-[#0B0B0B]">$2,300</p>
                  </div>

                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#6E6E73]">Daikin Cora 7.1kW installed</p>
                    <p className="mt-3 text-lg text-[#6E6E73]">Other advertised examples</p>
                    <p className="font-serif text-4xl text-[#6E6E73]">$2,800–$3,411.94</p>
                    <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-[#8F6A34]">SplitsPro</p>
                    <p className="font-serif text-5xl text-[#0B0B0B]">$2,550</p>
                  </div>
                </div>

                <p className="mt-4 text-[10px] leading-relaxed text-[#8A8A8E]">
                  Price check: Ozcon Air listed a Rinnai 7kW supplied &amp; installed at $2,799; BD Air listed Daikin Cora 7.1kW at $2,800; Hewitt Trade Services listed Daikin Cora 7.1kW at $3,411.94. Checked 28 Sep 2026. Installation conditions and models vary.
                </p>

                <p className="mt-12 font-serif text-3xl text-[#0B0B0B] sm:text-4xl">Now pick the size that suits your home.</p>
              </div>
            </div>
          </section>
        </>
      )}

      {isRinnaiLocalOffer && activeOfferRange && (
        <section id="installed-prices" className="scroll-mt-24 bg-white py-10 sm:py-12" data-testid="compact-installed-price-picker">
          <div className="sp-container">
            <div className="mx-auto max-w-5xl">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A46A]">Choose your system</p>
                  <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-[#0B0B0B] sm:text-4xl">Pick a brand. Pick a size. See the installed price.</h2>
                </div>
                <div className="inline-flex self-start rounded-full border border-[#E5E5EA] bg-[#F8F7F4] p-1" role="tablist" aria-label="Choose air conditioner brand">
                  {displayRanges.map((range) => {
                    const active = range.slug === activeOfferRange.slug;
                    return (
                      <button
                        key={range.slug}
                        type="button"
                        onClick={() => setActiveOfferSlug(range.slug)}
                        className={`rounded-full px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-all sm:px-5 ${active ? "bg-[#0B0B0B] text-white shadow-sm" : "text-[#5F5F63]"}`}
                        aria-selected={active}
                        role="tab"
                      >
                        {range.tabLabel || range.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#E5E5EA] bg-[#FBFAF8] p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-serif text-2xl text-[#0B0B0B]">{activeOfferRange.displayName}</p>
                    <p className="mt-1 text-xs text-[#6E6E73]">
                      {activeOfferRange.localBrand === "Rinnai" ? "7-year manufacturer warranty" : "5-year manufacturer warranty"} · Installation guarantee · Installations within 2 days
                    </p>
                  </div>
                  <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#7B5A28]">Supplied &amp; installed</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {activeOfferRange.prices.map((row) => {
                    const price = row.localOfferPrice || getRinnaiLocalSalePrice(row.price);
                    return (
                      <button
                        key={row.kw}
                        type="button"
                        onClick={() => handleBook(activeOfferRange, row)}
                        className="group rounded-xl border border-[#E2DED7] bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#C8A46A] hover:shadow-md"
                      >
                        <span className="block text-xs font-bold uppercase tracking-[0.12em] text-[#6E6E73]">{row.kw}</span>
                        <span className="mt-1 block font-serif text-2xl text-[#0B0B0B]">{price}</span>
                        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8A8A8E]">Installed</span>
                        <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#8F6A34]">Choose <ArrowUpRight className="h-3.5 w-3.5" /></span>
                      </button>
                    );
                  })}
                </div>

                <p className="mt-4 text-[11px] leading-relaxed text-[#6E6E73]">Standard-install pricing shown. If your home genuinely needs extra work, we tell you what it is and the price before it starts.</p>

              </div>
            </div>
          </div>
        </section>
      )}

      {!isRinnaiLocalOffer && <BrandSelectionBanner currentSlug={brand.slug} />}

      {/* Brand intro */}
      {!isRinnaiLocalOffer && (brand.installEditorial ? (
        <DaikinIntroEditorial brand={brand} jumpToRange={jumpToRange} />
      ) : (
        <section className="bg-white py-14 sm:py-20" data-testid="brand-intro">
          <div className="sp-container">
            <Link to="/split-systems" data-testid="brand-back" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#C8A46A] link-line">
              <ArrowLeft className="h-4 w-4" /> Split System Air Conditioning
            </Link>
            <div className="mt-5 max-w-3xl">
              <p className="leading-relaxed text-[#6E6E73]">
                {isRinnaiLocalOffer
                  ? "Pick the brand, pick the size, see the supplied-and-installed price. Rinnai and Daikin Cora are both available across Sydney, the Central Coast and Wollongong."
                  : brand.body}
              </p>
            </div>
            {displayRanges.length > 1 && (
              <div className="mt-8 flex flex-wrap items-center gap-2" data-testid="range-tabs">
                {displayRanges.map((r) => (
                  <button key={r.slug} onClick={() => jumpToRange(r.slug)} data-testid={`range-tab-${r.slug}`}
                    className="rounded-full border border-[#0B0B0B]/15 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0B0B0B] transition-all hover:border-[#C8A46A] hover:text-[#C8A46A]">
                    {r.tabLabel || r.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

            {/* Ranges + pricing tables */}
      {!isRinnaiLocalOffer && displayRanges.map((range, ri) => (
        <section
          key={range.slug}
          id={`range-${range.slug}`}
          data-testid={`range-${range.slug}`}
          className={`scroll-mt-24 py-16 sm:py-20 ${ri % 2 === 0 ? "bg-[#F5F5F7]" : "bg-white"}`}
        >
          <div className="sp-container">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-12">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="overline text-[#C8A46A]">{range.manufacturer || brand.brand}</span>
                {isRinnaiLocalOffer && (
                  <span className="rounded-full border border-[#C8A46A]/50 bg-[#F3E9D2] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#7B5A28]">Limited spots</span>
                )}
              </div>
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
                        <div key={feature.title} className={`flex min-w-0 items-start gap-2.5 ${feature.highlight ? "col-span-2 rounded-xl border-2 border-[#C8A46A] bg-[#FFF8E8] p-4 sm:col-span-3" : ""}`}>
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#009FE3]/10 text-[#008CCF]">
                            <Icon className="h-4 w-4" strokeWidth={1.9} />
                          </span>
                          <div className="min-w-0">
                            <h3 className={feature.highlight ? "text-2xl font-black leading-tight text-[#0B0B0B] sm:text-3xl" : "text-[12px] font-bold leading-4 text-[#0B0B0B]"}>{feature.title}</h3>
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
                    {isRinnaiLocalOffer && (
                      <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#C8A46A]/50 bg-[#FFF8E8] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#7B5A28]">
                        <Zap className="h-3.5 w-3.5" /> Installed within 2 days — guaranteed
                      </span>
                    )}
                  </span>
                  <span className="text-[#0B0B0B]">
                    {isRinnaiLocalOffer ? (
                      row.localOfferPrice ? (
                        <span className="flex flex-col items-start">
                          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A8A8E]">Supplied &amp; installed</span>
                          <span className="mt-1 font-serif text-2xl text-[#0B0B0B] sm:text-3xl">{row.localOfferPrice}</span>
                          <span className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#B58C4E]">No more to pay*</span>
                        </span>
                      ) : (
                        <span className="flex flex-col items-start">
                          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A8A8E] line-through">Was {row.price}</span>
                          <span className="mt-1 font-serif text-2xl text-[#0B0B0B] sm:text-3xl">{getRinnaiLocalSalePrice(row.price)}</span>
                          <span className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#B58C4E]">{RINNAI_LOCAL_DISCOUNT_LABEL} · Limited spots</span>
                        </span>
                      )
                    ) : (
                      <span className="font-serif text-xl sm:text-2xl">{row.price}</span>
                    )}
                  </span>
                  <button
                    onClick={() => handleBook(range, row)}
                    data-testid={`book-btn-${range.slug}-${row.kw.replace(/[^0-9a-z]/gi, "")}`}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0B0B0B] border border-[#C8A46A]/60 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#F8F7F5] transition-all hover:border-[#C8A46A] hover:text-[#E4CFA6] hover:-translate-y-[2px]"
                  >
                    {isRinnaiLocalOffer ? "Book This Offer" : "Book Installation"} <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-[#6E6E73]" data-testid={`disclaimer-${range.slug}`}>
              {isRinnaiLocalOffer
                ? "*No more to pay applies to qualifying standard installations including up to 3 metres of refrigeration pipework and standard electrical installation. Pipe runs over 3 metres, switchboard upgrades, difficult access, asbestos-related work and other non-standard requirements are quoted before proceeding."
                : "Standard back-to-back installation pricing. Additional pipework, electrical work, brackets or non-standard access may cost extra. Any additional costs are confirmed before work proceeds."}
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
                : isRinnaiLocalOffer
                  ? "Book your split system installation"
                  : `Book your ${brand.brand} installation`}
            </h2>
            {selected && (
              <p className="mt-5 text-lg text-[#C8A46A]" data-testid="brand-selected-summary">
                {selected.price} · Supplied &amp; Installed{isRinnaiLocalOffer ? " · Installed within 2 days" : ""}
              </p>
            )}
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">
              Busy day? No problem. A standard split-system install normally takes just a few hours, and you can usually keep using the rest of your home while we work.
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
                hideMessage
              />
              <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 pt-5">
                {[
                  "Minimum 5-Year Manufacturer Warranty",
                  "SplitsPro Workmanship Guarantee",
                  isRinnaiLocalOffer ? "Installed special pricing shown above" : "Standard installation pricing shown above",
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
