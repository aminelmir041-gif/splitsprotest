import PayLaterReminder from "../components/PayLaterReminder";

import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Clock3, Droplets, Loader2, ShieldCheck, Sun, Wind } from "lucide-react";
import { getCleaningSlots } from "../lib/api";
import { GoogleRating } from "../components/sections";
import { PHONE_TEL } from "../lib/data";

// This is the ONE consumer sales landing page for split-system cleaning.
// No separate cleaning funnel; the old /split-system-cleaning-offer/ URL redirects here.
const CLEANING_QUANTITIES = Array.from({ length: 7 }, (_, index) => index + 1);
const cleaningPrice = (count) => 300 + Math.max(0, count - 1) * 150;
const money = (value) => new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(value);

const FAQS = [
  { q: "Is a deep clean different to washing the filters?", a: "Yes. A filter wash is only one part. Our deep clean also targets accessible internal coil, blower wheel, drain tray and airflow path surfaces. The exact method depends on the unit and its condition." },
  { q: "How much do additional air conditioners cost?", a: "The first complete deep clean is $300. Every additional standard split system is $150 when cleaned at the same address and on the same visit. Two systems cost $450, three cost $600. Your total is shown before you choose a secure payment method. Eligible pay-later options may be available." },
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
  // Scroll guide visitors directly to this page's EXISTING live date picker.
  // Route fade-in and the global ScrollToTop run before this delayed scroll.
  useEffect(() => {
    if (location.hash !== "#cleaning-booking") return undefined;
    const timeout = window.setTimeout(() => {
      document.getElementById("cleaning-booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 650);
    return () => window.clearTimeout(timeout);
  }, [location.hash]);
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState(0);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotsError, setSlotsError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showMoreSlots, setShowMoreSlots] = useState(false);
  const [continuing, setContinuing] = useState(false);
  const requestId = useRef(0);
  const scrollBook = () => document.getElementById("cleaning-booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      if (selectedDate && selectedTime &&
          !next.some((slot) => slot.date === selectedDate && slot.time === selectedTime)) {
        setSelectedDate("");
        setSelectedTime("");
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

  const formatDate = (day) => new Date(day + "T00:00:00").toLocaleDateString(
    "en-AU", { weekday: "short", day: "numeric", month: "short" });
  const formatTime = (time) => new Date("2026-01-01T" + time + ":00").toLocaleTimeString(
    "en-AU", { hour: "numeric", minute: "2-digit" });
  const availableDays = [...new Set(slots.map((slot) => slot.date))];
  const availableTimes = slots.filter((slot) => slot.date === selectedDate);
  const continueBooking = async () => {
    if (!selectedDate || !selectedTime || continuing) return;
    setContinuing(true);
    try {
      const data = await getCleaningSlots(quantity, 100);
      const fresh = Array.isArray(data?.slots) ? data.slots : [];
      if (!fresh.some((slot) => slot.date === selectedDate && slot.time === selectedTime)) {
        setSelectedDate("");
        setSelectedTime("");
        setSlots(fresh);
        setSlotsError("That time has just booked out. Choose another opening.");
        return;
      }
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
        <title>Split System Deep Clean + Anti-Mould & Anti-Corrosion | $300 | SplitsPro Sydney</title>
        <meta name="description" content="SplitsPro complete split-system deep cleaning: $300 first system, $150 for each extra system at the same address, fully prepaid online. Protective treatments where suitable." />
        <link rel="canonical" href="https://splitspro.com.au/split-system-cleaning/" />
        <meta property="og:title" content="You Clean Everything They Touch. What About Your Aircon? | SplitsPro" />
        <meta property="og:description" content="Deep clean and suitable protective treatments. $300 first system, each extra split system $150 at the same property. Choose a live 90-minute start time." />
      </Helmet>



      {/* Keep the approved desktop artwork. On mobile display only the right-hand
          family and aircon photograph to avoid repeating/cropping the headline
          already rendered as accessible HTML above it. */}
      <section className="w-full overflow-hidden bg-[#FCFBF8]" data-testid="cleaning-hero"
        style={{ paddingTop: "max(52px, calc(var(--sp-site-header-height, 104px) - 36px))" }}>
        <div className="sp-container pb-5 pt-7 md:hidden">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] leading-relaxed text-[#9B753E]">For mums, dads, pet owners and older loved ones</p>
          <h1 className="mt-3 max-w-xl font-serif text-[clamp(2rem,8.5vw,3rem)] leading-[1.1] tracking-tight text-[#0B0B0B]">
            You clean everything they touch. <span className="text-[#805F2F]">What about the aircon they breathe around?</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#555D63]">The floors sparkle. The benches shine. But one of the hardest-working things in the house can still be hiding grime where you can't see it.</p>
        </div>
        <div className="relative w-full overflow-hidden md:hidden" style={{ aspectRatio: "936 / 1024" }}>
          <img
            src="/landing/splitspro-cleaning-family-hero.webp"
            alt="Family with a young child, dog and older loved one beneath an air conditioner with visible hidden grime"
            width={1536} height={1024} loading="eager" decoding="async" fetchPriority="high" data-no-fallback="true"
            style={{ position: "absolute", top: 0, left: "-64.1026%", height: "100%", width: "164.1026%", maxWidth: "none" }}
          />
        </div>
        <img
          src="/landing/splitspro-cleaning-family-hero.webp"
          alt="You clean everything they touch — what about the aircon they breathe around? A family with a dog and an elderly relative next to a dirty split-system aircon."
          width={1536} height={1024} loading="eager" decoding="async" data-no-fallback="true"
          className="hidden h-auto w-full md:block"
        />
      </section>

      <section className="bg-[#EAF7FC] py-10 sm:py-14" data-testid="cleaning-guardian-story"><div className="sp-container grid items-center gap-7 md:grid-cols-2"><img src="/landing/splitspro-guardian-petri-approved.png" alt="The outside looks spotless, but what about behind the cover? Illustrative petri dishes comparing microbial growth in samples." width={516} height={387} loading="lazy" decoding="async" className="h-auto w-full rounded-xl object-contain"/><div><p className="text-xs font-black uppercase tracking-[0.16em] text-[#147BA6]">Care you can see. Care you can't.</p><h2 className="mt-3 font-serif text-3xl leading-tight text-[#102C43] sm:text-4xl">The baby's toys. Grandpa's favourite chair. And the aircon quietly working above it all.</h2><p className="mt-4 text-base leading-relaxed text-[#53616B]">A cared-for home is built from small everyday habits. We help you look after one easy-to-miss part of it — without scare tactics or dramatic promises.</p></div></div></section>

      <section className="bg-white py-12 sm:py-20" data-testid="cleaning-benefits">
        <div className="sp-container">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#007FA4]">THE PART OF YOUR HOME YOU DON'T SEE</p>
          <h2 className="mt-3 max-w-4xl font-serif text-4xl leading-[1.12] tracking-tight text-[#102A41] sm:text-5xl">
            You clean the surfaces. What about behind the aircon cover?
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#485E6C] sm:text-lg">
            The benches get wiped. Toys get washed. But dust, damp grime and sometimes mould can collect behind an aircon's clean-looking front panel. Washing its filters doesn't always reach those hidden areas.
          </p>

          <div className="mt-8 border-y-2 border-[#DCE7EC] py-7 sm:mt-10 sm:py-9" data-testid="cleaning-benchtop-airflow-punchline">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#007FA4]">HERE'S SOMETHING TO THINK ABOUT</p>
            <h3 className="mt-3 max-w-5xl text-[clamp(1.8rem,4.2vw,3.5rem)] font-black uppercase leading-[1.07] tracking-tight text-[#082743]">
              YOU WOULDN'T LET SOMEONE <span className="bg-[#F4C620] px-1 text-[#081F34]">SNEEZE ALL OVER YOUR BENCHTOP</span> JUST AFTER YOU'VE WIPED IT DOWN.
            </h3>
            <p className="mt-4 max-w-4xl text-base font-bold leading-relaxed text-[#173C54] sm:text-xl">
              So why overlook what a dirty aircon could blow around the room — including onto surfaces you've just cleaned?
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#52616C]">
              If buildup is present, circulating airflow can carry some particles into the room. It isn't the same as a sneeze, and not every aircon has mould — but it's a good reason to clean beyond the filters.
            </p>
          </div>

          <div className="mt-9 grid items-center gap-7 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] sm:mt-11">
            <img src="/landing/splitspro-cleaning-baby-approved.png"
              alt="Baby holding a teething toy in a family home — reminder to care for the aircon as well as frequently touched surfaces"
              width={409} height={487} loading="lazy" decoding="async"
              className="mx-auto h-auto max-h-[460px] w-full max-w-sm rounded-lg object-contain md:max-w-none" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#007FA4]">WHY FAMILIES NOTICE THE DIFFERENCE</p>
              <h3 className="mt-3 font-serif text-3xl leading-tight text-[#122B40] sm:text-4xl">It's more than a bit of dust on a filter.</h3>
              <div className="mt-5 divide-y divide-[#DFE8EC] border-t border-b border-[#DFE8EC]">
                <div className="py-4">
                  <h4 className="text-lg font-black text-[#153249]">Kids and the everyday mess</h4>
                  <p className="mt-1 text-sm leading-relaxed text-[#4B6170]">You already look after the floors and toys. Hidden buildup inside the unit deserves that same attention.</p>
                </div>
                <div className="py-4">
                  <h4 className="text-lg font-black text-[#153249]">Pets and older loved ones</h4>
                  <p className="mt-1 text-sm leading-relaxed text-[#4B6170]">Pet hair, household dust and musty smells make a comfortable room harder to enjoy.</p>
                </div>
                <div className="py-4">
                  <h4 className="text-lg font-black text-[#153249]">The aircon itself</h4>
                  <p className="mt-1 text-sm leading-relaxed text-[#4B6170]">Grime in the blower, coil or drain can affect airflow, efficiency or drainage. Cleaning may help when dirt is the cause.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-7 max-w-4xl text-xs leading-relaxed text-[#667781]">
            Cleaning does not guarantee sterile air, prevent illness or replace mould-remediation and moisture control.
          </div>
        </div>
      </section>

      {/* The offer stays below the complete solution and company-proof story. */}
      <section className="bg-[#081C2B] py-16 text-white sm:py-24" id="cleaning-solution" data-testid="cleaning-solution">
        <div className="sp-container">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#40C9EE]">THE SPLITSPRO SOLUTION</p>
          <h2 className="mt-5 max-w-5xl text-4xl font-black uppercase leading-[1.03] tracking-tight sm:text-5xl xl:text-6xl">
            A FILTER WASH IS A START.
            <span className="mt-2 block text-[#45C6E7]">WE GO DEEPER.</span>
          </h2>
          <p className="mt-6 max-w-4xl text-base leading-relaxed text-[#D5E6EF] sm:text-lg">
            Anyone can pull out a filter and give it a rinse. We take the time to open the unit, get the covers and accessible drain pan out of the way, and reach the grime a filter wash leaves behind. Here's what that actually looks like.
          </p>

          <div className="mt-10 grid gap-9 md:grid-cols-3" data-testid="cleaning-real-process-gallery">
            <figure className="min-w-0">
              <div className="relative overflow-hidden rounded-lg bg-[#E9F5FB]">
                <img
                  src="/landing/splitspro-process-filter.png"
                  alt="Real SplitsPro cleaning photo showing the split system opened for filter and cover removal"
                  width={387} height={515} loading="lazy" decoding="async"
                  className="aspect-[4/5] w-full object-cover"
                />
                <span className="absolute left-4 top-4 bg-[#F4C620] px-3 py-2 text-xs font-black uppercase tracking-wide text-[#081C2B]">01 · OPEN IT UP</span>
              </div>
              <figcaption className="mt-5">
                <h3 className="text-2xl font-extrabold uppercase leading-tight text-white">More than the filters.</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#CBDFE9] sm:text-base">
                  We open the indoor unit, remove the washable filters and carefully strip back the cover. We also remove the drain pan where the model allows, exposing areas you'd never reach during ordinary household cleaning.
                </p>
              </figcaption>
            </figure>

            <figure className="min-w-0">
              <div className="relative overflow-hidden rounded-lg bg-[#E9F5FB]">
                <img
                  src="/landing/splitspro-process-coil.png"
                  alt="Real SplitsPro job photograph showing the indoor cooling coil and internal components exposed after cover removal"
                  width={387} height={516} loading="lazy" decoding="async"
                  className="aspect-[4/5] w-full object-cover"
                />
                <span className="absolute left-4 top-4 bg-[#F4C620] px-3 py-2 text-xs font-black uppercase tracking-wide text-[#081C2B]">02 · REACH THE HIDDEN PARTS</span>
              </div>
              <figcaption className="mt-5">
                <h3 className="text-2xl font-extrabold uppercase leading-tight text-white">Right into the inside.</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#CBDFE9] sm:text-base">
                  We clean accessible cooling-coil surfaces, behind the coil wherever access safely allows, the fan barrel, airflow path and drain areas. That's where dust and grime can build up behind a perfectly ordinary-looking white cover.
                </p>
              </figcaption>
            </figure>

            <figure className="min-w-0">
              <div className="relative overflow-hidden rounded-lg bg-[#E9F5FB]">
                <img
                  src="/landing/splitspro-process-covers.png"
                  alt="Removed white split-system cover and trim presented neatly on blue professional microfiber towels after cleaning"
                  width={400} height={499} loading="lazy" decoding="async"
                  className="aspect-[4/5] w-full object-cover"
                />
                <span className="absolute left-4 top-4 bg-[#F4C620] px-3 py-2 text-xs font-black uppercase tracking-wide text-[#081C2B]">03 · WASH WHAT WE REMOVE</span>
              </div>
              <figcaption className="mt-5">
                <h3 className="text-2xl font-extrabold uppercase leading-tight text-white">The covers get cleaned too.</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#CBDFE9] sm:text-base">
                  Front covers, filters, accessible drain-pan surfaces and removable parts get their own attention — including the backs and awkward corners. We protect the surrounding work area and handle the parts with care.
                </p>
              </figcaption>
            </figure>
          </div>

          <div className="mt-12 flex flex-col gap-5 border-t border-white/20 pt-8 sm:flex-row sm:items-start sm:gap-8" data-testid="cleaning-protective-finish">
            <span className="w-fit shrink-0 bg-[#F4C620] px-4 py-3 text-2xl font-black text-[#081C2B]">04</span>
            <div className="max-w-4xl">
              <h3 className="text-2xl font-extrabold uppercase leading-tight text-white sm:text-3xl">Protect it. Put it back. Check it.</h3>
              <p className="mt-3 text-base leading-relaxed text-[#CBDFE9]">
                Once the parts are clean, we apply compatible anti-mould and anti-corrosion protective products where suitable. Depending on the unit and agreed scope, that can include approved indoor and outdoor surfaces and appropriate PCB-area protection. We then reassemble the unit and check it operates correctly.
              </p>
            </div>
          </div>

          <p className="mt-9 max-w-5xl border-l-[3px] border-[#F4C620] pl-5 text-base font-extrabold uppercase leading-relaxed text-white sm:text-lg">
            FILTERS OUT. COVERS OFF. DRAIN PAN ACCESSED. COIL, FAN AND HIDDEN AREAS CLEANED. PROTECTION APPLIED WHERE SUITABLE. THEN IT ALL GOES BACK TOGETHER.
          </p>
          <p className="mt-5 max-w-4xl text-xs leading-relaxed text-[#AFC8D5]">
            Access and dismantling depend on the unit design. Protective treatments are used only where compatible with the product instructions and agreed service scope.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24" id="cleaning-trust" data-testid="cleaning-trust">
        <div className="sp-container">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#008DB8]">WHY HOMEOWNERS CHOOSE SPLITSPRO</p>
          <h2 className="mt-4 max-w-5xl text-[clamp(2.5rem,5.2vw,4.7rem)] font-black uppercase leading-[1.02] tracking-tight text-[#0B2641]">
            YOU'RE TRUSTING US WITH YOUR HOME.
            <span className="mt-2 block text-[#008DB8]">WE TAKE THAT SERIOUSLY.</span>
          </h2>
          <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-[#39566A] sm:text-xl">
            A proper deep clean isn't just about getting dirt out. It's knowing the person doing the job cares about your home, understands the equipment and shows you what they've done.
          </p>
          <div className="mt-11 grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
            <div className="border-t-[5px] border-[#F4C620] pt-6">
              <p className="text-sm font-black uppercase tracking-widest text-[#007FA4]">DON'T JUST TAKE OUR WORD FOR IT</p>
              <h3 className="mt-4 text-3xl font-black uppercase leading-tight text-[#0B2641] sm:text-4xl">REAL REVIEWS.<span className="block text-[#008DB8]">REAL LOCAL WORK.</span></h3>
              <div className="mt-6"><GoogleRating /></div>
              <p className="mt-5 text-base font-medium leading-relaxed text-[#475F6F]">
                See customer feedback for SplitsPro's air-conditioning work. We prefer genuine reviews and actual job photos over promises you can't check.
              </p>
              <Link to="/reviews" className="mt-6 inline-flex min-h-12 items-center gap-2 border-b-[3px] border-[#F4C620] text-base font-black uppercase text-[#085E7E]">
                READ CUSTOMER REVIEWS <ArrowUpRight className="h-5 w-5"/>
              </Link>
            </div>
            <div className="border-t-[5px] border-[#36BCE4] pt-6">
              <p className="text-sm font-black uppercase tracking-widest text-[#007FA4]">THE STANDARDS YOU SHOULD EXPECT</p>

              <div className="mt-5 divide-y-2 divide-[#E3EAF0]">
                {[
                  {title:"WE STRIP IT BACK. NOT JUST WIPE IT OVER.",body:"Our real work photos show the exposed coil and the removable covers and drain parts that get their own clean."},
                  {title:"WE LOOK AFTER YOUR HOME.",body:"We protect the work area, take care around furniture and walls, and tidy up when we're finished."},
                  {title:"WE EXPLAIN THE JOB BEFORE WE START.",body:"Extra work is quoted first. Once the cleaning is done, we reassemble your unit and check operation."}
                ].map((item) => (
                  <div className="py-5" key={item.title}>
                    <h3 className="flex items-start gap-3 text-xl font-black uppercase leading-tight text-[#0B2641] sm:text-2xl">
                      <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-[#009AC6]" aria-hidden="true"/>
                      <span>{item.title}</span>
                    </h3>
                    <p className="mt-2 pl-9 text-sm leading-relaxed text-[#425D6D] sm:text-base">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 border-y-[5px] border-[#008DB8] bg-[#F0F9FC] px-5 py-8 sm:px-9 sm:py-10" data-testid="cleaning-certificate-trust">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
              <div className="max-w-3xl">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#007EA7]">PROOF OF THE JOB — INCLUDED WITH YOUR CLEAN</p>
                <h3 className="mt-3 text-3xl font-black uppercase leading-[1.07] tracking-tight text-[#0B2641] sm:text-4xl">
                  DON'T JUST TAKE OUR WORD FOR IT.
                  <span className="mt-2 block text-[#008DB8]">TAKE HOME THE PROOF.</span>
                </h3>
                <p className="mt-5 text-base font-medium leading-relaxed text-[#3B596B] sm:text-lg">
                  After your service, we'll provide a SplitsPro Cleaning Completion Certificate showing which parts of your actual aircon were cleaned, which protective treatments were applied and before-and-after job photos. So you can see the work for yourself — no guesswork, no vague promises.
                </p>
              </div>
              <div className="min-w-0 border-l-[4px] border-[#F4C620] pl-5 lg:w-[19rem] lg:shrink-0">
                <p className="text-base font-black uppercase tracking-wide text-[#0B2641]">YOUR CERTIFICATE RECORDS</p>
                <div className="mt-4 space-y-3">
                  {[
                    "Your service date and system details",
                    "An itemised checklist of areas actually cleaned",
                    "Anti-mould and anti-corrosion treatments applied",
                    "Before-and-after photos from your service"
                  ].map((item) => (
                    <p key={item} className="flex items-start gap-3 text-sm font-bold leading-relaxed text-[#244254]">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#008DB8]" aria-hidden="true" />{item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-[#637680]">
              The certificate records work completed on your unit, not a warranty against future mould, corrosion or refrigerant leaks. Photos and treatment entries reflect what was accessible and actually carried out.
            </p>
          </div>
          <p className="mt-10 max-w-5xl border-l-[5px] border-[#F4C620] pl-5 text-base font-semibold leading-relaxed text-[#233C4D]">
            A thorough, honest cleaning process — not an unrealistic promise to make the entire house sterile or guarantee a health outcome.
          </p>
        </div>
      </section>

      <section className="bg-[#F1F9FC] py-16 sm:py-24" id="cleaning-prices" data-testid="cleaning-prices">
        <div className="sp-container">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#007EA7]">NOW, HERE'S THE DEAL</p>
          <h2 className="mt-4 max-w-5xl text-4xl font-black uppercase leading-[1.04] tracking-tight text-[#0B2641] sm:text-5xl">
            NOT ALL DEEP CLEANS ARE CREATED EQUAL.
            <span className="mt-2 block text-[#008DB8]">THE DIFFERENCE IS WHAT HAPPENS AFTER THE CLEAN.</span>
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#50616D] sm:text-lg">
            Some cleaners wash away the grime, pack up and call it a day. We go further. After cleaning those hard-to-reach indoor components, we apply compatible anti-mould treatment where suitable, and anti-corrosion protection to suitable outdoor components. Then we reassemble and check the system.
          </p>
          <div className="mt-8 border-y-[6px] border-[#F4C620] bg-[#08263E] px-5 py-8 text-white sm:px-10 sm:py-11" data-testid="cleaning-300-complete-offer">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#50D3F3]">THE COMPLETE SPLITSPRO CLEAN</p>
            <div className="mt-4 grid items-start gap-7 lg:grid-cols-[1.04fr_0.96fr] lg:gap-12">
              <div>
                <h3 className="max-w-xl text-3xl font-black uppercase leading-[1.04] tracking-tight sm:text-4xl">
                  THE FULL DEEP CLEAN. <span className="text-[#F4C620]">NOT A FILTER RINSE.</span>
                </h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-[#D6E7EF]">
                  We strip back accessible covers and drain parts, clean hidden coil, blower and air-path surfaces, then apply compatible anti-mould and anti-corrosion treatments on suitable indoor and outdoor surfaces.
                </p>
                <p className="mt-4 border-l-[3px] border-[#45C6E7] pl-4 text-sm font-extrabold leading-relaxed text-white">
                  Includes a cleaning certificate listing the work done, plus photos from your service.
                </p>
              </div>
              <div className="border-t border-white/25 pt-5 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#F4C620]">FIRST SPLIT SYSTEM</p>
                <strong className="mt-1 block text-[clamp(5.2rem,15vw,8rem)] font-black leading-[1] tracking-tighter text-white">$300</strong>
                <p className="mt-3 text-[clamp(1.55rem,4vw,2.45rem)] font-black uppercase leading-tight text-[#F4C620]">
                  + $150 EACH EXTRA SYSTEM
                </p>
                <p className="mt-2 text-sm font-bold leading-relaxed text-[#D2E6F0]">Same property. Same visit. Same complete clean.</p>
                <p className="mt-4 border-t border-white/20 pt-4 text-sm font-extrabold text-white sm:text-base">
                  2 systems <span className="text-[#F4C620]">$450</span> <span className="mx-2 text-white/45">|</span> 3 systems <span className="text-[#F4C620]">$600</span>
                </p>
              </div>
            </div>
            <div className="mt-7 border-t border-white/20 pt-5" data-testid="cleaning-booking-invitation">
              <div className="mb-4" data-testid="cleaning-before-booking-cta-pay-later-reminder">
                <PayLaterReminder kind="cleaning" compact theme="dark" stripeReady={paymentReadiness.stripe_ready} paypalReady={paymentReadiness.paypal_ready} />
              </div>
              <button type="button" onClick={() => choose(1)}
                className="flex min-h-14 w-full max-w-lg items-center justify-center gap-3 rounded-md bg-[#F4C620] px-5 py-4 text-base font-black uppercase text-[#081D2F] hover:bg-[#FBDD42] sm:text-lg">
                Choose systems &amp; booking time <ArrowRight className="h-5 w-5" />
              </button>
              <p className="mt-3 text-sm text-white/70">See available times and your exact total before paying. No separate deposit.</p>
            </div>
          </div>

          <div className="mt-7 border-y border-[#C7DDE7] py-6" data-testid="cleaning-deal-sweetener">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-[#007EA7]">WHAT YOUR COMPLETE CLEAN INCLUDES</p>
            <div className="mt-4 grid gap-x-7 gap-y-3 sm:grid-cols-2">
              {[
                "Indoor coil, fan and drainage cleaning where accessible",
                "Anti-mould protective treatment on compatible surfaces",
                "Outdoor anti-corrosion treatment where compatible and in scope",
                "Reassembly, operation check, certificate and job photos"
              ].map((value) => (
                <p key={value} className="flex items-start gap-2 text-sm font-bold leading-relaxed text-[#153249] sm:text-base">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#007FA4]" aria-hidden="true"/>{value}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-5 border-b border-[#C7DDE7] pb-5" data-testid="cleaning-competitor-prices">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#426173]">WHY THIS IS GOOD VALUE</p>
            <p className="mt-2 text-sm leading-relaxed text-[#456173]">
              For context, separately advertised services include a deep clean from <strong>$385</strong> (A Grade Air Con) and coastal anti-corrosion treatment up to <strong>$250+</strong> (Denali Air).
              These are different providers, scopes and inclusions — not one combined competitor quote or a like-for-like comparison.
            </p>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-[#566D7B]">
            Standard-access wall-mounted splits only. Additional-system pricing applies at one address during one visit. Protective products are only applied where suitable and compatible; they do not repair existing damage or leaks. Any additional work is quoted first.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#566D7B]">
            The complete cleaning price is paid to SplitsPro upfront using an available secure checkout. PayPal Pay in 4 may be available to eligible customers; Afterpay, Klarna and Zip require a connected Stripe checkout. Any instalment arrangement is between you and the payment provider.
          </p>
        </div>
      </section>

      <section className="scroll-mt-24 bg-[#081726] py-16 text-white sm:py-20" id="cleaning-booking" data-testid="cleaning-booking">
        <div className="sp-container mx-auto max-w-5xl">
          <p className="text-xs font-black uppercase tracking-[0.17em] text-[#F4C620]">CHOOSE YOUR COMPLETE CLEAN</p>
          <h2 className="mt-4 text-4xl font-black uppercase leading-tight sm:text-5xl">
            PICK THE SYSTEMS. <span className="text-[#45C6E7]">PICK THE TIME.</span>
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/75">
            One simple dropdown, live 90-minute appointment times and a secure full-payment checkout. Booked installation and cleaning times are removed from these openings.
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
                <div className="flex justify-between gap-3 text-sm text-white/80"><span>First complete deep clean</span><strong>$300</strong></div>
                {quantity > 1 && <div className="mt-3 flex justify-between gap-3 text-sm text-white/80"><span>{quantity - 1} additional system{quantity > 2 ? "s" : ""} × $150</span><strong>{money((quantity - 1) * 150)}</strong></div>}
                <div className="mt-6 flex items-end justify-between gap-3 border-t border-white/20 pt-5">
                  <span className="text-sm font-black uppercase tracking-[0.12em] text-[#F4C620]">Total</span>
                  <strong className="text-4xl font-black text-[#F4C620]">{money(cleaningPrice(quantity))}</strong>
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
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {(showMoreSlots ? availableDays : availableDays.slice(0, 6)).map((day) => (
                  <button type="button" key={day} aria-pressed={selectedDate === day}
                    onClick={() => { setSelectedDate(day); setSelectedTime(""); setSlotsError(""); }}
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
              <button type="button" onClick={continueBooking}
                disabled={!selectedDate || !selectedTime || continuing || slotsLoading || !!slotsError}
                className="mt-6 flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-[#F4C620] px-5 py-3 text-sm font-black uppercase tracking-wide text-[#071827] disabled:cursor-not-allowed disabled:opacity-40">
                {continuing ? "Rechecking your time..." : "Continue to details & full payment"} <ArrowRight className="h-5 w-5"/>
              </button>
              <p className="mt-3 text-xs leading-relaxed text-white/60">Your time is held when secure checkout begins. The booking is confirmed only once full payment is verified.</p>
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
