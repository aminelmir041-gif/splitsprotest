import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHero, TrustBadges } from "../components/sections";
import QuoteForm from "../components/QuoteForm";
import Reveal from "../components/Reveal";

const BenefitMoment = ({ benefit, index }) => {
  const Icon = benefit.icon;
  const feature = index === 0 || index === 3;

  return (
    <Reveal delay={index * 0.04}>
      <article className={`relative ${feature ? "lg:col-span-2" : "lg:col-span-1"}`}>
        <div className="relative pl-[76px] sm:pl-[88px]">
          <div className="absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-full border border-[#C8A46A]/45 bg-[#C8A46A]/10 text-[#DAB66E] shadow-[0_0_36px_rgba(200,164,106,0.10)] sm:h-16 sm:w-16">
            <Icon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.45} />
          </div>

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A46A]">
            {benefit.kicker || "Feel the difference"}
          </p>
          <h3 className={`mt-2 max-w-xl font-serif font-medium leading-[1.05] tracking-tight text-white ${feature ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>
            {benefit.title}
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/62 sm:text-[15px]">
            {benefit.desc}
          </p>
        </div>
      </article>
    </Reveal>
  );
};

const PlanPill = ({ plan, selected, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(plan)}
    className={`min-w-[180px] border-b px-1 py-3 text-left transition-all sm:min-w-[220px] ${
      selected
        ? "border-[#C8A46A] text-white"
        : "border-white/15 text-white/62 hover:border-[#C8A46A]/60 hover:text-white"
    }`}
  >
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-[9px] font-bold uppercase tracking-[0.14em] ${selected ? "text-[#C8A46A]" : "text-white/45"}`}>
            {plan.name}
          </span>
          {plan.popular && <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#C8A46A]">Popular</span>}
        </div>
        <p className="mt-1 text-[10px] text-white/42">{plan.note}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <span className={`font-serif text-2xl font-medium ${selected ? "text-[#DAB66E]" : "text-white"}`}>{plan.price}</span>
        {selected && <Check className="h-3.5 w-3.5 text-[#C8A46A]" strokeWidth={2.2} />}
      </div>
    </div>
  </button>
);

const CleaningDetailPage = ({
  overline,
  title,
  sub,
  benefitsTitle,
  benefitsIntro,
  benefits,
  dreamLine,
  dreamSub,
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

      <section className="relative overflow-hidden bg-[#0B0B0B] py-10 text-white sm:py-14">
        <div aria-hidden className="absolute left-[-12%] top-0 h-[420px] w-[420px] rounded-full bg-[#C8A46A]/[0.10] blur-[120px]" />
        <div aria-hidden className="absolute right-[-10%] top-[38%] h-[360px] w-[360px] rounded-full bg-[#8C6A34]/[0.08] blur-[120px]" />

        <div className="sp-container relative">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 text-xs">
            <Link to="/cleaning" className="font-semibold text-white/55 transition-colors hover:text-[#C8A46A]">
              ← All cleaning services
            </Link>
            <Link to={siblingHref} className="inline-flex items-center gap-1.5 font-semibold text-white/75 transition-colors hover:text-[#C8A46A]">
              Looking for {siblingLabel}? <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-9 max-w-5xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C8A46A]">More than just a clean</p>
            <h2 className="mt-3 max-w-4xl font-serif text-4xl font-medium leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[54px]">
              {benefitsTitle}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/60 sm:text-lg">{benefitsIntro}</p>
          </div>

          <div className="mt-11 grid gap-x-10 gap-y-11 lg:grid-cols-3 lg:gap-y-12">
            {benefits.map((benefit, index) => (
              <BenefitMoment key={benefit.title} benefit={benefit} index={index} />
            ))}
          </div>

          <Reveal delay={0.08}>
            <div className="relative my-12 overflow-hidden border-y border-white/10 py-9 sm:my-14 sm:py-11">
              <div aria-hidden className="absolute -right-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full border border-[#C8A46A]/15" />
              <div aria-hidden className="absolute -right-4 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full border border-[#C8A46A]/25" />
              <div className="relative max-w-5xl">
                <p className="max-w-4xl font-serif text-3xl font-medium leading-[1.02] tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {dreamLine}
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/58 sm:text-base">{dreamSub}</p>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C8A46A]">Simple. Affordable. Worth it.</p>
              <h2 className="mt-2 font-serif text-3xl font-medium leading-tight text-white sm:text-4xl">
                Pick your clean.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/52">
                Choose the level that suits your system and book in a few seconds.
              </p>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                {plans.map((plan) => (
                  <PlanPill key={plan.id} plan={plan} selected={selectedPlan.id === plan.id} onSelect={choosePlan} />
                ))}
              </div>
            </div>

            <div id="cleaning-booking" className="scroll-mt-24 lg:border-l lg:border-[#C8A46A]/30 lg:pl-8">
              <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C8A46A]">Book your cleaning</p>
                  <h3 className="mt-1 font-serif text-2xl font-medium text-white">{selectedPlan.name}</h3>
                </div>
                <div className="font-serif text-3xl font-medium text-[#DAB66E]">{selectedPlan.price}</div>
              </div>

              <div className="max-w-2xl rounded-xl bg-white p-4 shadow-[0_16px_40px_rgba(0,0,0,0.20)]">
                <QuoteForm
                  key={`${typeLabel}-${selectedPlan.id}`}
                  defaultService={`Air Conditioner Cleaning | ${typeLabel} | ${selectedPlan.name} | ${selectedPlan.price}`}
                  submitLabel="Book My Clean"
                  compact
                  hideMessage
                  hidePhoto
                  tight
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
            <p className="max-w-4xl text-[11px] leading-relaxed text-white/35">{finePrint}</p>
            <p className="font-serif text-xl italic text-[#C8A46A]">Fresh air. Happier days.</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default CleaningDetailPage;
