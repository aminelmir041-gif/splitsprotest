import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";
import { api } from "../lib/api";
import { GoogleRating } from "../components/sections";
import { PHONE_TEL } from "../lib/data";

// This is the ONE consumer sales landing page for split-system cleaning.
// One continuous explanation of the Gold-Standard Deep Clean, with no on-page booking calendar.


const GoogleReviewBadge = () => (
  <span className="inline-flex items-center gap-2 text-sm font-black text-[#374151]">
    <svg viewBox="0 0 48 48" className="h-5 w-5" role="img" aria-label="Google">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-7.97 6.56-16.17z"/>
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
      <path fill="#FBBC04" d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/>
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
    </svg>
    Google review
  </span>
);

const FAQS = [
  { q: "We wash the filters. Isn't that enough?", a: "Filters catch some of the dust passing through, but they are only the first layer. The blower wheel, accessible coils and drain tray can still collect dust, greasy residue and moisture. A filter rinse doesn't reach that build-up." },
  { q: "If dirt is inside the aircon, does it end up around the house?", a: "Your split system pulls room air through its indoor unit and blows it back into the spaces your family uses. Fine particles in moving air can travel with that airflow. Removing accessible internal build-up tackles a source that ordinary bench and floor cleaning doesn't reach." },
  { q: "My aircon still smells after a clean. Why would yours be different?", a: "A filter wash or a spray through the front can miss deposits on the blower, coils and drain components. Our Gold-Standard Deep Clean goes into suitable accessible parts and checks the drainage. If an odour returns, the cause may include trapped moisture or another issue that needs investigation." },
  { q: "What actually gets rid of mould? Do you just spray something over it?", a: "We open the suitable covers and use coil-compatible cleaning products, controlled rinsing and steam where appropriate to loosen and physically remove accessible contamination. Products are selected and used according to their labels. We also check drainage because persistent moisture lets mould return." },
  { q: "Can dust and mould trigger asthma or allergies?", a: "Yes. Dust and mould are recognised asthma and allergy triggers. A proper aircon clean is one practical way to deal with build-up in the system circulating room air. Keeping the rest of the home dry and well-ventilated matters too." },
  { q: "What about cleaning products near children's beds or our kitchen?", a: "We protect furniture and nearby surfaces, isolate power and use products suitable for the unit. We control rinse water, follow product instructions and reassemble and check the aircon before finishing. We explain the process before we start." },
  { q: "Do you clean the drain and the outdoor unit too?", a: "Yes, where safe and accessible. We look after the condensate drain components to help clear sludge and support water flow, and remove appropriate outdoor debris and grime. Those parts matter to how the whole system operates." },
  { q: "Could I just use a cheap spray and clean it myself?", a: "Keep washing removable filters as the manufacturer advises—that's useful routine care. Deep internal cleaning is different: there are electrical parts, delicate coils, drainage paths and model-specific access. The wrong spray or water pressure can do damage." },
  { q: "How often should a split system have a proper deep clean?", a: "It depends on use, indoor dust, pets, humidity and the unit's condition. We can talk you through simple signs to check and a sensible maintenance routine for your household during the free consultation." },
  { q: "Is the consultation genuinely free? Do we have to buy a clean?", a: "It's free and there is no pressure or obligation to book anything. You'll speak with an experienced air-conditioning professional about your unit, what deep cleaning involves, how to reduce build-up at home and what options make sense. You decide what happens next." }
];
export default function SplitSystemCleaning() {
  const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideEmail, setGuideEmail] = useState("");
  const [guideConsent, setGuideConsent] = useState(false);
  const [guideStatus, setGuideStatus] = useState("idle");
  const [guideError, setGuideError] = useState("");
  const guideShown = useRef(false);
  useEffect(() => {
    if (guideShown.current) return undefined;
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
  }, []);
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
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="bg-[#FBFAF8] text-[#18232F]" style={{ paddingTop: "max(0px, calc(var(--sp-site-header-height, 96px) - 24px))" }} data-testid="split-cleaning-landing">
      <Helmet>
        <title>Six-Step Gold-Standard Deep Clean | Split-System Deep Cleaning Sydney | SplitsPro</title>
        <meta name="description" content="For Sydney parents and carers: a proper one-visit Gold-Standard Deep Clean deep clean for the hidden dust and grime in the split system their family lives around. Learn how we care for indoor units, drains and outdoor coils." />
        <link rel="canonical" href="https://splitspro.com.au/split-system-cleaning/" />
        <meta property="og:title" content="Fresher Air Where Your Family Eats, Plays & Sleeps | SplitsPro" />
        <meta property="og:description" content="A practical, parent-focused deep clean for the aircon running through family mealtimes, play and sleep. Discover what our six-step gold-standard process reaches beyond a filter rinse." />
      </Helmet>




      {(
        <section id="cleaning-stage-1" className="scroll-mt-16 bg-[#FCFBF8] pt-0 pb-6 sm:py-10" data-testid="cleaning-diagnosis">
          <div className="sp-container mx-auto max-w-6xl">
            <div className="mt-0">
              <div className="mx-auto grid max-w-6xl overflow-hidden rounded-2xl bg-[#052137] shadow-[0_16px_40px_rgba(5,33,55,0.12)] md:grid-cols-[1.12fr_0.88fr]" data-testid="cleaning-baby-hero-overlay">
                <div className="relative z-10 flex flex-col justify-center px-5 py-7 text-white sm:px-8 sm:py-10 md:px-10 md:py-12" data-testid="cleaning-hero-title-over-photo">
                  <p className="max-w-md text-[0.7rem] font-black uppercase leading-5 tracking-[0.12em] text-[#F4C620] sm:text-xs">For Sydney mums, parents &amp; everyone who looks after family</p>
                  <h1 className="mt-3 max-w-2xl font-sans text-[clamp(2rem,7.6vw,3rem)] font-black uppercase leading-[1.06] tracking-tight text-white md:text-[clamp(2.35rem,3.5vw,3.6rem)]">FRESHER AIR WHERE YOUR FAMILY <span className="text-[#F4C620]">EATS, PLAYS &amp; SLEEPS.</span></h1>
                  <p className="mt-4 max-w-xl text-base font-semibold leading-7 text-[#E8F2F7] sm:text-lg">Clean filters don't tell the whole story. Dust and damp grime can still be hiding deeper inside your split system.</p>
                  <p className="mt-5 text-sm font-bold leading-6 text-[#BDEAF5]">Satisfaction guaranteed — or you don't pay for the clean.</p>
                </div>
                <div className="relative h-[290px] overflow-hidden bg-[#E6F3FA] sm:h-[340px] md:h-auto md:min-h-[480px]" data-testid="cleaning-baby-photo-crop">
                  <img src="/landing/splitspro-cleaning-baby-approved.png" alt="Baby smiling and playing at home" width={409} height={487} loading="eager" decoding="async" fetchPriority="high" className="absolute inset-0 block h-full w-full object-contain object-center md:object-cover" />
                </div>
              </div>
              <div className="mx-auto mt-5 grid max-w-6xl gap-3 text-sm font-black leading-6 text-[#12384E] sm:grid-cols-3 sm:text-base">
                <p className="rounded-lg bg-white px-4 py-3"><span className="text-[#008DB8]">01.</span> We reach beyond a filter rinse.</p>
                <p className="rounded-lg bg-white px-4 py-3"><span className="text-[#008DB8]">02.</span> We care for the drain and outdoor unit.</p>
                <p className="rounded-lg bg-white px-4 py-3"><span className="text-[#008DB8]">03.</span> We protect your home and explain the work.</p>
              </div>
              <div className="mt-7 max-w-4xl">
                <p className="text-xl font-black leading-8 text-[#12384E] sm:text-2xl">Being a mum is a full-time job that doesn't clock off.</p>
                <p className="mt-4 text-lg font-bold leading-8 text-[#294353] sm:text-xl">From meals and washing to school runs and bedtime, you're already doing a hundred little things to give your kids the best. You want them to grow up happy, healthy and ready to take on the world.</p>
                <p className="mt-5 border-l-4 border-[#F4C620] pl-5 text-base leading-8 text-[#294353] sm:text-lg font-semibold">And while you're doing all that, the aircon keeps drawing air in and sending it back into the rooms where they eat, play and sleep. The question isn't whether you care enough — you clearly do. <strong className="text-[#0B2641]">It's what a gold-standard clean reaches behind the filter that matters.</strong></p>
              </div>
            </div>
            <section className="mt-10" aria-label="What can build up inside an air conditioner">
              <p className="text-sm font-black uppercase tracking-widest text-[#007EA7]">Why a spotless room can still feel stale</p>
              <h2 className="mt-2 max-w-4xl text-2xl font-black uppercase leading-tight text-[#0B2641] sm:text-4xl">YOU'VE DONE EVERYTHING TO KEEP HOME CLEAN. <span className="text-[#008DB8]">WHAT ABOUT THE AIRCON RUNNING THROUGH IT?</span></h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#2B4758] sm:text-lg font-semibold">You're already putting in the work: the clean sheets, the dinner prep, the toys off the floor. But it's easy to overlook the aircon's internal parts while the unit keeps moving room air around the people you love.</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {[
                  ["You clean the surfaces your kids touch.", "But every time the split runs, room air is pulled through the unit and sent back into the spaces where they eat, play and sleep. A washed filter is only part of the clean."],
                  ["You finally settle the kids for the night.", "Then the split runs for hours while they sleep. The dust and residue on internal parts do not disappear because you washed the front filter."],
                  ["You want to give your children the world.", "A good start in life isn't just big moments. It's the everyday home you work so hard to make comfortable. The hidden parts of the aircon deserve that same effort."],
                  ["And you want the best for your parents, too.", "For older loved ones and the rest of your family, a cared-for home includes the things you can't easily see — like the build-up inside a split system."]
                ].map(([title, description]) => (
                  <div key={title} className="rounded-lg bg-white p-5 border-l-4 border-[#008DB8]">
                    <h3 className="text-lg font-black leading-snug text-[#0B2641] sm:text-xl">{title}</h3>
                    <p className="mt-3 text-base leading-7 text-[#2B4758] font-semibold">{description}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 max-w-3xl border-l-4 border-[#F4C620] pl-5 text-lg font-bold leading-8 text-[#244456]">A clean front cover is reassuring. But it's the hidden build-up that a filter rinse can miss.</p>
            </section>
            <section className="mt-12 rounded-xl border border-[#D4E5ED] bg-white px-5 py-8 sm:px-9 sm:py-10" aria-label="Everyday spaces your family uses">
              <p className="text-sm font-black uppercase tracking-widest text-[#007EA7]">You know that feeling</p>
              <h2 className="mt-3 max-w-4xl text-3xl font-black uppercase leading-tight text-[#0B2641] sm:text-4xl">YOU'VE CLEANED THE ROOM. <span className="text-[#008DB8]">BUT WHAT'S STILL INSIDE THE UNIT?</span></h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#2C4658] sm:text-lg font-semibold">You put real effort into the home: food prepared properly, clean bedding, washed toys, wiped benches. That's the everyday work of looking after your family — and it deserves to count.</p>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[#2C4658] sm:text-lg font-semibold">Yet the aircon in those same rooms keeps pulling air in and blowing it back out. Behind a clean-looking filter, dust and damp residue build up on parts you cannot see. Those deposits can support mould and bacterial growth. It's worth cleaning the system itself, not just everything around it.</p>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[#2C4658] sm:text-lg font-semibold">You shouldn't have to wonder whether the aircon is the one thing your household cleaning never reaches. A proper deep clean helps you deal with that overlooked build-up so you can get on with family life.</p>
              <div className="mt-6 rounded-lg border-l-8 border-[#F4C620] bg-[#FFF0A8] px-5 py-5" data-testid="cleaning-sneeze-analogy">
                <p className="text-xl font-black uppercase leading-8 text-[#0B2641] sm:text-2xl">YOU WOULDN'T LET SOMEONE <span className="bg-[#F4C620] px-1">SNEEZE OVER YOUR FAMILY'S DINNER.</span></p>
                <p className="mt-3 text-base font-bold leading-7 text-[#294353] sm:text-lg">So why leave years of dust and grime sitting in the aircon running while you cook, eat and settle the kids? The gold standard starts where a quick filter wash stops.</p>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                {[
                  ["FOR THE LITTLE ONES.", "A proper clean of accessible internal parts in rooms where babies nap and children play."],
                  ["FOR FAMILY MEALTIMES.", "Help clear airborne cooking grime that has settled inside the unit near busy kitchen spaces."],
                  ["FOR THE FAMILY YOU LOOK AFTER.", "When children, grandparents and loved ones are around, a clean-feeling home means taking care of the parts you cannot see as well."]
                ].map(([heading, detail]) => (
                  <div key={heading} className="rounded-lg bg-[#F5FAFC] p-5 border-l-4 border-[#F4C620]">
                    <h3 className="text-lg font-black leading-snug text-[#12384E] sm:text-xl">{heading}</h3>
                    <p className="mt-3 text-base leading-7 text-[#365163] font-semibold">{detail}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      )}

      {(
        <section id="cleaning-stage-2" className="scroll-mt-16 bg-[#F0F9FC] py-6 sm:py-12" data-testid="cleaning-solution-trust">
          <div className="sp-container mx-auto max-w-6xl">
            <div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.17em] text-[#007EA7]">The SplitsPro Gold-Standard Deep Clean</p>
                <h2 className="mt-3 max-w-4xl font-sans text-3xl font-black uppercase leading-tight text-[#0B2641] sm:text-4xl">
                  We strip it back. <span className="text-[#008DB8]">Not just wipe over it.</span>
                </h2>
                <p className="mt-5 max-w-3xl text-base leading-8 text-[#294556] sm:text-lg font-semibold">We open suitable accessible parts of the unit to reach the dirt that can linger behind a clean-looking front cover.</p>
                <p className="mt-4 max-w-3xl text-base leading-8 text-[#294556] sm:text-lg font-semibold">Then we use the right combination of <strong className="text-[#0B2641]">professional cleaning solutions, controlled steam and rinsing</strong> — followed by drain and outdoor-unit care.</p>
                <p className="mt-4 max-w-3xl text-base leading-8 text-[#294556] sm:text-lg font-semibold">Finally, we put it back together, check the operation and show you what we cleaned.</p>
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
            <section className="mt-14 scroll-mt-24" id="gold-standard-clean" data-testid="cleaning-process-benefits">
              <p className="text-sm font-black uppercase tracking-widest text-[#007EA7]">The SplitsPro Bare-Bones Deep Clean</p>
              <h3 className="mt-3 max-w-5xl text-3xl font-black uppercase leading-tight text-[#0B2641] sm:text-5xl">NOT JUST A FILTER RINSE. <span className="text-[#008DB8]">HERE'S OUR 6-STEP GOLD-STANDARD DEEP CLEAN.</span></h3>
              <p className="mt-6 max-w-3xl text-lg font-bold leading-8 text-[#24485D] sm:text-xl">We strip it back, get to the grime, clean the drain and outdoor unit — then check the result.</p>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[#2C4658] sm:text-lg font-semibold">Different types of build-up need different tools. That's why we combine <strong className="text-[#0B2641]">coil-compatible cleaners, enzyme detergents, controlled steam and careful rinsing</strong> to help lift and remove accessible dust and grime.</p>
              <div className="mt-9 grid gap-6 md:grid-cols-2">
                {[
                  {number:"01",title:"Bare-Bones Teardown",hook:"WE OPEN IT UP. NOT JUST WIPE OVER IT.",paragraphs:["We protect the room, isolate power and remove suitable covers, filters and louvers. That gives us better access to dirt hiding behind the front panel.","We reach accessible coils, the blower wheel and the drain tray. Parts such as the wheel or tray are removed when the specific model allows it safely."]},
                  {number:"02",title:"Triple-Action Chemical Attack",hook:"STICKY GRIME NEEDS MORE THAN PLAIN WATER.",paragraphs:["Professional coil-compatible surfactants and enzyme-based detergents help loosen oils, dust and organic build-up.","We select the right product for the unit and give it the contact time it needs. Any sanitising product is used only where suitable and according to its label."]},
                  {number:"03",title:"Thermal Flush & Steam",hook:"LOOSEN THE DIRT. THEN REMOVE IT.",paragraphs:["Controlled steam helps soften stubborn build-up on suitable components. We use gentle, directed rinsing where appropriate to carry away the loosened grime.","Wastewater is collected to protect your home. Some enzyme products are designed to self-rinse with condensate, so we follow those instructions instead of washing them off too early."]},
                  {number:"04",title:"Electronic Protection",hook:"WE CLEAN THE AIRCON — NOT SOAK ITS ELECTRONICS.",paragraphs:["We isolate power and protect the indoor and outdoor circuit boards from water, steam and cleaning spray.","If we spot contamination or a possible board fault, we explain what we've found and how we'll protect the unit while cleaning."]},
                  {number:"05",title:"Drainage & Outdoor Clean",hook:"YES, THE DRAIN AND OUTDOOR UNIT TOO.",paragraphs:["We clean accessible drain components to remove sludge and help condensate flow as it should.","Outside, we clear debris and clean suitable condenser surfaces with safe water pressure. That can help airflow and performance when dirt is the problem."]},
                  {number:"06",title:"Reassembly, Testing & Proof",hook:"PUT BACK PROPERLY. CHECKED BEFORE WE LEAVE.",paragraphs:["We reassemble the suitable parts, check the unit and accessible drainage, and tidy the work area.","Where practical, we'll show you before-and-after photos so you can see the care taken with the parts we serviced."]}
                ].map((step) => (
                  <article key={step.number} className="rounded-xl border border-[#C7E2EB] bg-white px-6 py-7 shadow-sm sm:px-8 sm:py-9">
                    <p className="text-sm font-black uppercase tracking-widest text-[#007EA7]">STEP {step.number} OF 6 · {step.title}</p>
                    <h4 className="mt-4 text-2xl font-black uppercase leading-tight text-[#0B2641] sm:text-[1.8rem]">{step.hook}</h4>
                    <div className="mt-5 space-y-4">
                      {step.paragraphs.map((paragraph, index) => (
                        <p key={index} className="text-base leading-8 text-[#30495A] sm:text-lg font-semibold">{paragraph}</p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <p className="mt-6 max-w-4xl border-l-4 border-[#F4C620] pl-5 text-sm leading-7 text-[#4B6575] sm:text-base font-semibold">Every split system is different. We choose suitable access, products, steam and rinsing based on the unit and manufacturer's instructions.</p>
            </section>
            <section className="mt-14 rounded-xl bg-[#08263E] px-6 py-9 text-white sm:px-10 sm:py-12" data-testid="cleaning-service-promise" id="cleaning-guarantee">
              <p className="text-sm font-black uppercase tracking-widest text-[#62D1EC]">Our work, backed by a simple promise</p>
              <h3 className="mt-4 max-w-4xl text-3xl font-black uppercase leading-tight sm:text-5xl">SATISFACTION GUARANTEED. <span className="text-[#F4C620]">OR YOU DON'T PAY FOR THE CLEAN.</span></h3>
              <p className="mt-6 max-w-3xl text-lg font-bold leading-8 text-white sm:text-xl">We explain the agreed accessible cleaning work before we begin. If you're not satisfied with that cleaning result, tell us so we can put it right. If we can't, you don't pay for the cleaning service — or we'll refund that cleaning charge if already paid.</p>
              <p className="mt-6 max-w-4xl border-t border-white/20 pt-5 text-sm leading-7 text-white/85 font-medium">We explain which parts are safely accessible for your model before starting. Your Australian Consumer Law rights continue to apply.</p>
            </section>
            <section className="mt-14 border-t-2 border-[#BCDDEB] pt-9" id="cleaning-trust" data-testid="cleaning-trust">
              <p className="text-sm font-black uppercase tracking-widest text-[#007EA7]">Why people choose SplitsPro</p>
              <h3 className="mt-3 max-w-4xl text-3xl font-black uppercase leading-tight text-[#0B2641] sm:text-4xl">WE TREAT YOUR CHILD'S PLAY SPACE AND YOUR FAMILY HOME WITH CARE.</h3>
              <div className="mt-7 grid gap-7 sm:grid-cols-[1fr_1fr] sm:items-start">
                <div>
                  <GoogleRating />
                  <p className="mt-4 max-w-md text-base leading-8 text-[#3B5667] sm:text-lg font-semibold">Real customer feedback, genuine work photos and a clear explanation before we begin.</p>
                </div>
                <div className="space-y-5">
                  <p className="flex items-start gap-3 text-base font-bold leading-7 text-[#14394E] sm:text-lg"><ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-[#008DB8]" /> Licensed and insured technicians.</p>
                  <p className="flex items-start gap-3 text-base font-bold leading-7 text-[#14394E] sm:text-lg"><ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-[#008DB8]" /> Your floors and furniture are protected, and we leave the work area tidy.</p>
                  <p className="flex items-start gap-3 text-base font-bold leading-7 text-[#14394E] sm:text-lg"><ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-[#008DB8]" /> A cleaning checklist, job photos and completion certificate.</p>
                </div>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2" data-testid="cleaning-google-review-cards">
                {[
                  { name: "Erfaan Khan", quote: "They were polite, helpful, and took the time to explain everything…" },
                  { name: "Gill McPhee", quote: "Amin and Ibrahim were excellent installers." }
                ].map((review) => (
                  <article key={review.name} className="rounded-xl border border-[#DEE4E8] bg-white p-5 shadow-sm sm:p-6" data-testid="cleaning-google-review-card">
                    <div className="flex items-start justify-between gap-3">
                      <GoogleReviewBadge />
                      <span className="text-lg font-black tracking-[0.12em] text-[#FBBC04]" role="img" aria-label="5 out of 5 stars">★★★★★</span>
                    </div>
                    <blockquote className="mt-5 text-lg font-bold leading-8 text-[#243F51]">“{review.quote}”</blockquote>
                    <p className="mt-4 text-sm font-black text-[#0B2641]">{review.name}</p>
                    <a href="https://g.page/r/CYTvO1ipeYUtEBM/" target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#007EA7] underline">View on Google <ArrowRight className="h-3 w-3" /></a>
                  </article>
                ))}
              </div>
              <p className="mt-7 max-w-3xl text-sm leading-7 text-[#435B6B] font-medium">We explain suitable access and protect nearby surfaces before work begins.</p>
            </section>
            <button type="button" onClick={() => scrollToSection("cleaning-next-step")}
              className="mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-[#F4C620] px-5 py-4 text-base font-black uppercase text-[#082337] hover:bg-[#FBDD42] sm:w-auto sm:px-9"
              data-testid="cleaning-next-offer">
              See how we care for your home <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </section>
      )}

      {(
        <>
          <section id="cleaning-next-step" className="scroll-mt-24 bg-[#FFF7E8] py-10 sm:py-16" data-testid="cleaning-next-step">
            <div className="sp-container mx-auto max-w-6xl">
              <p className="text-xs font-black uppercase tracking-[0.17em] text-[#007EA7]">For the home you work hard to look after</p>
              <h2 className="mt-3 max-w-4xl text-3xl font-black uppercase leading-tight text-[#0B2641] sm:text-5xl">KNOW WHAT YOUR AIRCON NEEDS. <span className="text-[#008DB8]">GET EXPERT ADVICE FOR FREE.</span></h2>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#30495B] sm:text-lg font-semibold">If it's been ages since your last proper deep clean, this is the easiest first step: talk with an experienced air-conditioning professional, get useful information for your family home and decide what makes sense. No charge to speak with us.</p>
              <div className="mt-6 border-l-4 border-[#F4C620] bg-white px-5 py-4" data-testid="cleaning-urgency">
                <p className="text-lg font-black text-[#0B2641] sm:text-xl">ANOTHER DAY, ANOTHER NIGHT WITH THE SAME BUILD-UP.</p>
                <p className="mt-2 text-base font-semibold leading-7 text-[#30495B]">The aircon goes back on tonight. If there's years of dust and damp grime inside, another week of putting it off won't remove it. Your family is in those rooms every day. Take a few minutes now to find out what your system needs. The advice costs nothing.</p>
              </div>
              <div className="mt-8 flex flex-col gap-5 rounded-xl bg-[#08263E] px-6 py-7 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <div>
                  <h3 className="text-xl font-black uppercase leading-snug sm:text-2xl">Questions about your aircon? Talk to us.</h3>
                  <p className="mt-2 max-w-2xl text-base font-semibold leading-7 text-[#D7EAF2]">No form to fill out. Ask us what a proper deep clean includes and whether it makes sense for your unit.</p>
                </div>
                <a href={PHONE_TEL} className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#F4C620] px-6 py-4 text-sm font-black uppercase tracking-wide text-[#082337] hover:bg-[#FFE06B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Call SplitsPro <ArrowRight className="h-4 w-4" /></a>
              </div>
              <div className="mt-5" aria-label="SplitsPro Google rating"><GoogleRating /></div>
              <p className="mt-4 text-sm font-bold text-[#244456] sm:text-base">✓ Licensed &amp; insured technicians &nbsp; ✓ We explain and show the work</p>
            </div>
          </section>

      <section className="bg-white py-14 sm:py-20" data-testid="cleaning-faq">
        <div className="sp-container grid gap-10 lg:grid-cols-[.68fr_1.32fr] lg:gap-16">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#9B753E]">Straight answers</p><h2 className="mt-3 text-3xl font-black uppercase leading-tight text-[#0B2641] sm:text-4xl">Still have questions? Straight answers before we arrive.</h2></div>
          <div className="border-t border-[#E6E0D7]">
            {FAQS.map((item, index) => (
              <div className="border-b border-[#E6E0D7]" key={item.q}>
                <button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between gap-5 py-6 text-left text-base font-black leading-7 text-[#192532] sm:text-lg"><span>{item.q}</span><ChevronDown className={"h-4 w-4 shrink-0 transition-transform " + (openFaq === index ? "rotate-180" : "")} /></button>
                {openFaq === index && <p className="max-w-3xl pb-7 text-base leading-8 text-[#536675] sm:text-lg font-semibold">{item.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
        </>
      )}
      {guideOpen && (
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
                <p className="text-sm font-medium">Leave your email to unlock a handy five-point home-care guide.</p>
                <label className="block text-sm font-bold">Email address<input type="email" required autoComplete="email" value={guideEmail} onChange={(e) => setGuideEmail(e.target.value)} className="mt-1 w-full rounded border p-3" placeholder="you@example.com" /></label>
                <label className="flex items-start gap-2 text-xs font-medium"><input type="checkbox" checked={guideConsent} onChange={(e) => setGuideConsent(e.target.checked)} className="mt-0.5" />Optional: I agree to receive occasional SplitsPro cleaning tips and offers by email. I can unsubscribe at any time.</label>
                {guideError && <p role="alert" className="text-sm text-red-700 font-medium">{guideError}</p>}
                <button type="submit" disabled={guideStatus === "saving"} className="w-full rounded bg-[#F4C620] p-3 font-black disabled:opacity-50">{guideStatus === "saving" ? "Please wait…" : "Get the free guide"}</button>
                <button type="button" onClick={() => setGuideOpen(false)} className="w-full p-2 text-sm underline">No thanks</button>
              </form>
            )}
          </div>
        </div>
      )}
      <div className="border-t border-[#E6E0D7] bg-[#FAF9F7] py-5">
        <div className="sp-container flex flex-wrap items-center justify-between gap-3 text-xs text-[#646970]">
          <span>SplitsPro · Bass Hill and selected surrounding Western Sydney suburbs. Call to confirm service in your postcode.</span>
          <Link to="/cleaning" className="font-bold text-[#946F3C] underline">All cleaning services</Link>
        </div>
      </div>
    </div>
  );
}
