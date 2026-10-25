import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";
import { api } from "../lib/api";
import { GoogleRating } from "../components/sections";
import { PHONE_TEL, FEATURED_REVIEW } from "../lib/data";

// This is the ONE consumer sales landing page for split-system cleaning.
// One continuous explanation of the Hero Method, with no on-page booking calendar.


const FAQS = [
  { q: "We already wash the filters. Why would the rest need cleaning?", a: "Filters are just the first layer. Dust, pet dander, airborne cooking residue and moisture can also collect on accessible coils, the blower wheel and the drain tray. Our Hero Method goes beyond the filter wash." },
  { q: "Can dust and mould inside a home aggravate asthma or allergies?", a: "Yes. Dust and mould are recognised triggers for some people with asthma and allergies. Keeping accessible parts of a split system clean is a practical way to tackle one potential source of build-up." },
  { q: "What do you clean in a baby's bedroom or a family living area?", a: "We protect nearby furniture and play areas, open suitable covers, clean accessible internal surfaces, look after drainage, clean the outdoor unit where appropriate, then reassemble and check operation." },
  { q: "What about kitchens where we prepare family meals?", a: "Airborne cooking oils and fine dust can settle on indoor components over time. Suitable professional detergents help loosen those deposits so we can remove accessible grime rather than just wiping the outside." },
  { q: "Will you need to take the entire air conditioner off the wall?", a: "Usually not. We open or remove suitable service-accessible covers and parts. The exact access and cleaning method depend on the unit's design." },
  { q: "How do we know the work was properly done?", a: "We explain the service before starting, protect the area, reassemble and test the unit, and show accessible areas cleaned where practical. If agreed accessible areas were missed, contact us within seven days so we can inspect and make that work right." }
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
  const [consultation, setConsultation] = useState({ name: "", phone: "", email: "" });
  const [consultationStatus, setConsultationStatus] = useState("idle");
  const [consultationError, setConsultationError] = useState("");
  const updateConsultation = (field, value) => setConsultation((previous) => ({ ...previous, [field]: value }));
  const submitConsultation = async (event) => {
    event.preventDefault();
    const phoneDigits = consultation.phone.replace(/[^0-9]/g, "");
    if (!consultation.name.trim() || phoneDigits.length < 8) {
      setConsultationError("Please enter your name and a phone number we can call.");
      return;
    }
    setConsultationStatus("saving");
    setConsultationError("");
    try {
      await api.post("/quotes", {
        name: consultation.name.trim(),
        phone: consultation.phone.trim(),
        email: consultation.email.trim(),
        service: "Split System Cleaning Consultation",
        suburb: "To be confirmed on callback",
        message: "Family-focused deep-clean consultation requested. If email provided, customer requests service information by email.",
        photo_url: "",
      });
      setConsultationStatus("success");
    } catch {
      setConsultationStatus("idle");
      setConsultationError("Your request could not be sent just now. Please try again or call us.");
    }
  };
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="bg-[#FBFAF8] text-[#18232F]" data-testid="split-cleaning-landing">
      <Helmet>
        <title>Six-Step Hero Method | Split-System Deep Cleaning Sydney | SplitsPro</title>
        <meta name="description" content="For Sydney parents and carers: a proper one-visit Hero Method deep clean for the hidden dust and grime in the split system their family lives around. Learn how we care for indoor units, drains and outdoor coils." />
        <link rel="canonical" href="https://splitspro.com.au/split-system-cleaning/" />
        <meta property="og:title" content="Fresher Air Where Your Family Eats, Plays & Sleeps | SplitsPro" />
        <meta property="og:description" content="A practical, parent-focused deep clean for the aircon running through family mealtimes, play and sleep. Discover what our six-step gold-standard process reaches beyond a filter rinse." />
      </Helmet>




      {(
        <section id="cleaning-stage-1" className="scroll-mt-16 bg-[#FCFBF8] pt-0 pb-6 sm:py-10" data-testid="cleaning-diagnosis">
          <div className="sp-container mx-auto max-w-6xl">
            <div className="mt-0">
              <div className="relative isolate overflow-hidden bg-[#08263E] sm:mx-auto sm:max-w-[680px] sm:rounded-xl" data-testid="cleaning-baby-hero-overlay">
                <img src="/landing/splitspro-cleaning-baby-approved.png" alt="Baby resting comfortably at home" width={409} height={487} loading="eager" decoding="async" fetchPriority="high" className="-mx-4 block h-auto w-[calc(100%+2rem)] max-w-none object-contain sm:mx-auto sm:w-full" />
                <div className="absolute inset-x-0 top-0 z-10 bg-[#052137]/95 px-4 py-2.5 text-white sm:px-7 sm:py-4" data-testid="cleaning-hero-title-over-photo">
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.1em] text-[#F4C620] sm:text-xs">Sydney parents &amp; families</p>
                  <h1 className="mt-1 max-w-2xl font-sans text-[clamp(1.12rem,4.5vw,2rem)] font-black uppercase leading-[1.12] tracking-tight text-white">FRESHER AIR WHERE YOUR FAMILY <span className="text-[#F4C620]">EATS, PLAYS &amp; SLEEPS.</span></h1>
                </div>
              </div>
              <p className="mx-auto mt-4 max-w-[680px] text-base font-black leading-7 text-[#12384E] sm:text-xl">One thorough visit to tackle hidden dust, mould-prone grime and debris inside your split system. <span className="text-[#008DB8]">Our workmanship is backed by a return-to-clean promise.</span></p>
              <div className="mt-7 max-w-4xl">
                <p className="text-xl font-black leading-8 text-[#12384E] sm:text-2xl">You wash the toys, wipe down the kitchen benches, and change the sheets.</p>
                <p className="mt-4 text-lg font-bold leading-8 text-[#294353] sm:text-xl">But the aircon keeps running during family dinner, your child's afternoon nap and the nights you want everyone sleeping comfortably.</p>
                <p className="mt-5 border-l-4 border-[#F4C620] pl-5 text-base leading-8 text-[#294353] sm:text-lg font-semibold">You already know your split system moves air around the home. The part most people never see is what builds up <em>behind its filter</em>. <strong className="text-[#0B2641]">So what should a gold-standard deep clean actually remove?</strong></p>
              </div>
            </div>
            <section className="mt-10" aria-label="What can build up inside an air conditioner">
              <p className="text-sm font-black uppercase tracking-widest text-[#007EA7]">Why a spotless room can still feel stale</p>
              <h2 className="mt-2 max-w-4xl text-2xl font-black uppercase leading-tight text-[#0B2641] sm:text-4xl">THE HOUSE LOOKS SPOTLESS. <span className="text-[#008DB8]">WHAT IS THE AIRCON MOVING THROUGH IT?</span></h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#2B4758] sm:text-lg font-semibold">You work hard to make home comfortable for the people who depend on you. It's easy to miss what sits behind the front panel of a split system.</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {[
                  ["You clean the surfaces your kids touch.", "But every time the split runs, room air is pulled through the unit and sent back into the spaces where they eat, play and sleep. A washed filter is only part of the clean."],
                  ["You finally settle the kids for the night.", "Then the split runs for hours while they sleep. The dust and residue on internal parts do not disappear because you washed the front filter."],
                  ["Asthma triggers are already on your mind.", "Dust and mould are recognised asthma triggers. If they have built up in the system you use every day, that is another place in your home worth cleaning properly."],
                  ["You want your parents to visit a cared-for home.", "You make the tea, tidy the lounge and get everything ready. The aircon above everyone deserves the same attention, especially if it has not had a deep clean in years."]
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
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#2C4658] sm:text-lg font-semibold">You wipe the kitchen benches before preparing dinner and keep the kids' rooms clean. You would never knowingly leave dust and grime all over those surfaces.</p>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[#2C4658] sm:text-lg font-semibold">The same rooms have an aircon moving air through them for hours. Dust, cooking residue and moisture collect on internal parts. Damp deposits also create conditions where mould and bacteria thrive. That is why the inside of the unit deserves attention, not just its filter.</p>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[#2C4658] sm:text-lg font-semibold">Dust and mould are recognised asthma triggers. If you are careful about bedding, floors and food preparation for your family, the appliance circulating room air belongs on that cleaning list too.</p>
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
            <button type="button" onClick={() => scrollToSection("hero-method")}
              className="mt-6 flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-[#F4C620] px-5 py-4 text-base font-black uppercase text-[#082337] hover:bg-[#FBDD42] sm:w-auto sm:px-9"
              data-testid="cleaning-next-solution">
              See what most quick cleans miss <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </section>
      )}

      {(
        <section id="cleaning-stage-2" className="scroll-mt-16 bg-[#F0F9FC] py-6 sm:py-12" data-testid="cleaning-solution-trust">
          <div className="sp-container mx-auto max-w-6xl">
            <div className="mb-10 rounded-xl bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10" data-testid="cleaning-caring-home-message">
              <p className="text-sm font-black uppercase tracking-widest text-[#007EA7]">For the rooms where your family sleeps, plays and eats</p>
              <h2 className="mt-3 max-w-4xl text-3xl font-black uppercase leading-tight text-[#0B2641] sm:text-4xl">A CHILD'S PLAY AREA DESERVES MORE THAN A SURFACE WIPE.</h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#294556] sm:text-lg font-semibold">If you keep the toys, kitchen bench and bedding clean, the hidden dust inside the system running nearby deserves attention too. Here is how we approach it.</p>
            </div>
            <div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.17em] text-[#007EA7]">The SplitsPro Hero Method</p>
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
            <section className="mt-14" id="hero-method" data-testid="cleaning-process-benefits">
              <p className="text-sm font-black uppercase tracking-widest text-[#007EA7]">The SplitsPro Bare-Bones Deep Clean</p>
              <h3 className="mt-3 max-w-5xl text-3xl font-black uppercase leading-tight text-[#0B2641] sm:text-5xl">NOT JUST A FILTER RINSE. <span className="text-[#008DB8]">HERE'S OUR 6-STEP HERO METHOD.</span></h3>
              <p className="mt-6 max-w-3xl text-lg font-bold leading-8 text-[#24485D] sm:text-xl">We strip it back, get to the grime, clean the drain and outdoor unit — then check the result.</p>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[#2C4658] sm:text-lg font-semibold">Different types of build-up need different tools. That's why we combine <strong className="text-[#0B2641]">coil-compatible cleaners, enzyme detergents, controlled steam and careful rinsing</strong> to help lift and remove accessible dust and grime.</p>
              <div className="mt-9 grid gap-6 md:grid-cols-2">
                {[
                  {number:"01",title:"Bare-Bones Teardown",hook:"WE OPEN IT UP. NOT JUST WIPE OVER IT.",paragraphs:["We protect the room, isolate power and remove suitable covers, filters and louvers. That gives us better access to dirt hiding behind the front panel.","We reach accessible coils, the blower wheel and the drain tray. Parts such as the wheel or tray are removed when the specific model allows it safely."]},
                  {number:"02",title:"Triple-Action Chemical Attack",hook:"STICKY GRIME NEEDS MORE THAN PLAIN WATER.",paragraphs:["Professional coil-compatible surfactants and enzyme-based detergents help loosen oils, dust and organic build-up.","We select the right product for the unit and give it the contact time it needs. Any sanitising product is used only where suitable and according to its label."]},
                  {number:"03",title:"Thermal Flush & Steam",hook:"LOOSEN THE DIRT. THEN REMOVE IT.",paragraphs:["Controlled steam helps soften stubborn build-up on suitable components. We use gentle, directed rinsing where appropriate to carry away the loosened grime.","Wastewater is collected to protect your home. Some enzyme products are designed to self-rinse with condensate, so we follow those instructions instead of washing them off too early."]},
                  {number:"04",title:"Electronic Protection",hook:"WE CLEAN THE AIRCON — NOT SOAK ITS ELECTRONICS.",paragraphs:["We isolate power and protect the indoor and outdoor circuit boards from water, steam and cleaning spray.","If we spot contamination or a possible board fault, we explain it. Specialist PCB cleaning and repairs are separate work, never an automatic extra charge."]},
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
              <h3 className="mt-4 max-w-4xl text-3xl font-black uppercase leading-tight sm:text-5xl">AGREED ACCESSIBLE PARTS CLEANED. <span className="text-[#F4C620]">OR WE RETURN TO PUT IT RIGHT.</span></h3>
              <p className="mt-6 max-w-3xl text-lg font-bold leading-8 text-white sm:text-xl">If we missed an agreed accessible area during the Hero Method service, contact us within seven days. We'll inspect it and complete that cleaning work without an extra service charge.</p>
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
              <div className="mt-8 grid gap-4 md:grid-cols-2" data-testid="cleaning-customer-testimonials">
                <blockquote className="rounded-lg border border-[#D4E5ED] bg-white p-5">
                  <p className="text-base font-bold leading-7 text-[#23465A]">“{FEATURED_REVIEW.text}”</p>
                  <footer className="mt-4 text-sm font-black text-[#0B2641]">Sia · SplitsPro installation customer</footer>
                </blockquote>
                <blockquote className="rounded-lg border border-[#D4E5ED] bg-white p-5">
                  <p className="text-base font-bold leading-7 text-[#23465A]">“Excellent installers. They work very well as a team. Heatwave arrives tomorrow, 34 degrees, and we have cooling! So happy.”</p>
                  <footer className="mt-4 text-sm font-black text-[#0B2641]">Gill McPhee · SplitsPro installation customer</footer>
                </blockquote>
              </div>
              <p className="mt-4 text-sm font-semibold text-[#435B6B]">These existing customer testimonials are about installation workmanship. <a href="https://g.page/r/CYTvO1ipeYUtEBM/" target="_blank" rel="noreferrer" className="font-black text-[#007EA7] underline">Read SplitsPro's Google reviews</a>.</p>
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
          <section id="cleaning-next-step" className="scroll-mt-16 bg-[#FFF7E8] py-10 sm:py-16" data-testid="cleaning-next-step">
            <div className="sp-container mx-auto max-w-6xl">
              <p className="text-xs font-black uppercase tracking-[0.17em] text-[#007EA7]">For the home you work hard to look after</p>
              <h2 className="mt-3 max-w-4xl text-3xl font-black uppercase leading-tight text-[#0B2641] sm:text-5xl">YOU'VE DONE THE SURFACE CLEANING. <span className="text-[#008DB8]">LET'S LOOK AFTER WHAT'S INSIDE.</span></h2>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#30495B] sm:text-lg font-semibold">A thorough deep clean is a practical, budget-conscious way to care for the split system you already own — reaching accessible internal areas that household cleaning cannot reach.</p>
              <div className="mt-6 border-l-4 border-[#F4C620] bg-white px-5 py-4" data-testid="cleaning-urgency">
                <p className="text-lg font-black text-[#0B2641] sm:text-xl">ANOTHER DAY, ANOTHER NIGHT WITH THE SAME BUILD-UP.</p>
                <p className="mt-2 text-base font-semibold leading-7 text-[#30495B]">It's easy to say you'll sort the aircon out next week. Then dinner, school, work and life take over. If the hidden dust and grime is there today, putting it off doesn't clean it. Make the first move now: ask us what a proper clean would involve for your unit.</p>
              </div>
              <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <form className="rounded-xl border border-[#C9DDE7] bg-white p-5 shadow-sm sm:p-7" data-testid="cleaning-consultation-form" onSubmit={submitConsultation}>
                  <h3 className="text-2xl font-black uppercase leading-tight text-[#0B2641]">Book a consultation</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#375469] sm:text-base">Leave your details. We'll call you to talk through the cleaning and arrange what comes next. No calendar or payment required.</p>
                  {consultationStatus === "success" ? (
                    <div role="status" className="mt-5 rounded-md bg-[#EAF7EF] p-5 text-[#14532D]" data-testid="cleaning-consultation-success">
                      <p className="text-lg font-black">Request received.</p>
                      <p className="mt-2 text-sm font-semibold">Thanks, {consultation.name.trim()}. SplitsPro has your details and will call you back to discuss your cleaning consultation.</p>
                    </div>
                  ) : (
                    <>
                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm font-black text-[#0B2641]">Your name <span aria-hidden="true">*</span><input name="name" type="text" required autoComplete="name" value={consultation.name} onChange={(event) => updateConsultation("name", event.target.value)} placeholder="First and last name" className="mt-2 w-full rounded-md border border-[#B4CDD9] px-4 py-3 text-base font-semibold text-[#0B2641] focus:outline-[#008DB8]" /></label>
                        <label className="block text-sm font-black text-[#0B2641]">Phone number <span aria-hidden="true">*</span><input name="phone" type="tel" required autoComplete="tel" value={consultation.phone} onChange={(event) => updateConsultation("phone", event.target.value)} placeholder="Your best number" className="mt-2 w-full rounded-md border border-[#B4CDD9] px-4 py-3 text-base font-semibold text-[#0B2641] focus:outline-[#008DB8]" /></label>
                      </div>
                      <label className="mt-4 block text-sm font-black text-[#0B2641]">Email <span className="font-semibold text-[#567286]">(optional, for the service information)</span><input name="email" type="email" autoComplete="email" value={consultation.email} onChange={(event) => updateConsultation("email", event.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-md border border-[#B4CDD9] px-4 py-3 text-base font-semibold text-[#0B2641] focus:outline-[#008DB8]" /></label>
                      {consultationError && <p role="alert" className="mt-4 font-semibold text-red-700">{consultationError}</p>}
                      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                        <button type="submit" disabled={consultationStatus === "saving"} className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-[#F4C620] px-7 py-4 text-base font-black uppercase text-[#082337] hover:bg-[#FBDD42] disabled:opacity-50 sm:w-auto" data-testid="cleaning-contact-cta">
                          {consultationStatus === "saving" ? "Sending request…" : "Book a consultation"} <ArrowRight className="h-5 w-5" />
                        </button>
                        <div className="rounded-lg bg-white px-3 py-3" data-testid="cleaning-cta-google-rating" aria-label="SplitsPro Google rating and review count"><GoogleRating /></div>
                      </div>
                      <p className="mt-3 text-xs leading-5 text-[#567286]">We use your details to contact you about this request. If you include an email, we can send the relevant service information.</p>
                    </>
                  )}
                </form>
                <p className="max-w-xs text-base font-bold leading-8 text-[#30495B]">A couple of minutes now beats another month of wondering what is hidden behind the filter. <a className="font-black text-[#007EA7] underline" href={PHONE_TEL}>Prefer to call? Talk to us directly.</a></p>
              </div>
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
