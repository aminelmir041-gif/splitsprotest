import { useMemo, useState } from "react";
import { ArrowUpRight, Check, ChevronDown } from "lucide-react";

const PACKAGES = [
  {
    id: "essential",
    label: "Essential",
    zones: 2,
    outlets: 6,
    description: "Simple whole-home comfort with basic zoning.",
  },
  {
    id: "comfort",
    label: "Comfort",
    zones: 4,
    outlets: 8,
    popular: true,
    description: "Better control between bedrooms and living areas.",
  },
  {
    id: "premium",
    label: "Premium",
    zones: 6,
    outlets: 10,
    description: "More individual control throughout the home.",
  },
];

const BRANDS = [
  { id: "samsung", label: "Samsung", fullName: "Samsung" },
  { id: "daikin", label: "Daikin", fullName: "Daikin" },
  { id: "mhi", label: "Mitsubishi Heavy", fullName: "Mitsubishi Heavy Industries" },
  { id: "fujitsu", label: "Fujitsu", fullName: "Fujitsu" },
];

const PRICING = {
  essential: {
    samsung: [
      { kw: "10.0kW", price: "$7,190" },
    ],
    daikin: [
      { kw: "7.1kW", price: "$5,590" },
      { kw: "10.0kW", price: "$7,090" },
    ],
    mhi: [
      { kw: "7.1kW", price: "$5,390" },
      { kw: "10.0kW", price: "$7,390" },
    ],
    fujitsu: [
      { kw: "7.1kW", price: "$5,390" },
      { kw: "10.0kW", price: "$6,690" },
    ],
  },
  comfort: {
    samsung: [
      { kw: "10.0kW", price: "$7,790" },
      { kw: "12.1kW", price: "$8,390" },
      { kw: "14.0kW", price: "$8,890" },
    ],
    daikin: [
      { kw: "10.0kW", price: "$9,490" },
      { kw: "12.5kW", price: "$10,390" },
      { kw: "14.0kW", price: "$11,290" },
      { kw: "16.0kW", price: "$12,090" },
    ],
    mhi: [
      { kw: "10.0kW", price: "$8,790" },
      { kw: "12.5kW", price: "$9,390" },
      { kw: "14.0kW", price: "$11,490" },
      { kw: "16.0kW", price: "$13,590" },
    ],
    fujitsu: [
      { kw: "10.0kW", price: "$7,890" },
      { kw: "12.5kW", price: "$8,890" },
      { kw: "14.0kW", price: "$9,390" },
    ],
  },
  premium: {
    samsung: [
      { kw: "12.1kW", price: "$9,390" },
      { kw: "14.0kW", price: "$9,990" },
      { kw: "15.5kW", price: "$10,990" },
    ],
    daikin: [
      { kw: "12.5kW", price: "$11,390" },
      { kw: "14.0kW", price: "$12,290" },
      { kw: "16.0kW", price: "$12,990" },
    ],
    mhi: [
      { kw: "12.5kW", price: "$10,390" },
      { kw: "14.0kW", price: "$12,490" },
      { kw: "16.0kW", price: "$14,490" },
    ],
    fujitsu: [
      { kw: "12.5kW", price: "$9,890" },
      { kw: "14.0kW", price: "$10,390" },
      { kw: "15.5kW", price: "$11,490" },
    ],
  },
};

const INCLUDED = [
  "Ducted indoor unit",
  "Outdoor unit",
  "Standard ductwork",
  "Selected outlet package",
  "Selected zoning package",
  "Zone controller",
  "Return air grille",
  "Standard condensate drainage",
  "Standard outdoor mounting",
  "Commissioning",
  "Manufacturer warranty",
  "SplitsPro workmanship warranty",
];

