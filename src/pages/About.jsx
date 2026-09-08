import { PageHero, SectionHeading, WhyGrid, ProcessTimeline, BrandStrip, CTASection } from "../components/sections";
import Reveal from "../components/Reveal";

const About = () => (
  <>
    <PageHero
      overline="About SplitsPro"
      title="Craftsmen of comfort"
      sub="We're Western Sydney air conditioning specialists who believe every home deserves a considered, precise solution — not a one-size-fits-all sell."
    />

    <section className="bg-white py-28 sm:py-36">
      <div className="sp-container">
        <Reveal><span className="overline">Our Belief</span></Reveal>
        <Reveal delay={0.05}>
          <p className="mt-8 max-w-4xl font-serif text-3xl font-normal leading-[1.25] tracking-tight text-[#1D1D1F] sm:text-4xl lg:text-5xl text-balance">
            Every home is different. Rather than guessing, we take the time to understand yours — then recommend and install the right system, properly, the first time.
          </p>
        </Reveal>
      </div>
    </section>

    <section className="bg-[#F5F5F7] py-28 sm:py-36">
      <div className="sp-container">
        <SectionHeading overline="What We Stand For" title="Trust earned through craftsmanship" sub="No inflated claims. No rushed installations. Just thoughtful planning, quality workmanship and genuine care." />
        <div className="mt-16"><WhyGrid /></div>
      </div>
    </section>

    <BrandStrip />

    <section className="bg-white py-28 sm:py-36">
      <div className="sp-container">
        <SectionHeading overline="Our Process" title="Considered from start to finish" />
        <div className="mt-16"><ProcessTimeline /></div>
      </div>
    </section>

    <CTASection />
  </>
);

export default About;
