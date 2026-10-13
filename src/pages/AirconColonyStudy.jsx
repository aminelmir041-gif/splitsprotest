import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { GoogleRating } from "../components/sections";

const BOOKING = "/split-system-cleaning#cleaning-booking";

const BookingLink = ({ children, subtle = false }) => (
  <Link to={BOOKING} className={subtle
    ? "inline-flex min-h-12 items-center gap-3 border-b-2 border-[#C8A46A] text-sm font-extrabold text-[#143044]"
    : "inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-[#F4C620] px-7 py-3 text-sm font-extrabold text-[#142538] transition-colors hover:bg-[#FFE269]"}>
    {children}<ArrowRight className="h-4 w-4 shrink-0" />
  </Link>
);

// Exactly three native, brightly lit editorial punchline photos.
// Reuse the approved existing website assets rather than introducing a new visual language.
const punchlineImages = [
  "/landing/cfu-family-punchline.webp",
  "/landing/cfu-hidden-grime.webp",
  "/landing/cfu-professional-clean.webp",
];

export default function AirconColonyStudy() {
  return (
    <div className="bg-[#FBFAF8] text-[#18232F]" data-testid="aircon-colony-study">
      <Helmet>
        <title>Colony Forming Units in Aircons: What Cleaning Research Found | SplitsPro</title>
        <meta name="description" content="Researchers measured colony forming units inside household air conditioners before and after deep cleaning. Learn what the findings mean for your home, then book SplitsPro's professional split system clean." />
        <link rel="canonical" href="https://splitspro.com.au/aircon-colony-forming-units/" />
        <meta property="og:title" content="They Found Something Growing Inside Aircons. And Counted It. | SplitsPro" />
        <meta property="og:description" content="What is a colony forming unit? Why does it matter, and what difference did deep cleaning make in published research?" />
      </Helmet>

      {/* The approved native ad artwork is the single hero headline. Do not repeat
          the large words in HTML or introduce an extra CTA over the graphic. */}
      <section className="bg-[#FCFBF8] pt-24 pb-6 sm:pt-32 sm:pb-10" data-testid="colony-hero">
        <h1 className="sr-only">What is a colony forming unit?</h1>
        <div className="sp-container">
          <img
            src="/landing/aircon-colony-hero.webp"
            alt="SplitsPro: What is a colony forming unit? Blue gloved hand showing microbial colonies growing on a laboratory culture plate against a bright Australian living room with air conditioning."
            width={1122}
            height={1402}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            data-no-fallback="true"
            className="mx-auto block h-auto w-full max-w-[900px] rounded-md object-contain"
          />
        </div>
      </section>

      <section id="the-homeowner" className="scroll-mt-24 bg-white py-14 sm:py-20" data-testid="colony-punchline-one">
        <div className="sp-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <img src={punchlineImages[0]} alt="Illustrative sunny Australian living room with a family and a little one putting a safe teething toy into their mouth" width={846} height={645} loading="lazy" className="aspect-[4/3] w-full rounded-md object-cover" />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9B753E]">01 · The homeowner's problem</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-[#0B0B0B] sm:text-5xl">Five minutes after you mop, they've found something else to eat.</h2>
            <p className="mt-5 text-base leading-relaxed text-[#606469]">You clean the floors your kids crawl on. You wash the blankets your pets sleep on. You wipe the kitchen bench after every meal.</p>
            <p className="mt-3 text-base leading-relaxed text-[#606469]">And somehow, five minutes later, the little one has something else in their mouth. <strong>If it's within crawling distance, apparently it's lunch.</strong></p>
            <p className="mt-3 text-base leading-relaxed text-[#606469]">But there's one place in your home most people never think to clean properly: inside the air conditioner.</p>
            <p className="mt-4 font-semibold text-[#15354C]">You're already looking after the people you love. Don't overlook what's hiding behind the aircon cover.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F6F2] py-14 sm:py-20" data-testid="colony-punchline-two">
        <div className="sp-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="lg:order-2">
            <img src={punchlineImages[1]} alt="Illustrative closeup showing dust and grime built up deep inside an open split-system air conditioner" width={850} height={638} loading="lazy" className="aspect-[4/3] w-full rounded-md object-cover" />
          </div>
          <div className="lg:order-1">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9B753E]">02 · What you don't see</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-[#0B0B0B] sm:text-5xl">Looks spotless. So does the top of the fridge — until you check.</h2>
            <p className="mt-5 text-base leading-relaxed text-[#606469]">Behind the white cover, dust, pet dander and damp grime can collect on coils, fans and drain areas. Some damp equipment develops mould.</p>
            <p className="mt-3 text-base leading-relaxed text-[#606469]">Certain moulds release spores that can become airborne. NSW Health says mould exposure can trigger irritation, coughing, wheezing and asthma symptoms in susceptible people.</p>
            <p className="mt-3 text-base leading-relaxed text-[#606469]">Think about your little ones, older relatives and anyone with asthma or sensitive airways. The point isn't to frighten them. It's to understand one overlooked source of indoor buildup.</p>
            <p className="mt-3 text-xs leading-relaxed text-[#76797C]">Not every dirty air conditioner contains mould or causes illness. Looking at an image cannot tell you how many microorganisms are present or how much someone has inhaled.</p>
            <a href="https://www.health.nsw.gov.au/environment/factsheets/Pages/mould.aspx" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#8F6B37] underline underline-offset-4">
              NSW Health's mould information <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20" data-testid="colony-explainer">
        <div className="sp-container max-w-5xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9B753E]">A laboratory term explained like normal English</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-[#0B0B0B] sm:text-5xl">What on earth is a colony forming unit?</h2>
          <p className="mt-6 max-w-4xl text-base leading-relaxed text-[#606469]">Imagine a scientist takes a sample from inside an aircon and puts it on a laboratory plate. Some living bacteria or fungi in that sample grow into visible colonies.</p>
          <p className="mt-3 max-w-4xl text-base leading-relaxed text-[#606469]">Each colony counted is called a <strong>colony forming unit</strong>. A colony can grow from a single microbe or a group of them. That gives scientists a way to compare certain types of microbial contamination before and after cleaning.</p>
          <p className="mt-4 max-w-4xl font-semibold text-[#16344C]">More colony forming units on a tested surface can indicate more culturable microorganisms in the sample. It doesn't automatically mean a greater risk of illness.</p>
        </div>
      </section>

      <section className="bg-[#F7F5F1] py-16 sm:py-24" data-testid="colony-study">
        <div className="sp-container max-w-5xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9B753E]">The measured difference · published research, 2024</p>
          <h2 className="mt-4 max-w-5xl font-serif text-4xl leading-tight text-[#0B0B0B] sm:text-5xl">Then researchers had the air conditioners thoroughly cleaned.</h2>
          <p className="mt-5 max-w-4xl text-base leading-relaxed text-[#606469]">In a published study of ten household air conditioners in Chengdu, China, researchers sampled internal surfaces before and after professional disassembly and cleaning. The average fungal counts on the sampled cooling fins changed dramatically.</p>
          <div className="mt-9 grid gap-8 border-y border-[#E1DAD0] py-9 md:grid-cols-[0.82fr_1.18fr] md:gap-14">
            <div>
              <p className="font-serif text-[clamp(4.4rem,9vw,7.5rem)] leading-none tracking-tight text-[#12283B]">Over 99%</p>
              <p className="mt-4 font-serif text-2xl leading-snug text-[#162F42]">Fewer culturable fungi on the cooling-fin surfaces sampled after thorough cleaning.</p>
            </div>
            <div>
              <div className="flex items-end justify-between gap-3"><span className="text-sm font-bold">Before cleaning</span><strong className="font-serif text-4xl text-[#12283B]">1,080</strong></div>
              <div className="mt-2 h-4 w-full bg-[#E1E4E6]"><div className="h-full w-full bg-[#8E9CA6]" /></div>
              <div className="mt-7 flex items-end justify-between gap-3"><span className="text-sm font-bold">After cleaning</span><strong className="font-serif text-4xl text-[#087C96]">10.5</strong></div>
              <div className="mt-2 h-4 w-full bg-[#E1E4E6]"><div className="h-full min-w-[3px] bg-[#0C97B4]" style={{width:"0.973%"}} /></div>
              <p className="mt-5 text-sm font-semibold text-[#233B4E]">Colony forming units per square centimetre of sampled cooling fins.</p>
              <p className="mt-3 text-xs leading-relaxed text-[#6D7176]">This is evidence of reduced culturable fungal contamination on those surfaces. It does not mean 99% fewer airborne spores or illnesses, and it is not a guaranteed SplitsPro cleaning result.</p>
              <a href="https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2024.1429626/full" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#8F6B37] underline underline-offset-4">
                See the published 2024 study <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
          <p className="mt-6 max-w-4xl font-serif text-2xl text-[#172F44] sm:text-3xl">That's why cleaning deeper than the filters is worth understanding.</p>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20" data-testid="colony-punchline-three">
        <div className="sp-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <img src={punchlineImages[2]} alt="Illustrative technician using a cleaning bag while deep cleaning the inside of a wall-mounted split-system air conditioner" width={850} height={638} loading="lazy" className="aspect-[4/3] w-full rounded-md object-cover" />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9B753E]">03 · The solution</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-[#0B0B0B] sm:text-5xl">A filter rinse? That's just the warm-up.</h2>
            <p className="mt-5 text-base leading-relaxed text-[#606469]">At SplitsPro, we don't just pull out the filters, rinse them and call it a day.</p>
            <p className="mt-3 text-base leading-relaxed text-[#606469]">We protect your home and carefully strip the indoor unit back to its service-accessible components, as far as the manufacturer's design safely allows.</p>
            <p className="mt-3 text-base leading-relaxed text-[#606469]">Then we deep clean the blower wheel, coil, covers, washable filters and accessible drainage areas using suitable specialist air-conditioning cleaning products.</p>
            <p className="mt-3 text-base leading-relaxed text-[#606469]">Where the product label and unit materials allow it, a compatible protective treatment may be applied to approved surfaces. Then we put the unit back together and check its operation.</p>
            <p className="mt-4 font-bold text-[#193A50]">Less hidden grime. Help with musty smells. Better airflow where dirt was restricting it.</p>
            <div className="mt-6"><BookingLink subtle>See available dates</BookingLink></div>
          </div>
        </div>
      </section>

      <section className="bg-[#FCFBF8] py-14 sm:py-20" data-testid="colony-authority">
        <div className="sp-container max-w-5xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9B753E]">Why choose SplitsPro?</p>
          <h2 className="mt-4 max-w-5xl font-serif text-4xl leading-tight text-[#0B0B0B] sm:text-5xl">We explain what we're cleaning. And show you what came out.</h2>
          <div className="mt-8 grid gap-8 border-y border-[#E5E0D7] py-8 md:grid-cols-2 md:gap-12">
            <div>
              <GoogleRating />
              <p className="mt-4 text-base leading-relaxed text-[#606469]">Read customer feedback about SplitsPro's air-conditioning work. We explain what is accessible on your system, protect the surrounding area and check operation after reassembly.</p>
              <Link to="/reviews" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#8F6B37] underline underline-offset-4">See customer reviews <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
            <div className="border-t border-[#E5E0D7] pt-7 md:border-l md:border-t-0 md:pl-9 md:pt-0">
              <p className="text-base font-bold text-[#193A50]">Clear scope. No miracle claims.</p>
              <p className="mt-3 text-base leading-relaxed text-[#606469]">A deep clean can remove accessible contamination. It can't sterilise a house, cure asthma, prevent infections or guarantee the results of a laboratory study. We want you to know the difference.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F5F1] py-16 sm:py-24" data-testid="colony-offer">
        <div className="sp-container max-w-5xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9B753E]">Your clean-home deal</p>
          <h2 className="mt-4 max-w-5xl font-serif text-4xl leading-tight text-[#0B0B0B] sm:text-5xl">You look after everyone else. Let us look after the aircon.</h2>
          <div className="mt-9 grid gap-6 border-y border-[#E1DAD0] py-8 sm:grid-cols-2 sm:gap-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#6E7174]">1 professional deep clean</p>
              <p className="mt-4 font-serif text-6xl text-[#182E40]">$220</p>
              <p className="mt-2 text-sm text-[#606469]">One standard-access wall-mounted split system.</p>
            </div>
            <div className="border-t border-[#E1DAD0] pt-6 sm:border-l sm:border-t-0 sm:pl-9 sm:pt-0">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#6E7174]">2 deep cleans · same property</p>
              <p className="mt-4 font-serif text-6xl text-[#182E40]">$300</p>
              <p className="mt-2 text-sm text-[#606469]">Just $150 each; save $140 compared with two single cleans.</p>
            </div>
          </div>
          <p className="mt-6 max-w-4xl text-sm leading-relaxed text-[#606469]">Pick a live cleaning date on our existing booking calendar. Then fill in your details and continue to Stripe or PayPal checkout. Pay-later options may be shown only if enabled for this service and approved by the provider.</p>
          <div className="mt-7"><BookingLink>See available cleaning dates</BookingLink></div>
          <p className="mt-4 max-w-4xl text-xs leading-relaxed text-[#7E7B76]">Two-unit offer requires two standard-access wall-mounted indoor units at the same property on the same visit. Extra work or difficult access is quoted separately.</p>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20" data-testid="colony-faq">
        <div className="sp-container max-w-5xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9B753E]">Questions you might have</p>
          <h2 className="mt-4 font-serif text-4xl text-[#0B0B0B] sm:text-5xl">Before we rock up.</h2>
          <div className="mt-7 border-t border-[#E6E0D7]">
            {[
              ["Can I see colony forming units inside my aircon?", "Not directly. These are laboratory measurements from cultured samples, not particles you can reliably identify by looking at a dirty coil."],
              ["Does a dirty aircon automatically make my family sick?", "No. Some mould exposure can worsen respiratory symptoms in sensitive people, but cleaning does not guarantee protection from illness. Talk to a healthcare professional about persistent symptoms."],
              ["Do you actually strip the whole unit down?", "We strip back service-accessible parts as safely permitted by the manufacturer, not sealed refrigerant components or parts that must stay assembled."],
              ["Does your clean reduce colony forming units by 99%?", "That number came from an independent 2024 study of sampled surfaces after thorough cleaning, not from testing every SplitsPro job. We cannot promise the same result for your system."],
              ["Can I book a time online?", "Yes. The booking buttons take you to SplitsPro's existing split-system cleaning date picker, followed by a separate details and secure payment page."],
            ].map(([q,a]) => (
              <details key={q} className="group border-b border-[#E6E0D7] py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-5 text-sm font-bold text-[#172F42] sm:text-base [&::-webkit-details-marker]:hidden">{q}<ChevronDown className="mt-1 h-4 w-4 shrink-0 transition-transform group-open:rotate-180" /></summary>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#606469]">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <div className="border-t border-[#E6E0D7] bg-[#FAF9F7] py-5">
        <div className="sp-container flex flex-wrap justify-between gap-3 text-xs text-[#676B6F]">
          <span>SplitsPro · Australian family homes, clear cleaning scope.</span>
          <Link to={BOOKING} className="font-bold text-[#8F6B37] underline">Book a deep clean ↗</Link>
        </div>
      </div>
    </div>
  );
}
