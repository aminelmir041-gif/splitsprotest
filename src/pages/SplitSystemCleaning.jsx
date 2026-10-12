
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Droplets, ShieldCheck, Star, Wind } from "lucide-react";
import QuoteForm from "../components/QuoteForm";
import { GoogleRating } from "../components/sections";
import { PHONE_TEL } from "../lib/data";

// This is the ONE consumer sales landing page for split-system cleaning.
// No separate cleaning funnel; the old /split-system-cleaning-offer/ URL redirects here.
const CLEANING_OFFERS = [
  { id: "one", name: "1 Deep Clean", label: "One split system", price: "$220", description: "A thorough indoor clean for one wall-mounted split system." },
  { id: "two", name: "2 Deep Cleans", label: "Same property · $150 each", price: "$300", description: "Two wall-mounted split systems deep cleaned during the same visit." }
];

const WHAT_WE_CLEAN = [
  { title: "Filters and indoor covers", copy: "Remove built-up dust from washable filters and accessible indoor surfaces." },
  { title: "Evaporator coil", copy: "Wash accessible coil surfaces to remove dirt that ordinary filter cleaning leaves behind." },
  { title: "Blower wheel and airflow path", copy: "Clean accessible areas that can trap grime and restrict airflow." },
  { title: "Drain tray and accessible drain", copy: "Clean the drain area and check operation where access allows." }
];
const FAQS = [
  { q: "Is a deep clean different to washing the filters?", a: "Yes. A filter wash is only one part. Our deep clean also targets accessible internal coil, blower wheel, drain tray and airflow path surfaces. The exact method depends on the unit and its condition." },
  { q: "Can I get 2 deep cleans for $300 at different properties?", a: "The $300 deal is for two standard wall-mounted split systems at the same property, during the same visit." },
  { q: "Do you have to remove the whole air conditioner?", a: "Normally no. We protect the area, open or remove suitable service-accessible covers and clean the accessible indoor components. We won't dismantle sealed refrigerant components as part of a cleaning job." },
  { q: "Can cleaning repair an air conditioner that isn't cooling?", a: "Cleaning can help when dirt is affecting airflow, but it won't fix a refrigerant leak, electrical fault or failed part. If we find a likely fault, we'll discuss the next step before any separate repair work." },
  { q: "What if there is heavy contamination or difficult access?", a: "These prices apply to standard accessible wall-mounted splits in our local offer area. We will explain and quote any additional cleaning or repair work before proceeding." }
];

