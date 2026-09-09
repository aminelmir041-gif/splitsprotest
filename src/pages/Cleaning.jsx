import { useState } from "react";
import {
  Bug,
  Wind,
  Gauge,
  Sparkles,
  Droplets,
  ShieldCheck,
  Fan,
  Home,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { PageHero, TrustBadges } from "../components/sections";
import QuoteForm from "../components/QuoteForm";
import Reveal from "../components/Reveal";

const SPLIT_BENEFITS = [
  {
    icon: Bug,
    title: "Bacteria & mould build-up",
    desc: "Remove built-up grime and contamination from accessible internal surfaces.",
  },
  {
    icon: Sparkles,
    title: "Dust & allergens",
    desc: "Clean filters and internal surfaces where dust collects and recirculates.",
  },
  {
    icon: Wind,
    title: "Stronger airflow",
    desc: "Reduce dirt restriction through the filters, coil and fan area.",
  },
  {
    icon: Gauge,
    title: "Better efficiency",
    desc: "A cleaner system can move air more freely and work with less restriction.",
  },
  {
    icon: Droplets,
    title: "Fresher smell",
    desc: "Remove the damp dust and grime that can contribute to stale air-con odours.",
  },
  {
    icon: ShieldCheck,
    title: "System care",
    desc: "Regular cleaning helps reduce unnecessary strain caused by heavy dirt build-up.",
  },
];

const DUCTED_BENEFITS = [
  {
    icon: Bug,
    title: "Cleaner return air",
    desc: "Clean the return-air filter and grille where household dust is constantly drawn in.",
  },
  {
    icon: Fan,
    title: "Whole-home airflow",
    desc: "Help maintain more consistent airflow through the system and across your outlets.",
  },
  {
    icon: Sparkles,
    title: "Less built-up dust",
    desc: "Remove visible dust from filters, grilles and accessible air-distribution surfaces.",
  },
  {
    icon: Gauge,
    title: "Efficient operation",
    desc: "Clean filters reduce airflow restriction and help the ducted system breathe properly.",
  },
  {
    icon: Wind,
    title: "Cleaner outlets",
    desc: "Detailed outlet and grille cleaning keeps the visible parts of the system fresh and tidy.",
  },
  {
    icon: Home,
    title: "Whole-home system care",
    desc: "A considered clean and inspection helps spot maintenance issues before peak season.",
  },
];

const SPLIT_PLANS = [
  {
    id: "refresh",
    name: "Refresh Clean",
    price: "$99",
    note: "Routine maintenance clean",
    items: [
      "Filter wash and clean",
      "Indoor cover and louvre clean",
      "Light coil surface clean",
      "Drain and airflow check",
      "System operation check",
    ],
  },
  {
    id: "deep",
    name: "Deep Clean",
    price: "$300",
    popular: true,
    note: "For dirty, neglected or odorous units",
    items: [
      "Indoor covers removed for access",
      "Deep evaporator coil clean",
      "Fan barrel / blower clean",
      "Drain tray and drain clean",
      "Protective cleaning bag wash-down",
      "Reassembly and operation test",
    ],
  },
];

const DUCTED_PLANS = [
  {
    id: "standard",
    name: "Standard Ducted Clean",
    price: "From $299",
    note: "Routine whole-home maintenance",
    items: [
      "Return-air filter clean",
      "Return grille clean",
      "Accessible outlet clean",
      "Indoor unit visual inspection",
      "Drain inspection",
      "Airflow and operation check",
    ],
  },
  {
    id: "deep",
    name: "Deep Ducted Clean",
    price: "From $399",
    popular: true,
    note: "For heavier dust and overdue systems",
    items: [
      "Detailed return-air clean",
      "Filter and grille deep clean",
      "Accessible indoor coil clean",
      "Drain tray and drain clean where accessible",
      "Outlet and grille detailing",
      "Full operation and airflow check",
    ],
  },
];

const BenefitGrid = ({ benefits }) => (
  <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-3 lg:grid-cols-6">
    {benefits.map((benefit, index) => (
      <Reveal key={benefit.title} delay={index * 0.04}>
        <div className="h-full border-t border-[#E6E2DA] pt-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3E9D2] text-[#B68C4E]">
            <benefit.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
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
    className={`relative w-full rounded-xl border p-5 text-left transition-all sm:p-6 ${
      selected
        ? "border-[#C8A46A] bg-white shadow-[0_12px_30px_rgba(11,11,11,0.07)] ring-1 ring-[#C8A46A]/25"
        : "border-[#E0DDD7] bg-white hover:border-[#C8A46A]/70"
    }`}
  >
    {plan.popular && (
      <span className="absolute right-4 top-4 rounded-full bg-[#1D1D1F] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white">
        Most Popular
      </span>
    )}
    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C8A46A]">{plan.name}</p>
    <div className="mt-3 font-serif text-3xl font-medium text-[#1D1D1F] sm:text-4xl">{plan.price}</div>
    <p className="mt-1.5 text-xs text-[#6E6E73]">{plan.note}</p>
    <div className="mt-5 space-y-2 border-t border-[#ECE9E2] pt-4">
      {plan.items.map((item) => (
        <div key={item} className="flex items-start gap-2 text-xs leading-relaxed text-[#3A3A3C]">
          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C8A46A]" strokeWidth={2.2} />
          <span>{item}</span>
        </div>
      ))}
    </div>
    <span className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1D1D1F]">
      Select & book <ArrowUpRight className="h-3.5 w-3.5" />
    </span>
  </button>
);

const CleaningServiceSection = ({
  id,
  overline,
  title,
  intro,
  benefits,
  plans,
  selectedPlan,
  setSelectedPlan,
  surface = "white",
  typeLabel,
}) => {
  const formId = `${id}-booking`;

  const choosePlan = (plan) => {
    setSelectedPlan(plan);
    window.setTimeout(() => {
      document.getElementById(formId)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 30);
  };

  return (
    <section id={id} className={`${surface === "grey" ? "bg-[#F5F5F7]" : "bg-white"} py-16 sm:py-20`}>
      <div className="sp-container">
        <div className="max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A46A]">{overline}</p>
          <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-[#1D1D1F] sm:text-4xl md:text-5xl">{title}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#6E6E73] sm:text-base">{intro}</p>
        </div>

        <BenefitGrid benefits={benefits} />

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1D1D1F]">Choose your clean</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {plans.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  selected={selectedPlan.id === plan.id}
                  onSelect={choosePlan}
                />
              ))}
            </div>
          </div>

          <div id={formId} className="scroll-mt-24 rounded-xl border border-[#E0DDD7] bg-white p-5 shadow-[0_12px_34px_rgba(11,11,11,0.05)] sm:p-7">
            <div className="mb-5 border-b border-[#ECE9E2] pb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C8A46A]">Book {typeLabel} Cleaning</p>
              <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-serif text-2xl font-medium text-[#1D1D1F]">{selectedPlan.name}</h3>
                <span className="text-lg font-semibold text-[#1D1D1F]">{selectedPlan.price}</span>
              </div>
              <p className="mt-1 text-xs text-[#6E6E73]">Message is optional — use it only for access details or special instructions.</p>
            </div>
            <QuoteForm
              key={`${id}-${selectedPlan.id}`}
              defaultService={`Air Conditioner Cleaning | ${typeLabel} | ${selectedPlan.name} | ${selectedPlan.price}`}
              submitLabel="Book Cleaning"
              compact
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const Cleaning = () => {
  const [splitPlan, setSplitPlan] = useState(SPLIT_PLANS[0]);
  const [ductedPlan, setDuctedPlan] = useState(DUCTED_PLANS[0]);

  return (
    <>
      <PageHero
        overline="Air Conditioner Cleaning"
        title="A cleaner system. Better airflow. Fresher comfort."
        sub="Professional split system and ducted cleaning with clear pricing, practical maintenance and a careful approach inside your home."
      />

      <TrustBadges />

      <CleaningServiceSection
        id="split-system-cleaning"
        overline="Split System Cleaning"
        title="Clean the parts you can’t reach with a filter wash"
        intro="Choose a simple maintenance clean for a regularly serviced unit or a deeper internal clean when dust, grime and odours have built up inside the system."
        benefits={SPLIT_BENEFITS}
        plans={SPLIT_PLANS}
        selectedPlan={splitPlan}
        setSelectedPlan={setSplitPlan}
        typeLabel="Split System"
      />

      <CleaningServiceSection
        id="ducted-cleaning"
        overline="Ducted Air Conditioning Cleaning"
        title="Cleaner return air and better whole-home airflow"
        intro="Ducted systems move air through the whole home. Cleaning the return-air area, filters, outlets and accessible indoor components helps keep the system breathing properly."
        benefits={DUCTED_BENEFITS}
        plans={DUCTED_PLANS}
        selectedPlan={ductedPlan}
        setSelectedPlan={setDuctedPlan}
        surface="grey"
        typeLabel="Ducted"
      />

      <section className="border-t border-[#E5E5EA] bg-white py-10 sm:py-12">
        <div className="sp-container text-center">
          <p className="mx-auto max-w-3xl text-xs leading-relaxed text-[#6E6E73] sm:text-sm">
            Cleaning scope depends on system condition and safe access. Ducted prices are starting prices and are confirmed once the system size, access and number of outlets are known.
          </p>
        </div>
      </section>
    </>
  );
};

export default Cleaning;
