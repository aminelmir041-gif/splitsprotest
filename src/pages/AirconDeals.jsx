import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

import {
  ArrowDown, ArrowRight, BadgeCheck, Check, CheckCircle2,
  Clock3, CreditCard, Phone, ShieldCheck, Star,
} from "lucide-react";


import QuoteForm from "../components/QuoteForm";
import { GoogleRating } from "../components/sections";
import { PHONE, PHONE_TEL, FEATURED_REVIEW, GOOGLE_RATING, IMAGES } from "../lib/data";
import { getReviews } from "../lib/api";
import { RINNAI_LOCAL_OFFER_RANGES } from "./BrandPage";

// Google Search visitors are actively comparing an installed deal.
// Show brand and installed-price selection without online booking,
// but put shopping and trust first instead of the Meta-style education story.
const priceFrom = (price) => Number(String(price).replace(/[^\d]/g, ""));
const allOffers = RINNAI_LOCAL_OFFER_RANGES.flatMap((brand) =>
  brand.prices.map((row) => ({
    brand: brand.displayName,
    size: row.kw,
    price: priceFrom(row.localOfferPrice || row.price),
  })),
);
const FAQs = [
  {
    question: "What's included in the advertised installed price?",
    answer: "The system, standard installation labour, up to 3 metres of refrigeration pipe, a standard wall bracket or suitable ground mounting, an isolator, and up to 20 metres of electrical circuit work where required. The price also includes commissioning and our installation guarantee.",
  },
  {
    question: "Will there be extra charges?",
    answer: "Not for an installation that meets the standard package. Longer pipe runs, difficult roof or wall access, switchboard upgrades, additional electrical work or other non-standard conditions are quoted separately before the job goes ahead.",
  },
  {
    question: "How quickly can you install?",
    answer: "Same-day installations may be available for eligible jobs. We aim to offer an installation appointment within 2 business days, subject to stock, access and our schedule. Call us to confirm the next available time.",
  },
  {
    question: "Can I book without paying the whole amount?",
    answer: "Yes. No payment is required to discuss options. We explain payment arrangements if you decide to proceed.",
  },
  {
    question: "Which areas do you cover?",
    answer: "SplitsPro services Sydney, the Central Coast and Wollongong. If you have an unusual installation or are unsure whether we cover your suburb, call or send us photos for a free quote.",
  },
];
const included = [
  "Your new air conditioner",
  "Professional installation",
  "Indoor and outdoor units back-to-back on the same wall",
  "Up to 20 metres of electrical cabling where required",
  "Wall bracket, mounting feet or a suitable pad",
  "All standard fittings and connections",
  "Testing, handover and workmanship support",
];
const GOOGLE_REVIEWS_URL = "https://g.page/r/CYTvO1ipeYUtEBM/";
const FALLBACK_REVIEWS = [
  { id: "erfaan-khan", name: "Erfaan Khan", rating: 5, text: "Very happy with the service. They were polite, helpful, and took the time to explain everything instead of trying to rush the job." },
  { id: "baitmee-marine", name: "BAITMEE MARINE", rating: 5, text: "Thanks to the boys from splitspro for an amazing job quick and neat and a great price!!" },
  { id: "billy-s", name: "BILLY S", rating: 5, text: "Had a new air conditioner installed in our granny flat and couldn’t be happier. The installation was neat and tidy, everything was explained clearly." },
  { id: "moeyy-khaled", name: "Moeyy Khaled", rating: 5, text: "Very happy with the electrical work and 5kW Mitsubishi installation. Clean, professional job — highly recommend." },
  { id: "gill-mcphee", name: "Gill McPhee", rating: 5, text: "Amin and Ibrahim were excellent installers. They work very well as a team. Heatwave arrives tomorrow, 34 degrees, and we have cooling!" },
  { id: "sia", ...FEATURED_REVIEW },
  { id: "mat-134", name: "Mat 134", rating: 5, text: "Best in the business, amazing work." },
];

