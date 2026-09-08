import { Phone, MapPin } from "lucide-react";
import { PageHero, CTASection, SectionHeading } from "../components/sections";
import Reveal from "../components/Reveal";
import ServiceAreasMap from "../components/ServiceAreasMap";
import { AREAS_REGIONS, PHONE, PHONE_TEL } from "../lib/data";

const ServiceAreas = () => (
  <>
    <PageHero
      overline="Service Areas"
      title="Air Conditioning Across Western Sydney"
      sub="Based in Bass Hill, Splits Pro proudly services homes across Western Sydney and surrounding suburbs. If your suburb isn't listed, contact us — we regularly travel outside our primary service areas."
    />

    <section className="bg-white py-28 pb-40 sm:py-36" data-testid="areas-grid">
      <div className="sp-container">
        <SectionHeading overline="Where We Work" title="Your suburb, expertly covered" />
        <div className="mt-12"><ServiceAreasMap /></div>

        <div className="mt-16 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {AREAS_REGIONS.map((grp, gi) => (
            <Reveal key={grp.region} delay={(gi % 4) * 0.05}>
              <div>
                <h3 className={`font-serif text-lg ${grp.primary ? "text-[#C8A46A]" : "text-[#1D1D1F]"}`}>
                  {grp.region}
                  {grp.primary && <span className="ml-2 rounded-full bg-[#C8A46A] px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wider text-white">Primary</span>}
                </h3>
                <ul className="mt-3 space-y-1.5">
                  {grp.suburbs.map((a) => (
                    <li key={a} data-testid={`area-${a.replace(/\s+/g, "-").toLowerCase()}`} className="text-sm text-[#6E6E73]">{a}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-12 text-[#6E6E73]"><MapPin className="mr-1 inline h-4 w-4 text-[#C8A46A]" /> SplitsPro services <span className="font-semibold text-[#1D1D1F]">all Sydney metropolitan suburbs</span>.</p>
          <a href={PHONE_TEL} data-testid="areas-call-btn" className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#C8A46A] px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-transform duration-300 hover:scale-[1.02]">
            <Phone className="h-4 w-4" /> {PHONE}
          </a>
        </Reveal>
      </div>
    </section>

    <CTASection />
  </>
);

export default ServiceAreas;
