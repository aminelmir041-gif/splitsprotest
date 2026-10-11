import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Check, ChevronDown, ArrowRight, CreditCard, Phone, ShieldCheck } from "lucide-react";
import QuoteForm from "../components/QuoteForm";
import { PHONE, PHONE_TEL } from "../lib/data";

// Advertised standard installed prices. The user has only confirmed an
// independent retail price and discounted installation price for Rinnai 2.5kW.
// Do not invent component prices or offer unapproved finance checkout links.
const DEALS = [
  { id: "rinnai-local:2.5kW", product: "rinnai-local", size: "2.5kW", name: "Rinnai 2.5kW", installed: 1600, equipment: 1200, install: 400 },
  { id: "rinnai-local:3.5kW", product: "rinnai-local", size: "3.5kW", name: "Rinnai 3.5kW", installed: 1700 },
  { id: "rinnai-local:5.0kW", product: "rinnai-local", size: "5.0kW", name: "Rinnai 5kW", installed: 2300 },
  { id: "rinnai-local:7.0kW", product: "rinnai-local", size: "7.0kW", name: "Rinnai 7kW", installed: 2600 },
  { id: "daikin-lite-local:2.5kW", product: "daikin-lite-local", size: "2.5kW", name: "Daikin Cora 2.5kW", installed: 1850 },
  { id: "daikin-lite-local:3.5kW", product: "daikin-lite-local", size: "3.5kW", name: "Daikin Cora 3.5kW", installed: 2100 },
  { id: "daikin-lite-local:5.0kW", product: "daikin-lite-local", size: "5.0kW", name: "Daikin Cora 5kW", installed: 2500 },
  { id: "daikin-lite-local:7.0kW", product: "daikin-lite-local", size: "7.0kW", name: "Daikin Cora 7kW", installed: 3000 },
];
const aud = (value) => new Intl.NumberFormat("en-AU", {
  style: "currency", currency: "AUD", maximumFractionDigits: 0
}).format(value);

