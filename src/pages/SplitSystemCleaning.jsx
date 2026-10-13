
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
  { id: "one", name: "1 Deep Clean", label: "One split system", price: "$220", description: "A deep clean of service-accessible indoor components — beyond a simple filter rinse." },
  { id: "two", name: "2 Deep Cleans", label: "Same property · $150 each", price: "$300", description: "Two wall-mounted split systems deep cleaned during one visit at the same property." }
];

const WHAT_WE_CLEAN = [
  { title: "Filters and indoor covers", copy: "Wash washable filters and service-accessible indoor surfaces, with surrounding areas protected." },
  { title: "Evaporator coil", copy: "Clean accessible coil surfaces where dust and grime can collect out of sight." },
  { title: "Blower wheel and airflow path", copy: "Clean the accessible fan barrel and airflow path to help remove buildup that can restrict circulation." },
  { title: "Drain tray and accessible drain", copy: "Clean accessible drain areas and check drainage where the system allows." }
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



      {/* Existing hero placement restored with the previously approved image; no logo, price or CTA baked into artwork. */}
      <section className="w-full overflow-hidden bg-[#FCFBF8]" data-testid="cleaning-hero"
        style={{ paddingTop: "max(80px, calc(var(--sp-site-header-height, 152px) - 36px))" }}>
        <div className="sp-container pb-5 pt-7 md:hidden">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9B753E]">For mums, dads, pet owners and older loved ones</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-[#0B0B0B]">
            You clean everything they touch. <span className="text-[#805F2F]">What about the aircon they breathe around?</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#555D63]">It can look spotless on the outside while hiding dust and grime behind the cover.</p>
        </div>
        <img
          src="/landing/splitspro-cleaning-family-hero.webp"
          alt="Bright Australian family home with a child, pet and older loved one beside an air conditioner showing hidden dirt; you clean everything they touch, what about the aircon they breathe around?"
          width={1536} height={1024} loading="eager" decoding="async" fetchPriority="high" data-no-fallback="true"
          className="block h-[300px] w-full object-cover object-[76%_center] md:h-auto md:max-w-none md:object-contain"
        />
      </section>

      <section className="border-b border-[#E5E0D7] bg-white py-5" data-testid="cleaning-social-proof">
        <div className="sp-container flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <div><GoogleRating /><p className="mt-1 text-[11px] text-[#62666B]">Customer feedback for SplitsPro's air-conditioning work. <Link to="/reviews" className="font-bold text-[#946C35] underline">Read reviews</Link></p></div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-[#283B48]">
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#A77C41]" /> Clear cleaning scope</span>
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#A77C41]" /> Local Western Sydney</span>
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#A77C41]" /> Choose a date, then pay securely</span>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20" data-testid="cleaning-benefits">
        <div className="sp-container">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9B753E]">For mums, dads, pet owners and families caring for older loved ones</p>
          <h2 className="mt-3 max-w-4xl font-serif text-4xl leading-tight tracking-tight text-[#0B0B0B] sm:text-5xl">
            A clean home shouldn't stop at what you can see.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#5E6267] sm:text-lg">
            You wipe the benches, mop the floors and wash the bedding. You pick up pet hair. And with little ones around, everything seems to end up in their mouths. But what about the air conditioner circulating air around the room? Behind that spotless white cover, dust, pet dander and moisture-related grime can build up on the fan, coil and drainage areas. It's one part of the home that's easy to forget — whether you're looking after children, pets or older loved ones.
          </p>

          {/* Three editorial punchlines within the page's existing three-column benefits layout. */}
          <div className="mt-9 grid gap-6 border-y border-[#E7E3DD] py-7 md:grid-cols-3" data-testid="cleaning-three-punchlines">
            <article className="min-w-0">
              
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.16em] text-[#9B753E]">01 · The family-home test</p>
              <h3 className="mt-2 font-serif text-[1.65rem] leading-tight text-[#152535]">If it's not nailed down, apparently it's food.</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5F6368]">From toddlers' toys to the dog's favourite spot on the rug, we put so much effort into clean surfaces. The aircon circulating air around the room deserves attention too.</p>
            </article>
            <article className="min-w-0">
              <img src="https://images.pexels.com/photos/16592625/pexels-photo-16592625.jpeg?auto=compress&cs=tinysrgb&w=1000" alt="Illustrative photograph of a wall-mounted split-system air conditioner" loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-md object-cover" />
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.16em] text-[#9B753E]">02 · Behind the white cover</p>
              <h3 className="mt-2 font-serif text-[1.65rem] leading-tight text-[#152535]">Looks clean. So does the top of the fridge.</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5F6368]">Until you actually look. Dust, pet dander and moisture-related grime can build up on hidden internal components even when the cover looks spotless. Not every dirty aircon contains mould, but damp buildup deserves inspection.</p>
            </article>
            <article className="min-w-0">
              
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.16em] text-[#9B753E]">03 · Time to go deeper</p>
              <h3 className="mt-2 font-serif text-[1.65rem] leading-tight text-[#152535]">You bought an aircon. Not a dust collector with a remote.</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5F6368]">A filter rinse only goes so far. A proper deep clean removes accessible internal buildup that may restrict airflow, contribute to musty smells, create some noises or obstruct drainage.</p>
            </article>
          </div>

          <p className="mt-3 text-[11px] text-[#6A7178]">Illustrative imagery, not a diagnosis of mould in your particular aircon. Ask us to show you what we find in yours.</p>

          <div className="mt-10 max-w-5xl" data-testid="cleaning-personal-impact">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9B753E]">What that hidden grime means for your home</p>
            <h3 className="mt-3 max-w-4xl font-serif text-3xl leading-tight text-[#0B0B0B] sm:text-4xl">The problem isn't just what you can see. It's what you live with.</h3>
            <div className="mt-7 grid gap-x-8 gap-y-6 md:grid-cols-2">
              <div className="border-t border-[#E4DFD6] pt-4">
                <h4 className="text-base font-bold text-[#162332]">For children and sensitive airways</h4>
                <p className="mt-2 text-sm leading-relaxed text-[#606469]">Mould can release spores that trigger coughing, wheezing and asthma symptoms in susceptible people. Dirty equipment may be one source of buildup, though not every dirty unit contains mould.</p>
              </div>
              <div className="border-t border-[#E4DFD6] pt-4">
                <h4 className="text-base font-bold text-[#162332]">For pet owners</h4>
                <p className="mt-2 text-sm leading-relaxed text-[#606469]">Fur, dander and household dust can collect around filters and inside accessible air paths. Washing the filters alone may leave grime further in.</p>
              </div>
              <div className="border-t border-[#E4DFD6] pt-4">
                <h4 className="text-base font-bold text-[#162332]">For older loved ones and anyone who values comfort</h4>
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

      <section className="bg-[#FBFAF8] py-14 sm:py-20" data-testid="cleaning-inclusions">
        <div className="sp-container grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9B753E]">The SplitsPro solution · deeper than a filter wash</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight text-[#0B0B0B] sm:text-5xl">We get into the bits your filter rinse misses.</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#606469]">We protect your home, open the unit and remove service-accessible parts where the manufacturer's design allows. Then we clean the blower wheel, cooling coil, filters, covers and accessible drainage areas — not just the pieces you can reach from the front. We reassemble and test the unit. Suitable cleaners or disinfectants are used only as labelled; any optional mould-inhibiting treatment depends on verified product claims and material compatibility. We can show you the hidden buildup, without promising a medical cure or a brand-new aircon.</p>
            <button type="button" onClick={() => document.getElementById("cleaning-prices")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="mt-6 inline-flex items-center gap-2 border-b-2 border-[#C8A46A] pb-1 text-sm font-bold text-[#1D2329]">See the deep-clean offer <ArrowRight className="h-4 w-4" /></button>
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



      <section className="bg-white py-14 sm:py-20" data-testid="cleaning-authority">
        <div className="sp-container max-w-6xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9B753E]">Why trust SplitsPro?</p>
          <h2 className="mt-3 max-w-5xl font-serif text-4xl leading-tight text-[#0B0B0B] sm:text-5xl">Don't just take our word for it. See the clean. See the evidence.</h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="border-t border-[#E6E0D7] pt-5">
              <h3 className="font-serif text-2xl text-[#18232F]">Real customer feedback. Clear workmanship.</h3>
              <div className="mt-4"><GoogleRating /></div>
              <p className="mt-4 text-sm leading-relaxed text-[#606469]">See SplitsPro's customer reviews and the steps involved in our deep clean. We explain what is accessible on your particular system, protect the work area, and check operation after reassembly. Ask to see the dirt removed from your unit.</p>
              <Link to="/reviews" className="mt-4 inline-block text-sm font-bold text-[#8E6733] underline underline-offset-4">Read SplitsPro customer reviews ↗</Link>
            </div>
            <div className="border-t-4 border-[#C8A46A] bg-[#F7F6F2] p-6 sm:p-7">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#89672F]">Independent published research · 2024</p>
              <p className="mt-3 font-serif text-5xl leading-none text-[#13273A]">Over 99%</p>
              <p className="mt-3 text-sm font-bold text-[#18232F]">Reduction in cultured fungi on sampled cooling fins after thorough disassembly and cleaning.</p>
              <p className="mt-3 text-xs leading-relaxed text-[#62666B]">In a study of 10 household air conditioners, average cultured fungal counts on tested cooling fins fell from 1,080 to 10.5 CFU/cm². This was a result on sampled surfaces, not a guarantee that our service eliminates airborne spores or prevents illness.</p>
              <a href="https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2024.1429626/full" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-xs font-extrabold text-[#8E6733] underline underline-offset-4">Read the published research ↗</a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F6F2] py-14 sm:py-20" id="cleaning-prices" data-testid="cleaning-prices">
        <div className="sp-container max-w-6xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9B753E]">Your clean-home offer · clear upfront pricing</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight text-[#0B0B0B] sm:text-5xl">One deep clean. Or two for less.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#606469]">You've seen the hidden problem, the health considerations and what a proper clean involves. Now here's the simple deal: $220 for one unit, or get two deep cleans for $300 at the same property — saving $140 compared with booking two single cleans.</p>
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
          <div className="mt-7 border-y border-[#E1DCD3] py-5" data-testid="cleaning-pay-later">
            <p className="text-base font-bold text-[#18232F]">Want to spread the payment?</p>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#62666B]">Choose your date and continue to Stripe or PayPal checkout. Eligible pay-later or instalment options may appear if they are enabled for this service and approved by your chosen provider. You can see the available methods before paying; instalments are not guaranteed.</p>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-[#666D73]">Offer applies to normal-access wall-mounted split-system indoor units at one address. Two-unit pricing requires both cleans during the same visit. Heavy contamination, access problems, repairs or non-standard requirements are discussed and quoted separately before any work.</p>
        </div>
      </section>

      <section className="scroll-mt-24 bg-[#081726] py-16 text-white sm:py-20" id="cleaning-booking" data-testid="cleaning-booking">
        <div className="sp-container mx-auto max-w-5xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#F4C620]">1 · Choose your cleaning date</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">Pick a day that works for you.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">You clean up after the kids, brush the dog and look after everyone at home. Now give the aircon some attention. Pick a live opening, then enter your details and pay on the next page. Your booking is secured only after payment is confirmed.</p>

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
