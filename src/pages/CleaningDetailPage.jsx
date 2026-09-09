import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHero, TrustBadges } from "../components/sections";
import QuoteForm from "../components/QuoteForm";
import Reveal from "../components/Reveal";

const BenefitGrid = ({ benefits }) => (
  <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-3 lg:grid-cols-6">
    {benefits.map((benefit, index) => (
      <Reveal key={benefit.title} delay={index * 0.04}>
        <div className="h-full border-t border-[#E6E2DA] pt-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3E9D2] text-[#B68C4E]">
            <benefit.icon className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <h3 className="mt-3 text-sm font-semibold leading-snug text-[#1D1D1F]">{benefit.title}</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-[#6E6E73]">{benefit.desc}</p>
        </div>
      </Reveal>
    ))}
  </div>
);

const PricingCard = ({ plan, selected, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(plan)}
    className={`relative w-full rounded-2xl border p-5 text-left transition-all sm:p-6 ${
      selected
        ? "border-[#C8A46A] bg-white shadow-[0_14px_34px_rgba(11,11,11,0.08)] ring-1 ring-[#C8A46A]/25"
        : "border-[#E0DDD7] bg-white hover:-translate-y-0.5 hover:border-[#C8A46A]/70 hover:shadow-[0_10px_28px_rgba(11,11,11,0.05)]"
    }`}
  >
    {plan.popular && (
      <span className="absolute right-4 top-4 rounded-full bg-[#1D1D1F] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white">
        Most Popular
      </span>
    )}
    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C8A46A]">{plan.name}</p>
    <div className="mt-3 font-serif text-4xl font-medium text-[#1D1D1F]">{plan.price}</div>
    <p className="mt-1.5 text-xs text-[#6E6E73]">{plan.note}</p>
    <div className="mt-5 space-y-2.5 border-t border-[#ECE9E2] pt-4">
      {plan.items.map((item) => (
        <div key={item} className="flex items-start gap-2 text-xs leading-relaxed text-[#3A3A3C]">
          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C8A46A]" strokeWidth={2.2} />
          <span>{item}</span>
        </div>
      ))}
    </div>
    <span className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1D1D1F]">
      Pick this clean <ArrowUpRight className="h-3.5 w-3.5" />
    </span>
  </button>
);

const CleaningDetailPage = ({
  overline,
  title,
  sub,
  benefitsTitle,
  benefitsIntro,
  benefits,
  plans,
  typeLabel,
  siblingHref,
  siblingLabel,
  finePrint,
}) => {
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);

  const choosePlan = (plan) => {
    setSelectedPlan(plan);
    window.setTimeout(() => {
      document.getElementById("cleaning-booking")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 30);
  };

  return (
    <>
      <PageHero overline={overline} title={title} sub={sub} />
      <TrustBadges />

      <section className="border-b border-[#E8E6E1] bg-white py-5">
        <div className="sp-container flex flex-wrap items-center justify-between gap-3 text-xs">
          <Link to="/cleaning" className="font-semibold text-[#6E6E73] transition-colors hover:text-[#C8A46A]">
            ← All cleaning services
          </Link>
          <Link to={siblingHref} className="inline-flex items-center gap-1.5 font-semibold text-[#1D1D1F] transition-colors hover:text-[#C8A46A]">
            Looking for {siblingLabel}? <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="sp-container">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A46A]">Why clean it?</p>
            <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-[#1D1D1F] sm:text-4xl md:text-5xl">{benefitsTitle}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#6E6E73] sm:text-base">{benefitsIntro}</p>
          </div>
          <BenefitGrid benefits={benefits} />
        </div>
      </section>

      <section className="bg-[#F5F5F7] py-16 sm:py-20">
        <div className="sp-container">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A46A]">Pick your clean</p>
            <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-[#1D1D1F] sm:text-4xl md:text-5xl">Simple pricing. No mystery fluff.</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#6E6E73] sm:text-base">Choose the level that matches the condition of your system. We&apos;ll confirm access and scope before work starts.</p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {plans.map((plan) => (
                <PricingCard key={plan.id} plan={plan} selected={selectedPlan.id === plan.id} onSelect={choosePlan} />
              ))}
            </div>

            <div id="cleaning-booking" className="scroll-mt-24 rounded-2xl border border-[#E0DDD7] bg-white p-5 shadow-[0_12px_34px_rgba(11,11,11,0.05)] sm:p-7">
              <div className="mb-5 border-b border-[#ECE9E2] pb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C8A46A]">Book {typeLabel} Cleaning</p>
                <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-serif text-2xl font-medium text-[#1D1D1F]">{selectedPlan.name}</h3>
                  <span className="text-lg font-semibold text-[#1D1D1F]">{selectedPlan.price}</span>
                </div>
                <p className="mt-1 text-xs text-[#6E6E73]">Message is optional — save it for access details or special instructions.</p>
              </div>
              <QuoteForm
                key={`${typeLabel}-${selectedPlan.id}`}
                defaultService={`Air Conditioner Cleaning | ${typeLabel} | ${selectedPlan.name} | ${selectedPlan.price}`}
                submitLabel="Book Cleaning"
                compact
              />
            </div>
          </div>

          <p className="mt-6 text-[11px] leading-relaxed text-[#7A7A7E]">{finePrint}</p>
        </div>
      </section>
    </>
  );
};

export default CleaningDetailPage;
