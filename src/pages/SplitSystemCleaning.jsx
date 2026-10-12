
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Clock3, Droplets, Loader2, ShieldCheck, Sun, Wind } from "lucide-react";
import { getBookingSlots } from "../lib/api";
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
  const navigate = useNavigate();
  const [offerId, setOfferId] = useState("two");
  const [openFaq, setOpenFaq] = useState(0);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotsError, setSlotsError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedWindow, setSelectedWindow] = useState("");
  const [showMoreSlots, setShowMoreSlots] = useState(false);
  const [continuing, setContinuing] = useState(false);
  const chosen = CLEANING_OFFERS.find((offer) => offer.id === offerId) || CLEANING_OFFERS[1];
  const scrollBook = () => document.getElementById("cleaning-booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const choose = (id) => { setOfferId(id); scrollBook(); };

  const refreshSlots = async () => {
    setSlotsLoading(true);
    setSlotsError("");
    try {
      // Same live opening picker as /book-installation. Server must re-check
      // and reserve a cleaning slot when starting checkout; selecting is not a reservation.
      const data = await getBookingSlots(12);
      const next = (Array.isArray(data?.slots) ? data.slots : []).filter((s) => s?.date && ["Morning", "Afternoon"].includes(s?.window));
      setSlots(next);
      if (selectedDate && !next.some((s) => s.date === selectedDate && s.window === selectedWindow)) {
        setSelectedDate("");
        setSelectedWindow("");
      }
    } catch {
      setSlots([]);
      setSlotsError("We couldn't check live availability. Please try again.");
    } finally {
      setSlotsLoading(false);
    }
  };
  useEffect(() => { refreshSlots(); }, []);
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === "visible") refreshSlots(); };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => { window.removeEventListener("focus", refresh); document.removeEventListener("visibilitychange", refresh); };
  }, [selectedDate, selectedWindow]);

  const formatDate = (day) => new Date(day + "T00:00:00").toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
  const continueBooking = async () => {
    if (!selectedDate || !selectedWindow || continuing) return;
    setContinuing(true);
    try {
      const data = await getBookingSlots(12);
      const fresh = (Array.isArray(data?.slots) ? data.slots : []);
      if (!fresh.some((s) => s.date === selectedDate && s.window === selectedWindow)) {
        setSelectedDate("");
        setSelectedWindow("");
        setSlots(fresh);
        setSlotsError("That time has just filled. Choose another available time.");
        return;
      }
      const q = new URLSearchParams({ package: offerId, date: selectedDate, window: selectedWindow });
      navigate("/secure-cleaning?" + q.toString());
    } catch {
      setSlotsError("Unable to confirm the opening right now. Please retry.");
    } finally {
      setContinuing(false);
    }
  };

  return (
    <div className="bg-[#FBFAF8] text-[#18232F]" data-testid="split-cleaning-landing">
      <Helmet>
        <title>Split System Deep Cleaning | $220 or 2 for $300 | SplitsPro Sydney</title>
        <meta name="description" content="Your aircon's hiding something. Professional wall-mounted split system deep cleaning: $220 for one or 2 deep cleans for $300 at the same property. Book with SplitsPro." />
        <link rel="canonical" href="https://splitspro.com.au/split-system-cleaning/" />
        <meta property="og:title" content="Your Aircon's Hiding Something | SplitsPro Deep Cleaning" />
        <meta property="og:description" content="Deep clean $220. Two deep cleans at the same property $300. See what we clean and request a booking." />
      </Helmet>

      {/* Approved full-width SplitsPro cleaning artwork; do not crop the logo,
          offer amounts or printed CTA. Live booking controls are below. */}
      <section className="w-full overflow-hidden bg-[#061525] text-white" data-testid="cleaning-hero">
        <h1 className="sr-only">SplitsPro Split System Deep Cleaning — One for $220 or two at the same property for $300</h1>
        <img
          src="/landing/splitspro-cleaning-hero.avif"
          alt="SplitsPro cleaning campaign featuring an Aussie aircon cleaner, a dog, a dirty blower wheel, a before-and-after comparison, and the offers: 1 deep clean $220 or 2 for $300 at the same property."
          width={1536}
          height={1024}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          data-no-fallback="true"
          className="block h-auto w-full max-w-none object-contain"
        />
        <div className="border-t border-white/15 bg-[#071523] py-4 sm:py-5">
          <div className="sp-container flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center sm:gap-5">
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#F4C620]">Book your deep clean</p>
              <p className="mt-1 text-sm font-semibold text-white/85">1 deep clean $220 · 2 deep cleans $300 at the same property</p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0 sm:gap-3">
              <button
                type="button"
                onClick={() => choose("one")}
                className="min-h-12 rounded-md border border-white/45 bg-transparent px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-white hover:bg-white/10 sm:text-xs"
              >Book 1 · $220</button>
              <button
                type="button"
                onClick={() => choose("two")}
                className="min-h-12 rounded-md bg-[#F4C620] px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#101A27] hover:bg-[#FFE269] sm:text-xs"
              >Book 2 · $300 <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></button>
            </div>
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


      <section className="scroll-mt-24 bg-[#081726] py-16 text-white sm:py-20" id="cleaning-booking" data-testid="cleaning-booking">
        <div className="sp-container mx-auto max-w-5xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#F4C620]">1 · Choose your cleaning date</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">Pick a day that works for you.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">Choose a live opening below, then continue to a separate page to enter your details and pay. Your date is not secured until the payment and booking are confirmed.</p>

          <div className="mt-8 grid gap-7 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div className="border-t border-white/20 pt-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/60">Your cleaning package</p>
              {CLEANING_OFFERS.map((offer) => (
                <button type="button" key={offer.id} onClick={() => setOfferId(offer.id)}
                  aria-pressed={offer.id === offerId}
                  className={"mt-3 flex w-full items-center justify-between gap-3 rounded-lg border p-4 text-left transition " + (offer.id === offerId ? "border-[#F4C620] bg-white/10" : "border-white/20 hover:border-white/50")}>
                  <span><strong className="block text-base">{offer.name}</strong><span className="mt-1 block text-xs text-white/65">{offer.label}</span></span>
                  <span className="text-2xl font-extrabold text-[#F4C620]">{offer.price}</span>
                </button>
              ))}
              <p className="mt-4 text-xs leading-relaxed text-white/55">Two cleans must be at the same property and during the same visit. Standard-access wall-mounted units only.</p>
            </div>

            <div className="border-t border-white/20 pt-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#F4C620]">Live availability</p><h3 className="mt-2 font-serif text-2xl">Choose morning or afternoon.</h3></div>
                <button type="button" onClick={refreshSlots} className="text-xs font-bold text-[#F4C620] underline underline-offset-4" disabled={slotsLoading}>Refresh dates</button>
              </div>
              {slotsLoading ? <div className="mt-5 flex items-center gap-2 text-sm text-white/65"><Loader2 className="h-4 w-4 animate-spin" /> Checking live dates…</div> : null}
              {slotsError && <p role="alert" className="mt-4 border-l-2 border-[#F4C620] pl-3 text-xs leading-relaxed text-[#F4C620]">{slotsError}</p>}
              {!slotsLoading && slots.length === 0 && !slotsError && <p className="mt-5 text-sm text-white/70">No online openings are available right now. Call us to ask about a date.</p>}
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {(showMoreSlots ? slots : slots.slice(0, 4)).map((slot) => {
                  const active = selectedDate === slot.date && selectedWindow === slot.window;
                  return (
                    <button type="button" key={slot.date + "-" + slot.window} aria-pressed={active}
                      onClick={() => { setSelectedDate(slot.date); setSelectedWindow(slot.window); setSlotsError(""); }}
                      className={"flex min-h-16 items-center justify-between gap-2 rounded-lg border p-3 text-left " + (active ? "border-[#F4C620] bg-[#F4C620] text-[#071827]" : "border-white/25 bg-white/5 text-white hover:border-[#F4C620]")}>
                      <span><strong className="block text-[13px]">{formatDate(slot.date)}</strong><span className="mt-1 block text-xs">{slot.window}</span></span>
                      {slot.window === "Morning" ? <Sun className="h-4 w-4 shrink-0" /> : <Clock3 className="h-4 w-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
              {slots.length > 4 && <button className="mt-4 text-xs font-semibold text-[#F4C620] underline underline-offset-4" type="button" onClick={() => setShowMoreSlots(v => !v)}>{showMoreSlots ? "Show fewer dates" : "More available dates"}</button>}
              {selectedDate && selectedWindow && <p className="mt-4 text-sm font-semibold text-white">Your choice: {formatDate(selectedDate)} · {selectedWindow}</p>}
              <button type="button" onClick={continueBooking} disabled={!selectedDate || !selectedWindow || continuing || slotsLoading || !!slotsError}
                className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#F4C620] px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-[#071827] disabled:cursor-not-allowed disabled:opacity-40">
                {continuing ? "Rechecking the date…" : "Continue to details & payment"} <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-3 text-xs leading-relaxed text-white/55">Your date will be checked again during secure checkout. A selection here does not reserve the slot.</p>
            </div>
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
