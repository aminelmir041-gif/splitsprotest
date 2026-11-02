import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

import {
  ArrowDown, ArrowRight, BadgeCheck, Check, CheckCircle2,
  Clock3, CreditCard, Phone, ShieldCheck, Star,
} from "lucide-react";


import QuoteForm from "../components/QuoteForm";
import { GoogleRating } from "../components/sections";
import { PHONE, PHONE_TEL } from "../lib/data";
import { RINNAI_LOCAL_OFFER_RANGES } from "./BrandPage";

// Google Search visitors are actively comparing an installed deal.
// Keep the same prices, live dates and checkout as the local offer page,
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
    answer: "We aim to install eligible standard systems within 2 business days where appointments are available. Call us to discuss availability.",
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
  "Air conditioner supplied",
  "Standard installation labour",
  "Up to 3 metres of pipework",
  "Standard wall bracket or floor mount",
  "Isolation switch",
  "Electrical circuit up to 20 metres where required",
  "Commissioning and installation guarantee",
];
const GoogleAdsLanding = () => {
  const { search } = useLocation();

  const [selectedUnit, setSelectedUnit] = useState(null);
  const requestedBrand = new URLSearchParams(search).get("brand")?.toLowerCase();
  const initialBrand = requestedBrand === "daikin" ? "daikin-lite-local"
    : requestedBrand === "rinnai" ? "rinnai-local" : "";
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);

  const schema = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    name: "SplitsPro",
    url: "https://splitspro.com.au/split-system-installation-sydney",
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
        <link rel="canonical" href="https://splitspro.com.au/split-system-installation-sydney" />
        <meta property="og:title" content="Rinnai & Daikin Split Systems Supplied & Installed | SplitsPro Sydney" />
        <meta property="og:description" content="Your standard-install price includes the unit, electrical circuit, isolator, bracket and pipework. Compare sizes and prices, then call for a free no-pressure consultation." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <section data-testid="google-ads-hero" className="bg-[#0B0B0B] text-white">
        <div className="sp-container grid gap-6 py-10 sm:py-14 lg:grid-cols-[1.2fr_.8fr] lg:items-center lg:gap-12">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.19em] text-[#D9BC8B]">Sydney · Central Coast · Wollongong</p>
            <h1 className="mt-4 max-w-3xl font-serif text-[clamp(36px,5.3vw,68px)] leading-[1.04] tracking-[-0.035em]">
              Air conditioning <span className="text-[#E4CFA6]">fully installed — electrical circuit included.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              Rinnai and Daikin Cora. One clear standard-install price covers the unit, labour, wall bracket, isolator, up to 3m of pipework and an electrical circuit up to 20m where required. No chasing extra trades or surprise essential add-ons.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/80">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#C8A46A]" /> No more to pay on qualifying standard installs</span>
              <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#C8A46A]" /> Installation within 2 business days, subject to availability</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#C8A46A]" /> Installation guarantee</span>
            </div>
          </div>
          <div className="space-y-4">
            <img
              src={`${process.env.PUBLIC_URL || ""}/landing/overheated-bulldog-hero.webp`}
              alt="Overheated bulldog — SplitsPro split-system installation deals"
              loading="eager"
              fetchPriority="high"
              className="w-full rounded-2xl object-contain"
            />
            <div className="rounded-2xl border border-white/15 bg-white/[0.055] p-5 sm:p-7">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#D9BC8B]">Fully installed deals · including electrical circuit</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-semibold text-white/70">Rinnai 2.5kW</p>
                <p className="mt-1 font-serif text-3xl text-[#E4CFA6]">$1,700</p>
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

      <section id="google-consultation" className="scroll-mt-20 bg-white py-12 sm:py-16">
        <div className="sp-container max-w-6xl">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#8F6A34]">Free consultation · No obligation</p>
          <h2 className="mt-3 font-serif text-4xl text-[#111]">Know what suits your home before spending a dollar.</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[#555]">This is a practical conversation, not a sales pitch. We'll help you understand the right size, installation options, inclusions and possible costs. You can take the advice away and decide in your own time.</p>
          <h3 className="mt-10 font-serif text-3xl text-[#111]">Exactly what happens when you call</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              ["1. Tell us about your space","We'll ask which suburb you're in, which room needs cooling or heating, its approximate size, ceiling height, sun exposure and insulation. Rough measurements are fine."],
              ["2. We explain suitable systems","We'll talk through likely capacity, brands, noise, comfort and features, explaining the trade-offs in plain English rather than pushing the most expensive unit."],
              ["3. We discuss the installation","We'll ask about indoor and outdoor locations, pipework, drainage, electrical supply and access. Photos can help us identify any complications before a quote."],
              ["4. You leave with a clear next step","We'll explain the standard installed price, what might cost extra and likely availability. If photos or a site assessment are needed for an accurate quote, we'll tell you. You choose whether to proceed."]
            ].map(([heading,description]) => (
              <div key={heading} className="rounded-2xl border border-[#E5E1D9] bg-[#FCFBF8] p-6">
                <h4 className="text-lg font-bold text-[#191919]">{heading}</h4>
                <p className="mt-3 text-sm leading-relaxed text-[#5E5E60]">{description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-[#0B0B0B] p-7 text-white">
            <h3 className="font-serif text-3xl text-[#E4CFA6]">Free advice. No sales pressure.</h3>
            <p className="mt-3 max-w-3xl leading-relaxed text-white/80">No consultation fee and no obligation to book. Installation within 2 business days for eligible standard jobs, subject to availability. Even if you're just comparing options, you're welcome to call. It helps to have your suburb, rough room dimensions and photos, but you don't need them to start.</p>
            <a href={PHONE_TEL} className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-md bg-[#C8A46A] px-6 py-3 text-sm font-extrabold uppercase text-[#0B0B0B]"><Phone className="h-4 w-4" /> Call to Book</a>
          </div>
        </div>
      </section>

      <section id="google-booking" className="scroll-mt-20 bg-white py-12 sm:py-16" data-testid="google-ads-prices">
        <div className="sp-container max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[#8F6A34]">Fully installed split systems</p>
          <h2 className="mt-3 font-serif text-4xl text-[#111]">Choose your system. See your price.</h2>
          <p className="mt-3 text-[#555]">No online bookings, dates or payments. Select a system to compare the standard installed price, then call us to arrange your installation.</p>
          <h3 className="mt-8 font-serif text-2xl">1 · Choose a brand</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {RINNAI_LOCAL_OFFER_RANGES.map(range => <button key={range.slug} type="button" onClick={() => {setSelectedBrand(range.slug);setSelectedUnit(null);}} className={`rounded-xl border p-6 text-left transition-colors ${selectedBrand === range.slug ? "border-[#B88A48] bg-[#FBF5E9]" : "border-[#E5E1D9] bg-white hover:border-[#B88A48]"}`}>
              <span className="block font-serif text-2xl text-[#111]">{range.displayName}</span>
              <span className="mt-2 block text-sm text-[#666]">{range.prices.length} sizes available · Choose brand →</span>
            </button>)}
          </div>
          {selectedBrand && <div className="mt-8">
            <h3 className="font-serif text-2xl">2 · Choose your size</h3>
            <p className="mt-2 text-sm text-[#666]">Tap a size to see its fully installed price.</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {RINNAI_LOCAL_OFFER_RANGES.filter(range => range.slug === selectedBrand).flatMap(range => range.prices.map(unit => <button key={range.slug + unit.kw} type="button" onClick={() => setSelectedUnit({productKey:range.slug,displayName:range.displayName,kw:unit.kw,price:unit.localOfferPrice || unit.price})} className={`rounded-xl border p-5 text-left transition-colors ${selectedUnit?.productKey === range.slug && selectedUnit?.kw === unit.kw ? "border-[#B88A48] bg-[#FBF5E9]" : "border-[#E5E1D9] bg-white hover:border-[#B88A48]"}`}>
                <span className="block text-xl font-bold text-[#111]">{unit.kw}</span>
                <span className="mt-2 block text-xl font-bold text-[#8F6A34]">{unit.localOfferPrice || unit.price}</span>
                <span className="mt-1 block text-xs text-[#666]">Fully installed</span>
              </button>))}
            </div>
          </div>}
          {selectedUnit && <div className="mt-7 rounded-xl bg-[#F7F5F1] p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#8F6A34]">Selected system</p>
            <h3 className="mt-2 font-serif text-2xl">{selectedUnit.displayName} · {selectedUnit.kw}</h3>
            <p className="mt-2 text-3xl font-bold text-[#8F6A34]">{selectedUnit.price}</p>
            <p className="mt-2 text-sm text-[#555]">Standard supply and installation. Non-standard work is quoted before proceeding.</p>
          </div>}
          <p className="mt-6 text-sm font-semibold text-[#555]">Installation within 2 business days for eligible standard jobs, subject to availability.</p>
          <a href={PHONE_TEL} className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-md bg-[#0B0B0B] px-7 py-3 font-bold text-white"><Phone className="h-4 w-4" /> Call to Book · {PHONE}</a>
        </div>
      </section>

      <section className="bg-[#F7F5F1] py-12 sm:py-16" data-testid="google-ads-inclusions">
        <div className="sp-container grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#8F6A34]">What you pay for</p>
            <h2 className="mt-3 font-serif text-4xl text-[#111]">Electrical circuit, bracket, isolator. Already included.</h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#5B5B60]">
              When your home qualifies for the standard installation, the card price includes the air conditioner, labour, electrical circuit up to 20 metres where required, wall bracket, isolator and up to 3 metres of pipe. No separate electrician to organise and no missing essential installation items.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#6C6A6E]">
              Extra pipework, difficult access, switchboard upgrades and unusual roof or cavity routing may need a separate quote.
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
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#8F6A34]">Confidence before you book</p>
          <h2 className="mt-2 font-serif text-4xl text-[#111]">Know who is installing your air conditioner.</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#606064]">
            SplitsPro uses licensed and insured installers, backs the installation workmanship, and supplies systems with manufacturer warranties. See the Google reviews and ask us anything before paying.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#E5E1D9] p-6">
              <Star className="h-6 w-6 text-[#B88A48]" />
              <p className="mt-4 font-serif text-2xl">Google reviews</p>
              <p className="mt-2 text-sm text-[#65656A]">Real customer feedback on our service and installations.</p>
              <div className="mt-4"><GoogleRating /></div>
            </div>
            <div className="rounded-2xl border border-[#E5E1D9] p-6">
              <BadgeCheck className="h-6 w-6 text-[#B88A48]" />
              <p className="mt-4 font-serif text-2xl">Licensed &amp; insured</p>
              <p className="mt-2 text-sm text-[#65656A]">Qualified trades working on your air conditioning installation.</p>
            </div>
            <div className="rounded-2xl border border-[#E5E1D9] p-6">
              <ShieldCheck className="h-6 w-6 text-[#B88A48]" />
              <p className="mt-4 font-serif text-2xl">Warranty protection</p>
              <p className="mt-2 text-sm text-[#65656A]">Rinnai 7-year and Daikin 5-year manufacturer warranties, plus our installation guarantee.</p>
            </div>
          </div>
          <a href={PHONE_TEL} className="mt-7 inline-flex items-center gap-2 rounded-md bg-[#0B0B0B] px-6 py-3 text-sm font-extrabold uppercase text-white">
            Call to Book <ArrowRight className="h-4 w-4" />
          </a>
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
            <h2 className="mt-3 font-serif text-4xl text-[#111]">Send us the details for a free quote.</h2>
            <p className="mt-4 max-w-lg leading-relaxed text-[#606064]">If you're unsure about pipe lengths, outside-unit position or access, tell us your suburb and what needs installing. We'll review the job and get back to you.</p>
            <a href={PHONE_TEL} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#8F6A34] underline"><Phone className="h-4 w-4" /> Prefer to call {PHONE}?</a>
          </div>
          <div className="rounded-2xl border border-[#E5E1D9] bg-[#FCFBF8] p-6 sm:p-8">
            <QuoteForm
              defaultService="Split System Installation"
              defaultMessage="Google Search installed-deals enquiry. Please confirm standard-install eligibility and quote any extras."
              submitLabel="Request My Free Quote"
              compact
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

export default GoogleAdsLanding;
