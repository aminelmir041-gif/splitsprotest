import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { Check, ShieldCheck, Star, Sparkles } from "lucide-react";
import {
  PageHero, SectionHeading, Overline, FeatureList, ProcessTimeline, BrandStrip,
  TrustBadges, ServiceReviews, GoogleRating, CTASection,
} from "../components/sections";
import Reveal from "../components/Reveal";
import QuoteForm from "../components/QuoteForm";
import ServiceAreasMap from "../components/ServiceAreasMap";
import { getReviews } from "../lib/api";
import {
  SERVICE_LANDING, HOME_COMFORT_INCLUDES, HOME_COMFORT_GUARANTEES, FORM_TRUST_STRIP, GOOGLE_RATING,
} from "../lib/data";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "../components/ui/accordion";

const Stars = ({ n = 5 }) => (
  <span className="inline-flex items-center gap-0.5">
    {Array.from({ length: n }).map((_, i) => <Star key={i} className="h-4 w-4 fill-[#FBBC04] text-[#FBBC04]" />)}
  </span>
);

const HomeComfortPage = ({ slug, overline, title, sub, image, introImage, intro, features, imgPos = "object-center", seoBlocks = null, afterHero = null, extraFaqs = null, helmet = null, bookingForm = false }) => {
  const cfg = SERVICE_LANDING[slug] || {};
  const lenis = useLenis();
  const [review, setReview] = useState(null);

  useEffect(() => {
    getReviews().then((rs) => {
      const match = rs.find((r) => r.category === cfg.reviewCategory) || rs.find((r) => r.featured) || rs[0];
      setReview(match || null);
    }).catch(() => setReview(null));
  }, [cfg.reviewCategory]);

  const reserve = () => {
    const el = document.getElementById("reserve");
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -20 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {helmet}
      <PageHero overline={overline} title={title} sub={sub} image={image} imgPos={imgPos} />

      {afterHero}

      <TrustBadges />

      {/* Early two-column enquiry — captures leads high on the page */}
      <section id="reserve" className="scroll-mt-24 bg-white py-24 sm:py-32" data-testid="reserve-section">
        <div className="sp-container grid gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Left — value + proof */}
          <div>
            <Reveal><Overline>{bookingForm ? "Split System Installation" : "The Splits Pro Home Comfort Plan™"}</Overline></Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 font-serif text-4xl font-medium leading-[1.08] tracking-tight text-[#1D1D1F] md:text-5xl text-balance">
                {bookingForm ? "Book your split system installation" : "Your home deserves more than just a quote"}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl leading-relaxed text-[#6E6E73]">
                {bookingForm
                  ? "Tell us the room, preferred brand or system size if you know it, and your suburb. We’ll confirm suitability, installation details and the final price before locking in the job."
                  : "Most companies simply measure your home and send you a price. We take the time to understand your home, your lifestyle and your comfort goals before recommending the right solution — then prepare a personalised plan with a fixed written quote."}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8"><GoogleRating /></div>
            </Reveal>
            {review && (
              <Reveal delay={0.2}>
                <figure className="mt-8 border-l-2 border-[#C8A46A] pl-5" data-testid="reserve-review">
                  <Stars n={review.rating} />
                  <blockquote className="mt-3 font-serif text-xl leading-relaxed text-[#1D1D1F]">&ldquo;{review.text}&rdquo;</blockquote>
                  <figcaption className="mt-3 text-sm font-semibold text-[#1D1D1F]">{review.name} <span className="font-normal text-[#6E6E73]">· Verified Google Review</span></figcaption>
                </figure>
              </Reveal>
            )}
            <Reveal delay={0.25}>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {["Complimentary — normally valued over $200", "Fixed written quote", "Licensed & insured", "No pressure, no obligation"].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[#1D1D1F]">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A46A]" strokeWidth={2} /> <span>{t}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Right — featured image (if provided) + compact form */}
          <div className="flex flex-col gap-6">
            {cfg.featuredImage && (
              <Reveal delay={0.08}>
                <figure data-testid="reserve-featured-image" className="img-reveal overflow-hidden rounded-2xl soft-shadow">
                  <img src={cfg.featuredImage} alt={`${title} — real Splits Pro installation`} loading="lazy"
                    className="block h-auto w-full object-cover" />
                  {cfg.featuredCaption && (
                    <figcaption className="bg-white px-6 py-4 text-sm italic text-[#6E6E73]">
                      {cfg.featuredCaption}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            )}
            <Reveal delay={0.12}>
              <div className="rounded-2xl border border-[#E5E5EA] bg-white p-8 soft-shadow sm:p-10" data-testid="reserve-form-card">
              <div className="mb-6"><GoogleRating /></div>
              <h3 className="font-serif text-2xl leading-snug text-[#1D1D1F]">{bookingForm ? "Book Your Split System Installation" : "Reserve Your Complimentary Home Comfort Plan™"}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6E6E73]">
                {bookingForm
                  ? "Tell us what you want installed. If you already know the brand or size, add it in the optional message and we’ll confirm the job details with you."
                  : "Book your personalised in-home consultation and receive your professionally prepared Home Comfort Plan™, complete with expert recommendations and a fixed written quotation."}
              </p>
              <div className="mt-7">
                <QuoteForm defaultService={cfg.formService} submitLabel={bookingForm ? "Request Installation Booking" : "Reserve My Home Comfort Plan"} compact={bookingForm} />
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#E5E5EA] pt-5">
                {FORM_TRUST_STRIP.map((t) => (
                  <li key={t} className="flex items-center gap-1.5 text-xs font-medium text-[#6E6E73]">
                    <Check className="h-3.5 w-3.5 text-[#C8A46A]" strokeWidth={2.5} /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          </div>
        </div>
      </section>

      {seoBlocks}

      {/* Benefits (existing style) */}
      {cfg.benefits && (
        <section className="bg-[#F5F5F7] py-24 sm:py-32" data-testid="service-benefits">
          <div className="sp-container">
            <SectionHeading overline="Why Choose SplitsPro" title="Comfort, done properly" />
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {cfg.benefits.map((b, i) => (
                <Reveal key={b.title} delay={i * 0.08}>
                  <div className="hover-rise h-full rounded-2xl border border-[#E5E5EA] bg-white p-8 soft-shadow-sm">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E9D2] text-[#C8A46A]">
                      <b.icon className="h-6 w-6" strokeWidth={1.7} />
                    </span>
                    <h3 className="mt-6 font-serif text-xl text-[#1D1D1F]">{b.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#6E6E73]">{b.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Approach intro (existing 2-col) */}
      <section className="bg-white py-24 sm:py-32">
        <div className="sp-container grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div><SectionHeading overline="The SplitsPro Approach" title={intro.heading} sub={intro.body} /></div>
          <Reveal delay={0.1}>
            <div className="img-reveal overflow-hidden rounded-2xl soft-shadow">
              <img src={introImage || image} alt={title} loading="lazy" className={`aspect-[4/3] w-full object-cover ${imgPos}`} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-[#F5F5F7] py-24 sm:py-32">
        <div className="sp-container grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading overline="What's Included" title="Held to a premium standard" />
          <FeatureList items={features} />
        </div>
      </section>

      {/* Home Comfort Plan premium section */}
      <section className="bg-white py-24 sm:py-32" data-testid="home-comfort-plan">
        <div className="sp-container">
          <div className="max-w-3xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#C8A46A]/20 bg-[#F3E9D2] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#C8A46A]">
                <Sparkles className="h-3.5 w-3.5" /> Complimentary · Normally valued over $200
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-serif text-4xl font-medium leading-[1.08] tracking-tight text-[#1D1D1F] md:text-5xl text-balance">The Splits Pro Home Comfort Plan&trade;</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 font-serif text-xl text-[#C8A46A]">Your home deserves more than just a quote.</p>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-6 leading-relaxed text-[#6E6E73]">
                At Splits Pro, we take the time to understand your home, your lifestyle and your comfort goals before recommending the right solution. For a limited number of homeowners each month, we offer our Home Comfort Plan&trade; completely complimentary — normally valued at over $200.
              </p>
            </Reveal>
          </div>

          <p className="mt-14 text-xs font-semibold uppercase tracking-[0.22em] text-[#6E6E73]">Your Home Comfort Plan includes</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {HOME_COMFORT_INCLUDES.map((t, i) => (
              <Reveal key={t} delay={(i % 3) * 0.06}>
                <div className="flex items-center gap-4 rounded-2xl border border-[#E5E5EA] bg-white p-6 soft-shadow-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3E9D2] text-[#C8A46A]">
                    <Check className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <span className="font-medium text-[#1D1D1F]">{t}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Curiosity section */}
      <section className="bg-[#F5F5F7] py-24 sm:py-32" data-testid="comfort-difference">
        <div className="sp-container max-w-3xl">
          <SectionHeading overline="A Different Approach" title="Why is our Home Comfort Plan different?" />
          <Reveal delay={0.1}>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-[#6E6E73]">
              <p>Most installers simply measure your home and email a quote. Our Home Comfort Plan&trade; is designed to help you understand the best solution for your home before making any decisions.</p>
              <p>You&apos;ll receive professional recommendations, expert planning and a fixed written quotation tailored specifically to your property.</p>
              <p className="font-serif text-2xl text-[#1D1D1F]">No pressure. No obligation. Just honest advice designed around your home.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Real installations gallery (existing) */}
      {cfg.gallery && (
        <section className="bg-white py-24 sm:py-32" data-testid="service-gallery">
          <div className="sp-container">
            <SectionHeading overline="Real Installations" title="Work we're proud to show" />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {cfg.gallery.map((src, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <div className="img-reveal overflow-hidden rounded-2xl soft-shadow-sm">
                    <img src={src} alt={`${title} project ${i + 1}`} loading="lazy" className="img-zoom aspect-square w-full object-cover" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Guarantee section */}
      <section className="bg-[#F5F5F7] py-24 sm:py-32" data-testid="guarantee-section">
        <div className="sp-container">
          <SectionHeading overline="Peace Of Mind" title="Built to last. Backed with confidence." />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {HOME_COMFORT_GUARANTEES.map((t, i) => (
              <Reveal key={t} delay={(i % 3) * 0.06}>
                <div className="hover-rise flex h-full items-start gap-4 rounded-2xl border border-[#E5E5EA] bg-white p-7 soft-shadow-sm">
                  <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-[#C8A46A]" strokeWidth={1.8} />
                  <span className="font-medium leading-relaxed text-[#1D1D1F]">{t}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews (service-specific) */}
      <ServiceReviews category={cfg.reviewCategory} light />

      <BrandStrip />

      {/* Process */}
      <section className="bg-white py-24 sm:py-32">
        <div className="sp-container">
          <SectionHeading overline="Our Process" title="A seamless, considered experience" />
          <div className="mt-16"><ProcessTimeline /></div>
        </div>
      </section>

      {/* Exclusivity */}
      <section className="relative overflow-hidden bg-[#0B0B0B] py-24 sm:py-32" data-testid="exclusivity-section">
        <div className="sp-container relative z-10 max-w-3xl text-center mx-auto">
          <Reveal><Overline light>By Appointment</Overline></Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 font-serif text-4xl font-medium leading-tight tracking-tight text-white md:text-5xl text-balance">
              Complimentary for a limited number of homeowners each month
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              To ensure every consultation receives the time and attention it deserves, we only offer a limited number of complimentary Home Comfort Plans each month. Reserve your consultation before this month&apos;s appointments are filled.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-10 flex justify-center">
              <button onClick={reserve} data-testid="exclusivity-reserve-btn" className="btn-glass-light">
                Reserve My Home Comfort Plan
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      {(cfg.faqs || extraFaqs) && (
        <section className="bg-white py-24 sm:py-32" data-testid="service-faq">
          <div className="sp-container grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
            <SectionHeading overline="FAQ" title="Answers, before you ask" />
            <Reveal delay={0.1}>
              <Accordion type="single" collapsible className="w-full">
                {[...(extraFaqs || []), ...(cfg.faqs || [])].map((f, i) => (
                  <AccordionItem key={i} value={`item-${i}`} data-testid={`faq-item-${i}`} className="border-b border-[#E5E5EA]">
                    <AccordionTrigger className="py-6 text-left font-serif text-xl font-normal text-[#1D1D1F] hover:no-underline">{f.q}</AccordionTrigger>
                    <AccordionContent className="pb-6 text-base leading-relaxed text-[#6E6E73]">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>
      )}

      {/* Service areas */}
      <section className="bg-[#F5F5F7] py-24 pb-32 sm:py-32" data-testid="service-areas-block">
        <div className="sp-container">
          <SectionHeading overline="Service Areas" title="Air Conditioning Across Western Sydney"
            sub="Based in Bass Hill, Splits Pro proudly services homes across Western Sydney and surrounding suburbs. If your suburb isn't listed, contact us — we regularly travel outside our primary service areas." />
          <div className="mt-14"><ServiceAreasMap /></div>
        </div>
      </section>

      <CTASection />
    </>
  );
};

export default HomeComfortPage;
