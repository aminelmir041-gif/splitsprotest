import { useRef } from "react";
import { Link } from "react-router-dom";
import { useLenis } from "lenis/react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { ArrowUpRight, Phone } from "lucide-react";
import Reveal from "../components/Reveal";
import {
  SectionHeading, Overline, CTASection, ProcessTimeline, BrandStrip, WhyGrid, Airflow,
  GoogleRating, ServiceReviews,
} from "../components/sections";
import ServiceAreasMap from "../components/ServiceAreasMap";
import QuoteForm from "../components/QuoteForm";
import {
  IMAGES, FEATURED_SERVICES, FAQS, PHONE, PHONE_TEL, FEATURED_REVIEW, TRUST_QUOTE,
} from "../lib/data";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "../components/ui/accordion";

const scrollToEnquiry = (lenis) => {
  const el = document.getElementById("enquiry");
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -20 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Hero = () => {
  const lenis = useLenis();
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });

  const imgX = useTransform(smx, [-0.5, 0.5], [-24, 24]);
  const imgY = useTransform(smy, [-0.5, 0.5], [-16, 16]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const zoom = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section ref={ref} onMouseMove={onMove} data-testid="hero" className="relative h-screen min-h-[680px] overflow-hidden">
      <motion.div className="absolute inset-0 -z-10" style={{ scale: zoom, x: imgX, y: imgY }}>
        <img src={IMAGES.heroLiving} alt="Premium modern Australian living room with wall-mounted split system air conditioning" className="h-full w-full scale-110 object-cover" />
        <div className="absolute inset-0 hero-overlay-lr" />
        <div className="absolute inset-0 hero-overlay-base" />
      </motion.div>

      <Airflow className="z-0 opacity-50" />

      <motion.div className="sp-container relative z-10 flex h-full flex-col justify-center pt-28 pb-36 sm:pt-24 sm:pb-32" style={{ y: contentY, opacity: fade }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}>
          <Overline light>Premium Residential Air Conditioning · South West Sydney</Overline>
        </motion.div>

        <h1 className="mt-6 max-w-4xl font-serif text-5xl font-medium leading-[1.0] tracking-tight text-white sm:text-6xl lg:text-8xl">
          {["Crafted Comfort", "For Every Home"].map((line, i) => (
            <span key={line} className="block overflow-hidden py-1">
              <motion.span className="block" initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 1, delay: 0.55 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}>
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.9 }}
          className="mt-7 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">
          Every home deserves the right solution. We take the time to understand your home, recommend the perfect air conditioning system and install it with precision and care.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.05 }} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button onClick={() => scrollToEnquiry(lenis)} data-testid="hero-quote-btn" className="btn-glass justify-center !px-7 !py-3">Free Quote &amp; Plan <ArrowUpRight className="h-4 w-4" /></button>
          <a href={PHONE_TEL} data-testid="hero-call-btn" className="btn-glass-outline justify-center !px-7 !py-3"><Phone className="h-4 w-4" /> Call {PHONE}</a>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.25 }} className="mt-9 max-w-lg">
          <GoogleRating light />
          <figure data-testid="hero-featured-review" className="mt-5 border-l-2 border-[#FBBC04] pl-4">
            <p className="text-yellow-400 tracking-widest text-sm">{"★".repeat(FEATURED_REVIEW.rating)}</p>
            <blockquote className="mt-2 text-sm leading-relaxed text-white/85 line-clamp-3">&ldquo;{FEATURED_REVIEW.text}&rdquo;</blockquote>
            <figcaption className="mt-2 text-xs font-semibold text-white/70">— {FEATURED_REVIEW.name}, Verified Google Review</figcaption>
          </figure>
        </motion.div>
      </motion.div>

      <motion.div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 lg:block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
        <motion.div className="flex h-11 w-7 items-start justify-center rounded-full border border-white/40 p-1.5" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
          <motion.span className="h-2 w-1 rounded-full bg-white" animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }} />
        </motion.div>
      </motion.div>
    </section>
  );
};

