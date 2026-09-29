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

const RINNAI_LOCAL_HERO_IMAGE = `${process.env.PUBLIC_URL || ""}/landing/overheated-bulldog-hero.webp`;
const SOCIAL_PROOF_DOG_IMAGE = "data:image/webp;base64,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";
// Local offer hero artwork. Mobile uses the bright image-first layout.

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
        mobileImageFirst={isRinnaiLocalOffer}
        mobileImgPos={isRinnaiLocalOffer ? "object-[62%_center]" : "object-center"}
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
          <section className="bg-white pb-12 pt-5 sm:py-16" data-testid="local-offer-story">
            <div className="sp-container">
              <div className="mx-auto max-w-5xl">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#C8A46A]">A hassle-free way to install split systems</p>
                <h2 className="mt-4 max-w-4xl font-serif text-4xl font-medium leading-[1.06] tracking-tight text-[#0B0B0B] sm:text-5xl lg:text-6xl">
                  You pick the system. We handle the rest.
                </h2>
                <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#55555A]">
                  No chasing an aircon installer, then an electrician, then finding out the “from” price did not include the bits your home actually needs. Our standard installed price includes the unit, labour, up to 3 metres of pipework, a standard wall bracket or suitable floor placement, an isolation switch and up to 20 metres of electrical connection if required.
                </p>

                <p className="mt-10 max-w-4xl font-serif text-3xl leading-tight text-[#0B0B0B] sm:text-4xl">
                  Installations within 2 days. A standard install takes just a few hours. Get it sorted now — and beat the summer rush.
                </p>

                <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4 border-y border-[#E5E5EA] py-6 text-sm font-semibold text-[#3A3A3C]">
                  <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-[#C8A46A]" /> Installations within 2 days</span>
                  <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#C8A46A]" /> Up to 20m power circuit if required</span>
                  <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-[#C8A46A]" /> Isolation switch included</span>
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

          <section className="bg-[#F7F5F1] py-10 sm:py-16" data-testid="local-offer-proof">
            <div className="sp-container">
              <div className="mx-auto max-w-5xl">
                <div className="relative overflow-hidden rounded-[30px] bg-[#FCFBF8] px-5 py-7 shadow-[0_22px_70px_rgba(11,11,11,0.07)] sm:px-8 sm:py-10 lg:px-10">
                  <div className="relative z-10 pr-0 sm:pr-36 lg:pr-44">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#6E6E73]">Real reviews · Real installs · Real accountability</p>
                    <h2 className="mt-3 max-w-4xl font-serif text-4xl font-medium leading-[1.04] tracking-tight text-[#0B0B0B] sm:text-5xl lg:text-6xl">
                      Beat the summer rush with a team you can trust.
                    </h2>
                    <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#55555A] sm:text-lg">
                      Fast is only useful when the job is done properly. You&apos;re trusting someone to drill through your home, run electrical work, mount the system and commission it. We make that easy — and we stand behind what happens after the install, not just the sale.
                    </p>
                  </div>

                  <div className="mt-5 flex justify-end sm:absolute sm:right-5 sm:top-6 sm:mt-0 lg:right-8 lg:top-8">
                    <div className="w-[170px] overflow-hidden rounded-[22px] bg-[#0B0B0B] shadow-[0_16px_38px_rgba(11,11,11,0.18)] sm:w-[190px]">
                      <img
                        src={SOCIAL_PROOF_DOG_IMAGE}
                        alt="Beat the summer rush with a team you can trust"
                        loading="lazy"
                        data-no-fallback="true"
                        className="block aspect-[3/2] h-auto w-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="mt-7 grid gap-7 lg:grid-cols-[1fr_1.08fr] lg:gap-10">
                    <div className="rounded-[24px] bg-white p-5 shadow-[0_14px_36px_rgba(11,11,11,0.06)] sm:p-6">
                      <GoogleRating />
                      <div className="mt-5 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-[#FBBC04] text-[#FBBC04]" />)}
                      </div>
                      <blockquote className="mt-4 max-w-xl font-serif text-2xl leading-snug text-[#2E2E31]">
                        &ldquo;Very happy with the 5kW Rinnai installation. The team was professional.&rdquo;
                      </blockquote>
                      <p className="mt-3 text-sm font-semibold text-[#6E6E73]">— Leilani R., Ashcroft NSW · Google Review</p>
                      <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#5F5F63]">
                        Reviews tell you how we treated customers before you. Our licences, warranties and installation guarantee tell you what you can expect after we leave.
                      </p>
                    </div>

                    <div className="grid gap-0 rounded-[24px] border border-[#E5E1D9] bg-white px-5 sm:px-6">
                      <div className="border-b border-[#E7E3DC] py-5">
                        <div className="flex items-start gap-3">
                          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A46A]" />
                          <div>
                            <h3 className="font-semibold text-[#0B0B0B]">Fully licensed &amp; insured</h3>
                            <p className="mt-1 text-sm leading-relaxed text-[#6E6E73]">The electrical and air-conditioning work is handled as one organised installation — not something you need to coordinate yourself.</p>
                          </div>
                        </div>
                      </div>
                      <div className="border-b border-[#E7E3DC] py-5">
                        <div className="flex items-start gap-3">
                          <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A46A]" />
                          <div>
                            <h3 className="font-semibold text-[#0B0B0B]">Installation guarantee</h3>
                            <p className="mt-1 text-sm leading-relaxed text-[#6E6E73]">We stand behind the workmanship as well as the unit, so an installation issue does not become your problem to chase.</p>
                          </div>
                        </div>
                      </div>
                      <div className="border-b border-[#E7E3DC] py-5">
                        <div className="flex items-start gap-3">
                          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A46A]" />
                          <div>
                            <h3 className="font-semibold text-[#0B0B0B]">Manufacturer-backed warranty</h3>
                            <p className="mt-1 text-sm leading-relaxed text-[#6E6E73]">7-year manufacturer warranty on the Rinnai specials and 5-year manufacturer warranty on Daikin Cora.</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-5">
                        <div className="flex items-start gap-3">
                          <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A46A]" />
                          <div>
                            <h3 className="font-semibold text-[#0B0B0B]">Clear standard inclusions</h3>
                            <p className="mt-1 text-sm leading-relaxed text-[#6E6E73]">The advertised standard-install price includes labour, commissioning, up to 3 metres of pipework, a standard wall bracket or suitable floor placement, an isolation switch and up to 20 metres of electrical connection if required.</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="rounded-full bg-[#F3E9D2] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#7B5A28]">Wall bracket included</span>
                              <span className="rounded-full bg-[#F3E9D2] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#7B5A28]">Up to 20m electrical connection*</span>
                              <span className="rounded-full bg-[#F3E9D2] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#7B5A28]">Isolation switch included</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-9 border-t border-[#E3DED6] pt-8">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#6E6E73]">See the standard for yourself</p>
                    <h3 className="mt-2 font-serif text-3xl font-medium text-[#0B0B0B] sm:text-4xl">Clean work. Properly finished. Built to stay that way.</h3>
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                      <figure className="m-0 overflow-hidden rounded-[20px]">
                        <img
                          src={brand.installEditorial?.primary?.src}
                          alt={brand.installEditorial?.primary?.alt || "SplitsPro Rinnai outdoor installation"}
                          loading="lazy"
                          data-no-fallback="true"
                          className="aspect-[4/3] w-full object-cover"
                        />
                      </figure>
                      <figure className="m-0 overflow-hidden rounded-[20px]">
                        <img
                          src={brand.installEditorial?.secondary?.src}
                          alt={brand.installEditorial?.secondary?.alt || "SplitsPro Rinnai indoor installation"}
                          loading="lazy"
                          data-no-fallback="true"
                          className="aspect-[4/3] w-full object-cover"
                        />
                      </figure>
                    </div>
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
                  These are current advertised installed examples we found online. Different installers use different models, inclusions and site conditions — so this is a price check, not a claim that every quote is identical. With SplitsPro, the value is in what the installed price already includes.
                </p>

                <div className="mt-10 grid gap-10 border-y border-[#E5E5EA] py-8 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#6E6E73]">Rinnai 7kW installed</p>
                    <p className="mt-3 text-lg text-[#6E6E73]">Other advertised example</p>
                    <p className="font-serif text-4xl text-[#6E6E73] line-through">$2,799</p>
                    <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-[#8F6A34]">SplitsPro</p>
                    <p className="font-serif text-5xl text-[#0B0B0B]">$2,300</p>
                    <p className="mt-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8F6A34]">Your SplitsPro price already includes</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#F3E9D2] px-3 py-1.5 text-[10px] font-bold text-[#7B5A28]">Up to 20m electrical connection*</span>
                      <span className="rounded-full bg-[#F3E9D2] px-3 py-1.5 text-[10px] font-bold text-[#7B5A28]">Isolation switch</span>
                      <span className="rounded-full bg-[#F3E9D2] px-3 py-1.5 text-[10px] font-bold text-[#7B5A28]">Wall bracket</span>
                      <span className="rounded-full bg-[#F3E9D2] px-3 py-1.5 text-[10px] font-bold text-[#7B5A28]">Up to 3m pipework</span>
                      <span className="rounded-full bg-[#F3E9D2] px-3 py-1.5 text-[10px] font-bold text-[#7B5A28]">Labour + commissioning</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#6E6E73]">Daikin Cora 7.1kW installed</p>
                    <p className="mt-3 text-lg text-[#6E6E73]">Other advertised example</p>
                    <p className="font-serif text-4xl text-[#6E6E73] line-through">$3,411.94</p>
                    <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-[#8F6A34]">SplitsPro</p>
                    <p className="font-serif text-5xl text-[#0B0B0B]">$2,550</p>
                    <p className="mt-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8F6A34]">Your SplitsPro price already includes</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#F3E9D2] px-3 py-1.5 text-[10px] font-bold text-[#7B5A28]">Up to 20m electrical connection*</span>
                      <span className="rounded-full bg-[#F3E9D2] px-3 py-1.5 text-[10px] font-bold text-[#7B5A28]">Isolation switch</span>
                      <span className="rounded-full bg-[#F3E9D2] px-3 py-1.5 text-[10px] font-bold text-[#7B5A28]">Wall bracket</span>
                      <span className="rounded-full bg-[#F3E9D2] px-3 py-1.5 text-[10px] font-bold text-[#7B5A28]">Up to 3m pipework</span>
                      <span className="rounded-full bg-[#F3E9D2] px-3 py-1.5 text-[10px] font-bold text-[#7B5A28]">Labour + commissioning</span>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-[10px] leading-relaxed text-[#8A8A8E]">
                  Price check: Ozcon Air listed a Rinnai 7kW supplied &amp; installed at $2,799; Hewitt Trade Services listed Daikin Cora 7.1kW supplied &amp; installed at $3,411.94. Competitor inclusions and installation conditions vary. SplitsPro standard-install pricing includes the wall bracket, isolation switch, up to 20m electrical connection if required, up to 3m pipework, labour and commissioning. Checked 29 Sep 2026.
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
                ? "*No more to pay applies to qualifying standard installations including up to 3 metres of refrigeration pipework, a standard wall bracket or suitable floor placement, an isolation switch and up to 20 metres of electrical connection if required. Switchboard upgrades, pipe runs over 3 metres, difficult access, asbestos-related work and other non-standard requirements are quoted before proceeding."
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