const DuctedPricingSelector = () => {
  const [packageId, setPackageId] = useState("comfort");
  const [brandId, setBrandId] = useState("samsung");

  const selectedPackage = useMemo(
    () => PACKAGES.find((item) => item.id === packageId) || PACKAGES[1],
    [packageId]
  );
  const selectedBrand = useMemo(
    () => BRANDS.find((item) => item.id === brandId) || BRANDS[0],
    [brandId]
  );
  const prices = PRICING[packageId]?.[brandId] || [];

  const requestQuote = (option) => {
    const message = [
      `Brand: ${selectedBrand.fullName}`,
      `Package: ${selectedPackage.zones} Zones`,
      `Outlets: Up to ${selectedPackage.outlets}`,
      `Capacity: ${option.kw}`,
      `Displayed Price: ${option.price}`,
    ].join("\n");

    window.dispatchEvent(
      new CustomEvent("splitspro:quote-preset", {
        detail: {
          service: "Ducted Air Conditioning",
          message,
        },
      })
    );

    window.setTimeout(() => {
      document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 30);
  };

  return (
    <section className="border-b border-[#E8E6E1] bg-[#F5F5F7] py-14 sm:py-20" data-testid="ducted-pricing-selector">
      <div className="sp-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C8A46A]">Choose Your Ducted System</p>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-tight tracking-tight text-[#1D1D1F] sm:text-4xl md:text-5xl">
            Pick your package, then compare brands
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#6E6E73] sm:text-base">
            Start with the zoning and outlet package that suits your home. Your package stays selected while you switch brands and compare installed prices.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-6xl sm:mt-12">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1D1D1F]">1. Choose package</p>
            <p className="hidden text-xs text-[#6E6E73] sm:block">4 Zones is selected by default</p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {PACKAGES.map((item) => {
              const selected = item.id === packageId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPackageId(item.id)}
                  aria-pressed={selected}
                  data-testid={`ducted-package-${item.id}`}
                  className={`relative min-h-[154px] rounded-2xl border p-5 text-left transition-all sm:p-6 ${
                    selected
                      ? "border-[#C8A46A] bg-white shadow-[0_14px_34px_rgba(11,11,11,0.08)] ring-1 ring-[#C8A46A]/30"
                      : "border-[#DEDBD5] bg-white/70 hover:border-[#C8A46A]/70 hover:bg-white"
                  }`}
                >
                  {item.popular && (
                    <span className="absolute right-4 top-4 rounded-full bg-[#1D1D1F] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
                      Most Popular
                    </span>
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C8A46A]">{item.label}</span>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="font-serif text-3xl font-medium text-[#1D1D1F]">{item.zones} Zones</span>
                    {selected && <Check className="mb-1 h-5 w-5 text-[#C8A46A]" strokeWidth={2.2} />}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-[#3A3A3C]">Up to {item.outlets} outlets</p>
                  <p className="mt-3 max-w-sm text-xs leading-relaxed text-[#6E6E73]">{item.description}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-9 sm:mt-11">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1D1D1F]">2. Choose brand</p>
            <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {BRANDS.map((brand) => {
                const selected = brand.id === brandId;
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => setBrandId(brand.id)}
                    aria-pressed={selected}
                    data-testid={`ducted-brand-${brand.id}`}
                    className={`shrink-0 rounded-full border px-5 py-3 text-xs font-semibold transition-colors sm:px-6 ${
                      selected
                        ? "border-[#1D1D1F] bg-[#1D1D1F] text-white"
                        : "border-[#D7D4CE] bg-white text-[#1D1D1F] hover:border-[#C8A46A] hover:text-[#A17D43]"
                    }`}
                  >
                    {brand.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-9 sm:mt-11">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1D1D1F]">3. Choose size</p>
                <h3 className="mt-2 font-serif text-2xl font-medium text-[#1D1D1F] sm:text-3xl">{selectedBrand.fullName}</h3>
              </div>
              <p className="text-sm font-medium text-[#6E6E73]">
                {selectedPackage.zones} Zones · Up to {selectedPackage.outlets} outlets
              </p>
            </div>

            <div className={`mt-5 grid gap-3 ${prices.length >= 4 ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
              {prices.map((option) => (
                <article
                  key={`${brandId}-${packageId}-${option.kw}`}
                  className="flex min-h-[260px] flex-col rounded-2xl border border-[#E0DDD7] bg-white p-5 shadow-[0_10px_28px_rgba(11,11,11,0.05)] sm:p-6"
                  data-testid={`ducted-price-${brandId}-${packageId}-${option.kw}`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6E6E73]">{selectedBrand.fullName}</p>
                  <div className="mt-4 font-serif text-4xl font-medium leading-none text-[#1D1D1F]">{option.kw}</div>
                  <p className="mt-3 text-xs leading-relaxed text-[#6E6E73]">
                    {selectedPackage.zones} zones · Up to {selectedPackage.outlets} outlets
                  </p>
                  <div className="mt-5 border-t border-[#ECE9E2] pt-5">
                    <div className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">{option.price}</div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#C8A46A]">Fully Installed</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => requestQuote(option)}
                    className="mt-auto flex w-full items-center justify-center gap-2 rounded-sm bg-[#1D1D1F] px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#C8A46A]"
                    data-testid={`ducted-quote-${brandId}-${packageId}-${option.kw}`}
                  >
                    Get A Fixed Quote <ArrowUpRight className="h-4 w-4" />
                  </button>
                </article>
              ))}
            </div>
          </div>

          <details className="group mt-8 rounded-2xl border border-[#DEDBD5] bg-white" data-testid="ducted-inclusions">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 sm:px-7">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C8A46A]">What&apos;s included?</span>
                <p className="mt-1 text-sm text-[#6E6E73]">Standard package inclusions for the selection above.</p>
              </div>
              <ChevronDown className="h-5 w-5 shrink-0 text-[#1D1D1F] transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-t border-[#ECE9E2] px-5 py-6 sm:px-7">
              <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {INCLUDED.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-sm text-[#3A3A3C]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#C8A46A]" strokeWidth={2.2} />
                    <span>
                      {item === "Selected outlet package" ? `Up to ${selectedPackage.outlets} outlets` :
                        item === "Selected zoning package" ? `${selectedPackage.zones} zones` : item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </details>

          <p className="mt-4 text-[11px] leading-relaxed text-[#7A7A7E]">
            Pricing applies to a standard installation with suitable access. Final system sizing and installation requirements are confirmed before installation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DuctedPricingSelector;
