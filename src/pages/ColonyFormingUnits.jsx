
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { GoogleRating } from "../components/sections";

// The existing SplitsPro booking system remains the single source of appointment availability.
const BOOK = "/split-system-cleaning#cleaning-booking";
const BookLink = ({children,secondary=false}) => (
  <Link to={BOOK} className={secondary
    ? "inline-flex min-h-12 items-center gap-2 border-b-2 border-[#C8A46A] text-sm font-extrabold text-[#132A3D]"
    : "inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-[#F4C620] px-6 py-3 text-sm font-extrabold text-[#0B1D2B] transition-colors hover:bg-[#FFE269]"}>
    {children} <ArrowRight className="h-4 w-4 shrink-0"/>
  </Link>
);
export default function ColonyFormingUnits() {
  return (
    <div data-testid="cfu-guide-landing" className="bg-[#FBFAF8] text-[#18232F]">
      <Helmet>
        <title>What's Hiding In Your Aircon? Colony Forming Units | SplitsPro</title>
        <meta name="description" content="What is a colony forming unit? A practical Australian guide to hidden split-system dirt, mould research and professional deep cleaning from SplitsPro."/>
        <link rel="canonical" href="https://splitspro.com.au/colony-forming-units/"/>
        <meta property="og:title" content="You clean everything they touch. What about the aircon? | SplitsPro"/>
        <meta property="og:description" content="A family-home guide to colony forming units, hidden grime and deep cleaning."/>
      </Helmet>
      <section className="bg-[#FCFBF8] pb-14 pt-32 sm:pb-20 sm:pt-40" data-testid="cfu-hero">
        <div className="sp-container">
          <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#9B753E]">A home-care guide for mums, dads, pet owners and older loved ones</p>
          <h1 className="mt-5 max-w-5xl font-serif text-[clamp(2.6rem,6.3vw,5.3rem)] leading-[1.06] tracking-tight text-[#0B0B0B]">
            You clean everything they touch.
            <span className="mt-2 block text-[#805F2F]">But what about what's hiding inside your aircon?</span>
          </h1>
          <p className="mt-7 max-w-3xl text-base leading-relaxed text-[#555C62] sm:text-xl">
            You wipe the benches, wash the bedding and chase pet hair across the couch. But behind the spotless white cover, an aircon can hide dust, damp grime and sometimes microbial contamination.
          </p>
          <p className="mt-3 max-w-3xl text-base font-bold leading-relaxed text-[#162E42] sm:text-lg">Scientists can measure some of that microbial contamination using colony forming units. Here's what that actually means for your home.</p>
          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-4">
            <a href="#the-problem" className="inline-flex min-h-12 items-center gap-3 border-b-2 border-[#C8A46A] text-sm font-extrabold text-[#142E42]">Find out more <ArrowRight className="h-4 w-4"/></a>
            <BookLink>Choose a cleaning date</BookLink>
          </div>
        </div>
      </section>

      <section id="the-problem" className="scroll-mt-24 bg-white py-14 sm:py-20" data-testid="cfu-punchline-one">
        <div className="sp-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <img src="/landing/cfu-family-punchline.webp" alt="Illustrative Australian family with a toddler putting a teething toy in their mouth, pet dog and relatives in a bright living room" width={846} height={645} loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover"/>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#9B753E]">01 · The everyday problem</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-[#0B0B0B] sm:text-5xl">If it's within reach, apparently it's lunch.</h2>
            <p className="mt-5 text-base leading-relaxed text-[#5F6368]">Toddlers put everything in their mouths. Pets bring fur and dander into the house. And you're wiping the same bench for the third time today.</p>
            <p className="mt-3 text-base leading-relaxed text-[#5F6368]">You do all that because you want the people at home comfortable. So there's one fair question: when did someone last clean inside the machine circulating air around their room?</p>
            <p className="mt-4 font-semibold text-[#17364C]">It's not about cleaning more. It's about cleaning the places you can't normally reach.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F6F2] py-14 sm:py-20" data-testid="cfu-punchline-two">
        <div className="sp-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="lg:order-2">
            <img src="/landing/cfu-hidden-grime.webp" alt="Illustrative closeup of an indoor split system with heavily built-up dust and grime on the blower wheel" width={850} height={638} loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover"/>
          </div>
          <div className="lg:order-1">
            <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#9B753E]">02 · The unseen buildup</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-[#0B0B0B] sm:text-5xl">Looks clean? So does the top of the fridge.</h2>
            <p className="mt-5 text-base leading-relaxed text-[#5F6368]">Inside a split system, dust and dander can collect on the fan and coil. Moisture can add to the buildup. In some units, mould can grow on damp surfaces.</p>
            <p className="mt-3 text-base leading-relaxed text-[#5F6368]">Airborne mould spores may trigger coughing, wheezing and asthma symptoms in people who are sensitive to them. That matters when you're looking after little ones or relatives with breathing problems.</p>
            <p className="mt-3 text-sm leading-relaxed text-[#62666B]">Not every dirty aircon contains mould or is causing illness. A photograph cannot identify microbes.</p>
            <a href="https://www.health.nsw.gov.au/environment/factsheets/Pages/mould.aspx" rel="noopener noreferrer" target="_blank" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#926D34] underline underline-offset-4">NSW Health on mould and breathing <ArrowUpRight className="h-4 w-4"/></a>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24" data-testid="cfu-the-science">
        <div className="sp-container max-w-5xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#9B753E]">The science, minus the confusing words</p>
          <h2 className="mt-4 max-w-4xl font-serif text-4xl leading-tight text-[#0B0B0B] sm:text-5xl">What on earth is a colony forming unit?</h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#5F6368]">Researchers take a sample and grow it in a lab. A colony forming unit represents one viable microbe — or a group of microbes — that can grow into a visible colony in those test conditions. It's a way of comparing contamination on the surfaces sampled, not a count of every germ or an illness diagnosis.</p>
          <div className="mt-11 grid gap-9 border-y border-[#E3DED5] py-9 md:grid-cols-[0.88fr_1.12fr] md:gap-14">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#96713B]">Independent research · 2024</p>
              <p className="mt-4 font-serif text-6xl leading-none text-[#112B41] sm:text-7xl">Over 99%</p>
              <h3 className="mt-4 font-serif text-2xl leading-snug text-[#1A3348]">Reduction in cultured fungi on sampled cooling fins after thorough disassembly and cleaning.</h3>
            </div>
            <div>
              <p className="text-sm leading-relaxed text-[#60676C]">A small study of 10 Chinese household air conditioners measured these average counts of culturable fungi on cooling-fin surfaces:</p>
              <div className="mt-6 flex items-baseline justify-between gap-3 font-semibold"><span>Before cleaning</span><span className="font-serif text-3xl">1,080</span></div>
              <div className="mt-2 h-4 w-full bg-[#EDE8DE]"><div className="h-full w-full bg-[#8999A5]"/></div>
              <div className="mt-6 flex items-baseline justify-between gap-3 font-semibold"><span>After cleaning</span><span className="font-serif text-3xl text-[#007C99]">10.5</span></div>
              <div className="mt-2 h-4 w-full bg-[#EDE8DE]"><div className="h-full min-w-[3px] bg-[#0D9AB8]" style={{width:"0.973%"}}/></div>
              <p className="mt-5 text-sm font-semibold text-[#1B3446]">Colony forming units per square centimetre of tested cooling fins.</p>
              <p className="mt-3 text-xs leading-relaxed text-[#747779]">The study measured sampled surfaces, not airborne spores or illness rates. These are not SplitsPro results and cannot be promised for every unit.</p>
              <a href="https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2024.1429626/full" rel="noopener noreferrer" target="_blank" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#906A33] underline underline-offset-4">Read the 2024 study <ArrowUpRight className="h-4 w-4"/></a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FBFAF8] py-14 sm:py-20" data-testid="cfu-punchline-three">
        <div className="sp-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <img src="/landing/cfu-professional-clean.webp" alt="Illustrative technician deep cleaning an accessible indoor split system coil with a protective water-collection bag" width={850} height={638} loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover"/>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#9B753E]">03 · The SplitsPro solution</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-[#0B0B0B] sm:text-5xl">Washing the filters? That's just the warm-up.</h2>
            <p className="mt-5 text-base leading-relaxed text-[#5F6368]">We protect the room, open the indoor unit and strip back service-accessible parts as far as the manufacturer's design safely allows.</p>
            <p className="mt-3 text-base leading-relaxed text-[#5F6368]">Using suitable specialist aircon cleaning products, we clean the accessible blower wheel, coil, filters, covers and drain areas — not just what you can reach from the front.</p>
            <p className="mt-3 text-base leading-relaxed text-[#5F6368]">Where appropriate, a compatible protective coating may be used on approved surfaces, but only where its product label supports it. Then we reassemble and test operation.</p>
            <p className="mt-4 font-semibold text-[#17364C]">Less hidden grime, fewer musty smells, and better airflow where dirt was the cause.</p>
            <div className="mt-6"><BookLink secondary>Choose your cleaning date</BookLink></div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20" data-testid="cfu-trust">
        <div className="sp-container max-w-5xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#9B753E]">Why SplitsPro?</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-[#0B0B0B] sm:text-5xl">You should be able to see what we clean.</h2>
          <div className="mt-8 grid gap-8 border-y border-[#E5E0D7] py-7 md:grid-cols-2 md:gap-12">
            <div><GoogleRating/><p className="mt-4 text-sm leading-relaxed text-[#60676C]">Our customer reviews cover SplitsPro's air-conditioning work. We explain what your particular system lets us access, protect your home, and check operation after reassembly.</p><Link to="/reviews" className="mt-3 inline-block text-sm font-bold text-[#906B33] underline underline-offset-4">Read our customer reviews ↗</Link></div>
            <div><p className="text-base font-semibold text-[#152C3E]">A proper clean, not a miracle promise.</p><p className="mt-3 text-sm leading-relaxed text-[#60676C]">Cleaning accessible contamination is sensible maintenance. It can't sterilise the whole house, prevent infections, cure asthma, guarantee better sleep or repair a faulty component.</p></div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F5F1] py-16 sm:py-24" data-testid="cfu-offer">
        <div className="sp-container max-w-5xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#9B753E]">The clean-home offer</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-[#0B0B0B] sm:text-5xl">You've seen what's hiding. Here's the simple deal.</h2>
          <div className="mt-9 grid gap-7 border-y border-[#E3DED5] py-8 sm:grid-cols-2 sm:gap-12">
            <div><p className="text-xs font-bold uppercase tracking-[0.1em] text-[#60666B]">One split system deep clean</p><p className="mt-4 font-serif text-6xl leading-none text-[#152B3E]">$220</p><p className="mt-3 text-sm text-[#61666B]">For one standard-access wall-mounted unit.</p></div>
            <div className="border-t border-[#E3DED5] pt-7 sm:border-l sm:border-t-0 sm:pl-9 sm:pt-0"><p className="text-xs font-bold uppercase tracking-[0.1em] text-[#60666B]">Two deep cleans · same property</p><p className="mt-4 font-serif text-6xl leading-none text-[#152B3E]">$300</p><p className="mt-3 text-sm text-[#61666B]">$150 each, saving $140 compared with two individual cleans.</p></div>
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[#63676D]">Choose your date and morning or afternoon slot on our existing booking page. Then enter your contact details and pay through Stripe or PayPal. Instalments may be offered at checkout if enabled for the service and approved by the provider.</p>
          <div className="mt-7"><BookLink>See available cleaning dates</BookLink></div>
          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-[#7A7771]">Standard-access wall-mounted split systems only. Two-unit pricing requires the same property and visit. Repairs and unusual access are quoted separately.</p>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20" data-testid="cfu-faq">
        <div className="sp-container max-w-5xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#9B753E]">Straight answers</p>
          <h2 className="mt-3 font-serif text-4xl text-[#0B0B0B] sm:text-5xl">Before you book.</h2>
          <div className="mt-8 border-t border-[#E6E0D7]">
            {[
              ["Can you see colony forming units?", "Not with the naked eye. A lab grows a sample under controlled conditions to count colonies. Dust or a black spot doesn't identify a species or measure microbial contamination."],
              ["Does this mean my aircon is making us sick?", "Not necessarily. Not every dirty unit has mould. If you have persistent coughing, wheezing or breathing problems, seek medical advice and address other causes of moisture and poor indoor air quality."],
              ["Do you take my entire aircon apart?", "No. We carefully remove service-accessible components as the manufacturer allows, without dismantling sealed refrigerant parts for a routine clean."],
              ["Where do I choose a date?", "Our yellow booking buttons take you directly to the existing SplitsPro cleaning calendar. You select a live opening, then proceed to the separate secure details and payment page."],
            ].map(([question,answer])=>(
              <details key={question} className="group border-b border-[#E6E0D7] py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-5 text-sm font-bold text-[#172F42] sm:text-base [&::-webkit-details-marker]:hidden">{question}<ChevronDown className="mt-1 h-4 w-4 shrink-0 transition-transform group-open:rotate-180"/></summary>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#63676D]">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <div className="border-t border-[#E6E0D7] bg-[#FAF9F7] py-5"><div className="sp-container flex flex-wrap items-center justify-between gap-3 text-xs text-[#646970]"><span>SplitsPro · Australian homes, real comfort, clear cleaning scope.</span><Link to={BOOK} className="font-bold text-[#906A35] underline">Book your cleaning ↗</Link></div></div>
    </div>
  );
}
