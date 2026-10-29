import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";
import { api, getReviews, submitQuote } from "../lib/api";

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

const CLEANING_PROCESS_PHOTOS = [
  {src:"/landing/splitspro-process-filter.png",alt:"Real job — covers and filters opened",caption:"Taking it apart to reach hidden dirt"},
  {src:"/landing/splitspro-process-coil.png",alt:"Real job — indoor coil exposed",caption:"Reaching beyond the filter"},
  {src:"/landing/splitspro-process-covers.png",alt:"Real job — cleaned removable covers",caption:"Carefully cleaned and ready to reassemble"}
];

const CONSULTATION_REVIEW_FALLBACK = [
  { id: "erfaan", name: "Erfaan Khan", rating: 5, service: "Air conditioning work", text: "They were polite, helpful, and took the time to explain everything…" },
  { id: "gill", name: "Gill McPhee", rating: 5, service: "Air conditioner installation", text: "Excellent installers. They work very well as a team. Heatwave arrives tomorrow, 34 degrees, and we have cooling! So happy." },
  { id: "mat", name: "Mat 134", rating: 5, service: "Air conditioning work", text: "Best in the business, amazing work." },
];

const FAQS = [
  { q: "We wash the filters. Isn't that enough?", a: "A filter wash is useful, but dirt can still build up deeper inside the air conditioner. Our Gold Standard clean reaches the parts a filter rinse misses." },
  { q: "My aircon still smells after a clean. Why would yours be different?", a: "A quick spray can miss the dirt and damp sludge inside. Our deeper clean tackles the buildup and drainage. If a smell returns, we'll explain what else may be causing it." },
  { q: "What actually gets rid of mould? Do you just spray something over it?", a: "No. We open up the unit, use professional cleaning treatments and physically remove buildup with careful rinsing and steam where suitable. Our anti-mould coating then helps protect the cleaned surfaces against regrowth." },
  { q: "Can dust and mould trigger asthma or allergies?", a: "Yes. Dust and mould can trigger asthma and allergies. Cleaning buildup inside the air conditioner is one practical part of looking after your home; managing dampness and ventilation matters too." },
  { q: "What about cleaning chemicals near my children or kitchen?", a: "We protect your room, use suitable professional products and follow their directions. We keep water away from sensitive parts, clean up and check the air conditioner before we leave." },
  { q: "How often does my split system need a deep clean?", a: "It depends on use, dust, cooking, pets and moisture. We'll help you work out what makes sense for your home during the free consultation." },
  { q: "Is the consultation genuinely free? Do we have to buy a clean?", a: "Yes, it's free. We'll answer your questions and explain your options without pressure or any obligation to book." }

];
export default function SplitSystemCleaning() {
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideEmail, setGuideEmail] = useState("");
  const [guideConsent, setGuideConsent] = useState(false);
  const [guideStatus, setGuideStatus] = useState("idle");
  const [guideError, setGuideError] = useState("");
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
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [selectedProcessPhoto, setSelectedProcessPhoto] = useState(null);
  const [consultationForm, setConsultationForm] = useState({ name: "", suburb: "", phone: "" });
  const [consultationStatus, setConsultationStatus] = useState("idle");
  const [consultationError, setConsultationError] = useState("");
  const [consultationReviews, setConsultationReviews] = useState(CONSULTATION_REVIEW_FALLBACK);

  useEffect(() => {
    let active = true;
    getReviews().then((items) => {
      if (!active || !Array.isArray(items)) return;
      const fiveStars = items.filter((item) => Number(item.rating) === 5 && typeof item.text === "string" && item.text.trim().length > 20);
      if (fiveStars.length >= 2) setConsultationReviews(fiveStars.slice(0, 3));
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!consultationOpen) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") setConsultationOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [consultationOpen]);

  useEffect(() => {
    if (!selectedProcessPhoto) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") setSelectedProcessPhoto(null); };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selectedProcessPhoto]);

  const submitConsultation = async (event) => {
    event.preventDefault();
    const name = consultationForm.name.trim();
    const suburb = consultationForm.suburb.trim();
    const phone = consultationForm.phone.trim();
    if (!name || !suburb || phone.replace(/\D/g, "").length < 8) {
      setConsultationError("Please enter your name, suburb and a valid phone number.");
      return;
    }
    setConsultationError("");
    setConsultationStatus("saving");
    try {
      await submitQuote({
        name, suburb, phone, service: "Split System Cleaning",
        email: "", address: "", preferred_date: "",
        message: "Free Gold-Standard Deep Clean consultation. Honest advice, no pressure.",
        page_url: window.location.href, landing_page: window.location.href, referrer: document.referrer || ""
      });
      try {
        if (typeof window.fbq === "function") window.fbq("track", "Lead", { content_name: "Split System Cleaning Free Consultation" });
        if (typeof window.gtag === "function") window.gtag("event", "generate_lead", { lead_type: "cleaning_consultation" });
      } catch {}
      setConsultationStatus("success");
      setConsultationForm({ name: "", suburb: "", phone: "" });
    } catch {
      setConsultationStatus("idle");
      setConsultationError("We couldn't send your request. Please try again or call SplitsPro.");
    }
  };

  return (
    <div className="bg-[#FBFAF8] text-[#18232F]" style={{ paddingTop: "max(0px, calc(var(--sp-site-header-height, 96px) - 24px))" }} data-testid="split-cleaning-landing">
      <Helmet>
        <title>Gold Standard Split-System Deep Clean Sydney | SplitsPro</title>
        <meta name="description" content="For Sydney parents and carers: learn how our Gold Standard Deep Clean tackles hidden dust, oily buildup and damp grime inside split air conditioners. Careful cleaning, protective treatment and no-pressure advice." />
        <link rel="canonical" href="https://splitspro.com.au/split-system-cleaning/" />
        <meta property="og:title" content="Fresher Air Where Your Family Eats, Plays & Sleeps | SplitsPro" />
        <meta property="og:description" content="A practical, parent-focused deep clean for the aircon running through family mealtimes, play and sleep. See how our Gold Standard Deep Clean reaches the places a filter rinse misses." />
      </Helmet>




      {(
        <section id="cleaning-stage-1" className="scroll-mt-16 bg-[#FCFBF8] pt-0 pb-6 sm:py-10" data-testid="cleaning-diagnosis">
          <div className="sp-container mx-auto max-w-6xl">
            <div className="mt-0">
              <div className="mx-auto grid max-w-6xl overflow-hidden rounded-2xl bg-[#052137] shadow-[0_16px_40px_rgba(5,33,55,0.12)] md:grid-cols-[1.12fr_0.88fr]" data-testid="cleaning-baby-hero-overlay">
                <div className="relative z-10 flex flex-col justify-center px-5 py-7 text-white sm:px-8 sm:py-10 md:px-10 md:py-12" data-testid="cleaning-hero-title-over-photo">
                  <p className="max-w-md text-[0.7rem] font-black uppercase leading-5 tracking-[0.12em] text-[#F4C620] sm:text-xs">For Sydney mums, parents &amp; everyone who looks after family</p>
                  <h1 className="mt-3 max-w-2xl font-sans text-[clamp(2rem,7.6vw,3rem)] font-black uppercase leading-[1.06] tracking-tight text-white md:text-[clamp(2.35rem,3.5vw,3.6rem)]">FRESHER AIR WHERE YOUR FAMILY <span className="text-[#F4C620]">EATS, PLAYS &amp; SLEEPS.</span></h1>
                  <p className="mt-4 max-w-xl text-base font-semibold leading-7 text-[#E8F2F7] sm:text-lg">Your home can look spotless. But something you can't see may still be affecting the air your family lives in.</p>
                </div>
                <div className="relative h-[290px] overflow-hidden bg-[#E6F3FA] sm:h-[340px] md:h-auto md:min-h-[480px]" data-testid="cleaning-baby-photo-crop">
                  <img src="/landing/splitspro-cleaning-baby-approved.png" alt="Baby smiling and playing at home" width={409} height={487} loading="eager" decoding="async" fetchPriority="high" className="absolute inset-0 block h-full w-full object-contain object-center md:object-cover" />
                </div>
              </div>
              <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-[#D4E5ED] bg-white px-5 py-8 shadow-[0_12px_34px_rgba(5,33,55,0.06)] sm:px-10 sm:py-12" data-testid="cleaning-mums-problem-copy">
                <p className="text-sm font-black uppercase tracking-widest text-[#007EA7]">For the mums keeping everyone looked after</p>
                <h2 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-[#0B2641] sm:text-4xl">MUMS, YOU WORK SO HARD TO <span className="text-[#008DB8]">KEEP YOUR FAMILY HEALTHY.</span></h2>
                <div className="mt-5 max-w-4xl space-y-4 text-lg font-semibold leading-8 text-[#2C4658]">
                  <p>Being a mum is a full-time job.</p>
                  <p>You make healthy meals, wash baby bottles, clean toys, mop floors and look after your family every day.</p>
                  <p>You want your children to grow up happy, healthy and ready to take on the world.</p>
                </div>
                <div className="mt-8 border-l-8 border-[#F4C620] bg-[#FFF2AD] px-5 py-6">
                  <h3 className="text-xl font-black leading-8 text-[#0B2641] sm:text-2xl">BUT WHILE YOU'RE BUSY CLEANING YOUR HOME, SOMETHING COULD BE GROWING INSIDE YOUR AIR CONDITIONER.</h3>
                  <p className="mt-4 text-lg font-bold leading-8 text-[#203D51]">Studies show that harmful bacteria, mould and fungi can grow inside air conditioners. Scientists have found harmful bacteria on the parts that cool the air your family breathes.</p>
                </div>
                <h3 className="mt-10 text-2xl font-black uppercase leading-tight text-[#0B2641] sm:text-3xl">HERE'S WHY.</h3>
                <p className="mt-4 max-w-4xl text-lg font-semibold leading-8 text-[#2C4658]">Your air conditioner pulls in air from around your home. Think about everything that moves through that air each day:</p>
                <div className="mt-5 max-w-4xl space-y-4 border-l-4 border-[#008DB8] pl-5 text-lg font-semibold leading-8 text-[#2C4658]">
                  <p><strong className="text-[#0B2641]">Think about your kitchen.</strong> Frying meat, fish or onions sends tiny grease and oil particles into the air. There are cooking fumes, steam, smoke from burnt toast and smells from leftover food or the kitchen rubbish bin.</p>
                  <p><strong className="text-[#0B2641]">And throughout the house?</strong> Dust, pet hair, dirt and lingering cigarette or shisha smoke are all part of the air moving around your rooms.</p>
                </div>
                <p className="mt-7 text-xl font-black leading-8 text-[#0B2641]">YOUR AIR CONDITIONER PULLS IN THIS AIR AGAIN AND AGAIN.</p>
                <div className="mt-4 max-w-4xl space-y-4 text-lg font-semibold leading-8 text-[#2C4658]">
                  <p>Over time, dust, smoke particles, grease and dirt can collect inside.</p>
                  <p>And when your air conditioner runs, water forms on its cold parts.</p>
                  <p><strong className="text-[#0B2641]">Now you've got dirt, grease and moisture sitting together in a dark place.</strong></p>
                  <p>Bacteria and mould love dark, damp places.</p>
                </div>
                <p className="mt-6 rounded-lg bg-[#08263E] px-5 py-6 text-xl font-black leading-8 text-white sm:text-2xl">THIS CREATES THE PERFECT BREEDING GROUND FOR MOULD, FUNGI AND HARMFUL BACTERIA THAT CAN AFFECT YOUR FAMILY'S HEALTH.</p>
                <h3 className="mt-10 text-2xl font-black uppercase text-[#0B2641] sm:text-3xl">AND HERE'S THE WORRYING PART.</h3>
                <div className="mt-4 max-w-4xl space-y-4 text-lg font-semibold leading-8 text-[#2C4658]">
                  <p>When your air conditioner runs, it blows air straight back into your home. Dust, mould spores and bacteria caught in that moving air go with it.</p>
                  <p>They move through the rooms and can settle on things around your house.</p>
                  <p className="font-black text-[#0B2641]">The same air moves through your living room, your children's bedrooms and the kitchen where you prepare your family's food.</p>
                  <p>You spend so much time keeping your floors, benches and bedrooms clean.</p>
                </div>
                <p className="mt-8 border-l-8 border-[#F4C620] bg-[#FFF2AD] px-5 py-6 text-xl font-black leading-8 text-[#0B2641] sm:text-2xl">BUT WHEN WAS THE LAST TIME YOU CLEANED THE INSIDE OF THE MACHINE BLOWING AIR AROUND YOUR HOME?</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {(
        <section id="cleaning-stage-2" className="scroll-mt-16 bg-[#F0F9FC] py-10 sm:py-16" data-testid="cleaning-solution-trust">
          <div className="sp-container mx-auto max-w-6xl">
            <header className="relative overflow-hidden rounded-[1.75rem] bg-[#08263E] px-6 py-10 text-white sm:rounded-[2rem] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
              <div aria-hidden="true" className="absolute right-0 top-0 h-1.5 w-2/3 bg-[#F4C620]" />
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#A5E7F4] sm:text-sm">A deeper clean. A fresher-feeling home.</p>
              <h2 className="mt-6 max-w-5xl text-[clamp(1.6rem,7vw,4rem)] font-black leading-[1.05] tracking-[-0.05em] sm:text-6xl lg:text-[5.25rem]" style={{fontFamily:"'Manrope', Arial, sans-serif"}}>
                THE SPLITSPRO<br />
                <span className="text-[#F4C620]">GOLD STANDARD</span><br />
                DEEP CLEAN.
              </h2>
            </header>
            <div className="mt-5 grid grid-cols-3 gap-2 sm:mt-7 sm:gap-4" data-testid="cleaning-real-process-gallery">
              {CLEANING_PROCESS_PHOTOS.map((photo) => (
                <button key={photo.src} type="button" onClick={() => setSelectedProcessPhoto(photo)} className="group relative overflow-hidden rounded-xl border border-[#C4DAE6] bg-white shadow-sm focus-visible:outline focus-visible:outline-4 focus-visible:outline-[#008DB8]" aria-label={`Enlarge real cleaning photo: ${photo.caption}`}>
                  <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] sm:aspect-[3/2]" />
                  <span className="absolute inset-x-0 bottom-0 bg-[#08263E]/90 px-2 py-2 text-center text-[11px] font-extrabold text-white sm:text-sm">Tap to view</span>
                </button>
              ))}
            </div>
            <section className="mt-10 space-y-5 scroll-mt-24 sm:mt-14 sm:space-y-7" id="gold-standard-clean" data-testid="cleaning-process-benefits">
              <article className="grid gap-5 border-b border-[#C7DEE7] bg-transparent px-2 py-11 sm:px-6 sm:py-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
                <div>
                  <div className="mb-5 h-1.5 w-14 rounded-full bg-[#008DB8]" />
                  <h3 className="text-[2rem] font-black uppercase leading-[1.09] tracking-[-0.045em] text-[#09263D] sm:text-[2.9rem]" style={{fontFamily:"'Manrope', Arial, sans-serif"}}>WE STRIP IT BACK <span className="text-[#007EA7]">TO BARE BONES.</span></h3>
                </div>
                <div className="space-y-4 text-[1.06rem] font-medium leading-[1.8] text-[#284658] sm:text-[1.18rem]">
                  <p>We don't just wipe what you can see.</p>
                  <p>We strip your air conditioner back to reach the hidden places where mould, bacteria and dirt build up.</p>
                  <p className="border-l-4 border-[#F4C620] pl-4 text-xl font-extrabold leading-snug text-[#09263D] sm:text-2xl">Every corner gets the attention it deserves.</p>

                </div>
              </article>

              <article className="grid gap-5 border-l-4 border-[#008DB8] bg-[#E5F4F9] px-6 py-9 sm:px-10 sm:py-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
                <div>
                  <div className="mb-5 h-1.5 w-14 rounded-full bg-[#008DB8]" />
                  <h3 className="text-[2rem] font-black uppercase leading-[1.09] tracking-[-0.045em] text-[#09263D] sm:text-[2.9rem]" style={{fontFamily:"'Manrope', Arial, sans-serif"}}>WE GO AFTER THE <span className="text-[#007EA7]">MOULD, BACTERIA AND FUNGI.</span></h3>
                </div>
                <div className="space-y-4 text-[1.06rem] font-medium leading-[1.8] text-[#284658] sm:text-[1.18rem]">
                  <p>To tackle the mould, bacteria and fungi hiding inside, we use specialist deep-cleaning treatments and remove the buildup they live in.</p>
                  <p>Our heavy-duty, low-odour cleaner cuts through oily cooking residue, grease and stubborn dirt. It is pH-neutral and biodegradable, so we can clean deeply without relying on harsh acid or alkaline cleaners. Our enzyme-based treatment also breaks down the slimy sludge and organic buildup that help mould take hold.</p>
                  <p className="border-l-4 border-[#008DB8] pl-4 text-xl font-extrabold leading-snug text-[#09263D] sm:text-2xl">Because if you leave the buildup behind, you're leaving the problem behind.</p>

                </div>
              </article>

              <article className="grid gap-5 border-b border-[#C7DEE7] bg-transparent px-2 py-11 sm:px-6 sm:py-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
                <div>
                  <div className="mb-5 h-1.5 w-14 rounded-full bg-[#008DB8]" />
                  <h3 className="text-[2rem] font-black uppercase leading-[1.09] tracking-[-0.045em] text-[#09263D] sm:text-[2.9rem]" style={{fontFamily:"'Manrope', Arial, sans-serif"}}>THEN WE BRING IN <span className="text-[#007EA7]">THE STEAM AND PRESSURE.</span></h3>
                </div>
                <div className="space-y-4 text-[1.06rem] font-medium leading-[1.8] text-[#284658] sm:text-[1.18rem]">
                  <p>We thoroughly steam-clean and pressure-rinse your air conditioner, washing away loosened dirt, mould residue and grime.</p>
                  <p className="border-l-4 border-[#F4C620] pl-4 text-xl font-extrabold leading-snug text-[#09263D] sm:text-2xl">Leaving the inside cleaner, airflow less restricted and your air conditioner feeling fresh again.</p>

                </div>
              </article>

              <article className="grid gap-5 rounded-[1.5rem] bg-[#08263E] text-white shadow-lg px-6 py-9 sm:px-10 sm:py-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
                <div>
                  <div className="mb-5 h-1.5 w-14 rounded-full bg-[#F4C620]" />
                  <h3 className="text-[2rem] font-black uppercase leading-[1.09] tracking-[-0.045em] text-white sm:text-[2.9rem]" style={{fontFamily:"'Manrope', Arial, sans-serif"}}>WE DON'T JUST CLEAN IT. <span className="text-[#F4C620]">WE HELP PROTECT IT.</span></h3>
                </div>
                <div className="space-y-4 text-[1.06rem] font-medium leading-[1.8] text-[#E2EEF4] sm:text-[1.18rem]">
                  <p>Here's what makes our Gold Standard different.</p>
                  <p>We apply a protective anti-mould coating to help stop mould from growing back.</p>
                  <p>Combined with our enzyme-based cleaning treatment, it helps tackle existing buildup and leaves your air conditioner better protected against future grime and mould.</p>
                  <p className="border-l-4 border-[#F4C620] pl-4 text-xl font-extrabold leading-snug text-[#F4C620] sm:text-2xl">A deeper clean today. Longer-lasting freshness tomorrow.</p>

                </div>
              </article>

              <article className="grid gap-5 border-b border-[#C7DEE7] bg-transparent px-2 py-11 sm:px-6 sm:py-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
                <div>
                  <div className="mb-5 h-1.5 w-14 rounded-full bg-[#008DB8]" />
                  <h3 className="text-[2rem] font-black uppercase leading-[1.09] tracking-[-0.045em] text-[#09263D] sm:text-[2.9rem]" style={{fontFamily:"'Manrope', Arial, sans-serif"}}>YOUR AIR CONDITIONER GETS <span className="text-[#007EA7]">THE VIP TREATMENT.</span></h3>
                </div>
                <div className="space-y-4 text-[1.06rem] font-medium leading-[1.8] text-[#284658] sm:text-[1.18rem]">
                  <p>We carefully clean the casing, treat sensitive electrical areas with suitable specialist cleaners, clear the drain and give the outdoor unit the attention it needs.</p>
                  <p>We use soft microfibre towels and protect the surrounding area, so your home and air conditioner are treated with care.</p>
                  <p className="border-l-4 border-[#F4C620] pl-4 text-xl font-extrabold leading-snug text-[#09263D] sm:text-2xl">No careless mess. No cutting corners. Just proper care from start to finish.</p>

                </div>
              </article>

              <article className="grid gap-5 border-l-4 border-[#008DB8] bg-[#E5F4F9] px-6 py-9 sm:px-10 sm:py-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
                <div>
                  <div className="mb-5 h-1.5 w-14 rounded-full bg-[#008DB8]" />
                  <h3 className="text-[2rem] font-black uppercase leading-[1.09] tracking-[-0.045em] text-[#09263D] sm:text-[2.9rem]" style={{fontFamily:"'Manrope', Arial, sans-serif"}}>WE DON'T LEAVE UNTIL <span className="text-[#007EA7]">WE'VE CHECKED OUR WORK.</span></h3>
                </div>
                <div className="space-y-4 text-[1.06rem] font-medium leading-[1.8] text-[#284658] sm:text-[1.18rem]">
                  <p>We carefully put everything back together and test your air conditioner before leaving.</p>
                  <p>The result?</p>
                  <p className="border-l-4 border-[#008DB8] pl-4 text-xl font-extrabold leading-snug text-[#09263D] sm:text-2xl">A cleaner air conditioner. Fresher-feeling air. Better airflow. And a home that feels that little bit nicer for the people you love.</p>
                  <p className="pt-3 text-lg font-black uppercase tracking-[-0.02em] text-[#007EA7] sm:text-xl">That's what we call the SplitsPro Gold Standard.</p>
                </div>
              </article>
            </section>
            <section className="mt-14 border-t-2 border-[#BCDDEB] pt-9" id="cleaning-trust" data-testid="cleaning-trust">
              <p className="text-sm font-black uppercase tracking-widest text-[#007EA7]">Why people choose SplitsPro</p>
              <h3 className="mt-3 max-w-4xl text-3xl font-black uppercase leading-tight text-[#0B2641] sm:text-4xl">WE TREAT YOUR CHILD'S PLAY SPACE AND YOUR FAMILY HOME WITH CARE.</h3>
              <div className="mt-7 grid gap-7 sm:grid-cols-[1fr_1fr] sm:items-start">
                <div>
                  <span className="inline-flex items-center gap-2 text-base font-black text-[#0B2641]"><span className="text-[#E7A700]">★★★★★</span> 5-star Google rated</span>
                  <p className="mt-4 max-w-md text-base leading-8 text-[#3B5667] sm:text-lg font-semibold">Real customer feedback, genuine work photos and a clear explanation before we begin.</p>
                </div>
                <div className="space-y-5">
                  <p className="flex items-start gap-3 text-base font-bold leading-7 text-[#14394E] sm:text-lg"><ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-[#008DB8]" /> Licensed and insured technicians.</p>
                  <p className="flex items-start gap-3 text-base font-bold leading-7 text-[#14394E] sm:text-lg"><ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-[#008DB8]" /> Your floors and furniture are protected, and we leave the work area tidy.</p>
                  <p className="flex items-start gap-3 text-base font-bold leading-7 text-[#14394E] sm:text-lg"><ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-[#008DB8]" /> A cleaning checklist, job photos and completion certificate.</p>
                </div>
              </div>
              <div className="mt-9" data-testid="cleaning-consultation-reviews">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest text-[#007EA7]">Real Google feedback</p>
                    <h3 className="mt-2 text-2xl font-black uppercase text-[#0B2641] sm:text-3xl">Real feedback about our workmanship.</h3>
                  </div>
                  <span className="inline-flex items-center gap-2 text-base font-black text-[#0B2641]"><span className="text-[#E7A700]">★★★★★</span> 5-star Google rated</span>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-3" data-testid="cleaning-google-review-cards">
                  {consultationReviews.map((review, index) => (
                    <figure key={review.id || review.name || index} className="rounded-xl border border-[#DEE4E8] bg-white p-5 shadow-sm sm:p-6" data-testid="cleaning-google-review-card">
                      <div className="flex items-center justify-between gap-2">
                        <GoogleReviewBadge />
                        <span className="text-base font-black tracking-wider text-[#FBBC04]" role="img" aria-label="5 out of 5 stars">★★★★★</span>
                      </div>
                      <blockquote className="mt-4 text-base font-bold leading-7 text-[#243F51]">
                        “{review.text.slice(0, 160).trimEnd() + (review.text.length > 160 ? "…" : "")}”
                      </blockquote>
                      <figcaption className="mt-4 text-sm font-bold text-[#0B2641]">{review.name || "SplitsPro customer"}{review.service && <span className="mt-1 block text-xs font-semibold text-[#4E6979]">{review.service}</span>}</figcaption>
                    </figure>
                  ))}
                </div>
                <a href="https://g.page/r/CYTvO1ipeYUtEBM/" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#007EA7] underline">Read more Google reviews <ArrowRight className="h-4 w-4" /></a>
              </div>
            </section>
            <section className="mt-14 rounded-xl bg-[#08263E] px-6 py-9 text-white sm:px-10 sm:py-12" data-testid="cleaning-service-promise" id="cleaning-guarantee">
              <p className="text-sm font-black uppercase tracking-widest text-[#62D1EC]">Our work, backed by a simple promise</p>
              <h3 className="mt-4 max-w-4xl text-3xl font-black uppercase leading-tight sm:text-5xl">SATISFACTION GUARANTEED. <span className="text-[#F4C620]">OR YOU DON'T PAY FOR THE CLEAN.</span></h3>
              <p className="mt-6 max-w-3xl text-lg font-bold leading-8 text-white sm:text-xl">We explain the agreed accessible cleaning work before we begin. If you're not satisfied with that cleaning result, tell us so we can put it right. If we can't, you don't pay for the cleaning service — or we'll refund that cleaning charge if already paid.</p>
              <p className="mt-6 max-w-4xl border-t border-white/20 pt-5 text-sm leading-7 text-white/85 font-medium">We explain which parts are safely accessible for your model before starting. Your Australian Consumer Law rights continue to apply.</p>
            </section>

          </div>
        </section>
      )}

      {(
        <>
          <section id="cleaning-next-step" className="scroll-mt-24 bg-[#FFF7E8] py-12 sm:py-20" data-testid="cleaning-next-step">
            <div className="sp-container mx-auto max-w-6xl">
              <p className="text-xs font-black uppercase tracking-[0.17em] text-[#007EA7]">Real advice for the family you look after</p>
              <h2 className="mt-3 max-w-5xl text-3xl font-black uppercase leading-tight text-[#0B2641] sm:text-5xl">
                YOU KEEP THEIR HOME CLEAN. <span className="text-[#008DB8]">LET US HELP WITH THE AIR THEY LIVE IN.</span>
              </h2>
              <p className="mt-6 max-w-4xl text-lg font-bold leading-8 text-[#294556] sm:text-xl">
                Whether you're caring for little ones, elderly parents or the whole family, you deserve straight answers about the air conditioner running in their rooms. Talk with a professional who'll listen, explain what to expect and give you advice you can actually use.
              </p>
              <p className="mt-4 max-w-4xl text-base font-semibold leading-8 text-[#40586A] sm:text-lg">
                No sales pitch. No pressure to arrange a clean. Even if you decide to do nothing else, you'll leave knowing more about caring for your home.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3" data-testid="cleaning-consultation-benefits">
                {[
                  ["Know what a deep clean can change.", "Clear advice about what's hiding inside your unit, what cleaning can help and what it can't fix."],
                  ["Look after your family's aircon.", "Simple ways to manage dust and moisture, plus signs your unit needs attention."],
                  ["Stay in control.", "Ask questions, understand the care involved and decide in your own time. No pressure."]
                ].map(([title, description]) => (
                  <article key={title} className="border-t-4 border-[#008DB8] bg-white px-5 py-6 sm:px-6">
                    <h3 className="text-xl font-black leading-snug text-[#0B2641]">{title}</h3>
                    <p className="mt-3 text-base font-medium leading-7 text-[#395469]">{description}</p>
                  </article>
                ))}
              </div>
              <div className="mt-9 rounded-xl bg-[#08263E] px-6 py-9 text-center text-white sm:px-10 sm:py-11" data-testid="cleaning-consultation-offer">
                <p className="text-sm font-black uppercase tracking-widest text-[#77D8EF]">For mums, carers and anyone looking after family</p>
                <h3 className="mx-auto mt-3 max-w-3xl text-2xl font-black uppercase leading-tight sm:text-4xl">REAL ADVICE. NO PRESSURE. <span className="text-[#F4C620]">NOTHING TO LOSE.</span></h3>
                <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-8 text-[#E5F3F7] sm:text-lg">Ask us anything about your split system and indoor air quality. We'll help you understand your options and leave the decision with you.</p>
                <button type="button" onClick={() => { setConsultationStatus("idle"); setConsultationError(""); setConsultationOpen(true); }}
                  className="mx-auto mt-7 flex min-h-14 w-full max-w-md items-center justify-center gap-2 rounded-lg bg-[#F4C620] px-6 py-4 text-base font-black uppercase text-[#082337] hover:bg-[#FFE06B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  data-testid="cleaning-consultation-cta">Claim Your Free Consultation <ArrowRight className="h-5 w-5" /></button>
                <p className="mt-4 text-sm font-bold text-[#D5EAF2]">No obligation. No awkward sales conversation. Just guidance for your home.</p>
              </div>
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
      <section className="bg-[#08263E] px-5 py-12 text-white sm:py-16" data-testid="cleaning-final-cta">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9DE1EE]">One last thing</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-[clamp(1.9rem,5.3vw,3.6rem)] font-black uppercase leading-[1.1] tracking-[-0.04em]" style={{fontFamily:"'Manrope', Arial, sans-serif"}}>YOUR HOME LOOKS CLEAN. <span className="text-[#F4C620]">WHAT ABOUT THE AIRCON?</span></h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold leading-8 text-[#E8F2F7]"><strong className="text-white">P.S.</strong> You don't have to guess what's hiding inside. Ask us what your system needs, get straight answers and decide when you're ready.</p>
          <button type="button" onClick={() => { setConsultationStatus("idle"); setConsultationError(""); setConsultationOpen(true); }} className="mx-auto mt-7 flex min-h-14 w-full max-w-md items-center justify-center gap-2 rounded-lg bg-[#F4C620] px-6 py-4 text-base font-black uppercase text-[#082337] hover:bg-[#FFE06B]">Claim Your Free Consultation <ArrowRight className="h-5 w-5" /></button>
          <p className="mt-3 text-sm font-bold text-[#CDE5ED]">Free advice. No pressure. No obligation.</p>
        </div>
      </section>
        </>
      )}
      {selectedProcessPhoto && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-[#051624]/95 p-3 sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedProcessPhoto(null); }}>
          <div role="dialog" aria-modal="true" aria-label="Real SplitsPro cleaning photo" className="relative w-full max-w-4xl rounded-xl bg-[#08263E] p-3 text-white shadow-2xl sm:p-5">
            <button type="button" onClick={() => setSelectedProcessPhoto(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white px-4 py-2 text-sm font-black text-[#08263E]" aria-label="Close enlarged photo">Close ✕</button>
            <img src={selectedProcessPhoto.src} alt={selectedProcessPhoto.alt} className="max-h-[77vh] w-full rounded-lg object-contain" />
            <p className="pt-4 text-center text-base font-bold">{selectedProcessPhoto.caption}</p>
          </div>
        </div>
      )}
      {consultationOpen && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-[#061A2A]/75 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setConsultationOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="cleaning-consultation-title" className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 text-[#102B40] shadow-2xl sm:p-8" data-testid="cleaning-consultation-popup">
            <button type="button" aria-label="Close consultation request" onClick={() => setConsultationOpen(false)} className="absolute right-3 top-2 rounded p-2 text-2xl text-[#294353] hover:bg-[#F0F9FC]">×</button>
            {consultationStatus === "success" ? (
              <div className="py-5 text-center" role="status">
                <p className="text-4xl text-[#008DB8]">✓</p>
                <h2 id="cleaning-consultation-title" className="mt-4 text-2xl font-black">You're all set.</h2>
                <p className="mt-3 text-base leading-7">We'll call to talk through your air conditioner and arrange a suitable time. No pressure to book a clean.</p>
                <button type="button" onClick={() => setConsultationOpen(false)} className="mt-5 rounded-lg bg-[#F4C620] px-6 py-3 font-black text-[#082337]">Back to the page</button>
              </div>
            ) : (
              <>
                <p className="text-xs font-black uppercase tracking-widest text-[#008DB8]">Friendly, honest cleaning advice</p>
                <h2 id="cleaning-consultation-title" className="mt-2 text-2xl font-black uppercase leading-tight">Claim your free consultation</h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-[#395469]">Tell us where to reach you. We'll explain your options honestly, with no obligation to book.</p>
                <form onSubmit={submitConsultation} className="mt-6 space-y-4" data-testid="cleaning-consultation-form">
                  <label className="block text-sm font-bold">Name
                    <input type="text" required autoFocus autoComplete="name" value={consultationForm.name} onChange={(event) => setConsultationForm((current) => ({ ...current, name: event.target.value }))} className="mt-1 block min-h-12 w-full rounded-lg border border-[#B5CCD7] bg-white px-4 text-base text-[#102B40]" placeholder="Your name" />
                  </label>
                  <label className="block text-sm font-bold">Suburb
                    <input type="text" required autoComplete="address-level2" value={consultationForm.suburb} onChange={(event) => setConsultationForm((current) => ({ ...current, suburb: event.target.value }))} className="mt-1 block min-h-12 w-full rounded-lg border border-[#B5CCD7] bg-white px-4 text-base text-[#102B40]" placeholder="Your suburb" />
                  </label>
                  <label className="block text-sm font-bold">Phone number
                    <input type="tel" required autoComplete="tel" value={consultationForm.phone} onChange={(event) => setConsultationForm((current) => ({ ...current, phone: event.target.value }))} className="mt-1 block min-h-12 w-full rounded-lg border border-[#B5CCD7] bg-white px-4 text-base text-[#102B40]" placeholder="04xx xxx xxx" />
                  </label>
                  {consultationError && <p role="alert" className="text-sm font-semibold text-red-700">{consultationError}</p>}
                  <button type="submit" disabled={consultationStatus === "saving"} className="w-full rounded-lg bg-[#F4C620] px-5 py-4 text-sm font-black uppercase text-[#082337] hover:bg-[#FFE06B] disabled:opacity-60">{consultationStatus === "saving" ? "Sending…" : "Request My Free Consultation"}</button>
                  <p className="text-center text-xs font-semibold text-[#526878]">Nothing to lose. Just useful advice for your home.</p>
                </form>
              </>
            )}
          </div>
        </div>
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
          <span>SplitsPro · Serving Western and South Western Sydney, plus surrounding Sydney suburbs. Ask us about your location.</span>
          <button type="button" onClick={() => setGuideOpen(true)} className="font-bold text-[#946F3C] underline">Get the free home-care guide by email</button>
        </div>
      </div>
    </div>
  );
}
