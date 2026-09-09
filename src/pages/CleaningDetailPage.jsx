import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHero, TrustBadges } from "../components/sections";
import QuoteForm from "../components/QuoteForm";
import Reveal from "../components/Reveal";

const benefitLayout = [
  "lg:col-span-2 lg:min-h-[285px]",
  "lg:col-span-1 lg:min-h-[285px]",
  "lg:col-span-1 lg:min-h-[250px]",
  "lg:col-span-2 lg:min-h-[250px]",
  "lg:col-span-2 lg:min-h-[250px]",
  "lg:col-span-1 lg:min-h-[250px]",
];

const BenefitGrid = ({ benefits }) => (
  <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:auto-rows-auto">
    {benefits.map((benefit, index) => {
      const Icon = benefit.icon;
      const feature = index === 0 || index === 3;

      return (
        <Reveal key={benefit.title} delay={index * 0.05}>
          <article
            className={`group relative h-full overflow-hidden rounded-[28px] border p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-8 ${
              feature
                ? "border-[#1D1D1F] bg-[#111214] text-white"
                : "border-[#E7E2D9] bg-[#FAF9F7] text-[#1D1D1F]"
            } ${benefitLayout[index] || ""}`}
          >
            <Icon
              aria-hidden
              className={`pointer-events-none absolute -bottom-8 -right-6 h-36 w-36 rotate-[-8deg] transition-transform duration-500 group-hover:rotate-0 group-hover:scale-105 sm:h-44 sm:w-44 ${
                feature ? "text-[#C8A46A]/12" : "text-[#C8A46A]/10"
              }`}
              strokeWidth={1.15}
            />

            <div className="relative z-10 flex h-full flex-col">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl sm:h-[72px] sm:w-[72px] ${
                  feature ? "bg-[#C8A46A] text-[#111214]" : "bg-[#F3E9D2] text-[#A97E3F]"
                }`}
              >
                <Icon className="h-8 w-8 sm:h-9 sm:w-9" strokeWidth={1.65} />
              </div>

              <div className="mt-auto pt-10 sm:pt-12">
                <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${feature ? "text-[#C8A46A]" : "text-[#A97E3F]"}`}>
                  {benefit.kicker || "Cleaner comfort"}
                </p>
                <h3 className={`mt-2 font-serif text-2xl font-medium leading-tight sm:text-[28px] ${feature ? "text-white" : "text-[#1D1D1F]"}`}>
                  {benefit.title}
                </h3>
                <p className={`mt-3 max-w-md text-sm leading-relaxed ${feature ? "text-white/68" : "text-[#6E6E73]"}`}>
                  {benefit.desc}
                </p>
              </div>
            </div>
          </article>
        </Reveal>
      );
    })}
  </div>
);

const PricingCard = ({ plan, selected, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(plan)}
    className={`relative flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-4 text-left transition-all sm:px-5 ${
      selected
        ? "border-[#C8A46A] bg-white shadow-[0_8px_22px_rgba(11,11,11,0.07)] ring-1 ring-[#C8A46A]/20"
        : "border-[#DEDAD3] bg-white/75 hover:border-[#C8A46A]/70 hover:bg-white"
    }`}
  >
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C8A46A]">{plan.name}</p>
        {plan.popular && (
          <span className="rounded-full bg-[#1D1D1F] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-white">
            Popular
          </span>
        )}
      </div>
      <p className="mt-1 truncate text-xs text-[#6E6E73]">{plan.note}</p>
    </div>

    <div className="shrink-0 text-right">
      <div className="font-serif text-2xl font-medium text-[#1D1D1F] sm:text-[28px]">{plan.price}</div>
      <span className={`mt-1 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.1em] ${selected ? "text-[#A97E3F]" : "text-[#6E6E73]"}`}>
        {selected ? "Selected" : "Choose"} <ArrowUpRight className="h-3 w-3" />
      </span>
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
        <div aria-hidden className="absolute left-[-8%] top-24 h-72 w-72 rounded-full bg-[#C8A46A]/[0.07] blur-3xl" />
        <div className="sp-container relative">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A46A]">Why clean it?</p>
              <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-[#1D1D1F] sm:text-4xl md:text-5xl">
                {benefitsTitle}
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-[#6E6E73] sm:text-lg">{benefitsIntro}</p>
          </div>

          <BenefitGrid benefits={benefits} />
        </div>
      </section>

      <section className="bg-[#F5F5F7] py-14 sm:py-20">
        <div className="sp-container">
          <div className="grid gap-8 lg:grid-cols-[0.68fr_1.32fr] lg:items-start lg:gap-12">
            <div className="lg:sticky lg:top-24">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A46A]">Pick your clean</p>
              <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-[#1D1D1F] sm:text-4xl">
                Small choice. Big difference.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#6E6E73]">
                Choose the clean that matches the condition of your system. Your selection carries straight into the booking form.
              </p>

              <div className="mt-6 space-y-3">
                {plans.map((plan) => (
                  <PricingCard key={plan.id} plan={plan} selected={selectedPlan.id === plan.id} onSelect={choosePlan} />
                ))}
              </div>
            </div>

            <div id="cleaning-booking" className="scroll-mt-24 overflow-hidden rounded-[28px] border border-[#DEDAD3] bg-white shadow-[0_16px_44px_rgba(11,11,11,0.06)]">
              <div className="border-b border-[#ECE9E2] bg-[#111214] p-6 text-white sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C8A46A]">Your selected clean</p>
                    <h3 className="mt-2 font-serif text-3xl font-medium">{selectedPlan.name}</h3>
                    <p className="mt-1 text-sm text-white/60">{selectedPlan.note}</p>
                  </div>
                  <div className="font-serif text-4xl font-medium text-[#C8A46A]">{selectedPlan.price}</div>
                </div>

                <div className="mt-6 grid gap-2 border-t border-white/10 pt-5 sm:grid-cols-2">
                  {selectedPlan.items.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-xs leading-relaxed text-white/76">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C8A46A]" strokeWidth={2.2} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 sm:p-8">
                <div className="mb-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C8A46A]">Book {typeLabel} Cleaning</p>
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
          </div>

          <p className="mt-6 text-[11px] leading-relaxed text-[#7A7A7E]">{finePrint}</p>
        </div>
      </section>
    </>
  );
};

export default CleaningDetailPage;
