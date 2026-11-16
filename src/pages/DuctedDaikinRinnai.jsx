import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, BadgeCheck, Check, Phone, ShieldCheck, Star, Wind } from "lucide-react";
import QuoteForm from "../components/QuoteForm";
import { GOOGLE_RATING, IMAGES, PHONE, PHONE_TEL } from "../lib/data";

// Separate Daikin / Rinnai retail page. The original /ducted pricing selector stays unchanged.
// Daikin Comfort prices were approved in the November 2026 costing discussion.
// Daikin Premium = provisional +$1,000 relative to Comfort (full six-zone BOM to be confirmed).
// Rinnai prices are preserved from the previous publicly listed ducted packages and require re-costing.
const PACKAGES = [
  { id: "essential", name: "Essential", zones: 2, outlets: 6, description: "Straightforward zoning for smaller homes." },
  { id: "comfort", name: "Comfort", zones: 4, outlets: 8, description: "Flexible room-by-room comfort.", popular: true },
  { id: "premium", name: "Premium", zones: 6, outlets: 10, description: "More control for larger homes." },
];

const PRICE_LIST = {
  daikin: {
    essential: [
      { size: "7.1 kW", amount: null, note: "2-zone design only; price to be confirmed" },
    ],
    comfort: [
      { size: "8.5 kW", amount: null, note: "Supplier and installation cost to be confirmed" },
      { size: "10 kW", amount: 9590 },
      { size: "12.5 kW", amount: 10490 },
      { size: "14 kW", amount: 11290 },
      { size: "16 kW", amount: 11990 },
      { size: "18 kW", amount: null, note: "Waiting for supplier price" },
      { size: "20 kW", amount: 12590, note: "Subject to detailed airflow, power and installation assessment" },
      { size: "25 kW", amount: 14490, note: "Subject to detailed airflow, power and installation assessment" },
    ],
    premium: [
      { size: "10 kW", amount: 10590, provisional: true },
      { size: "12.5 kW", amount: 11490, provisional: true },
      { size: "14 kW", amount: 12290, provisional: true },
      { size: "16 kW", amount: 12990, provisional: true },
      { size: "18 kW", amount: null, note: "Waiting for supplier price" },
      { size: "20 kW", amount: 13590, provisional: true, note: "Subject to detailed airflow and power assessment" },
      { size: "25 kW", amount: 15490, provisional: true, note: "Subject to detailed airflow and power assessment" },
    ],
  },
  rinnai: {
    essential: [
      { size: "7.3 kW", amount: 6390, previous: true },
      { size: "9 kW", amount: 6790, previous: true },
      { size: "10.5 kW", amount: 6890, previous: true },
      { size: "12.5 kW", amount: 7990, previous: true },
      { size: "14 kW", amount: 8790, previous: true },
    ],
    comfort: [
      { size: "10.5 kW", amount: 9390, previous: true },
      { size: "12.5 kW", amount: 10290, previous: true },
      { size: "14 kW", amount: 11190, previous: true },
      { size: "17 kW", amount: 11990, previous: true },
    ],
    premium: [
      { size: "12.5 kW", amount: 11490, previous: true },
      { size: "14 kW", amount: 12390, previous: true },
      { size: "17 kW", amount: 13090, previous: true },
    ],
  },
};

const INCLUDED = [
  "Indoor and outdoor ducted units",
  "Standard ductwork, subject to a designed layout",
  "Selected zoning and outlet package",
  "Zone controller, dampers and standard outlets",
  "One return-air grille, standard drainage and mounting",
  "Installation, testing and commissioning",
  "Applicable manufacturer and workmanship warranties",
];

const money = (amount) => amount == null
  ? "Price on request"
  : "$" + amount.toLocaleString("en-AU");

