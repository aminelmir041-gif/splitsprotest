import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useLenis } from "lenis/react";
import {
  ArrowDown, ArrowRight, BadgeCheck, Check, CheckCircle2,
  Clock3, CreditCard, Phone, ShieldCheck, Star,
} from "lucide-react";
import InlineDealsBooking from "../components/InlineDealsBooking";
import ExitQuoteCapture from "../components/ExitQuoteCapture";
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
    answer: "We aim to install eligible standard systems within 2 business days where appointments are available. Choose a live available day in the booking form, or call us if you need a different time.",
  },
  {
    question: "Can I book without paying the whole amount?",
    answer: "Yes. After choosing a unit and installation day, you can book with 10% upfront and pay the balance later. The checkout also offers full payment and eligible buy now, pay later options, subject to provider approval and availability.",
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
  const lenis = useLenis();
  const [selectedUnit, setSelectedUnit] = useState(null);
  const requestedBrand = new URLSearchParams(search).get("brand")?.toLowerCase();
  const initialBrand = requestedBrand === "daikin" ? "daikin-lite-local"
    : requestedBrand === "rinnai" ? "rinnai-local" : "";

  const chooseUnit = (range, row) => {
    setSelectedUnit({
      productKey: range.slug,
      displayName: range.displayName,
      kw: row.kw,
      price: row.localOfferPrice || row.price,
    });
    window.setTimeout(() => {
      const el = document.getElementById("deals-select-day");
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { offset: -95 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };
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
        <meta property="og:description" content="Your standard-install price includes the unit, electrical circuit, isolator, bracket and pipework. Compare sizes and book a real installation date." />
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
            <a href="#google-booking" className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-md bg-[#C8A46A] px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-[#0B0B0B] transition-colors hover:bg-[#E4CFA6]">
              See fully installed prices &amp; dates <ArrowDown className="h-4 w-4" />
            </a>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/80">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#C8A46A]" /> No more to pay on qualifying standard installs</span>
              <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#C8A46A]" /> Fast installation dates</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#C8A46A]" /> Installation guarantee</span>
            </div>
          </div>
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
      </section>

      <div className="border-b border-[#E6E1D9] bg-[#FDFBF7] py-4" data-testid="google-ads-trust-strip">
        <div className="sp-container flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs font-bold text-[#49474A]">
          <GoogleRating />
          <span className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[#A3793B]" /> Licensed &amp; insured installers</span>
          <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#A3793B]" /> 5–7 year manufacturer warranties</span>
        </div>
      </div>

      <section id="google-booking" className="scroll-mt-20 bg-white py-10 sm:py-14" data-testid="google-ads-booking">
        <div className="sp-container max-w-6xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#8F6A34]">Complete standard-install prices · Real appointment availability</p>
              <h2 className="mt-2 font-serif text-3xl font-medium text-[#111] sm:text-4xl">Choose your all-inclusive installed deal</h2>
            </div>
            <a href={PHONE_TEL} className="inline-flex items-center gap-2 text-sm font-bold text-[#7B5A28] underline"><Phone className="h-4 w-4" /> Talk to us: {PHONE}</a>
          </div>
          <InlineDealsBooking
            selectedUnit={selectedUnit}
            offerRanges={RINNAI_LOCAL_OFFER_RANGES}
            onChooseUnit={chooseUnit}
            onClearUnit={() => setSelectedUnit(null)}
            initialBrand={initialBrand}
          />
          <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-semibold text-[#555]">
            <span className="inline-flex items-center gap-2"><CreditCard className="h-4 w-4 text-[#8F6A34]" /> 10% to book, full payment or eligible pay-later</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#8F6A34]" /> Choose how to pay after choosing your date</span>
          </div>
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
          <a href="#google-booking" className="mt-7 inline-flex items-center gap-2 rounded-md bg-[#0B0B0B] px-6 py-3 text-sm font-extrabold uppercase text-white">
            Back to systems &amp; dates <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="bg-[#F7F5F1] py-12 sm:py-16" data-testid="google-ads-faq">
        <div className="sp-container max-w-4xl">
          <h2 className="font-serif text-4xl text-[#111]">Quick answers before you book</h2>
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
      <ExitQuoteCapture selectedUnit={selectedUnit} />
    </>
  );
};

export default GoogleAdsLanding;
