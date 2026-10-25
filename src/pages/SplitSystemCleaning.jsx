import PayLaterReminder from "../components/PayLaterReminder";

import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, ArrowLeft, ChevronDown, Clock3, Loader2, ShieldCheck } from "lucide-react";
import { getCleaningCheckoutConfig, getCleaningSlots } from "../lib/api";
import { scheduledCleaningPrice } from "../lib/cleaningPricing";
import { GoogleRating } from "../components/sections";
import { PHONE_TEL } from "../lib/data";

// This is the ONE consumer sales landing page for split-system cleaning.
// Three short stages share one live offer and checkout.
const CLEANING_QUANTITIES = Array.from({ length: 7 }, (_, index) => index + 1);
const EXTRA_CLEAN_PRICE = 120;
const cleaningPrice = (count, firstPrice) => firstPrice + Math.max(0, count - 1) * EXTRA_CLEAN_PRICE;
const money = (value) => new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(value);


const FAQS = [
  { q: "Is a deep clean different to washing the filters?", a: "Yes. A filter wash is only one part. Our deep clean also targets accessible internal coil, blower wheel, drain tray and airflow path surfaces. The exact method depends on the unit and its condition." },
  { q: "How much do additional air conditioners cost?", a: "The current first-system price is displayed in the live offer and booking calculator. Every additional standard split system is $120 when cleaned at the same address and on the same visit. Your total is shown before you choose a secure payment method. Eligible pay-later options may be available." },
  { q: "Do you have to remove the whole air conditioner?", a: "Normally no. We protect the area, open or remove suitable service-accessible covers and clean the accessible indoor components. We won't dismantle sealed refrigerant components as part of a cleaning job." },
  { q: "Can cleaning repair an air conditioner that isn't cooling?", a: "Cleaning can help when dirt is affecting airflow, but it won't fix a refrigerant leak, electrical fault or failed part. If we find a likely fault, we'll discuss the next step before any separate repair work." },
  { q: "What if there is heavy contamination or difficult access?", a: "These prices apply to standard accessible wall-mounted splits in our local offer area. We will explain and quote any additional cleaning or repair work before proceeding." },
  { q: "Can a deep clean help if we have children, pets or older relatives at home?", a: "Cleaning removes accessible dirt, dander and other buildup from inside the unit. If contamination is present, cleaning those surfaces can reduce a possible source of irritants and musty odours. It cannot guarantee better health, prevent infections, or replace asthma treatment, good ventilation or dealing with dampness." },
  { q: "Will the aircon run like new, use less electricity or sound quieter?", a: "Cleaning may restore airflow and reduce certain noises or inefficiency when the cause is dirt. Results depend on the starting condition, and cleaning does not repair worn bearings, electrical problems, refrigerant leaks or other faults." },
  { q: "Can I pay later?", a: "Our cleaning checkout uses Stripe or PayPal. Some customers may see instalment or pay-later options if enabled for the purchase and offered by the provider. Availability and approval vary; always check the actual checkout before relying on an instalment arrangement." }
];