export default function PaymentOptions() {
  const [params] = useSearchParams();
  const requested = (params.get("product") || "") + ":" + (params.get("size") || "");
  const initial = DEALS.find((deal) => deal.id === requested) || DEALS[0];
  const [dealId, setDealId] = useState(initial.id);
  const [withInstallation, setWithInstallation] = useState(true);
  const [provider, setProvider] = useState("afterpay");
  const deal = DEALS.find((item) => item.id === dealId) || DEALS[0];
  const hasSplit = typeof deal.equipment === "number" && typeof deal.install === "number";
  const payableTotal = withInstallation ? deal.installed : hasSplit ? deal.equipment : null;
  const day = params.get("date") || "";
  const windowChoice = params.get("window") || "";
  const bookingRequest = withInstallation && day
    ? "Original preferred installation date: " + day + (windowChoice ? " " + windowChoice : "") + ". Date requires reconfirmation."
    : "";
  const enquiryMessage = [
    "Equipment finance request for " + deal.name + ".",
    "Selected option: " + (withInstallation ? "air conditioner + discounted SplitsPro installation" : "air conditioner only; customer will arrange own licensed installer") + ".",
    "Installed advertised price: " + aud(deal.installed) + ".",
    hasSplit ? "Equipment-only retail price: " + aud(deal.equipment) + "." : "Equipment-only retail price needs confirmation before purchase.",
    withInstallation && hasSplit ? "Discounted standard installation quote: " + aud(deal.install) + "." : "",
    "Preferred provider: " + (provider === "afterpay" ? "Afterpay" : "Klarna") + ".",
    bookingRequest,
    "Please confirm standalone product availability, stock/delivery/collection, lawful installation terms and BNPL eligibility before sending payment links. No payment authorised on this page.",
  ].filter(Boolean).join(" ");

  return (
    <>
      <Helmet>
        <title>Split System Instalments | SplitsPro</title>
        <meta name="description" content="Explore air conditioner equipment instalment options and optional discounted SplitsPro installation. Equipment-only purchases are available by phone." />
      </Helmet>

      <section className="finance-page-hero bg-[#10151C] text-white" data-testid="finance-page-hero">
        <div className="sp-container mx-auto max-w-5xl">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#D9B573]">SplitsPro · Flexible payments</p>
          <h1 className="mt-2 max-w-3xl font-serif text-3xl leading-[1.08] tracking-tight sm:mt-3 sm:text-5xl">
            Your aircon, with installation sorted.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75 sm:mt-3 sm:text-base">
            Choose your aircon. Our standard installation is included in the displayed price. Prefer your own installer? You can remove installation below.
          </p>
        </div>
      </section>

      <section className="bg-[#F7F5F1] px-4 pb-10 pt-5 sm:py-10" id="finance-selection">
        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-2xl border border-[#E3DFD5] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]" data-testid="finance-purchase-selector">
            <div className="p-4 sm:p-7">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#8F6A34]">Your purchase</p>
                <span className="rounded-full bg-[#F6EBD5] px-3 py-1 text-[10px] font-bold uppercase text-[#755320]">Supplied &amp; installed</span>
              </div>
              <label htmlFor="finance-deal" className="mt-3 block text-sm font-bold text-[#212121]">Air conditioner</label>
              <div className="relative mt-2">
                <select
                  id="finance-deal"
                  value={dealId}
                  onChange={(event) => setDealId(event.target.value)}
                  className="min-h-[50px] w-full appearance-none rounded-lg border border-[#D4CFC6] bg-white px-3 pr-10 text-base font-semibold text-[#1B1B1B]"
                >
                  {DEALS.map((item) => (
                    <option key={item.id} value={item.id}>{item.name} — {aud(item.installed)} installed</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-4 h-4 w-4 text-[#4F4F4F]" />
              </div>

              <div className="mt-5 border-t border-[#EEEAE3] pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#202020]">Include SplitsPro standard installation</p>
                    <p className="mt-1 text-xs leading-relaxed text-[#65615B]">Included by default. We arrange the installer, and you get the advertised inclusions and installation guarantee.</p>
                  </div>
                  <input
                    type="checkbox"
                    aria-label="Include SplitsPro standard installation"
                    checked={withInstallation}
                    onChange={(event) => setWithInstallation(event.target.checked)}
                    className="mt-1 h-6 w-6 shrink-0 accent-[#9D7A3F]"
                  />
                </div>
                <button type="button" onClick={() => setWithInstallation((value) => !value)}
                  className="mt-2 text-left text-xs font-bold text-[#81602F] underline underline-offset-2">
                  {withInstallation ? "Remove installation — buy the unit only" : "Add SplitsPro installation back"}
                </button>
              </div>

              <div className="mt-5 rounded-lg bg-[#F7F5F1] px-4 py-4" aria-live="polite" data-testid="finance-price-summary">
                {hasSplit && (
                  <>
                    <div className="flex justify-between gap-3 text-sm text-[#414141]">
                      <span>Air conditioner (separate retail purchase)</span>
                      <strong>{aud(deal.equipment)}</strong>
                    </div>
                    {withInstallation && (
                      <div className="mt-3 flex justify-between gap-3 text-sm text-[#414141]">
                        <span>Discounted standard installation (separate agreement)</span>
                        <strong>{aud(deal.install)}</strong>
                      </div>
                    )}
                  </>
                )}
                <div className={hasSplit ? "mt-4 flex items-end justify-between gap-3 border-t border-[#DDD7CB] pt-4" : "flex items-end justify-between gap-3"}>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#67615B]">
                      {withInstallation ? "Complete standard package" : "Air conditioner only"}
                    </p>
                    <p className="mt-1 text-[11px] text-[#69615A]">
                      {withInstallation ? "No additional charge for the standard inclusions" : "No SplitsPro installation included"}
                    </p>
                  </div>
                  <strong className="shrink-0 font-serif text-3xl text-[#8A662D] sm:text-4xl">
                    {payableTotal === null ? "On request" : aud(payableTotal)}
                  </strong>
                </div>
                {!hasSplit && (
                  <p className="mt-3 text-xs leading-relaxed text-[#67615B]">
                    {withInstallation
                      ? "We'll confirm the separate equipment price and discounted installation charge before any finance application. The complete installed total shown above remains the advertised price."
                      : "Equipment-only pricing for this model is available by phone. You can buy the unit without using our installer."}
                  </p>
                )}
                {hasSplit && (
                  <p className="mt-3 text-xs leading-relaxed text-[#67615B]">
                    {withInstallation
                      ? "Equipment finance enquiry: " + aud(deal.equipment) + ". Installation payment is agreed separately and is not included in equipment financing."
                      : "Equipment finance enquiry: " + aud(deal.equipment) + ". You can collect the unit or arrange delivery and use another licensed installer."}
                  </p>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold text-[#555]">
                <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-[#9B773F]" /> Up to 3m pipework*</span>
                <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-[#9B773F]" /> Up to 20m electrical*</span>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-[#9B773F]" /> Installation guarantee*</span>
              </div>
              <p className="mt-2 text-[11px] text-[#777]">*Standard-install inclusions apply only when SplitsPro installation is selected, subject to site conditions.</p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-[#E1DBD0] bg-white p-4 sm:p-6" data-testid="finance-provider-picker">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#8F6A34]">Payment choice</p>
            <h2 className="mt-1 font-serif text-2xl text-[#161616] sm:text-3xl">Pay for the aircon over time.</h2>
            <p className="mt-2 text-xs leading-relaxed text-[#5D5D5D]">Choose which provider you'd like us to check for the equipment purchase. All plans depend on provider eligibility and approval.</p>
            <div className="mt-4 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Preferred equipment finance provider">
              <button type="button" role="radio" aria-checked={provider === "afterpay"} onClick={() => setProvider("afterpay")}
                className={provider === "afterpay" ? "min-h-[68px] rounded-lg border-2 border-[#B68C4A] bg-[#FFF7E9] p-3 text-left" : "min-h-[68px] rounded-lg border border-[#D8D3C9] p-3 text-left"}>
                <CreditCard className="h-4 w-4 text-[#8F6A34]" />
                <strong className="mt-1 block text-base">Afterpay</strong>
              </button>
              <button type="button" role="radio" aria-checked={provider === "klarna"} onClick={() => setProvider("klarna")}
                className={provider === "klarna" ? "min-h-[68px] rounded-lg border-2 border-[#B68C4A] bg-[#FFF7E9] p-3 text-left" : "min-h-[68px] rounded-lg border border-[#D8D3C9] p-3 text-left"}>
                <CreditCard className="h-4 w-4 text-[#8F6A34]" />
                <strong className="mt-1 block text-base">Klarna</strong>
              </button>
            </div>
            <a href="#finance-enquiry" className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-md bg-[#C8A46A] px-4 py-3 text-center text-sm font-extrabold text-[#111]">
              Continue — request finance options <ArrowRight className="h-4 w-4" />
            </a>
            <p className="mt-2 text-[11px] leading-relaxed text-[#6B6B6B]">Finance is not charged or approved here. We'll confirm both agreements and provider eligibility before sending a secure payment link.</p>
          </div>

          <div className="mt-6 text-sm leading-relaxed text-[#4C4C4C]">
            <p><strong>Know what you're buying.</strong> Equipment can be bought independently, including by phone. If you cancel installation, you can still keep your equipment purchase subject to its own terms and Australian Consumer Law rights. A separate invoice or optional-install switch does not, by itself, decide the legal classification of the transaction.</p>
            {withInstallation && day && (
              <p className="mt-2">Your previous installation selection ({day} {windowChoice}) is a preference only and must be reconfirmed.</p>
            )}
          </div>
        </div>
      </section>

      <section id="finance-enquiry" className="scroll-mt-24 bg-white px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#987544]">One last step</p>
          <h2 className="mt-2 font-serif text-3xl text-[#171717]">We'll confirm your options.</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#555]">Tell us your name and number. We'll confirm stock, delivery or collection, equipment price, and any separate installation agreement. This is an enquiry, not a purchase or credit application.</p>
          <div className="mt-5 rounded-xl border border-[#E9E4DC] bg-[#FAF9F6] p-4 sm:p-6">
            <QuoteForm
              defaultService="Split System Installation"
              defaultMessage={enquiryMessage}
              submitLabel="Request My Payment Options"
              compact hidePhoto hidePreferredDate hideEmail hideCallButton includeAttribution
              successTitle="Enquiry received"
              successMessage="We'll contact you to discuss your purchase and financing choices."
            />
          </div>
          <a href={PHONE_TEL} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#8A662D] underline">
            <Phone className="h-4 w-4" /> Equipment-only orders by phone: {PHONE}
          </a>
          <div className="mt-6">
            <Link className="text-sm font-semibold text-[#8A662D] underline" to="/split-systems/rinnai-local-offer#installed-prices">Back to installed deals</Link>
          </div>
        </div>
      </section>
    </>
  );
}
