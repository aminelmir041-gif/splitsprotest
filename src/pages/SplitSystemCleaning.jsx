import PayLaterReminder from "../components/PayLaterReminder";

import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, ArrowLeft, ChevronDown, Clock3, Loader2, ShieldCheck } from "lucide-react";
import { api, getCleaningCheckoutConfig, getCleaningSlots } from "../lib/api";
import { scheduledCleaningPrice } from "../lib/cleaningPricing";
import { GoogleRating } from "../components/sections";
import { PHONE_TEL } from "../lib/data";

// This is the ONE consumer sales landing page for split-system cleaning.
// One long-form cleaning landing page, using the existing secure checkout and live calendar.
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
  { q: "Is there a $50 call-out fee?", a: "No. There is no separate $50 call-out or inspection charge for the standard booked clean. If you choose to reserve with $50 online, that is a booking payment credited toward your displayed total, not an extra fee. Any non-standard work is discussed and quoted first." },
  { q: "What if the musty smell is still there after the clean?", a: "Contact us within seven days if the same cleaning-related musty smell remains or returns from the accessible parts we serviced. We will inspect and re-clean those affected areas once at no charge. If we still cannot resolve that cleaning-related odour, we'll refund the cleaning service charge, including your booking payment. Odours from leaks, building moisture, inaccessible contamination or other faults require separate diagnosis and are outside this cleaning guarantee. Australian Consumer Law rights always apply." },
  { q: "Do you use harsh chemicals or perfume to mask smells?", a: "We use suitable professional coil cleaners, including low-odour, biodegradable enzyme-and-detergent formulas where appropriate, to loosen grime and organic residue. We follow each product's label, protect your home and never treat chemical use as a substitute for physically removing dirt. The exact product and rinse method depend on your unit." },
  { q: "Is steam used on every part, and does it sterilise the aircon?", a: "We use controlled steam on suitable accessible components only, keeping it away from sensitive electrical parts and heat-sensitive materials. Steam can help loosen stubborn grime, but we do not claim that the whole system is sterile or that every mould spore or bacterium is eliminated." },
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
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideEmail, setGuideEmail] = useState("");
  const [guideConsent, setGuideConsent] = useState(false);
  const [guideStatus, setGuideStatus] = useState("idle");
  const [guideError, setGuideError] = useState("");
  const guideShown = useRef(false);
  useEffect(() => {
    if (stage !== 1 || guideShown.current) return undefined;
    const start = Date.now();
    let maxScroll = 0;
    let lastY = window.scrollY;
    const show = () => {
      if (guideShown.current || Date.now() - start < 20000 || document.visibilityState !== "visible") return;
      guideShown.current = true;
      try { sessionStorage.setItem("splitspro-cleaning-guide-shown", "1"); } catch {}
      setGuideOpen(true);
    };
    try { if (sessionStorage.getItem("splitspro-cleaning-guide-shown")) return undefined; } catch {}
    const onScroll = () => {
      const y = window.scrollY;
      const range = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      maxScroll = Math.max(maxScroll, y / range);
      if (maxScroll >= 0.6 && lastY - y > 50 && y / range < 0.3) show();
      lastY = y;
    };
    const onLeave = (event) => { if (event.clientY <= 0 && window.matchMedia("(hover: hover)").matches) show(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onLeave);
    return () => { window.removeEventListener("scroll", onScroll); document.removeEventListener("mouseout", onLeave); };
  }, [stage]);
  const submitGuide = async (event) => {
    event.preventDefault();
    setGuideStatus("saving"); setGuideError("");
    try {
      await api.post("/cleaning-guide-leads", { email: guideEmail, marketing_consent: guideConsent });
      setGuideStatus("success");
    } catch {
      setGuideStatus("idle");
      setGuideError("Couldn't save your email. Please try again.");
    }
  };
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

  const refreshSlots = async (requestedQuantity = quantity, preserveSelection = true) => {
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
      if (!preserveSelection || !next.some((slot) => slot.date === selectedDate && slot.time === selectedTime)) {
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
    refreshSlots(quantity, false);
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
        <title>Six-Step Hero Method | Split-System Deep Cleaning Sydney | SplitsPro</title>
        <meta name="description" content="SplitsPro Bare-Bones Hero Method: a six-step split-system deep clean for accessible indoor parts, drainage and the outdoor unit. $200 for one split and $120 for every additional split at the same property. Book for $50 credited to the total, or pay in full." />
        <link rel="canonical" href="https://splitspro.com.au/split-system-cleaning/" />
        <meta property="og:title" content="We Strip It Back — The SplitsPro Bare-Bones Hero Method" />
        <meta property="og:description" content="The six-step SplitsPro Hero Method: deep internal cleaning, careful steam and rinsing, drain cleaning and outdoor-unit care. $200 for the first split, $120 for each extra at the same property." />
      </Helmet>




      <div className="border-b border-[#D6E6EC] bg-white" data-testid="cleaning-no-callout-banner">
        <div className="sp-container flex flex-wrap items-center justify-between gap-3 py-3 text-xs font-black text-[#12425D]">
          <span>No $50 call-out fee · Clear price before booking · No pressure to upgrade</span>
          <a href="#cleaning-booking" className="underline underline-offset-4 text-[#007EA7]">See dates &amp; book online</a>
        </div>
      </div>

      {(
        <section id="cleaning-stage-1" className="scroll-mt-16 bg-[#FCFBF8] pt-0 pb-6 sm:py-10" data-testid="cleaning-diagnosis">
          <div className="sp-container mx-auto max-w-6xl">
            <div className="mt-0">
              <img src="/landing/splitspro-cleaning-baby-approved.png" alt="Baby at home — if it's not nailed down, it's food. What about the aircon they breathe around?" width={409} height={487} loading="eager" decoding="async" fetchPriority="high" className="-mx-4 block w-[calc(100%+2rem)] max-w-none h-auto object-contain sm:mx-auto sm:w-full sm:max-w-[680px] sm:rounded-xl" />
              <div className="mt-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#007EA7]">Sydney split-system deep cleaning · Complete indoor and outdoor care</p>
                <h1 className="font-serif text-[clamp(1.8rem,6vw,3.5rem)] leading-[1.1] tracking-tight text-[#0B2641]">You clean everything they touch. <span className="text-[#008DB8]">What about the aircon they breathe around?</span></h1>
                <p className="mt-3 max-w-2xl text-base font-semibold leading-relaxed text-[#3B5969]">You wouldn't let someone sneeze all over a freshly wiped benchtop. So why overlook the dust a neglected aircon could blow back around the room?</p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#526978]">A filter can look clean while dust, pet dander and grime build up deeper inside the coil and blower wheel. Damp areas can also develop biofilm, musty smells and sometimes mould. When the fan runs, some particles and odours may be carried into the room.</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2" aria-label="What can build up inside an air conditioner">
              {[
                ["Dust and pet dander", "Can settle beyond the filters on the coil and blower."],
                ["Moisture and slimy buildup", "Condensation in the drain tray can allow biofilm and unpleasant smells."],
                ["Mould in damp areas", "May develop where moisture and dirt remain, even out of sight."],
                ["Trapped grime", "Can restrict airflow and leave a stale or musty smell when the unit runs."]
              ].map(([title, description]) => <div key={title} className="border-l-[3px] border-[#008DB8] pl-3"><h2 className="text-sm font-black text-[#0B2641]">{title}</h2><p className="mt-1 text-sm leading-relaxed text-[#526978]">{description}</p></div>)}
            </div>
            <p className="mt-4 border-l-4 border-[#F4C620] pl-4 text-sm font-bold leading-relaxed text-[#244456]">
              The nasties aren't always on the filter. Some buildup hides deeper inside, where a quick wipe won't reach.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-[#637782]">
              That's why cleaning beyond the filter matters, especially in homes with children, pets or older loved ones.
            </p>
            <section className="mt-7 rounded-xl border border-[#D4E5ED] bg-white px-5 py-6 sm:px-8" aria-label="The concerns we answer">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#007EA7]">The questions people are afraid to ask</p>
              <h2 className="mt-2 text-2xl font-black uppercase leading-tight text-[#0B2641] sm:text-3xl">What if I pay someone and the aircon still smells?</h2>
              <p className="mt-3 max-w-4xl text-sm leading-relaxed text-[#405E6E] sm:text-base">You hear it in homeowner discussions: the cleaner only washed the filters; the fan still looks dirty; the musty smell comes back; the price changes after arrival; or dirty water ends up on the carpet. You shouldn't have to guess what you paid for.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {[
                  ["Did they clean inside?", "We explain what we can safely open, show the actual components cleaned and document the work."],
                  ["Will it smell again?", "Our written cleaning-related musty-odour guarantee provides a return visit and, if we cannot fix the cleaned-area odour, a refund."],
                  ["Will there be extra fees?", "No separate $50 call-out fee, no mystery diagnostic fee and no extra work without your approval."]
                ].map(([heading, detail]) => <div key={heading} className="border-l-4 border-[#F4C620] pl-4"><h3 className="text-sm font-black text-[#12384E]">{heading}</h3><p className="mt-1 text-sm leading-relaxed text-[#4E6674]">{detail}</p></div>)}
              </div>
            </section>
            <button type="button" onClick={() => goStage(2)}
              className="mt-6 flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-[#F4C620] px-5 py-4 text-base font-black uppercase text-[#082337] hover:bg-[#FBDD42] sm:w-auto sm:px-9"
              data-testid="cleaning-next-solution">
              Learn more <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </section>
      )}

      {(
        <section id="cleaning-stage-2" className="scroll-mt-16 bg-[#F0F9FC] py-6 sm:py-12" data-testid="cleaning-solution-trust">
          <div className="sp-container mx-auto max-w-6xl">
            <button type="button" onClick={() => goStage(1)} className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#176A88]">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div className="mb-7 rounded-xl bg-white px-5 py-7 shadow-sm sm:px-9 sm:py-9" data-testid="cleaning-caring-home-message">
              <p className="text-xs font-black uppercase tracking-[0.17em] text-[#007EA7]">For the people under your roof</p>
              <h2 className="mt-2 font-serif text-3xl leading-tight text-[#0B2641] sm:text-4xl">Good homes start with <span className="text-[#008DB8]">people who care.</span></h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#3F5B6D] sm:text-base">Even the air your loved ones breathe is worth thinking about.</p>
            </div>
            <div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.17em] text-[#007EA7]">The SplitsPro Hero Method</p>
                <h2 className="mt-2 font-serif text-3xl leading-[1.1] text-[#0B2641] sm:text-4xl">
                  We strip it back. <span className="text-[#008DB8]">Not just wipe over it.</span>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#3F5B6D] sm:text-base">Our six-step Bare-Bones Hero Method gets behind accessible covers, combines professional coil-compatible chemistry with targeted steam and appropriate rinsing, looks after the drain and outdoor unit, and finishes with careful reassembly and testing.</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4" data-testid="cleaning-real-process-gallery">
              {[
                {src:"/landing/splitspro-process-filter.png",alt:"Real job — covers and filters opened",label:""},
                {src:"/landing/splitspro-process-coil.png",alt:"Real job — indoor coil exposed",label:""},
                {src:"/landing/splitspro-process-covers.png",alt:"Real job — cleaned removable covers",label:""}
              ].map((photo) => (
                <figure key={photo.src}>
                  <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="h-24 w-full rounded-md object-cover sm:h-40" />
                  
                </figure>
              ))}
            </div>
            <section className="mt-7" id="hero-method" data-testid="cleaning-process-benefits">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#007EA7]">The SplitsPro Bare-Bones Deep Clean</p>
              <h3 className="mt-2 text-3xl font-black uppercase leading-tight text-[#0B2641] sm:text-4xl">OUR 6-STEP <span className="text-[#008DB8]">HERO METHOD.</span></h3>
              <p className="mt-3 text-base font-semibold leading-relaxed text-[#24485D]">We don't just wipe the cover and rinse the filters. We get into accessible components, tackle the build-up, look after the outdoor unit and test the result.</p>
              <p className="mt-3 text-sm leading-relaxed text-[#405E6E] sm:text-base">Our Bare-Bones Hero Method combines specialised coil-compatible cleaning solutions, enzyme-based detergents, carefully controlled steam and physical dirt removal — without disguising odours with perfume or spraying sensitive electrical parts.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  {number:"01",title:"The Bare-Bones Teardown",subtitle:"We strip it back, not just wipe over it.",description:"We protect the room and safely open the indoor head unit, removing suitable covers, filters and louvers. We reach the coil, blower wheel and drain pan, and remove the wheel and pan when the model permits safe removal. Hidden dust and grime are exposed instead of left behind the fascia."},
                  {number:"02",title:"Triple-Action Chemical Attack",subtitle:"Professional cleaners loosen what's stuck.",description:"Coil-compatible surfactants and enzyme-based detergents help break down oily dirt, sticky residues and organic film. Suitable labelled sanitising treatments may be used when appropriate for the surfaces and the job. We follow the chemical instructions and give the solution time to work."},
                  {number:"03",title:"The Thermal Flush & Steam Treatment",subtitle:"Loosen, lift and carefully flush.",description:"We use controlled steam on suitable accessible components to soften stubborn dirt, with gentle rinsing to physically wash away loosened debris where appropriate. Some enzyme cleaners are made to self-rinse with condensate, so those are used as directed rather than washed away prematurely. Wastewater is captured to protect the room."},
                  {number:"04",title:"Electronic Protection",subtitle:"We look after the brains of your aircon.",description:"We isolate power and keep indoor and outdoor printed circuit boards protected from cleaning water, steam and chemicals. We can check for visible signs of contamination, but any specialised PCB cleaning, fault repair or electrical work would be assessed and quoted separately — never sprayed as part of an ordinary deep clean."},
                  {number:"05",title:"Full Drainage & Outdoor Clean",subtitle:"Indoor drain and outdoor condenser included.",description:"We clean the accessible drain pan and drainage path to help remove sludge and reduce the risk of blockages and stale smells. Outside, we clear debris and gently clean accessible condenser surfaces with suitable water pressure, without crushing delicate fins. A clean coil can improve performance when dirt was the cause, but savings vary."},
                  {number:"06",title:"Reassembly, Testing & Proof",subtitle:"Rebuilt carefully. Checked before we go.",description:"We refit the removed parts, clean up, check operation and accessible drainage, and show you the completed work with photos where practical. We also check for cleaning-related musty smells, backed by our written seven-day odour guarantee."}
                ].map((step) => (
                  <article key={step.number} className="rounded-lg border border-[#C7E2EB] bg-white p-5 shadow-sm">
                    <span className="text-xs font-black tracking-[0.16em] text-[#008DB8]">STEP {step.number} OF 6</span>
                    <h4 className="mt-2 text-xl font-black uppercase text-[#0B2641]">{step.title}</h4>
                    <p className="mt-2 text-sm font-extrabold text-[#008DB8]">{step.subtitle}</p>
                    <p className="mt-3 text-sm leading-relaxed text-[#496374]">{step.description}</p>
                  </article>
                ))}
              </div>
              <p className="mt-4 border-l-4 border-[#F4C620] pl-4 text-xs leading-relaxed text-[#4B6575]">Access, disassembly, chemicals, steam and rinsing are selected for the model and condition of the unit. We do not claim completely sterile air, a fixed bacteria-kill percentage or guaranteed energy savings.</p>
            </section>
            <section className="mt-8 rounded-xl bg-[#08263E] p-6 text-white sm:p-9" data-testid="cleaning-odour-guarantee" id="cleaning-guarantee">
              <p className="text-xs font-black uppercase tracking-[0.17em] text-[#62D1EC]">Our cleaning promise</p>
              <h3 className="mt-2 text-3xl font-black uppercase leading-tight sm:text-4xl">Musty smell from the parts we clean? <span className="text-[#F4C620]">We'll make it right — or you don't pay.</span></h3>
              <p className="mt-4 text-sm leading-relaxed text-white/90 sm:text-base">If the same musty odour caused by build-up in the accessible components we've cleaned remains after the service, or returns within seven days, tell us within seven days. We'll inspect those areas and re-clean the affected accessible parts once at no extra charge. If we cannot resolve a cleaning-related odour from those serviced areas, we'll refund the cleaning service charge, including any $50 booking payment.</p>
              <p className="mt-3 text-xs leading-relaxed text-white/70">This covers cleaning of accessible split-system parts, not odours caused by other building areas, ongoing leaks, inaccessible contamination, refrigerant or electrical faults, or new moisture problems outside our cleaning scope. We explain any such issue before extra work. This promise is in addition to your rights under Australian Consumer Law.</p>
            </section>
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
            <p className="mt-4 text-xs leading-relaxed text-[#607889]">Cleaning steps depend on the unit's design and product compatibility. We explain any access limits and protect your room and electronics during the service.</p>
            <button type="button" onClick={() => goStage(3)}
              className="mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-[#F4C620] px-5 py-4 text-base font-black uppercase text-[#082337] hover:bg-[#FBDD42] sm:w-auto sm:px-9"
              data-testid="cleaning-next-offer">
              View the clear price &amp; book <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </section>
      )}

      {(
        <>
          <section id="cleaning-stage-3" className="scroll-mt-16 bg-[#FFF7E8] py-8 sm:py-14" data-testid="cleaning-offer">
            <div className="sp-container mx-auto max-w-6xl">
              <button type="button" onClick={() => goStage(2)} className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#176A88]">
                <ArrowLeft className="h-4 w-4" /> Back to how we clean
              </button>
              <div className="grid items-center gap-5 sm:grid-cols-[1fr_0.45fr]">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.17em] text-[#007EA7]">Now, here's the offer</p>
                  <h2 className="mt-2 max-w-3xl font-black uppercase text-3xl leading-tight text-[#0B2641] sm:text-5xl">
                    The complete six-step Hero Method. One straightforward price.
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4F6575] sm:text-base">
                    The six-step Hero Method includes suitable deep indoor cleaning, drain care, outdoor unit cleaning and final checks. Choose your systems and date below.
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-6 rounded-xl bg-[#08263E] p-5 text-white sm:grid-cols-[1fr_1fr] sm:p-8" id="cleaning-prices" data-testid="cleaning-prices">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#4BD0F0]">Complete split-system deep clean</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/85">One complete six-step Hero Method service, including accessible indoor cleaning, drainage and outdoor care, with our cleaning-related musty-odour guarantee. No $50 call-out fee or surprise extras for a standard accessible split.</p>
                  <p className="mt-3 text-xs text-white/60">Standard accessible wall-mounted systems, same property and visit. Non-standard work is always quoted before you approve it. Your $50 online booking payment counts towards the service price; it is not a call-out fee.</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#F4C620]">First split system</p>
                  <strong className="mt-1 block text-6xl font-black leading-none text-white sm:text-7xl">{money(firstPrice)}</strong>
                  <p className="mt-2 text-2xl font-black uppercase text-[#F4C620]">+ $120 each extra system</p>
                  <p className="mt-2 text-sm font-bold text-white/85">2 systems {money(cleaningPrice(2, firstPrice))} · 3 systems {money(cleaningPrice(3, firstPrice))}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/75">Choose what suits you at checkout: pay $50 to book and the remaining $150 after cleaning, or pay the full $200 now by card or an eligible Afterpay / Pay in 4 option. Pay-later availability and approval depend on the provider. Want Afterpay for the $150 balance on the day? Ask us ahead of your visit so we can confirm availability.</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-[#244456]" data-testid="cleaning-offer-reassurance"><GoogleRating /><span>✓ Licensed & insured technicians</span><span>✓ Secure $50 booking · balance after cleaning</span></div>
              <div className="mt-5" data-testid="cleaning-before-booking-cta-pay-later-reminder">
                <PayLaterReminder kind="cleaning" compact stripeReady={paymentReadiness.stripe_ready} paypalReady={paymentReadiness.paypal_ready} />
              </div>
              <button type="button" onClick={scrollBook}
                className="mt-4 flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-[#F4C620] px-5 py-4 text-base font-black uppercase text-[#082337] hover:bg-[#FBDD42] sm:w-auto sm:px-10">
                Choose systems &amp; date <ArrowRight className="h-5 w-5" />
              </button>
              <p className="mt-3 text-xs text-[#506979]">We tackle dirt and cleaning-related odours, but no cleaning can guarantee sterile air, prevent all future mould or repair mechanical faults.</p>
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
      {guideOpen && stage === 1 && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/55 p-3 sm:items-center" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setGuideOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="cleaning-guide-title" className="relative w-full max-w-md rounded-xl bg-white p-6 text-[#142E43] shadow-xl">
            <button type="button" aria-label="Close free guide offer" onClick={() => setGuideOpen(false)} className="absolute right-3 top-2 p-2 text-xl">×</button>
            <p className="text-xs font-black uppercase tracking-widest text-[#008DB8]">Something useful for your home</p>
            <h2 id="cleaning-guide-title" className="mt-2 text-2xl font-black">5 places dust, mould and grime hide at home</h2>
            {guideStatus === "success" ? (
              <div className="mt-4 text-sm leading-relaxed">
                <p className="font-bold">Here's your quick home-care guide:</p>
                <ol className="mt-2 list-decimal space-y-2 pl-5">
                  <li>Aircon filters and accessible vents: check and clean as the manufacturer recommends.</li>
                  <li>Bathroom grout and exhaust fans: remove buildup and improve ventilation.</li>
                  <li>Window tracks: vacuum dust and wipe away trapped moisture.</li>
                  <li>Kitchen rangehood filters: degrease regularly.</li>
                  <li>Under sinks and behind furniture: check for leaks and dampness.</li>
                </ol>
                <p className="mt-3">If mould keeps returning, address the moisture source rather than just wiping the surface.</p>
                <button type="button" onClick={() => setGuideOpen(false)} className="mt-4 rounded bg-[#F4C620] px-5 py-3 font-bold">Back to the page</button>
              </div>
            ) : (
              <form onSubmit={submitGuide} className="mt-4 space-y-3">
                <p className="text-sm">Leave your email to unlock a handy five-point home-care guide. No booking required.</p>
                <label className="block text-sm font-bold">Email address<input type="email" required autoComplete="email" value={guideEmail} onChange={(e) => setGuideEmail(e.target.value)} className="mt-1 w-full rounded border p-3" placeholder="you@example.com" /></label>
                <label className="flex items-start gap-2 text-xs"><input type="checkbox" checked={guideConsent} onChange={(e) => setGuideConsent(e.target.checked)} className="mt-0.5" />Optional: I agree to receive occasional SplitsPro cleaning tips and offers by email. I can unsubscribe at any time.</label>
                {guideError && <p role="alert" className="text-sm text-red-700">{guideError}</p>}
                <button type="submit" disabled={guideStatus === "saving"} className="w-full rounded bg-[#F4C620] p-3 font-black disabled:opacity-50">{guideStatus === "saving" ? "Please wait…" : "Get the free guide"}</button>
                <button type="button" onClick={() => setGuideOpen(false)} className="w-full p-2 text-sm underline">No thanks</button>
              </form>
            )}
          </div>
        </div>
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
