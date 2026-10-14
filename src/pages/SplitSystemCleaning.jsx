
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Clock3, Droplets, Loader2, ShieldCheck, Sun, Wind } from "lucide-react";
import { getBookingSlots } from "../lib/api";
import { GoogleRating } from "../components/sections";
import { PHONE_TEL } from "../lib/data";

// This is the ONE consumer sales landing page for split-system cleaning.
// No separate cleaning funnel; the old /split-system-cleaning-offer/ URL redirects here.
const CLEANING_OFFERS = [
  { id: "one", name: "1 Deep Clean", label: "One split system", price: "$220", description: "A deep clean of service-accessible indoor components — beyond a simple filter rinse." },
  { id: "two", name: "2 Deep Cleans", label: "Same property · $150 each", price: "$300", description: "Two wall-mounted split systems deep cleaned during one visit at the same property." }
];

const WHAT_WE_CLEAN = [
  { title: "Filters and indoor covers", copy: "Wash washable filters and service-accessible indoor surfaces, with surrounding areas protected." },
  { title: "Evaporator coil", copy: "Clean accessible coil surfaces where dust and grime can collect out of sight." },
  { title: "Blower wheel and airflow path", copy: "Clean the accessible fan barrel and airflow path to help remove buildup that can restrict circulation." },
  { title: "Drain tray and accessible drain", copy: "Clean accessible drain areas and check drainage where the system allows." },
  { title: "Suitable surface treatment", copy: "Where compatible with the unit and the product label, apply a protective coating intended to discourage mould-related buildup on approved surfaces." }
];
const FAQS = [
  { q: "Is a deep clean different to washing the filters?", a: "Yes. A filter wash is only one part. Our deep clean also targets accessible internal coil, blower wheel, drain tray and airflow path surfaces. The exact method depends on the unit and its condition." },
  { q: "Can I get 2 deep cleans for $300 at different properties?", a: "The $300 deal is for two standard wall-mounted split systems at the same property, during the same visit." },
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
        <meta name="description" content="You clean everything they touch. But what about the aircon they breathe around? SplitsPro deep cleaning for homes with children, pets and older loved ones. $220 for one, $300 for two at the same property." />
        <link rel="canonical" href="https://splitspro.com.au/split-system-cleaning/" />
        <meta property="og:title" content="You Clean Everything They Touch. What About Your Aircon? | SplitsPro" />
        <meta property="og:description" content="For mums, dads, pet owners and families with older loved ones: see what your aircon might be hiding. Deep clean $220, or two at the same property for $300." />
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
      <section className="bg-white py-14 sm:py-20" data-testid="cleaning-benefits">
        <div className="sp-container">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9B753E]">For mums, dads, pet owners and families caring for older loved ones</p>
          <h2 className="mt-3 max-w-4xl font-serif text-4xl leading-tight tracking-tight text-[#0B0B0B] sm:text-5xl">
            You look after everyone. Who's looking after the aircon?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#5E6267] sm:text-lg">
            Little hands grab everything. Babies explore the world by putting ordinary things in their mouths. You wipe the benches, wash the toys, mop the floor and keep an eye on what matters. And when an older loved one is enjoying a quiet afternoon, you want them comfortable too. Yet there is one hardworking appliance that is easy to overlook: the aircon. Its filter might look clean while the fan, coil and drain areas behind it collect dust and grime over time. That is not a reason to panic. It is simply one more part of your home worth caring for.
          </p>

          <div className="mt-9 border-y-2 border-[#DBE7EA] py-8 sm:py-10" data-testid="cleaning-benchtop-airflow-punchline">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#007DA5]">THE PART YOUR CLOTH CAN'T REACH</p>
            <h3 className="mt-3 max-w-5xl text-[clamp(1.75rem,4.8vw,3.8rem)] font-black uppercase leading-[1.06] tracking-tight text-[#082743]">
              YOU'VE JUST WIPED YOUR BENCHTOP SPOTLESS.{" "}
              <span className="bg-[#F4C620] px-1 text-[#081F34]">THEN YOU SWITCH ON YOUR DIRTY AIRCON.</span>
            </h3>
            <p className="mt-5 max-w-4xl text-lg font-bold leading-relaxed text-[#173C54] sm:text-xl">
              If dust or mould is building up inside, airflow can carry particles back into the room — including onto surfaces you've just cleaned.
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#52616C]">
              Not every dirty aircon contains mould, and cleaning does not make a home sterile. But the parts behind the cover deserve attention as much as the benchtop does.
            </p>
          </div>

          {/* Three editorial punchlines within the page's existing three-column benefits layout. */}
          <div className="mt-9 grid gap-6 border-y border-[#E7E3DD] py-7 md:grid-cols-3" data-testid="cleaning-three-punchlines">
            <article className="min-w-0">
              
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.16em] text-[#9B753E]">01 · The family-home test</p>
              <h3 className="mt-2 font-serif text-[1.65rem] leading-tight text-[#152535]">If it's within crawling distance, apparently it's lunch.</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5F6368]">From toddlers' toys to the dog's favourite spot on the rug, we put so much effort into clean surfaces. The aircon circulating air around the room deserves attention too.</p>
            </article>
            <article className="min-w-0">
              <img src="/landing/splitspro-cleaning-baby-approved.png" alt="Baby with a teething toy beside the SplitsPro reminder: if it is not nailed down, it is food. What about the aircon they breathe around?" width={409} height={487} loading="lazy" decoding="async" className="h-auto w-full rounded-md object-contain" />
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.16em] text-[#9B753E]">02 · Behind the white cover</p>
              <h3 className="mt-2 font-serif text-[1.65rem] leading-tight text-[#152535]">The outside looks spotless. But what about behind the cover?</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5F6368]">Wiping a surface doesn't remove dirt trapped inside your split system. When internal parts get damp, grime and sometimes mould can grow. Cleaning those accessible components can remove a potential source of contamination — without claiming every dusty aircon is making the family sick.</p>
            </article>
            <article className="min-w-0">
              
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.16em] text-[#9B753E]">03 · Time to go deeper</p>
              <h3 className="mt-2 font-serif text-[1.65rem] leading-tight text-[#152535]">Because a filter rinse can't reach everything.</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5F6368]">We carefully strip back accessible parts, wash away grime with specialist aircon cleaning products and, when suitable, apply a compatible protective coating. The aim is a cleaner unit, fewer musty smells and better airflow where dirt was the problem.</p>
            </article>
          </div>

          <p className="mt-3 text-[11px] text-[#6A7178]">Illustrative imagery, not a diagnosis of mould in your particular aircon. Ask us to show you what we find in yours.</p>

          <div className="mt-10 max-w-5xl" data-testid="cleaning-personal-impact">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9B753E]">It's about the everyday moments</p>
            <h3 className="mt-3 max-w-4xl font-serif text-3xl leading-tight text-[#0B0B0B] sm:text-4xl">Clean surfaces are only one part of a well-looked-after home.</h3>
            <div className="mt-7 grid gap-x-8 gap-y-6 md:grid-cols-2">
              <div className="border-t border-[#E4DFD6] pt-4">
                <h4 className="text-base font-bold text-[#162332]">For the little explorers</h4>
                <p className="mt-2 text-sm leading-relaxed text-[#606469]">Mould can release spores that trigger coughing, wheezing and asthma symptoms in susceptible people. Dirty equipment may be one source of buildup, though not every dirty unit contains mould.</p>
              </div>
              <div className="border-t border-[#E4DFD6] pt-4">
                <h4 className="text-base font-bold text-[#162332]">For pet owners</h4>
                <p className="mt-2 text-sm leading-relaxed text-[#606469]">Fur, dander and household dust can collect around filters and inside accessible air paths. Washing the filters alone may leave grime further in.</p>
              </div>
              <div className="border-t border-[#E4DFD6] pt-4">
                <h4 className="text-base font-bold text-[#162332]">For older loved ones</h4>
                <p className="mt-2 text-sm leading-relaxed text-[#606469]">Musty smells, weaker airflow and rooms that take longer to cool are especially frustrating when someone relies on the aircon to stay comfortable.</p>
              </div>
              <div className="border-t border-[#E4DFD6] pt-4">
                <h4 className="text-base font-bold text-[#162332]">For your home and your power bill</h4>
                <p className="mt-2 text-sm leading-relaxed text-[#606469]">A dirty blower or coil can reduce cooling performance and efficiency. Sludge in a drain can contribute to leaks. Cleaning may help when dirt is the cause.</p>
              </div>
            </div>
            <p className="mt-5 text-xs leading-relaxed text-[#6A7178]">Cleaning is not a treatment for asthma, cannot prevent infections and does not guarantee better sleep, energy savings or like-new performance. Ventilation, moisture control and any medical treatment still matter.</p>
            <a href="https://www.health.nsw.gov.au/environment/factsheets/Pages/mould.aspx" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-bold text-[#8E6733] underline underline-offset-4">Read NSW Health's information about mould and breathing ↗</a>
          </div>
        </div>
      </section>


      {/* The offer stays below the complete solution and company-proof story. */}
      <section className="bg-[#081C2B] py-16 text-white sm:py-24" id="cleaning-solution" data-testid="cleaning-solution">
        <div className="sp-container">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#40C9EE]">THE SPLITSPRO SOLUTION</p>
          <div className="mt-5 grid items-center gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:gap-14">
            <div>
              <h2 className="max-w-3xl text-4xl font-black uppercase leading-[1.03] tracking-tight sm:text-5xl xl:text-6xl">
                A FILTER WASH IS A START.
                <span className="mt-2 block text-[#45C6E7]">WE GO DEEPER.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#D5E6EF] sm:text-lg">
                Imagine knowing the hidden parts have had some proper attention too. Not just the removable filter — the accessible blower, cooling coil, drain tray and air path where dust and grime can build up.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#D5E6EF]">
                That's the difference between giving an aircon a quick once-over and booking a professional deep clean. We work carefully inside the unit, using cleaning products suitable for its parts, then put everything back and check operation.
              </p>
              <p className="mt-5 border-l-[3px] border-[#F4C620] pl-4 text-sm font-semibold leading-relaxed text-white">
                Less hidden buildup to wonder about. A cleaner machine to rely on. No scare tactics — just the care you'd expect in your home.
              </p>
            </div>
            <figure className="overflow-hidden rounded-xl bg-[#EAF8FC]">
              <img src="/landing/cfu-professional-clean.webp" alt="Illustrative close-up of internal split-system air-conditioner cleaning" loading="lazy" decoding="async" className="aspect-[5/4] w-full object-cover"/>
              <figcaption className="px-4 py-3 text-xs leading-relaxed text-[#355568]">Illustrative process image. The parts we can safely reach depend on the model and condition of your unit.</figcaption>
            </figure>
          </div>
          <div className="mt-12 border-t border-white/20 pt-9 sm:mt-16">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#45C6E7]">HOW WE LOOK AFTER YOUR AIRCON</p>
            <div className="mt-6 grid gap-7 md:grid-cols-3">
              <article className="border-t-[3px] border-[#F4C620] pt-5">
                <span className="text-4xl font-black text-[#45C6E7]">01</span>
                <h3 className="mt-3 text-2xl font-extrabold">Protect the home.</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#D5E6EF]">Protect the surrounding work area. Open the indoor unit and remove service-accessible covers and filters without unnecessary disruption.</p>
              </article>
              <article className="border-t-[3px] border-[#F4C620] pt-5">
                <span className="text-4xl font-black text-[#45C6E7]">02</span>
                <h3 className="mt-3 text-2xl font-extrabold">Get into the grime.</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#D5E6EF]">Deep-clean accessible coil, blower wheel, airflow and drain surfaces with appropriate products — the places a quick filter rinse cannot reach.</p>
              </article>
              <article className="border-t-[3px] border-[#F4C620] pt-5">
                <span className="text-4xl font-black text-[#45C6E7]">03</span>
                <h3 className="mt-3 text-2xl font-extrabold">Finish it properly.</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#D5E6EF]">Apply a compatible protective treatment where suitable, reassemble the unit, check operation and explain what was cleaned.</p>
              </article>
            </div>
          </div>
          <div className="mt-12 grid gap-5 border-t border-white/20 pt-8 md:grid-cols-[0.7fr_1.3fr]">
            <div>
              <h3 className="text-2xl font-extrabold">What actually gets cleaned?</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#C4D9E4]">This is the detail behind the deep-clean promise. Exact access varies by system.</p>
            </div>
            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {WHAT_WE_CLEAN.map((item) => (
                <div key={item.title} className="border-t border-white/20 pt-3">
                  <h4 className="flex items-center gap-2 font-bold"><Check className="h-4 w-4 shrink-0 text-[#F4C620]"/>{item.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#C4D9E4]">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24" id="cleaning-trust" data-testid="cleaning-trust">
        <div className="sp-container">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#008DB8]">WHY SPLITSPRO?</p>
          <h2 className="mt-4 max-w-5xl text-4xl font-black uppercase leading-[1.05] tracking-tight text-[#0B2641] sm:text-5xl">
            PLENTY OF PEOPLE CAN SAY "DEEP CLEAN."
            <span className="mt-2 block text-[#008DB8]">WE SHOW YOU WHAT THAT MEANS.</span>
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#526171]">
            You're letting someone work inside your home. You deserve to know what they're doing, how they'll look after your place, and what you're getting — before you book.
          </p>
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
            <div className="border-t-4 border-[#F4C620] pt-6">
              <p className="text-xs font-black uppercase tracking-[0.15em] text-[#008DB8]">REAL CUSTOMER FEEDBACK</p>
              <div className="mt-5"><GoogleRating /></div>
              <p className="mt-4 text-sm leading-relaxed text-[#53616D]">
                Read genuine feedback about SplitsPro's air-conditioning work. You can check the reviews yourself rather than relying on a made-up testimonial.
              </p>
              <Link to="/reviews" className="mt-5 inline-flex items-center gap-2 text-base font-extrabold text-[#086D93] underline underline-offset-4">
                Read our customer reviews <ArrowUpRight className="h-4 w-4"/>
              </Link>
            </div>
            <div className="border-t-4 border-[#36BCE4] pt-6">
              <p className="text-xs font-black uppercase tracking-[0.15em] text-[#008DB8]">OUR STANDARDS IN YOUR HOME</p>
              <div className="mt-5 divide-y divide-[#E6EBEE]">
                {[
                  {title:"We look after the room, not just the machine.",body:"We protect the surrounding area and work carefully around your furniture and walls."},
                  {title:"We explain what we're actually cleaning.",body:"We tell you which service-accessible parts can be cleaned on your particular unit, rather than promise impossible dismantling."},
                  {title:"We don't hide surprise extra work.",body:"If heavy contamination, access issues or repairs need more work, we discuss and quote them before going ahead."},
                  {title:"We check it before we leave.",body:"We reassemble and check the aircon's operation after the cleaning work."}
                ].map((item) => (
                  <div className="py-4" key={item.title}>
                    <h3 className="flex gap-2 text-base font-extrabold text-[#142D42]"><ShieldCheck className="h-5 w-5 shrink-0 text-[#008DB8]"/>{item.title}</h3>
                    <p className="mt-2 pl-7 text-sm leading-relaxed text-[#53616D]">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-7 max-w-4xl border-l-[3px] border-[#F4C620] pl-4 text-sm leading-relaxed text-[#51616D]">
            No service can promise a sterile house or guarantee a health outcome. What we can offer is a clear, careful cleaning process and honest expectations.
          </p>
        </div>
      </section>

      <section className="bg-[#F1F9FC] py-16 sm:py-24" id="cleaning-prices" data-testid="cleaning-prices">
        <div className="sp-container">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#007EA7]">NOW, HERE'S THE DEAL</p>
          <h2 className="mt-4 max-w-5xl text-4xl font-black uppercase leading-[1.04] tracking-tight text-[#0B2641] sm:text-5xl">
            A PROPER DEEP CLEAN.
            <span className="mt-2 block text-[#008DB8]">WITHOUT PAYING FOR WHAT YOU DON'T NEED.</span>
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#50616D] sm:text-lg">
            You're getting more than a filter rinse: careful internal cleaning, attention to the accessible hard-to-reach areas, protection for your home and an operational check when we're done.
          </p>
          <div className="mt-8 border-y border-[#C7DDE7] py-6" data-testid="cleaning-deal-sweetener">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#007EA7]">THE VALUE IS IN WHAT'S INCLUDED</p>
            <div className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Accessible internal coil and blower attention",
                "Work area protected during the clean",
                "Reassembly and operation check",
                "Clear quote before any non-standard work"
              ].map((value) => (
                <p className="flex items-start gap-2 text-sm font-bold leading-relaxed text-[#153249]" key={value}><Check className="mt-0.5 h-5 w-5 shrink-0 text-[#007FA4]"/>{value}</p>
              ))}
            </div>
          </div>
          <h3 className="mt-10 text-2xl font-black uppercase text-[#0B2641] sm:text-3xl">CHOOSE THE CLEAN THAT SUITS YOUR HOME.</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {CLEANING_OFFERS.map((offer) => {
              const featured = offer.id === "two";
              return (
                <div key={offer.id} className={"border-t-[5px] bg-white px-6 pb-7 pt-6 sm:px-8 " + (featured ? "border-[#F4C620] shadow-[0_12px_30px_rgba(9,56,81,0.08)]" : "border-[#008DB8]")}>
                  {featured && <p className="mb-4 inline-block bg-[#F4C620] px-3 py-2 text-xs font-black uppercase tracking-wide text-[#09243A]">Best value — save $140 vs two single cleans</p>}
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-[#007FA4]">{offer.label}</p>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <h4 className="text-2xl font-black uppercase text-[#0B2641]">{offer.name}</h4>
                    <strong className="text-4xl font-black tracking-tight text-[#0B2641] sm:text-5xl">{offer.price}</strong>
                  </div>
                  <p className="mt-5 min-h-[3rem] text-sm leading-relaxed text-[#5C6A73]">{offer.description}</p>
                  {featured && <p className="mt-3 font-bold text-[#007FA4]">That's $150 per unit when we clean both at the same property.</p>}
                  <button type="button" onClick={() => choose(offer.id)} className={"mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-base font-black uppercase " + (featured ? "bg-[#F4C620] text-[#081D2F] hover:bg-[#FBDD42]" : "bg-[#007FA4] text-white hover:bg-[#006F91]")}>
                    Choose my date <ArrowRight className="h-5 w-5"/>
                  </button>
                </div>
              );
            })}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-[#566D7B]">
            Standard-access wall-mounted splits only. The two-unit offer applies to one address during one visit. Any additional work is quoted before it starts.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#566D7B]">
            Choose your date and continue to Stripe or PayPal checkout. Eligible payment methods or instalments, where offered, are shown by the provider at checkout and are subject to approval.
          </p>
        </div>
      </section>

      <section className="scroll-mt-24 bg-[#081726] py-16 text-white sm:py-20" id="cleaning-booking" data-testid="cleaning-booking">
        <div className="sp-container mx-auto max-w-5xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#F4C620]">1 · Choose your cleaning date</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">Pick a day that works for you.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">Your choice is nearly sorted. Select a live morning or afternoon opening, then enter your contact details and pay securely on the next page. Your booking is secured after payment confirmation.</p>

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
