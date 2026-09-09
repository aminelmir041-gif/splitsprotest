import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHero, TrustBadges } from "../components/sections";
import QuoteForm from "../components/QuoteForm";
import Reveal from "../components/Reveal";

const firstLayouts = [
  "lg:col-span-7 lg:col-start-1",
  "lg:col-span-4 lg:col-start-9 lg:mt-20",
  "lg:col-span-5 lg:col-start-2 lg:mt-10",
];

const secondLayouts = [
  "lg:col-span-6 lg:col-start-7",
  "lg:col-span-5 lg:col-start-1 lg:mt-20",
  "lg:col-span-5 lg:col-start-8 lg:mt-8",
];

const BenefitMoment = ({ benefit, index, layout }) => {
  const Icon = benefit.icon;
  const reverse = index === 1 || index === 4;
  const large = index === 0 || index === 3;

  return (
    <Reveal delay={index * 0.05}>
      <article className={`${layout} relative ${large ? "py-5 sm:py-8" : "py-3 sm:py-5"}`}>
        <div className={`flex items-start gap-5 sm:gap-7 ${reverse ? "lg:flex-row-reverse lg:text-right" : ""}`}>
          <div className="relative shrink-0">
            <div
              aria-hidden
              className={`absolute inset-0 rounded-full bg-[#C8A46A]/10 blur-xl ${large ? "scale-125" : "scale-110"}`}
            />
            <div className={`relative flex items-center justify-center rounded-full bg-[#F3E9D2] text-[#A97E3F] ${large ? "h-24 w-24 sm:h-28 sm:w-28" : "h-20 w-20 sm:h-24 sm:w-24"}`}>
              <Icon className={large ? "h-12 w-12 sm:h-14 sm:w-14" : "h-10 w-10 sm:h-12 sm:w-12"} strokeWidth={1.45} />
            </div>
          </div>

          <div className={`min-w-0 pt-1 ${reverse ? "lg:flex lg:flex-col lg:items-end" : ""}`}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B68C4E]">
              {benefit.kicker || "Feel the difference"}
            </p>
            <h3 className={`mt-2 font-serif font-medium leading-[1.03] tracking-tight text-[#1D1D1F] ${large ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"}`}>
              {benefit.title}
            </h3>
            <p className={`mt-3 text-sm leading-relaxed text-[#6E6E73] sm:text-base ${large ? "max-w-xl" : "max-w-md"}`}>
              {benefit.desc}
            </p>
          </div>
        </div>
      </article>
    </Reveal>
  );
};

const BenefitStory = ({ benefits, dreamLine, dreamSub }) => (
  <>
    <div className="mt-12 grid gap-y-10 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-2">
      {benefits.slice(0, 3).map((benefit, index) => (
        <BenefitMoment key={benefit.title} benefit={benefit} index={index} layout={firstLayouts[index]} />
      ))}
    </div>

    <Reveal delay={0.08}>
      <div className="my-16 border-y border-[#E8E3DA] py-12 sm:my-20 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <p className="max-w-4xl font-serif text-4xl font-medium leading-[1.02] tracking-tight text-[#1D1D1F] sm:text-5xl lg:text-6xl">
            {dreamLine}
          </p>
          <p className="max-w-lg text-sm leading-relaxed text-[#6E6E73] sm:text-base">{dreamSub}</p>
        </div>
      </div>
    </Reveal>

    <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-2">
      {benefits.slice(3).map((benefit, offset) => {
        const index = offset + 3;
        return (
          <BenefitMoment key={benefit.title} benefit={benefit} index={index} layout={secondLayouts[offset]} />
        );
      })}
    </div>
  </>
);

const PlanPill = ({ plan, selected, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(plan)}
    className={`inline-flex min-w-[190px] items-center justify-between gap-4 rounded-full border px-4 py-3 text-left transition-all sm:min-w-[220px] ${
      selected
        ? "border-[#C8A46A] bg-[#1D1D1F] text-white shadow-[0_8px_22px_rgba(11,11,11,0.08)]"
        : "border-[#DDD8CF] bg-white text-[#1D1D1F] hover:border-[#C8A46A]"
    }`}
  >
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <span className={`text-[9px] font-bold uppercase tracking-[0.12em] ${selected ? "text-[#C8A46A]" : "text-[#6E6E73]"}`}>
          {plan.name}
        </span>
        {plan.popular && <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#C8A46A]">Popular</span>}
      </div>
      <p className={`mt-0.5 truncate text-[10px] ${selected ? "text-white/60" : "text-[#8A8A8E]"}`}>{plan.note}</p>
    </div>
    <div className="flex shrink-0 items-center gap-1.5">
      <span className="font-serif text-xl font-medium">{plan.price}</span>
      {selected && <Check className="h-3.5 w-3.5 text-[#C8A46A]" strokeWidth={2.2} />}
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

      <section className="relative overflow-hidden bg-white py-16 sm:py-24">
        <div aria-hidden className="absolute left-[-10%] top-[18%] h-80 w-80 rounded-full bg-[#C8A46A]/[0.055] blur-3xl" />
        <div aria-hidden className="absolute right-[-12%] top-[55%] h-96 w-96 rounded-full bg-[#C8A46A]/[0.045] blur-3xl" />

        <div className="sp-container relative">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A46A]">Why you&apos;ll feel the difference</p>
              <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-[#1D1D1F] sm:text-4xl md:text-5xl">
                {benefitsTitle}
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-[#6E6E73] sm:text-lg">{benefitsIntro}</p>
          </div>

          <BenefitStory benefits={benefits} dreamLine={dreamLine} dreamSub={dreamSub} />

          <div className="mt-20 border-t border-[#E8E3DA] pt-12 sm:mt-24 sm:pt-14">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A46A]">Choose your clean</p>
                <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-[#1D1D1F] sm:text-4xl">
                  Pick the feeling you want back.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-[#6E6E73] sm:text-base">
                A quick refresh for a well-kept system, or the deeper reset when it has been a while.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {plans.map((plan) => (
                <PlanPill key={plan.id} plan={plan} selected={selectedPlan.id === plan.id} onSelect={choosePlan} />
              ))}
            </div>

            <div id="cleaning-booking" className="mt-12 scroll-mt-24 border-y border-[#E8E3DA] py-10 sm:py-12">
              <div className="grid gap-8 lg:grid-cols-[0.58fr_1.42fr] lg:items-start lg:gap-12">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C8A46A]">Ready when you are</p>
                  <h3 className="mt-2 font-serif text-3xl font-medium leading-tight text-[#1D1D1F]">
                    Bring back that just-cleaned feeling.
                  </h3>
                  <div className="mt-5 flex items-end gap-3">
                    <span className="font-serif text-3xl font-medium text-[#1D1D1F]">{selectedPlan.price}</span>
                    <span className="pb-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#6E6E73]">{selectedPlan.name}</span>
                  </div>
                </div>

                <div className="max-w-3xl">
                  <QuoteForm
                    key={`${typeLabel}-${selectedPlan.id}`}
                    defaultService={`Air Conditioner Cleaning | ${typeLabel} | ${selectedPlan.name} | ${selectedPlan.price}`}
                    submitLabel="Book Cleaning"
                    compact
                    hideMessage
                    hidePhoto
                    tight
                  />
                </div>
              </div>
            </div>

            <p className="mt-5 max-w-4xl text-[11px] leading-relaxed text-[#7A7A7E]">{finePrint}</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default CleaningDetailPage;