const AirconDeals = () => {
  const { search } = useLocation();

  const [activePhoto, setActivePhoto] = useState(null);
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS);
  useEffect(() => { let active = true; getReviews().then(items => { if (active && Array.isArray(items) && items.length) setReviews(items); }).catch(() => {}); return () => { active = false; }; }, []);
  const requestedBrand = new URLSearchParams(search).get("brand")?.toLowerCase();
  const initialBrand = requestedBrand === "daikin" ? "daikin-lite-local"
    : requestedBrand === "rinnai" ? "rinnai-local" : "";
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);

  const schema = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    name: "SplitsPro",
    url: "https://splitspro.com.au/aircon-deals",
    telephone: "+61414698435",
    areaServed: ["Sydney", "Central Coast NSW", "Wollongong NSW"],
    address: { "@type": "PostalAddress", addressLocality: "Bass Hill", addressRegion: "NSW", addressCountry: "AU" },
    makesOffer: {
      "@type": "OfferCatalog",
      name: "Split systems supplied and installed",
      itemListElement: allOffers.map((offer) => ({
        "@type": "Offer",
        priceCurrency: "AUD",
        price: offer.price,
        itemOffered: {
          "@type": "Service",
          name: offer.brand + " " + offer.size + " split system supplied and installed",
        },
      })),
    },
  };
  return (
    <>
      <Helmet>
        <title>Split Systems Fully Installed with Electrical Circuit Included | Sydney | SplitsPro</title>
        <meta name="description" content="Rinnai 2.5kW $1,700 fully installed. Daikin Cora 2.5kW $2,000. Standard installation includes electrical circuit, bracket, isolator and pipework." />
        <link rel="canonical" href="https://splitspro.com.au/aircon-deals" />
        <meta property="og:title" content="Rinnai & Daikin Split Systems Supplied & Installed | SplitsPro Sydney" />
        <meta property="og:description" content="Your standard-install price includes the unit, electrical circuit, isolator, bracket and pipework. Compare sizes and prices, then call for a free no-pressure consultation." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <section data-testid="google-ads-hero" className="bg-[#0B0B0B] text-white">
        <div className="sp-container grid gap-10 pb-16 pt-24 sm:pb-20 sm:pt-28 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:gap-16">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.19em] text-[#D9BC8B]">SplitsPro · Sydney installation deals</p>
            <h1 className="mt-6 max-w-3xl font-serif text-[clamp(48px,6.5vw,92px)] font-medium leading-[0.98] tracking-[-0.055em]">
              A better aircon deal. <span className="block text-[#E4CFA6]">All installed.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-[1.6] text-white/80 sm:text-xl">
              Explore our Rinnai and Daikin Cora packages, including premium Wi-Fi options. See the installed price upfront. No more to pay when your job meets our standard-install criteria.
            </p>
            <a href="#aircon-deals-prices" className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-lg bg-[#D8B77C] px-7 py-3 text-sm font-extrabold tracking-wide text-[#17130E] hover:bg-[#F0D6A7]">Explore installed deals <ArrowDown className="h-4 w-4" /></a>
            <div className="mt-7 flex flex-col gap-3 text-sm font-medium text-white/80">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#C8A46A]" /> No more to pay on qualifying standard installs</span>
              <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#C8A46A]" /> Same-day installation may be available · appointments within 2 business days, subject to availability</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#C8A46A]" /> Installation guarantee</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-[28px] border border-[#C7A46C]/35 bg-[#191715] p-7 shadow-[0_28px_90px_rgba(0,0,0,.35)] sm:p-9">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#D9BC8B]">Real installed package prices</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-semibold text-white/70">Rinnai 2.5kW</p>
                <p className="mt-3 font-serif text-[clamp(36px,4vw,58px)] leading-none tracking-[-0.05em] text-[#E4CFA6]">$1,700</p>
                <p className="mt-2 text-xs text-white/65">7-year manufacturer warranty</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white/70">Daikin Cora 2.5kW</p>
                <p className="mt-1 font-serif text-3xl text-[#E4CFA6]">$2,000</p>
                <p className="mt-2 text-xs text-white/65">5-year manufacturer warranty</p>
              </div>
            </div>
            <p className="mt-5 border-t border-white/15 pt-4 text-xs text-white/65">These are complete prices for qualifying standard installations. Any non-standard extras are quoted upfront, never hidden.</p>
          </div>
          </div>
        </div>
      </section>

      <div className="border-b border-[#E6E1D9] bg-[#FDFBF7] py-4" data-testid="google-ads-trust-strip">
        <div className="sp-container flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs font-bold text-[#49474A]">
          <GoogleRating />
          <span className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[#A3793B]" /> Licensed &amp; insured installers</span>
          <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#A3793B]" /> 5–7 year manufacturer warranties</span>
        </div>
      </div>

      <section id="aircon-deals-prices" className="scroll-mt-20 bg-white py-12 sm:py-16" data-testid="google-ads-prices">
        <div className="sp-container max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[#8F6A34]">Fully installed split systems</p>
          <h2 className="mt-3 max-w-3xl font-serif text-[clamp(40px,4.5vw,64px)] leading-[1.04] tracking-[-0.045em] text-[#111]">The right unit. <span className="text-[#956C35]">The price upfront.</span></h2>
          <p className="mt-3 text-[#555]">No online bookings, dates or payments. Select a system to compare the standard installed price, then call us to arrange your installation.</p>
          <h3 className="mt-8 font-serif text-2xl">Choose a brand to see installed prices</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {RINNAI_LOCAL_OFFER_RANGES.map(range => <button key={range.slug} type="button" onClick={() => setSelectedBrand(range.slug)} className={`rounded-xl border p-6 text-left transition-colors ${selectedBrand === range.slug ? "border-[#B88A48] bg-[#FBF5E9]" : "border-[#E5E1D9] bg-white hover:border-[#B88A48]"}`}>
              <span className="block font-serif text-2xl text-[#111]">{range.displayName}</span>
              <span className="mt-2 block text-sm text-[#666]">View all sizes and prices</span>
            </button>)}
          </div>
          {selectedBrand && <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {RINNAI_LOCAL_OFFER_RANGES.filter(range => range.slug === selectedBrand).flatMap(range => range.prices.map(unit => <div key={range.slug + unit.kw} className="rounded-xl border border-[#E5E1D9] bg-[#FCFBF8] p-5">
              <span className="block text-xl font-bold text-[#111]">{unit.kw}</span>
              <span className="mt-2 block text-2xl font-bold text-[#8F6A34]">{unit.localOfferPrice || unit.price}</span>
              <span className="mt-1 block text-xs text-[#666]">Standard fully installed price</span>
            </div>))}
          </div>}
          <div className="mt-6 rounded-xl border border-[#D5B77B] bg-[#FFF8E8] p-4 sm:p-5">
            <p className="flex items-center gap-2 font-bold text-[#2B251B]"><Clock3 className="h-5 w-5 text-[#9A7540]" /> Need it installed quickly?</p>
            <p className="mt-2 text-sm leading-relaxed text-[#544A3A]">Same-day installations may be available. We aim to offer installation appointments within 2 business days for eligible jobs, subject to stock and scheduling. Call to confirm your earliest option.</p>
            <a href={PHONE_TEL} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#6D4F21] underline"><Phone className="h-4 w-4" /> Check availability · {PHONE}</a>
          </div>

        </div>
      </section>

      <section className="bg-[#F7F5F1] py-12 sm:py-16" data-testid="google-ads-inclusions">
        <div className="sp-container grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#8F6A34]">One clear installed price</p>
            <h2 className="mt-3 max-w-3xl font-serif text-[clamp(40px,4.5vw,64px)] leading-[1.04] tracking-[-0.045em] text-[#111]">Standard install? <span className="text-[#956C35]">No more to pay.</span></h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#5B5B60]">
              Our advertised deal covers the air conditioner and a complete standard installation — with the indoor and outdoor units on opposite sides of the same wall. You also get up to 20 metres of electrical cabling where required, plus the suitable wall bracket, mounting feet or pad. It's one upfront package price, with no surprise charges for what's included.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#6C6A6E]">
              If your job needs pipes run through the roof, longer runs through walls or cavities, extra pipe length, difficult access or electrical upgrades, that's additional work. We'll explain it and give you the extra price before you agree to anything. Fair and straightforward.
            </p>
          </div>
          <ul className="grid content-start gap-3 sm:grid-cols-2">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-xl bg-white p-4 text-sm font-semibold text-[#2A2A2C]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#A3793B]" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="local-offer-trust" className="scroll-mt-20 bg-white py-12 sm:py-16" data-testid="google-ads-proof">
        <div className="sp-container max-w-5xl">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#8F6A34]">Our workmanship promise</p>
          <h2 className="mt-3 max-w-3xl font-serif text-[clamp(40px,4.5vw,64px)] leading-[1.04] tracking-[-0.045em] text-[#111]">The details matter. <span className="text-[#956C35]">So does your home.</span></h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-[#555]">We plan the installation before starting, take care with pipework, drainage, electrical connections and the finish, protect your home and clean up. We test and commission the system, walk you through its controls and Wi-Fi where supported, and stand behind our workmanship.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ["Before work", "Confirm unit position, access and a clear written price, including any non-standard extras."],
              ["During installation", "Careful mounting, pipework, drainage and electrical work by licensed and insured installers."],
              ["At handover", "Commissioning checks, a tidy finish, and a walkthrough of controls and Wi-Fi where available."],
              ["If there's a concern", "We review job photos and applicable paperwork, explain our findings and work through the next steps and warranty obligations."]
            ].map(([title, description]) => <div key={title} className="rounded-xl border border-[#E5E1D9] bg-[#FCFBF8] p-4">
              <p className="font-bold text-[#252525]">{title}</p><p className="mt-2 text-sm leading-relaxed text-[#5B5B60]">{description}</p>
            </div>)}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-[#333]">
            <span className="rounded-xl border p-4">Licensed &amp; insured</span>
            <span className="rounded-xl border p-4">Written quote upfront</span>
            <span className="rounded-xl border p-4">Workmanship support</span>
            <span className="rounded-xl border p-4">Manufacturer warranty</span>
          </div>
          <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-[#E5E1D9] bg-[#FCFBF8] p-5 sm:flex-row sm:items-center">
            <button type="button" className="shrink-0" onClick={() => setActivePhoto({src:"/workmanship/splitspro-installation-certificate.png",alt:"SplitsPro installation completion certificate template"})} aria-label="View installation completion certificate">
              <img src="/workmanship/splitspro-installation-certificate.png" alt="SplitsPro installation completion certificate" className="max-h-72 w-full object-contain sm:w-56" loading="lazy"/>
            </button>
            <div><h3 className="font-serif text-2xl">A written record of your installation</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#555]">Our installation certificate records the unit fitted, checks completed, pipe routing and any outstanding work. Tap the certificate to enlarge it.</p>
              <p className="mt-2 text-xs text-[#777]">Blank certificate shown. Completed for your installation.</p>
            </div>
          </div>
          <h3 className="mt-12 font-serif text-3xl">See the workmanship for yourself</h3>
          <p className="mt-2 text-sm text-[#666]">More real work from our workmanship gallery. Swipe to explore, or tap a photo to enlarge.</p>
          <div className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-5" aria-label="Installation photo gallery">
            {[
              {src:"/workmanship/photo-gallery/01-100144.jpg",alt:"Daikin indoor unit by a window"},
              {src:"/workmanship/photo-gallery/02-100213.jpg",alt:"Daikin living room installation"},
              {src:"/workmanship/photo-gallery/03-100214.jpg",alt:"Wall-mounted air conditioner and controls"},
              {src:"/workmanship/photo-gallery/04-102748.jpg",alt:"Mitsubishi Electric outdoor installation"},
              {src:"/workmanship/photo-gallery/05-96068.jpg",alt:"Daikin kitchen installation"},
              {src:"/workmanship/photo-gallery/06-91494.jpg",alt:"Rinnai bedroom installation"},
              {src:"/workmanship/photo-gallery/07-90592.jpg",alt:"Haier indoor installation"},
              {src:"/workmanship/photo-gallery/08-90009.jpg",alt:"Daikin above-window installation"},
              {src:"/workmanship/photo-gallery/09-86696.jpg",alt:"Daikin outdoor installation"},
              {src:"/workmanship/photo-gallery/10-100215.jpg",alt:"Large Daikin outdoor installation"},
              {src:IMAGES.installDaikinBathroom,alt:"Daikin indoor installation",rotation:90},
              {src:IMAGES.installRinnaiWall,alt:"Rinnai outdoor installation on a wall bracket",rotation:90},
              {src:IMAGES.installDaikinOutdoor2,alt:"Rinnai indoor unit showing the temperature display",rotation:90},
              {src:IMAGES.installDaikinGarage,alt:"Daikin utility room installation",rotation:90},
              {src:IMAGES.splitIndoor,alt:"Rinnai indoor installation"}
            ].map((photo,i) => <button key={i} type="button" onClick={() => setActivePhoto(photo)} className="w-[72%] shrink-0 snap-start overflow-hidden rounded-xl border border-[#E5E1D9] bg-[#F7F5F1] sm:w-[35%]" aria-label={`Enlarge installation photo ${i+1}`}>
              <img src={photo.src} alt={photo.alt} loading="lazy" className="aspect-square w-full object-contain" style={{transform:`rotate(${photo.rotation || 0}deg)`}} />
            </button>)}
          </div>
          {activePhoto && <div role="dialog" aria-modal="true" aria-label="Enlarged installation photo" className="fixed inset-0 z-[10060] flex items-center justify-center bg-black/90 p-4" onClick={() => setActivePhoto(null)}>
            <button type="button" onClick={() => setActivePhoto(null)} className="absolute right-5 top-5 rounded-full bg-white px-4 py-2 font-bold text-black">Close ×</button>
            <div className="flex max-h-[85vh] max-w-[90vw] items-center justify-center" onClick={e => e.stopPropagation()}>
              {activePhoto.rotation
                ? <img src={activePhoto.src} alt={activePhoto.alt} className="aspect-square w-[min(90vw,85vh)] object-contain" style={{transform:`rotate(${activePhoto.rotation}deg)`}} />
                : <img src={activePhoto.src} alt={activePhoto.alt} className="max-h-[85vh] max-w-full object-contain" />}
            </div>
          </div>}
          <h3 className="mt-12 font-serif text-3xl">What customers say</h3>
          <p className="mt-2 text-sm text-[#666]">Read customer feedback from our Google listing. Swipe through the reviews here or open Google to explore the full collection.</p>
          <div className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5" aria-label="Customer review carousel">
            {reviews.map((r, i) => <figure key={r.id || i} className="min-w-[82%] snap-start rounded-2xl border border-[#E5E1D9] bg-[#FCFBF8] p-6 sm:min-w-[45%]">
              <div className="text-[#A3793B]" aria-label={`${r.rating || 5} out of 5 stars`}>{"★".repeat(Math.max(1, Math.min(5, Number(r.rating) || 5)))}</div>
              <blockquote className="mt-3 leading-relaxed text-[#333]">“{r.text}”</blockquote>
              <figcaption className="mt-4 text-sm font-bold">{r.name || "SplitsPro customer"}</figcaption>
            </figure>)}
          </div>
          <div className="mt-5 flex flex-col gap-3 rounded-xl border border-[#E5E1D9] bg-[#FCFBF8] p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-[#555]">
              Showing {reviews.length} customer reviews here. Read all {GOOGLE_RATING.count} Google reviews on our public listing.
            </p>
            <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-[#111] px-5 py-3 text-sm font-bold text-white hover:bg-[#333]">
              See all reviews on Google <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
          <h3 className="mt-10 font-serif text-3xl">Find the right system size</h3>
          <p className="mt-3 max-w-3xl leading-relaxed text-[#555]">Our sizing calculator is being prepared. Until then, we can help estimate capacity from your room dimensions, ceiling height, insulation, windows and sun exposure during your free call. A final recommendation depends on the property and installation conditions.</p>
        </div>
      </section>

      <section id="google-consultation" className="scroll-mt-20 bg-[#F7F5F1] py-12 sm:py-16">
        <div className="sp-container max-w-4xl">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#8F6A34]">Free phone consultation · No obligation</p>
          <h2 className="mt-3 max-w-3xl font-serif text-[clamp(40px,4.5vw,64px)] leading-[1.04] tracking-[-0.045em] text-[#111]">A quick conversation. <span className="text-[#956C35]">A clearer decision.</span></h2>
          <p className="mt-5 leading-relaxed text-[#555]">We'll ask about the layout of your home, the room dimensions, ceiling height, insulation and sun exposure. We'll discuss where the indoor and outdoor units could go, electrical access and any installation challenges. Then we'll recommend a suitable system size and explain the Rinnai and Daikin options, fully installed prices, what is included and whether anything needs a separate quote. You can ask questions and decide in your own time — no payment or online booking is required.</p>
          <p className="mt-4 text-sm text-[#666]">Have your suburb and rough measurements ready if possible. Photos can help, but you can call without them.</p>
          <a href={PHONE_TEL} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-md bg-[#0B0B0B] px-7 py-3 font-bold text-white"><Phone className="h-4 w-4" /> Call to Book · {PHONE}</a>
        </div>
      </section>

      <section className="bg-[#F7F5F1] py-12 sm:py-16" data-testid="google-ads-faq">
        <div className="sp-container max-w-4xl">
          <h2 className="font-serif text-4xl text-[#111]">Quick answers before you call</h2>
          <div className="mt-7 divide-y divide-[#DED8CF]">
            {FAQs.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="cursor-pointer pr-6 text-base font-bold text-[#1D1D1F]">{item.question}</summary>
                <p className="mt-3 text-sm leading-relaxed text-[#5E5E60]">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="google-quote" className="scroll-mt-24 bg-white py-12 sm:py-16" data-testid="google-ads-quote">
        <div className="sp-container grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#8F6A34]">Not a standard install?</p>
            <h2 className="mt-3 max-w-3xl font-serif text-[clamp(40px,4.5vw,64px)] leading-[1.04] tracking-[-0.045em] text-[#111]">Not standard? <span className="text-[#956C35]">Let’s work it out.</span></h2>
            <p className="mt-4 max-w-lg leading-relaxed text-[#606064]">If you're unsure about pipe lengths, outside-unit position or access, tell us your suburb and what needs installing. We'll review the job and get back to you.</p>
            <a href={PHONE_TEL} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#8F6A34] underline"><Phone className="h-4 w-4" /> Prefer to call {PHONE}?</a>
          </div>
          <div className="rounded-2xl border border-[#E5E1D9] bg-[#FCFBF8] p-6 sm:p-8">
            <QuoteForm
              defaultService="Split System Installation"
              defaultMessage="Google Search installed-deals enquiry. Please confirm standard-install eligibility and quote any extras."
              submitLabel="Request My Free Quote"
              compact
              hidePreferredDate
              includeAttribution
              successTitle="Quote request received"
              successMessage="We'll be in touch to discuss your system and installation."
              tight
            />
          </div>
        </div>
      </section>

    </>
  );
};

export default AirconDeals;