const DuctedDaikinRinnai = () => {
  const [brand, setBrand] = useState("daikin");
  const [packageId, setPackageId] = useState("comfort");
  const [selected, setSelected] = useState(null);
  const currentPackage = PACKAGES.find((item) => item.id === packageId) || PACKAGES[1];
  const options = PRICE_LIST[brand][packageId];
  const brandName = brand === "daikin" ? "Daikin" : "Rinnai";

  const askForQuote = (option) => {
    setSelected({ brand: brandName, package: currentPackage, option });
    document.getElementById("new-ducted-quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const requestMessage = selected
    ? [
        "Please contact me about a ducted air conditioning quote.",
        "Brand: " + selected.brand,
        "Package: " + selected.package.name + ", " + selected.package.zones + " zones / up to " + selected.package.outlets + " outlets",
        "Capacity: " + selected.option.size,
        "Indicative price: " + money(selected.option.amount),
        "Final quote and system sizing to be confirmed.",
      ].join("\n")
    : [
        "Please contact me about a ducted air conditioning quote.",
        "Brand: " + brandName,
        "Package: " + currentPackage.name + ", " + currentPackage.zones + " zones / up to " + currentPackage.outlets + " outlets",
        "Please help size the system for my property.",
      ].join("\n");

  return (
    <>
      <Helmet>
        <title>Daikin &amp; Rinnai Ducted Air Conditioning Packages | SplitsPro Sydney</title>
        <meta name="description" content="Compare Daikin and Rinnai ducted air conditioning packages with 2, 4 or 6 zones and request a tailored installation quote from SplitsPro." />
        <link rel="canonical" href="https://splitspro.com.au/ducted/daikin-rinnai" />
      </Helmet>

      <section className="bg-[#111111] text-white" data-testid="ducted-two-brand-hero">
        <div className="sp-container grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#D8B77C]">SplitsPro · Ducted Air Conditioning</span>
            <h1 className="mt-5 font-serif text-[clamp(44px,5vw,76px)] leading-[1.02] tracking-[-0.05em]">Daikin or Rinnai.<span className="block text-[#E5C794]">Comfort designed for your home.</span></h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">Compare ducted systems by brand, zones and outlets. Choose a package and we'll check the right capacity, layout and fully installed quote for your home.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#new-ducted-prices" className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#D8B77C] px-6 py-3 font-bold text-[#17130E]">See packages <ArrowRight className="h-4 w-4" /></a>
              <a href={PHONE_TEL} className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/40 px-6 py-3 font-bold">Call {PHONE} <Phone className="h-4 w-4" /></a>
            </div>
            <p className="mt-5 text-sm text-white/70">No deposit: payment after your agreed installation is completed and tested.</p>
          </div>
          <div className="overflow-hidden rounded-[22px] border border-white/20 bg-[#252525]">
            <img src={IMAGES.ductedHall} alt="Completed home ducted air conditioning installation" className="aspect-[4/3] h-full w-full object-cover" loading="eager" />
          </div>
        </div>
      </section>

      <section className="border-b border-[#E3DDD3] bg-[#F9F5ED] py-5">
        <div className="sp-container flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm font-semibold text-[#312B22]">
          <span className="inline-flex items-center gap-2"><Star className="h-4 w-4 fill-[#B98B46] text-[#B98B46]" /> {GOOGLE_RATING.score} / 5 · {GOOGLE_RATING.count} Google reviews</span>
          <span className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[#A47736]" /> Licensed &amp; insured</span>
          <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#A47736]" /> Workmanship guarantee</span>
        </div>
      </section>

      <section id="new-ducted-prices" className="scroll-mt-20 bg-[#F7F5F1] py-14 sm:py-20" data-testid="ducted-two-brand-pricing">
        <div className="sp-container max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9B7138]">Choose your package</p>
          <h2 className="mt-3 font-serif text-[clamp(36px,4vw,58px)] leading-tight text-[#1D1D1F]">Simple options. Clear prices.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#67625C] sm:text-base">Prices are indicative standard-install amounts, not fixed quotes. Final system size, airflow, pipe runs, electrical requirements, access and total price are confirmed in writing before work starts.</p>

          <div className="mt-9 flex flex-wrap gap-3" role="group" aria-label="Choose ducted brand">
            {["daikin", "rinnai"].map((item) => (
              <button key={item} type="button" onClick={() => { setBrand(item); setSelected(null); }} aria-pressed={brand === item}
                className={brand === item ? "rounded-full bg-[#181818] px-7 py-3 text-sm font-bold text-white" : "rounded-full border border-[#CFC6B8] bg-white px-7 py-3 text-sm font-bold text-[#333]"}>
                {item === "daikin" ? "Daikin" : "Rinnai"}
              </button>
            ))}
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-3" aria-label="Choose zones and outlets">
            {PACKAGES.map((item) => (
              <button key={item.id} type="button" onClick={() => { setPackageId(item.id); setSelected(null); }} aria-pressed={packageId === item.id}
                className={packageId === item.id ? "rounded-2xl border-2 border-[#B88A48] bg-[#FFF9EF] p-6 text-left shadow-md" : "rounded-2xl border border-[#E0DAD0] bg-white p-6 text-left"}>
                <span className="text-xs font-bold uppercase tracking-widest text-[#98713D]">{item.name}{item.popular ? " · Popular" : ""}</span>
                <span className="mt-2 block font-serif text-3xl text-[#181818]">{item.zones} zones</span>
                <span className="mt-1 block text-sm font-semibold text-[#252525]">Up to {item.outlets} outlets</span>
                <span className="mt-2 block text-sm text-[#777]">{item.description}</span>
              </button>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h3 className="font-serif text-3xl text-[#171717]">{brandName} · {currentPackage.name}</h3>
            <p className="text-sm font-semibold text-[#655E55]">{currentPackage.zones} zones · Up to {currentPackage.outlets} outlets</p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {options.map((option) => (
              <article key={brand + "-" + packageId + "-" + option.size} className="flex flex-col rounded-2xl border border-[#E6DED2] bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-[#9D7843]">{brandName} ducted</p>
                <h4 className="mt-3 font-serif text-4xl text-[#151515]">{option.size}</h4>
                <p className="mt-4 text-3xl font-extrabold text-[#171717]">{money(option.amount)}</p>
                <p className="mt-2 min-h-12 text-xs leading-relaxed text-[#75716C]">
                  {option.note || (option.provisional ? "Provisional 6-zone upgrade; final materials and labor to be confirmed" : option.previous ? "Previous Rinnai listed price; reconfirmed in written quote" : "Indicative standard installation price")}
                </p>
                <button type="button" onClick={() => askForQuote(option)} className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#1A1A1A] px-4 py-3 text-sm font-bold text-white hover:bg-[#353535]">
                  Request quote <ArrowRight className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
          <p className="mt-6 max-w-4xl text-xs leading-relaxed text-[#69655E]">
            The 7.1 kW Daikin is offered as a 2-zone system only. Daikin 8.5 kW and 18 kW prices are pending supplier confirmation. Daikin 6-zone figures are proposed upgrades pending a complete materials check; Rinnai prices come from the previous ducted package list pending re-costing. Larger 20–25 kW systems require individual design, airflow, power-supply and labor checks before a firm quote.
          </p>
        </div>
      </section>

      <section className="bg-[#151515] py-14 text-white sm:py-20" data-testid="ducted-two-brand-inclusions">
        <div className="sp-container max-w-6xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D8B77C]">What comes with your installation</span>
          <h2 className="mt-4 font-serif text-4xl">A complete, carefully planned system.</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED.map((item) => <div key={item} className="flex items-start gap-3 rounded-xl border border-white/15 bg-white/5 p-4 text-sm leading-relaxed"><Check className="mt-1 h-4 w-4 shrink-0 text-[#D8B77C]" />{item}</div>)}
          </div>
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-[#D8B77C]/50 bg-[#32291B] p-5">
            <Wind className="mt-1 h-5 w-5 shrink-0 text-[#D8B77C]" />
            <p className="text-sm leading-relaxed text-white/85">The number of outlets and zones is a package maximum, not a substitute for heat-load calculations. Airflow, minimum zone airflow, return air, electrical supply and duct sizes must suit the selected system and house.</p>
          </div>
        </div>
      </section>

      <section id="new-ducted-quote" className="scroll-mt-24 bg-white py-16 sm:py-20" data-testid="ducted-two-brand-quote">
        <div className="sp-container grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#9B7138]">Free ducted consultation</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight text-[#171717]">Let's confirm the right system for your home.</h2>
            <p className="mt-4 leading-relaxed text-[#636363]">Leave your details and we'll review your selected brand, capacity, number of zones and outlets, and installation conditions. We'll then give you a clear written quote before booking.</p>
            {selected && <p className="mt-5 rounded-xl border border-[#D6B77C] bg-[#FFF8EB] p-4 text-sm font-semibold text-[#503B20]">
              Selected: {selected.brand} {selected.option.size} · {selected.package.zones} zones, up to {selected.package.outlets} outlets · {money(selected.option.amount)}
            </p>}
            <a href={PHONE_TEL} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#89602D]"><Phone className="h-4 w-4" /> Prefer to call? {PHONE}</a>
          </div>
          <div className="rounded-2xl border border-[#E8E1D6] bg-[#FCFBF8] p-5 sm:p-8">
            <QuoteForm key={brand + "-" + packageId + "-" + (selected?.option.size || "general")} defaultService="Ducted Air Conditioning"
              defaultMessage={requestMessage} submitLabel="Request My Free Ducted Quote" compact hideEmail hideAddress hidePhoto hideMessage hidePreferredDate includeAttribution
              successTitle="Ducted quote request received" successMessage="We'll contact you to confirm the installation details and quote." />
          </div>
        </div>
      </section>
    </>
  );
};

export default DuctedDaikinRinnai;