const EnquirySection = () => (
  <section id="enquiry" className="scroll-mt-24 bg-white py-24 sm:py-32" data-testid="enquiry-section">
    <div className="sp-container grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
      <div>
        <Reveal><Overline>Free Quote &amp; Plan</Overline></Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 font-serif text-4xl font-medium leading-[1.08] tracking-tight text-[#1D1D1F] md:text-5xl text-balance">
            Trusted by homeowners across Western Sydney
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-7"><GoogleRating /></div>
        </Reveal>
        <Reveal delay={0.15}>
          <figure className="mt-8 border-l-2 border-[#C8A46A] pl-5">
            <p className="text-[#FBBC04] tracking-widest">{"★".repeat(5)}</p>
            <blockquote className="mt-3 font-serif text-xl leading-relaxed text-[#1D1D1F]">&ldquo;{TRUST_QUOTE}&rdquo;</blockquote>
          </figure>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-md leading-relaxed text-[#6E6E73]">
            Tell us a little about your home. Add a photo of your space or unit and we&apos;ll call you back to arrange a considered consultation and honest quote — no obligation.
          </p>
        </Reveal>
      </div>
      <Reveal delay={0.12}>
        <div className="rounded-2xl border border-[#E5E5EA] bg-white p-8 soft-shadow sm:p-10">
          <h3 className="font-serif text-2xl text-[#1D1D1F]">Request your free quote</h3>
          <p className="mt-2 text-sm text-[#6E6E73]">We&apos;ll be in touch shortly.</p>
          <div className="mt-8"><QuoteForm /></div>
        </div>
      </Reveal>
    </div>
  </section>
);


const Philosophy = () => (
  <section className="bg-white py-28 sm:py-36" data-testid="philosophy-section">
    <div className="sp-container">
      <Reveal><Overline>Our Philosophy</Overline></Reveal>
      <Reveal delay={0.05}>
        <p className="mt-8 max-w-4xl font-serif text-3xl font-normal leading-[1.25] tracking-tight text-[#1D1D1F] sm:text-4xl lg:text-5xl text-balance">
          We don&apos;t simply install air conditioners. We craft comfort — planning every detail, recommending only what your home truly needs, and finishing each installation with the care of skilled craftsmen.
        </p>
      </Reveal>
    </div>
  </section>
);

const Services = () => (
  <section className="bg-[#F5F5F7] py-28 sm:py-36" data-testid="services-section">
    <div className="sp-container">
      <SectionHeading overline="What We Do" title="Considered services, precisely delivered" />
      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {FEATURED_SERVICES.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 2) * 0.1}>
            <Link to={`/${s.slug}`} data-testid={`service-card-${i}`} className="hover-rise group block h-full overflow-hidden rounded-2xl border border-[#E5E5EA] bg-white soft-shadow-sm">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={s.image} alt={s.title} loading="lazy" className={`h-full w-full object-cover ${s.pos || "object-center"}`} />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3E9D2] text-[#C8A46A]">
                    <s.icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <h3 className="font-serif text-2xl text-[#1D1D1F]">{s.title}</h3>
                </div>
                <p className="mt-4 text-[#6E6E73]">{s.desc}</p>
                <span className="link-line mt-6 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-[#C8A46A]">
                  Explore <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const WhySplitsPro = () => (
  <section className="bg-white py-28 sm:py-36" data-testid="why-section">
    <div className="sp-container">
      <SectionHeading overline="Why SplitsPro" title="Trust Earned Through Craftsmanship" sub="No inflated claims. No rushed installations. Just thoughtful planning, quality workmanship and genuine care." />
      <div className="mt-16"><WhyGrid /></div>
    </div>
  </section>
);

const GalleryPreview = () => (
  <section className="bg-[#F5F5F7] py-28 sm:py-36" data-testid="gallery-preview">
    <div className="sp-container">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading overline="Real Installations" title="Work we&apos;re proud to show" />
        <Reveal><Link to="/gallery" className="link-line text-sm font-semibold uppercase tracking-wider text-[#C8A46A]">View Full Gallery</Link></Reveal>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {[
          { src: IMAGES.splitLiving, t: "Living Room Install" },
          { src: IMAGES.outdoorRinnai, t: "Rinnai Outdoor Unit" },
          { src: IMAGES.outdoorDaikin, t: "Daikin Condenser" },
        ].map((g, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div className="group img-reveal relative overflow-hidden rounded-2xl soft-shadow-sm">
              <img src={g.src} alt={g.t} loading="lazy" className="img-zoom aspect-[3/4] w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="font-serif text-lg text-white">{g.t}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Reviews = () => (
  <ServiceReviews title="Kind words from local homeowners" light max={6} />
);

const Process = () => (
  <section className="bg-white py-28 sm:py-36" data-testid="process-section">
    <div className="sp-container">
      <SectionHeading overline="Our Process" title="Thoughtful from first visit to lasting comfort" />
      <div className="mt-16"><ProcessTimeline /></div>
    </div>
  </section>
);

const ServiceAreas = () => (
  <section className="bg-[#F5F5F7] py-28 pb-40 sm:py-36" data-testid="areas-section">
    <div className="sp-container">
      <SectionHeading
        overline="Service Areas"
        title="Air Conditioning Across Western Sydney"
        sub="Based in Bass Hill, Splits Pro proudly services homes across Western Sydney and surrounding suburbs. If your suburb isn't listed, contact us — we regularly travel outside our primary service areas."
      />
      <div className="mt-14">
        <ServiceAreasMap />
      </div>
    </div>
  </section>
);

const HomeFAQ = () => (
  <section className="bg-white py-28 sm:py-36" data-testid="faq-section">
    <div className="sp-container grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
      <SectionHeading overline="FAQ" title="Answers, before you ask" />
      <Reveal delay={0.1}>
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} data-testid={`faq-item-${i}`} className="border-b border-[#E5E5EA]">
              <AccordionTrigger className="py-6 text-left font-serif text-xl font-normal text-[#1D1D1F] hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="pb-6 text-base leading-relaxed text-[#6E6E73]">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </div>
  </section>
);

const Home = () => (
  <>
    <Hero />
    <EnquirySection />
    <BrandStrip />
    <Philosophy />
    <Services />
    <WhySplitsPro />
    <GalleryPreview />
    <Reviews />
    <Process />
    <ServiceAreas />
    <HomeFAQ />
    <CTASection />
  </>
);

export default Home;