export default function SplitSystemCleaning() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stage, setStage] = useState(() => /^(#cleaning-booking|#cleaning-prices)$/.test(window.location.hash) ? 3 : 1);
  const goStage = (next) => {
    setStage(next);
    window.setTimeout(() => document.getElementById("cleaning-stage-" + next)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };
  // Scroll guide visitors directly to this page's EXISTING live date picker.
  // Route fade-in and the global ScrollToTop run before this delayed scroll.
  useEffect(() => {
    if (location.hash !== "#cleaning-booking" && location.hash !== "#cleaning-prices") return undefined;
    setStage(3);
    const timeout = window.setTimeout(() => {
      document.getElementById(location.hash === "#cleaning-prices" ? "cleaning-prices" : "cleaning-booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 650);
    return () => window.clearTimeout(timeout);
  }, [location.hash]);
  const [quantity, setQuantity] = useState(1);
  const [firstPrice, setFirstPrice] = useState(scheduledCleaningPrice);
  const [priceReady, setPriceReady] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotsError, setSlotsError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showMoreSlots, setShowMoreSlots] = useState(false);
  const [continuing, setContinuing] = useState(false);
  // Unknown until the API responds: do not call an active Stripe integration unavailable while checking.
  const [paymentReadiness, setPaymentReadiness] = useState({ stripe_ready: undefined, paypal_ready: undefined });
  const requestId = useRef(0);
  const scrollBook = () => document.getElementById("cleaning-booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const scrollOffer = () => { setStage(3); window.setTimeout(() => document.getElementById("cleaning-prices")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50); };
  const choose = (count) => { setQuantity(count); scrollBook(); };

  const refreshSlots = async (requestedQuantity = quantity) => {
    const token = ++requestId.current;
    setSlotsLoading(true);
    setSlotsError("");
    try {
      // Availability is server-filtered against both cleaning and installation
      // holds/bookings. A checkout creates an atomic hold under a shared day lock.
      const data = await getCleaningSlots(requestedQuantity, 85);
      if (token !== requestId.current) return;
      const next = (Array.isArray(data?.slots) ? data.slots : []).filter(
        (slot) => slot?.date && /^\d{2}:\d{2}$/.test(slot?.time || "")
      );
      setSlots(next);
      // Highlight an actual live opening by default, keeping a prior choice if still free.
      if (!next.some((slot) => slot.date === selectedDate && slot.time === selectedTime)) {
        const defaultSlot = next.find((slot) => slot.date === selectedDate) || next[0];
        setSelectedDate(defaultSlot?.date || "");
        setSelectedTime(defaultSlot?.time || "");
      }
    } catch {
      if (token !== requestId.current) return;
      setSlots([]);
      setSlotsError("We couldn't check live availability. Refresh and try again.");
    } finally {
      if (token === requestId.current) setSlotsLoading(false);
    }
  };
  useEffect(() => {
    setSelectedDate("");
    setSelectedTime("");
    setShowMoreSlots(false);
    refreshSlots(quantity);
  }, [quantity]);
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === "visible") refreshSlots(quantity); };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [quantity, selectedDate, selectedTime]);

  useEffect(() => {
    let active = true;
    getCleaningCheckoutConfig()
      .then((data) => {
        if (active) {
          const latestPrice = Number(data?.first_system);
          setPriceReady(latestPrice === scheduledCleaningPrice() && Number(data?.each_additional_system) === EXTRA_CLEAN_PRICE && Number(data?.booking_payment) === 50 && data?.enabled === true);
           setFirstPrice(scheduledCleaningPrice());
          setPaymentReadiness({
          stripe_ready: Boolean(data?.stripe_ready),
          paypal_ready: Boolean(data?.paypal_ready),
          });
        }
      })
      .catch(() => { if (active) { setFirstPrice(scheduledCleaningPrice()); setPriceReady(false); } });
    return () => { active = false; };
  }, []);

  const currentTotal = cleaningPrice(quantity, firstPrice);
  const formatDate = (day) => new Date(day + "T00:00:00").toLocaleDateString(
    "en-AU", { weekday: "short", day: "numeric", month: "short" });
  const formatTime = (time) => new Date("2026-01-01T" + time + ":00").toLocaleTimeString(
    "en-AU", { hour: "numeric", minute: "2-digit" });
  const availableDays = [...new Set(slots.map((slot) => slot.date))];
  const availableTimes = slots.filter((slot) => slot.date === selectedDate);
  const continueBooking = async () => {
    if (!selectedDate || !selectedTime || continuing || !priceReady) return;
    setContinuing(true);
    try {
      // The checkout server performs the authoritative conflict check under
      // the shared day lock; a second page-side calendar request only delays buyers.
      navigate("/secure-cleaning?" + new URLSearchParams({
        count: String(quantity), date: selectedDate, time: selectedTime
      }).toString());
    } catch {
      setSlotsError("Unable to verify that time right now. Please try again.");
    } finally {
      setContinuing(false);
    }
  };

  return (
    <div className="bg-[#FBFAF8] text-[#18232F]" data-testid="split-cleaning-landing">
      <Helmet>
        <title>Split System Deep Clean + Anti-Mould & Anti-Corrosion | SplitsPro Sydney</title>
        <meta name="description" content="SplitsPro complete split-system deep cleaning for $200 for one system, plus $120 for each additional system at the same address. Choose a date and book online for $50, with the balance due after cleaning. Full payment and eligible pay-later options are also available. Protective treatments where suitable." />
        <link rel="canonical" href="https://splitspro.com.au/split-system-cleaning/" />
        <meta property="og:title" content="You Clean Everything They Touch. What About Your Aircon? | SplitsPro" />
        <meta property="og:description" content="$200 complete deep clean with suitable protective treatments. Each extra split system $120 at the same property. Book online for $50 and pay the balance after cleaning, or pay the full total online." />
      </Helmet>




      <div className="border-b border-[#D6E6EC] bg-white" aria-label="Cleaning booking progress">
        <div className="sp-container flex items-center justify-between gap-3 py-3">
          <p className="text-xs font-black uppercase tracking-wide text-[#28506A]">Step {stage} of 3 · {stage === 1 ? "Your home" : stage === 2 ? "How we protect it" : "Offer & booking"}</p>
          <div className="flex gap-1.5" aria-hidden="true">
            {[1, 2, 3].map((step) => <span key={step} className={"h-1.5 w-9 rounded-full " + (step <= stage ? "bg-[#008DB8]" : "bg-[#D8E4EA]")} />)}
          </div>
        </div>
      </div>

      {stage === 1 && (
        <section id="cleaning-stage-1" className="scroll-mt-16 bg-[#FCFBF8] py-6 sm:py-14" data-testid="cleaning-diagnosis">
          <div className="sp-container mx-auto max-w-6xl">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-[#8D6325]">For the little ones, the older ones and everyone in between</p>
            <div className="mt-4 grid items-center gap-5 md:grid-cols-[1.1fr_0.9fr] md:gap-12">
              <div>
                <h1 className="font-serif text-[clamp(2.05rem,7.6vw,4.25rem)] leading-[1.08] tracking-tight text-[#0B2641]">
                  You clean everything they touch. <span className="text-[#008DB8]">What about the aircon they breathe around?</span>
                </h1>
                <p className="mt-4 max-w-xl text-base font-semibold leading-relaxed text-[#3B5969] sm:text-lg">
                  You wouldn't let someone sneeze all over a freshly wiped benchtop. So why overlook the dust a neglected aircon could blow back around the room?
                </p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#526978] sm:text-base">
                  Behind a clean-looking cover, dust, pet dander, damp grime and sometimes mould can build up. Airflow may recirculate particles into the rooms your children, pets and older loved ones share.
                </p>
              </div>
              <img src="/landing/splitspro-cleaning-baby-approved.png" alt="Baby playing at home — a reminder to care for hidden dirt inside the air conditioner"
                width={409} height={487} loading="eager" decoding="async"
                className="mx-auto h-[220px] w-full max-w-md rounded-xl object-contain sm:h-[330px] md:h-[460px]" />
            </div>
            <p className="mt-4 border-l-4 border-[#F4C620] pl-4 text-sm font-bold leading-relaxed text-[#244456]">
              Looking after the people you love starts with caring for the parts of your home you can't easily see.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-[#637782]">
              Not every aircon has mould. Cleaning can remove accessible buildup; it cannot guarantee sterile air or prevent illness.
            </p>
            <button type="button" onClick={() => goStage(2)}
              className="mt-6 flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-[#F4C620] px-5 py-4 text-base font-black uppercase text-[#082337] hover:bg-[#FBDD42] sm:w-auto sm:px-9"
              data-testid="cleaning-next-solution">
              See how we clean &amp; protect it <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </section>
      )}

      {stage === 2 && (
        <section id="cleaning-stage-2" className="scroll-mt-16 bg-[#F0F9FC] py-6 sm:py-12" data-testid="cleaning-solution-trust">
          <div className="sp-container mx-auto max-w-6xl">
            <button type="button" onClick={() => goStage(1)} className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#176A88]">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div className="grid items-center gap-5 sm:grid-cols-[1.3fr_0.7fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.17em] text-[#007EA7]">The SplitsPro solution</p>
                <h2 className="mt-2 font-serif text-3xl leading-[1.1] text-[#0B2641] sm:text-4xl">
                  We strip it back. <span className="text-[#008DB8]">Not just wipe over it.</span>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#3F5B6D] sm:text-base">A proper clean reaches past the filters, targets hidden buildup and finishes with protection where suitable.</p>
              </div>
              <img src="/landing/splitspro-cleaning-family-hero.webp" alt="Family with their dog at home"
                width={1536} height={1024} loading="lazy" decoding="async"
                className="h-28 w-full rounded-lg object-cover object-[78%_55%] sm:h-36" />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4" data-testid="cleaning-real-process-gallery">
              {[
                {src:"/landing/splitspro-process-filter.png",alt:"Real job — covers and filters opened",label:"01 · Strip back"},
                {src:"/landing/splitspro-process-coil.png",alt:"Real job — indoor coil exposed",label:"02 · Deep clean"},
                {src:"/landing/splitspro-process-covers.png",alt:"Real job — cleaned removable covers",label:"03 · Protect"}
              ].map((photo) => (
                <figure key={photo.src}>
                  <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="h-24 w-full rounded-md object-cover sm:h-40" />
                  <figcaption className="mt-2 text-center text-[11px] font-black uppercase leading-tight text-[#0B3650] sm:text-sm">{photo.label}</figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3" data-testid="cleaning-process-benefits">
              <div className="border-l-[3px] border-[#008DB8] pl-3">
                <h3 className="text-sm font-black uppercase text-[#0B2641]">We expose hidden dirt.</h3>
                <p className="mt-1 text-sm leading-snug text-[#435F70]">Filters and accessible covers come off, so we reach buildup a quick filter rinse leaves behind.</p>
              </div>
              <div className="border-l-[3px] border-[#008DB8] pl-3">
                <h3 className="text-sm font-black uppercase text-[#0B2641]">We spray, rinse and clear.</h3>
                <p className="mt-1 text-sm leading-snug text-[#435F70]">We clean accessible coils, fan and drain with suitable sprays, steam and pressure rinsing. Clear drainage helps reduce blockages and drips.</p>
              </div>
              <div className="border-l-[3px] border-[#008DB8] pl-3">
                <h3 className="text-sm font-black uppercase text-[#0B2641]">We help protect surfaces.</h3>
                <p className="mt-1 text-sm leading-snug text-[#435F70]">Compatible anti-mould and anti-corrosion coatings go on suitable indoor and outdoor surfaces. Then we reassemble and test.</p>
              </div>
            </div>

            <div className="mt-6 border-t-2 border-[#BCDDEB] pt-5" id="cleaning-trust" data-testid="cleaning-trust">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#007EA7]">Why trust SplitsPro with your home?</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_1fr] sm:items-center">
                <div>
                  <GoogleRating />
                  <p className="mt-2 text-xs leading-relaxed text-[#526B7B]">Genuine customer reviews and real work photos.</p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-start gap-2 text-sm font-bold text-[#14394E]"><ShieldCheck className="h-5 w-5 shrink-0 text-[#008DB8]" /> Licensed and insured technicians.</p>
                  <p className="flex items-start gap-2 text-sm font-bold text-[#14394E]"><ShieldCheck className="h-5 w-5 shrink-0 text-[#008DB8]" /> We protect the work area, explain the job and leave it tidy.</p>
                  <p className="flex items-start gap-2 text-sm font-bold text-[#14394E]"><ShieldCheck className="h-5 w-5 shrink-0 text-[#008DB8]" /> Cleaning checklist, job photos and completion certificate.</p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-[#607889]">Cleaning access and treatments depend on the unit and product compatibility. Coatings cannot guarantee that mould or corrosion will never return.</p>
            <button type="button" onClick={() => goStage(3)}
              className="mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-[#F4C620] px-5 py-4 text-base font-black uppercase text-[#082337] hover:bg-[#FBDD42] sm:w-auto sm:px-9"
              data-testid="cleaning-next-offer">
              See the complete clean offer <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </section>
      )}

      {stage === 3 && (
        <>
          <section id="cleaning-stage-3" className="scroll-mt-16 bg-[#F1F9FC] py-8 sm:py-14" data-testid="cleaning-offer">
            <div className="sp-container mx-auto max-w-6xl">
              <button type="button" onClick={() => goStage(2)} className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#176A88]">
                <ArrowLeft className="h-4 w-4" /> Back to how we clean
              </button>
              <div className="grid items-center gap-5 sm:grid-cols-[1fr_0.45fr]">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.17em] text-[#007EA7]">Now, here's the offer</p>
                  <h2 className="mt-2 max-w-3xl font-serif text-3xl leading-tight text-[#0B2641] sm:text-5xl">
                    A small price for a cleaner, better-protected aircon at home.
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4F6575] sm:text-base">
                    The full deep clean, outdoor care and compatible anti-mould and anti-corrosion treatments are included. More than a filter wash, with one clear price.
                  </p>
                </div>
                <img src="/landing/splitspro-process-covers.png" alt="Real SplitsPro cleaning work with removed covers neatly cleaned"
                  loading="lazy" decoding="async" className="h-36 w-full rounded-xl object-cover sm:h-52" />
              </div>
              <div className="mt-6 grid gap-6 rounded-xl bg-[#08263E] p-5 text-white sm:grid-cols-[1fr_1fr] sm:p-8" id="cleaning-prices" data-testid="cleaning-prices">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#4BD0F0]">Complete split-system deep clean</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/85">We clean accessible covers, filters, coil, fan and drainage, plus the outdoor unit. Suitable anti-mould and anti-corrosion protection, operation check and job photos are included.</p>
                  <p className="mt-3 text-xs text-white/60">Standard wall-mounted systems, same property and visit. Any non-standard work is quoted first.</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#F4C620]">First split system</p>
                  <strong className="mt-1 block text-6xl font-black leading-none text-white sm:text-7xl">{money(firstPrice)}</strong>
                  <p className="mt-2 text-2xl font-black uppercase text-[#F4C620]">+ $120 each extra system</p>
                  <p className="mt-2 text-sm font-bold text-white/85">2 systems {money(cleaningPrice(2, firstPrice))} · 3 systems {money(cleaningPrice(3, firstPrice))}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/75">Only $50 to book online, credited toward your total. Balance after cleaning, or pay in full with eligible instalments at checkout.</p>
                </div>
              </div>
              <div className="mt-5" data-testid="cleaning-before-booking-cta-pay-later-reminder">
                <PayLaterReminder kind="cleaning" compact stripeReady={paymentReadiness.stripe_ready} paypalReady={paymentReadiness.paypal_ready} />
              </div>
              <button type="button" onClick={scrollBook}
                className="mt-4 flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-[#F4C620] px-5 py-4 text-base font-black uppercase text-[#082337] hover:bg-[#FBDD42] sm:w-auto sm:px-10">
                Choose systems &amp; date <ArrowRight className="h-5 w-5" />
              </button>
              <p className="mt-3 text-xs text-[#506979]">Protective coatings help care for treated surfaces; they are not a promise of permanent mould prevention or medical protection.</p>
            </div>
          </section>

      <section className="scroll-mt-24 bg-[#081726] py-16 text-white sm:py-20" id="cleaning-booking" data-testid="cleaning-booking">
        <div className="sp-container mx-auto max-w-5xl">
          <p className="text-xs font-black uppercase tracking-[0.17em] text-[#F4C620]">CHOOSE YOUR COMPLETE CLEAN</p>
          <h2 className="mt-4 text-4xl font-black uppercase leading-tight sm:text-5xl">
            PICK THE SYSTEMS. <span className="text-[#45C6E7]">PICK THE TIME.</span>
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/75">
            Choose the number of systems and an available start time. Then pay $50 online to reserve, or pay the full total securely. Cleaning and installation bookings share the same live calendar.
          </p>
          <div className="mt-6" data-testid="cleaning-booking-pay-later-reminder">
            <PayLaterReminder kind="cleaning" theme="dark" />
          </div>
          <div className="mt-9 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
            <div className="border-t-[3px] border-[#45C6E7] pt-6">
              <label htmlFor="cleaning-unit-quantity" className="block text-xs font-black uppercase tracking-[0.17em] text-[#F4C620]">How many split systems need cleaning?</label>
              <select id="cleaning-unit-quantity" data-testid="cleaning-unit-count"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-3 min-h-14 w-full rounded-md border border-white/25 bg-white px-4 py-3 text-lg font-extrabold text-[#082337]">
                {CLEANING_QUANTITIES.map((count) => (
                  <option key={count} value={count}>{count} split {count === 1 ? "system" : "systems"}</option>
                ))}
              </select>
              <div className="mt-6 border-y border-white/20 py-5">
                <div className="flex justify-between gap-3 text-sm text-white/80"><span>First complete deep clean</span><strong>{money(firstPrice)}</strong></div>
                {quantity > 1 && <div className="mt-3 flex justify-between gap-3 text-sm text-white/80"><span>{quantity - 1} additional system{quantity > 2 ? "s" : ""} × $120</span><strong>{money((quantity - 1) * EXTRA_CLEAN_PRICE)}</strong></div>}
                <div className="mt-6 flex items-end justify-between gap-3 border-t border-white/20 pt-5">
                  <span className="text-sm font-black uppercase tracking-[0.12em] text-[#F4C620]">Total</span>
                  <strong className="text-4xl font-black text-[#F4C620]">{money(currentTotal)}</strong>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/20 pt-4" data-testid="cleaning-booking-full-payment">
                  <span className="font-black uppercase text-[#F4C620]">Pay $50 online to reserve</span>
                  <span className="text-sm font-semibold text-white/80">Balance after clean: {money(currentTotal - 50)}</span>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-white/70">We allow 90 minutes per system, so {quantity} {quantity === 1 ? "system needs" : "systems need"} {quantity * 90} minutes. Multiple systems must be at the same address.</p>
            </div>
            <div className="border-t-[3px] border-[#F4C620] pt-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#F4C620]">Live calendar</p>
                  <h3 className="mt-2 text-2xl font-black uppercase sm:text-3xl">Choose a date</h3>
                </div>
                <button type="button" onClick={() => refreshSlots(quantity)} disabled={slotsLoading}
                  className="text-sm font-bold text-[#F4C620] underline underline-offset-4 disabled:opacity-50">Refresh openings</button>
              </div>
              {slotsLoading && <p className="mt-5 flex items-center gap-2 text-sm text-white/75"><Loader2 className="h-4 w-4 animate-spin"/> Checking live bookings...</p>}
              {slotsError && <p className="mt-5 border-l-[3px] border-[#F4C620] pl-3 text-sm font-semibold text-[#F4C620]" role="alert">{slotsError}</p>}
              {!slotsLoading && availableDays.length === 0 && !slotsError && <p className="mt-5 text-sm text-white/80">No online openings are available for {quantity} systems right now. Call 0414 698 435 to ask about another date.</p>}
              <p className="mt-4 text-xs text-white/65">Soonest available opening is selected automatically. Choose another date or time if you prefer.</p>
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {(showMoreSlots ? availableDays : availableDays.slice(0, 6)).map((day) => (
                  <button type="button" key={day} aria-pressed={selectedDate === day}
                    onClick={() => { const first = slots.find((slot) => slot.date === day); setSelectedDate(day); setSelectedTime(first?.time || ""); setSlotsError(""); }}
                    className={"min-h-14 rounded-md border px-3 py-3 text-sm font-bold transition " + (selectedDate === day ? "border-[#F4C620] bg-[#F4C620] text-[#071827]" : "border-white/25 bg-white/5 text-white hover:border-[#F4C620]")}>
                    {formatDate(day)}
                  </button>
                ))}
              </div>
              {availableDays.length > 6 && <button type="button" onClick={() => setShowMoreSlots(!showMoreSlots)} className="mt-3 text-sm font-bold text-[#F4C620] underline underline-offset-4">{showMoreSlots ? "Show fewer dates" : "See more dates"}</button>}
              {selectedDate && <div className="mt-7 border-t border-white/20 pt-5">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#F4C620]">Available start times · {formatDate(selectedDate)}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {availableTimes.map((slot) => (
                    <button type="button" key={slot.time} aria-pressed={selectedTime === slot.time}
                      onClick={() => { setSelectedTime(slot.time); setSlotsError(""); }}
                      className={"min-h-14 rounded-md border px-3 py-3 text-sm font-extrabold " + (selectedTime === slot.time ? "border-[#F4C620] bg-[#F4C620] text-[#071827]" : "border-white/25 bg-white/5 text-white hover:border-[#F4C620]")}>
                      <Clock3 className="mr-2 inline h-4 w-4"/> {formatTime(slot.time)}
                    </button>
                  ))}
                </div>
              </div>}
              {selectedDate && selectedTime && <p className="mt-5 text-sm font-bold text-[#FFFFFF]">Your booking: {formatDate(selectedDate)} at {formatTime(selectedTime)} · {quantity} {quantity === 1 ? "system" : "systems"}</p>}
              {!priceReady && <p role="status" className="mt-4 text-xs text-[#F4C620]">We're verifying the $200 cleaning offer and $50 booking payment. Online booking will open when the secure checkout matches.</p>}
              <button type="button" onClick={continueBooking}
                disabled={!selectedDate || !selectedTime || continuing || slotsLoading || !!slotsError || !priceReady}
                className="mt-6 flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-[#F4C620] px-5 py-3 text-sm font-black uppercase tracking-wide text-[#071827] disabled:cursor-not-allowed disabled:opacity-40">
                {continuing ? "Opening secure booking..." : "Continue to secure $50 booking"} <ArrowRight className="h-5 w-5"/>
              </button>
              <p className="mt-3 text-xs leading-relaxed text-white/60">Your time is held when checkout starts. Your date is confirmed after your $50 booking payment or full payment is verified.</p>
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
        </>
      )}
      <div className="border-t border-[#E6E0D7] bg-[#FAF9F7] py-5">
        <div className="sp-container flex flex-wrap items-center justify-between gap-3 text-xs text-[#646970]">
          <span>SplitsPro · Bass Hill and selected surrounding Western Sydney suburbs. Ask about your postcode before booking.</span>
          <Link to="/cleaning" className="font-bold text-[#946F3C] underline">All cleaning services</Link>
        </div>
      </div>
    </div>
  );
}
