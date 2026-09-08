import { PageHero } from "../components/sections";
import Reveal from "../components/Reveal";
import { FAQS } from "../lib/data";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "../components/ui/accordion";

const FAQ = () => (
  <>
    <PageHero
      overline="Frequently Asked Questions"
      title="Clear answers, no jargon"
      sub="Everything you need to know about our air conditioning installation, cleaning, maintenance and repairs."
    />

    <section className="bg-white py-24 sm:py-32" data-testid="faq-section">
      <div className="sp-container max-w-3xl">
        <Reveal>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} data-testid={`faq-item-${i}`} className="border-b border-[#E5E5EA]">
                <AccordionTrigger className="py-7 text-left font-serif text-xl font-normal text-[#1D1D1F] hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="pb-7 text-base leading-relaxed text-[#6E6E73]">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  </>
);

export default FAQ;
