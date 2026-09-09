import { useMemo, useState } from "react";
import { ArrowUpRight, Check, ChevronDown } from "lucide-react";
import QuoteForm from "./QuoteForm";

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
  { id: "rinnai", label: "Rinnai", fullName: "Rinnai" },
];

const PRICING = {
  essential: {
    samsung: [
      { kw: "10.0kW", price: "$7,190" },
      { kw: "12.5kW", price: "$7,590" },
      { kw: "14.0kW", price: "$8,790" },
    ],
    daikin: [
      { kw: "7.1kW", price: "$5,590" },
      { kw: "10.0kW", price: "$7,090" },
      { kw: "12.5kW", price: "$8,990" },
      { kw: "14.0kW", price: "$9,790" },
    ],
    mhi: [
      { kw: "7.1kW", price: "$5,390" },
      { kw: "10.0kW", price: "$7,390" },
      { kw: "12.5kW", price: "$7,990" },
      { kw: "14.0kW", price: "$9,490" },
    ],
    fujitsu: [
      { kw: "7.1kW", price: "$5,390" },
      { kw: "10.0kW", price: "$6,690" },
      { kw: "12.5kW", price: "$7,590" },
      { kw: "14.0kW", price: "$8,290" },
    ],
    rinnai: [
      { kw: "10.5kW", price: "$8,990" },
      { kw: "12.5kW", price: "$9,590" },
      { kw: "14.0kW", price: "$10,190" },
    ],
  },
  comfort: {
    samsung: [
      { kw: "10.0kW", price: "$7,790" },
      { kw: "12.5kW", price: "$8,390" },
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
    rinnai: [
      { kw: "10.5kW", price: "$9,590" },
      { kw: "12.5kW", price: "$10,190" },
      { kw: "14.0kW", price: "$10,790" },
      { kw: "17.0kW", price: "$11,990" },
    ],
  },
  premium: {
    samsung: [
      { kw: "12.5kW", price: "$9,390" },
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
    rinnai: [
      { kw: "12.5kW", price: "$11,190" },
      { kw: "14.0kW", price: "$11,790" },
      { kw: "17.0kW", price: "$12,990" },
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
  const [quoteSelection, setQuoteSelection] = useState(null);

  const selectedPackage = useMemo(
    () => PACKAGES.find((item) => item.id === packageId) || PACKAGES[1],
    [packageId]
  );
  const selectedBrand = useMemo(
    () => BRANDS.find((item) => item.id === brandId) || BRANDS[0],
    [brandId]
  );
  const prices = PRICING[packageId]?.[brandId] || [];

  const selectPackage = (id) => {
    setPackageId(id);
    setQuoteSelection(null);
  };

  const selectBrand = (id) => {
    setBrandId(id);
    setQuoteSelection(null);
  };

  const requestQuote = (option) => {
    setQuoteSelection({
      brand: selectedBrand,
      package: selectedPackage,
      option,
    });

    window.setTimeout(() => {
      document.getElementById("ducted-book-installation")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 30);
  };

  const bookingMessage = quoteSelection
    ? [
        `I'd like to book a ducted installation.`,
        `Brand: ${quoteSelection.brand.fullName}`,
        `Package: ${quoteSelection.package.zones} Zones`,
        `Outlets: Up to ${quoteSelection.package.outlets}`,
        `Capacity: ${quoteSelection.option.kw}`,
        `Displayed Price: ${quoteSelection.option.price}`,
      ].join("\n")
    : [
        `I'd like to book a ducted installation.`,
        `Preferred Brand: ${selectedBrand.fullName}`,
        `Package: ${selectedPackage.zones} Zones`,
        `Outlets: Up to ${selectedPackage.outlets}`,
        `Please help me choose the right capacity.`,
      ].join("\n");

  const formKey = quoteSelection
    ? `${quoteSelection.brand.id}-${quoteSelection.package.id}-${quoteSelection.option.kw}`
    : `${brandId}-${packageId}-custom`;

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
                  onClick={() => selectPackage(item.id)}
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
                    onClick={() => selectBrand(brand.id)}
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

          <div id="ducted-book-installation" className="scroll-mt-24 pt-10 sm:pt-14" data-testid="ducted-book-installation">
            <div className="grid gap-8 rounded-2xl border border-[#DEDAD3] bg-white p-6 shadow-[0_14px_38px_rgba(11,11,11,0.06)] sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:p-10">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C8A46A]">Book An Installation</p>
                <h3 className="mt-3 font-serif text-3xl font-medium leading-tight text-[#1D1D1F] sm:text-4xl">
                  Ready to install your ducted system?
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#6E6E73] sm:text-base">
                  Your current package and brand are carried into this booking form. Choose a price above for the exact capacity and advertised price to be added automatically.
                </p>
                <div className="mt-6 rounded-xl bg-[#F5F5F7] p-5">
                  <p className="text-sm font-semibold text-[#1D1D1F]">Need something different?</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#6E6E73]">
                    Use the optional message box to tell us if you need a different kW size, more or fewer outlets, a different zoning setup, special access requirements or anything else you want quoted.
                  </p>
                </div>
                <p className="mt-5 text-xs leading-relaxed text-[#7A7A7E]">
                  This installation booking is separate from the complimentary Home Comfort Plan further down the page.
                </p>
              </div>

              <div className="rounded-xl border border-[#ECE9E2] bg-white p-5 sm:p-7">
                <QuoteForm
                  key={formKey}
                  defaultService="Ducted Air Conditioning"
                  defaultMessage={bookingMessage}
                  submitLabel="Book Installation"
                  compact
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DuctedPricingSelector;