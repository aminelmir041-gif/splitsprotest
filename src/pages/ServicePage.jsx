import { PageHero, SectionHeading, FeatureList, ProcessTimeline, BrandStrip, TrustBadges, ServiceReviews } from "../components/sections";
import Reveal from "../components/Reveal";
import QuoteForm from "../components/QuoteForm";
import ServiceAreasMap from "../components/ServiceAreasMap";
import { SERVICE_LANDING } from "../lib/data";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "../components/ui/accordion";

const ServicePage = ({ slug, overline, title, sub, image, introImage, intro, features, imgPos = "object-center" }) => {
  const cfg = SERVICE_LANDING[slug] || {};

  return (
    <>
      <PageHero overline={overline} title={title} sub={sub} image={image} imgPos={imgPos} />

      <TrustBadges />

      {/* Benefits */}
      {cfg.benefits && (
        <section className="bg-white py-24 sm:py-32" data-testid="service-benefits">
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

      {/* Intro */}
      <section className="bg-[#F5F5F7] py-24 sm:py-32">
        <div className="sp-container grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading overline="The SplitsPro Approach" title={intro.heading} sub={intro.body} />
          </div>
          <Reveal delay={0.1}>
            <div className="img-reveal overflow-hidden rounded-2xl soft-shadow">
              <img src={introImage || image} alt={title} loading="lazy" className={`aspect-[4/3] w-full object-cover ${imgPos}`} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-white py-24 sm:py-32">
        <div className="sp-container grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading overline="What's Included" title="Held to a premium standard" />
          <FeatureList items={features} />
        </div>
      </section>

      {/* Real installation images */}
      {cfg.gallery && (
        <section className="bg-[#F5F5F7] py-24 sm:py-32" data-testid="service-gallery">
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

      <ServiceReviews category={cfg.reviewCategory} light />

      <BrandStrip />

      {/* Process */}
      <section className="bg-white py-24 sm:py-32">
        <div className="sp-container">
          <SectionHeading overline="Our Process" title="A seamless, considered experience" />
          <div className="mt-16"><ProcessTimeline /></div>
        </div>
      </section>

      {/* FAQ */}
      {cfg.faqs && (
        <section className="bg-[#F5F5F7] py-24 sm:py-32" data-testid="service-faq">
          <div className="sp-container grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
            <SectionHeading overline="FAQ" title="Answers, before you ask" />
            <Reveal delay={0.1}>
              <Accordion type="single" collapsible className="w-full">
                {cfg.faqs.map((f, i) => (
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

      {/* Tailored quote form */}
      <section id="quote" className="relative overflow-hidden bg-[#0B0B0B] py-24 sm:py-32" data-testid="service-quote">
        <div className="sp-container relative grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="overline text-[#C8A46A]">Free, No-Obligation</span>
            <h2 className="mt-5 font-serif text-4xl font-medium leading-tight tracking-tight text-white md:text-5xl text-balance">
              {cfg.formHeading || "Book Your Free Quote & Plan"}
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
              Tell us a little about your home and we&apos;ll call you back to arrange a considered consultation and honest quote.
            </p>
          </div>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md sm:p-10">
              <QuoteForm onDark defaultService={cfg.formService} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Service areas */}
      <section className="bg-white py-24 pb-32 sm:py-32" data-testid="service-areas-block">
        <div className="sp-container">
          <SectionHeading overline="Service Areas" title="Air Conditioning Across Western Sydney"
            sub="Based in Bass Hill, Splits Pro proudly services homes across Western Sydney and surrounding suburbs. If your suburb isn't listed, contact us — we regularly travel outside our primary service areas." />
          <div className="mt-14"><ServiceAreasMap /></div>
        </div>
      </section>
    </>
  );
};

export default ServicePage;