export default function SplitSystemCleaning() {
  const [offerId, setOfferId] = useState("two");
  const [openFaq, setOpenFaq] = useState(0);
  const chosen = CLEANING_OFFERS.find((offer) => offer.id === offerId) || CLEANING_OFFERS[1];
  const choose = (id) => {
    setOfferId(id);
    document.getElementById("cleaning-booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const scrollBook = () => document.getElementById("cleaning-booking")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="bg-[#FBFAF8] text-[#18232F]" data-testid="split-cleaning-landing">
      <Helmet>
        <title>Split System Deep Cleaning | $220 or 2 for $300 | SplitsPro Sydney</title>
        <meta name="description" content="Your aircon's hiding something. Professional wall-mounted split system deep cleaning: $220 for one or 2 deep cleans for $300 at the same property. Book with SplitsPro." />
        <link rel="canonical" href="https://splitspro.com.au/split-system-cleaning/" />
        <meta property="og:title" content="Your Aircon's Hiding Something | SplitsPro Deep Cleaning" />
        <meta property="og:description" content="Deep clean $220. Two deep cleans at the same property $300. See what we clean and request a booking." />
      </Helmet>

      {/* Deals-page style: image-led dark hero, big statement, offer and immediate action. */}
      <section className="relative isolate overflow-hidden bg-[#071523] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_32%,rgba(0,168,209,0.14),transparent_40%),radial-gradient(circle_at_6%_95%,rgba(200,164,106,0.19),transparent_39%)]" />
        <div className="sp-container relative grid items-center gap-8 pb-12 pt-44 sm:pt-40 lg:min-h-[650px] lg:grid-cols-[1.06fr_0.94fr] lg:gap-12 lg:pb-20 lg:pt-44">
          <div className="relative z-10">
            <p className="inline-block border-l-4 border-[#F4C620] pl-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#F4C620] sm:text-xs">SplitsPro · Split system deep cleaning</p>
            <h1 className="mt-5 max-w-[760px] font-sans text-[clamp(2.7rem,6.5vw,5.7rem)] font-black uppercase leading-[0.98] tracking-[-0.045em]">
              YOUR AIRCON'S <span className="text-[#F4C620]">HIDING</span> SOMETHING.
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/85">
              You clean the filters. Good on ya. But what about the dirt hiding behind them? Give the inside of your split system a proper deep clean before the summer heat arrives.
            </p>
            <div className="mt-6 flex flex-wrap items-end gap-x-5 gap-y-3 border-y border-white/15 py-5">
              <div><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-white/60">One deep clean</p><p className="mt-1 font-sans text-[36px] font-black leading-none text-white">$220</p></div>
              <div className="h-10 w-px bg-white/20" />
              <div><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#F4C620]">Two at one property</p><p className="mt-1 font-sans text-[36px] font-black leading-none text-[#F4C620]">$300</p></div>
              <span className="pb-1 text-xs font-bold text-[#F4C620]">$150 each</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => choose("two")} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-[#F4C620] px-6 py-3 text-xs font-black uppercase tracking-[0.09em] text-[#101A27] transition hover:bg-[#FFE269]">
                Get 2 Deep Cleans · $300 <ArrowRight className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => choose("one")} className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/40 px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-white transition hover:bg-white/10">Just one · $220</button>
            </div>
            <p className="mt-5 text-xs font-semibold text-white/60">Local Western Sydney bookings · Clear inclusions · No surprise repairs</p>
          </div>

          <div className="relative z-0 mx-auto w-full max-w-[620px] lg:max-w-none">
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#132736] shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
              <img src="/installs/rinnai-indoor.webp" alt="A wall-mounted split system air conditioner; internal cleaning goes beyond the visible filters" className="block aspect-[5/4] w-full object-cover" loading="eager" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071523] via-[#071523]/85 to-transparent px-5 pb-6 pt-24 sm:px-8">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#F4C620]">A tidy cover isn't the whole story.</p>
                <p className="mt-2 max-w-md font-sans text-2xl font-black uppercase leading-tight tracking-tight text-white sm:text-3xl">The tricky stuff's on the inside.</p>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-2 -top-4 rotate-6 rounded-md bg-[#F4C620] px-4 py-3 font-sans text-xs font-black uppercase tracking-wide text-[#0B1B2A] shadow-lg sm:-right-4 sm:text-sm">FILTERS: THE EASY BIT.</div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#E5E0D7] bg-white py-5" data-testid="cleaning-social-proof">
        <div className="sp-container flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <div><GoogleRating /><p className="mt-1 text-[11px] text-[#62666B]">Customer feedback for SplitsPro's air-conditioning work. <Link to="/reviews" className="font-bold text-[#946C35] underline">Read reviews</Link></p></div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-[#283B48]">
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#A77C41]" /> Clear cleaning scope</span>
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#A77C41]" /> Local Western Sydney</span>
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#A77C41]" /> One simple request form</span>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20" data-testid="cleaning-benefits">
        <div className="sp-container">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9B753E]">The problem no one sees</p>
          <h2 className="mt-3 max-w-4xl font-serif text-4xl leading-tight tracking-tight text-[#0B0B0B] sm:text-5xl">Looks clean on the outside. Doesn't mean it's clean inside.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#5E6267] sm:text-base">Dust, residue and moisture can build up in parts of a wall-mounted unit you don't see during a normal filter wash. That can contribute to stale smells or reduced airflow. A proper deep clean tackles those accessible internal areas.</p>
          <div className="mt-9 grid gap-6 border-y border-[#E7E3DD] py-6 md:grid-cols-3">
            <div className="md:border-r md:border-[#E7E3DD] md:pr-6">
              <Droplets className="h-7 w-7 text-[#0098BC]" />
              <h3 className="mt-3 font-serif text-2xl">Less hidden grime.</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5F6368]">Wash dirt from accessible coil, blower and drain components — not just the front filter.</p>
            </div>
            <div className="md:border-r md:border-[#E7E3DD] md:pr-6">
              <Wind className="h-7 w-7 text-[#0098BC]" />
              <h3 className="mt-3 font-serif text-2xl">Let the airflow breathe.</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5F6368]">Removing buildup that is obstructing the airflow path can help your aircon move air more freely.</p>
            </div>
            <div>
              <ShieldCheck className="h-7 w-7 text-[#0098BC]" />
              <h3 className="mt-3 font-serif text-2xl">Know what's included.</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5F6368]">Clear cleaning steps. If a unit needs a repair or specialist treatment, we explain it first.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F6F2] py-14 sm:py-20" id="cleaning-prices" data-testid="cleaning-prices">
        <div className="sp-container max-w-6xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9B753E]">The same service. A better deal for two.</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight text-[#0B0B0B] sm:text-5xl">Choose your deep clean.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#606469]">Same deep-clean scope. Pick how many wall-mounted units need attention at the one property.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {CLEANING_OFFERS.map((offer) => {
              const featured = offer.id === "two";
              return (
                <div key={offer.id} className={"relative border-t-4 bg-white p-6 sm:p-8 " + (featured ? "border-[#F4C620] shadow-[0_15px_40px_rgba(0,0,0,0.08)]" : "border-[#C8A46A]")}>
                  {featured && <p className="mb-4 inline-block bg-[#F4C620] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#0B1C2A]">Best value · save $140 versus 2 singles</p>}
                  <div className="flex items-start justify-between gap-3">
                    <div><h3 className="font-serif text-2xl text-[#0B0B0B] sm:text-3xl">{offer.name}</h3><p className="mt-2 text-xs font-semibold text-[#676C72]">{offer.label}</p></div>
                    <strong className="text-4xl font-black tracking-tight text-[#111E2A] sm:text-5xl">{offer.price}</strong>
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-[#5F646A]">{offer.description}</p>
                  <button type="button" onClick={() => choose(offer.id)} className={"mt-7 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-md px-5 py-3 text-xs font-black uppercase tracking-wider " + (featured ? "bg-[#F4C620] text-[#0A1A27]" : "bg-[#0B1D2B] text-white")}>Choose this clean <ArrowUpRight className="h-4 w-4" /></button>
                </div>
              );
            })}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-[#666D73]">Offer applies to normal-access wall-mounted split-system indoor units at one address. Two-unit pricing requires both cleans during the same visit. Heavy contamination, access problems, repairs or non-standard requirements are discussed and quoted separately before any work.</p>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20" data-testid="cleaning-inclusions">
        <div className="sp-container grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9B753E]">This is what a deep clean means</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight text-[#0B0B0B] sm:text-5xl">Not a quick wipe and a wave goodbye.</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#606469]">We protect the surrounding area, wash the service-accessible indoor components, reassemble and check operation. Actual access depends on the model.</p>
            <button type="button" onClick={scrollBook} className="mt-6 inline-flex items-center gap-2 border-b-2 border-[#C8A46A] pb-1 text-sm font-bold text-[#1D2329]">Request my deep clean <ArrowRight className="h-4 w-4" /></button>
          </div>
          <div className="border-t border-[#E5E0D7]">
            {WHAT_WE_CLEAN.map((item, index) => (
              <div key={item.title} className="flex gap-4 border-b border-[#E5E0D7] py-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D4BC96] text-xs font-black text-[#976E36]">{String(index + 1).padStart(2, "0")}</span>
                <div><h3 className="font-semibold text-[#162332]">{item.title}</h3><p className="mt-1 text-sm leading-relaxed text-[#63676D]">{item.copy}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#081726] py-16 text-white sm:py-20" id="cleaning-booking" data-testid="cleaning-booking">
        <div className="sp-container grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#F4C620]">Book a SplitsPro clean</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">We'll handle the dirty work.</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/75">Tell us where you are and which package you want. We'll contact you to confirm the appointment. This form is a booking request, not an instant confirmed time.</p>
            <div className="mt-8 border-y border-white/15 py-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">Your selected offer</p>
              <div className="mt-2 flex items-center justify-between gap-4">
                <p className="text-xl font-semibold">{chosen.name}</p><strong className="text-4xl font-black text-[#F4C620]">{chosen.price}</strong>
              </div>
              <p className="mt-2 text-xs text-white/55">{chosen.label}</p>
              <button type="button" onClick={() => setOfferId(offerId === "two" ? "one" : "two")} className="mt-3 text-xs font-bold text-[#F4C620] underline underline-offset-4">Change package</button>
            </div>
            <a href={PHONE_TEL} className="mt-5 inline-block text-xs font-bold text-white/80 underline underline-offset-4">Prefer to call us? 0414 698 435</a>
          </div>
          <div className="bg-white p-5 text-[#181818] shadow-[0_20px_60px_rgba(0,0,0,.16)] sm:p-8">
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.16em] text-[#97703D]">Request an appointment</p>
            <QuoteForm
              key={chosen.id}
              defaultService={"Air Conditioner Cleaning | Split System | " + chosen.name + " | " + chosen.price + (chosen.id === "two" ? " | Same property" : "")}
              defaultMessage={"Selected " + chosen.name + " at " + chosen.price + (chosen.id === "two" ? " for two units at the same address." : " for one unit.")}
              submitLabel="Request My Cleaning"
              successTitle="Cleaning request received"
              successMessage="Thanks — we'll be in touch to confirm your cleaning appointment and any site details."
              compact
              hidePhoto
              hideMessage
              tight
              requireAddress
              hideCallButton
              includeAttribution
            />
            <p className="mt-4 text-xs leading-relaxed text-[#6E7378]">Submitting this form requests a booking. We confirm availability and price conditions before an appointment is locked in. No payment is taken here.</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20" data-testid="cleaning-faq">
        <div className="sp-container grid gap-10 lg:grid-cols-[.68fr_1.32fr] lg:gap-16">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#9B753E]">Straight answers</p><h2 className="mt-3 font-serif text-4xl text-[#0B0B0B] sm:text-5xl">Before we rock up.</h2></div>
          <div className="border-t border-[#E6E0D7]">
            {FAQS.map((item, index) => (
              <div className="border-b border-[#E6E0D7]" key={item.q}>
                <button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between gap-5 py-5 text-left text-sm font-bold text-[#192532] sm:text-base"><span>{item.q}</span><ChevronDown className={"h-4 w-4 shrink-0 transition-transform " + (openFaq === index ? "rotate-180" : "")} /></button>
                {openFaq === index && <p className="pb-5 text-sm leading-relaxed text-[#60676E]">{item.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="border-t border-[#E6E0D7] bg-[#FAF9F7] py-5">
        <div className="sp-container flex flex-wrap items-center justify-between gap-3 text-xs text-[#646970]">
          <span>SplitsPro · Bass Hill and selected surrounding Western Sydney suburbs. Ask about your postcode before booking.</span>
          <Link to="/cleaning" className="font-bold text-[#946F3C] underline">All cleaning services</Link>
        </div>
      </div>
    </div>
  );
}
