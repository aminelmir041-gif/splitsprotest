import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Check, CreditCard, ShieldCheck, Phone, ArrowLeft } from "lucide-react";
import QuoteForm from "../components/QuoteForm";
import { PHONE, PHONE_TEL } from "../lib/data";

// Package prices reflect the advertised standard supplied-and-installed deals.
// Only the Rinnai 2.5kW component prices have been agreed for separate sale.
// Never invent standalone equipment pricing for other models.
const PACKAGES = [
  { key: "rinnai-local:2.5kW", product: "rinnai-local", size: "2.5kW", label: "Rinnai 2.5kW", installed: 1600, equipment: 1200, discountedInstall: 400 },
  { key: "rinnai-local:3.5kW", product: "rinnai-local", size: "3.5kW", label: "Rinnai 3.5kW", installed: 1700 },
  { key: "rinnai-local:5.0kW", product: "rinnai-local", size: "5.0kW", label: "Rinnai 5kW", installed: 2300 },
  { key: "rinnai-local:7.0kW", product: "rinnai-local", size: "7.0kW", label: "Rinnai 7kW", installed: 2600 },
  { key: "daikin-lite-local:2.5kW", product: "daikin-lite-local", size: "2.5kW", label: "Daikin Cora 2.5kW", installed: 1850 },
  { key: "daikin-lite-local:3.5kW", product: "daikin-lite-local", size: "3.5kW", label: "Daikin Cora 3.5kW", installed: 2100 },
  { key: "daikin-lite-local:5.0kW", product: "daikin-lite-local", size: "5.0kW", label: "Daikin Cora 5kW", installed: 2500 },
  { key: "daikin-lite-local:7.0kW", product: "daikin-lite-local", size: "7.0kW", label: "Daikin Cora 7kW", installed: 3000 },
];
const money = (n) => new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);

export default function PaymentOptions() {
  const [params] = useSearchParams();
  const incomingKey = (params.get("product") || "") + ":" + (params.get("size") || "");
  const [packageKey, setPackageKey] = useState(
    PACKAGES.some((item) => item.key === incomingKey) ? incomingKey : PACKAGES[0].key
  );
  // Standard package includes installation. Customer can clearly opt out.
  const [includeInstallation, setIncludeInstallation] = useState(true);
  const [provider, setProvider] = useState("afterpay");
  const pack = PACKAGES.find((item) => item.key === packageKey) || PACKAGES[0];
  const componentPricesConfirmed = typeof pack.equipment === "number";
  const displayTotal = componentPricesConfirmed
    ? (includeInstallation ? pack.installed : pack.equipment)
    : (includeInstallation ? pack.installed : null);
  const selectedDate = params.get("date") || "";
  const selectedWindow = params.get("window") || "";
  const todaySydney = new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Sydney" });
  const datePassed = selectedDate && selectedDate < todaySydney;
  const dateDescription = includeInstallation && selectedDate && !datePassed
    ? "Preferred installation: " + selectedDate + (selectedWindow ? " (" + selectedWindow + ")" : "") + ". This is not a confirmed booking."
    : "Installation time arranged separately after the installation agreement is accepted.";
  const financeChoice = provider === "afterpay" ? "Afterpay" : "Klarna";
  const message = "SplitsPro finance enquiry — " + pack.label + ". "
    + (includeInstallation
      ? "I want to buy the air conditioner and request the separately agreed discounted standard installation."
      : "I want an EQUIPMENT-ONLY purchase, with no SplitsPro installation. I will arrange my own licensed installer.")
    + " Equipment finance preference: " + financeChoice + ". "
    + (componentPricesConfirmed
      ? "Equipment sale: " + money(pack.equipment) + ". "
        + (includeInstallation ? "Optional installation: " + money(pack.discountedInstall) + ". Combined advertised price: " + money(pack.installed) + ". " : "No installation charge. ")
      : "Please confirm a separate equipment-only price and optional installation price before any order or finance application. "
        + (includeInstallation ? "Advertised installed package: " + money(pack.installed) + ". " : ""))
    + dateDescription + " Please call to confirm stock, collection or delivery, separate sale and installation terms, and applicable payment-provider eligibility. No finance has been approved or charged on this page.";

  return (
    <>
      <Helmet>
        <title>Aircon Equipment Instalments & Optional Installation | SplitsPro</title>
        <meta name="description" content="Choose an air conditioner from SplitsPro, with discounted standard installation included by default and an equipment-only option. Ask about eligible Afterpay and Klarna financing." />
      </Helmet>
      <section className="bg-[#10151C] px-5 pb-12 pt-32 text-white sm:pb-16 sm:pt-40">
        <div className="sp-container mx-auto max-w-5xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#D9B573]">SplitsPro · Flexible payment options</p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight sm:text-6xl">
            Your aircon. Installation sorted. Payment options that suit you.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Choose your air conditioner. SplitsPro's discounted standard installation is included in the displayed package by default. Prefer another installer? Remove our installation below and buy the aircon on its own.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-white/80">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-[#D9B573]" /> Clear total price</span>
            <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-[#D9B573]" /> Separate equipment and installation agreements</span>
            <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-[#D9B573]" /> Equipment-only option</span>
          </div>
          <a href="#choose-package" className="mt-7 inline-flex min-h-12 items-center justify-center bg-[#D9B573] px-7 py-3 text-sm font-extrabold text-[#10151C]">See your purchase options</a>
        </div>
      </section>
      <section className="bg-[#F7F5F1] px-5 py-12 sm:py-16" id="choose-package">
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#987544]">1 · Your air conditioner</p>
          <h2 className="mt-2 font-serif text-3xl text-[#171717] sm:text-4xl">Choose your model.</h2>
          <label className="mt-5 block max-w-lg text-sm font-bold text-[#292929]" htmlFor="finance-model">Air conditioner</label>
          <select id="finance-model" value={packageKey} onChange={(e) => setPackageKey(e.target.value)}
            className="mt-2 h-14 w-full max-w-lg rounded-lg border border-[#D2CCC1] bg-white px-4 text-base font-semibold text-[#161616]">
            {PACKAGES.map((item) => <option key={item.key} value={item.key}>{item.label} — {money(item.installed)} supplied & installed</option>)}
          </select>
          <div className="mt-8 border-t border-[#D9D2C7] pt-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#987544]">2 · Your installation choice</p>
            <h2 className="mt-2 font-serif text-3xl text-[#171717] sm:text-4xl">We can handle the install. Or you can.</h2>
            <div role="radiogroup" aria-label="Select whether to include SplitsPro installation" className="mt-5 grid gap-3 sm:grid-cols-2">
              <button type="button" role="radio" aria-checked={includeInstallation} onClick={() => setIncludeInstallation(true)}
                className={includeInstallation ? "rounded-xl border-2 border-[#C8A46A] bg-[#FFF9EC] p-5 text-left" : "rounded-xl border border-[#D9D2C7] bg-white p-5 text-left"}>
                <span className="block text-base font-bold text-[#151515]">With SplitsPro installation</span>
                <span className="mt-1 block text-xs font-extrabold uppercase tracking-wide text-[#8F6A34]">Standard selection</span>
                <span className="mt-3 block text-sm leading-relaxed text-[#555]">Discounted standard installation, covered by its own agreement. Installation guarantee and relevant manufacturer warranty.</span>
              </button>
              <button type="button" role="radio" aria-checked={!includeInstallation} onClick={() => setIncludeInstallation(false)}
                className={!includeInstallation ? "rounded-xl border-2 border-[#C8A46A] bg-[#FFF9EC] p-5 text-left" : "rounded-xl border border-[#D9D2C7] bg-white p-5 text-left"}>
                <span className="block text-base font-bold text-[#151515]">Air conditioner only</span>
                <span className="mt-1 block text-xs font-extrabold uppercase tracking-wide text-[#8F6A34]">Remove installation</span>
                <span className="mt-3 block text-sm leading-relaxed text-[#555]">Buy just the unit. Collect it or arrange delivery, and use any appropriately licensed installer you choose.</span>
              </button>
            </div>
          </div>
          <div className="mt-7 border-t border-[#D9D2C7] pt-7" data-testid="finance-price-summary">
            <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#987544]">Your price, without the surprises</p>
            {componentPricesConfirmed ? (
              <div className="mt-4 rounded-xl bg-white p-5 sm:p-7">
                <div className="flex items-center justify-between gap-3 border-b border-[#ECE6DC] pb-4 text-sm sm:text-base">
                  <span>Air conditioner — separate equipment purchase</span>
                  <strong className="text-lg">{money(pack.equipment)}</strong>
                </div>
                {includeInstallation && (
                  <div className="flex items-center justify-between gap-3 border-b border-[#ECE6DC] py-4 text-sm sm:text-base">
                    <span>Optional discounted standard installation — separate agreement</span>
                    <strong className="text-lg">{money(pack.discountedInstall)}</strong>
                  </div>
                )}
                <div className="mt-5 flex items-end justify-between gap-3">
                  <span className="text-sm font-bold">{includeInstallation ? "Total with installation" : "Equipment-only total"}</span>
                  <strong className="font-serif text-4xl text-[#8F6A34] sm:text-5xl">{money(displayTotal)}</strong>
                </div>
                <div className="mt-5 border-t border-[#ECE6DC] pt-4 text-sm leading-relaxed text-[#555]">
                  <strong>Instalments requested for equipment: {money(pack.equipment)}.</strong>
                  {includeInstallation ? " Installation is not part of the equipment financing. Its payment and any lawful booking deposit are agreed separately." : " No installation will be booked or charged by SplitsPro."}
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-xl bg-white p-5 sm:p-7">
                {includeInstallation && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">Advertised supplied-and-installed price</span>
                    <strong className="font-serif text-3xl text-[#8F6A34]">{money(displayTotal)}</strong>
                  </div>
                )}
                <p className="mt-4 text-sm leading-relaxed text-[#555]">
                  The separate equipment-only price and optional discounted installation price for this model must be confirmed before you agree to either purchase or apply for financing. We'll provide both prices and the combined total in writing. No payment is being taken here.
                </p>
              </div>
            )}
            {includeInstallation ? (
              <p className="mt-4 text-xs leading-relaxed text-[#5C5954]">Standard installation includes the advertised inclusions and limits, including up to 3m refrigeration pipework, up to 20m electrical connection where required, isolation and standard mounting. Any non-standard work must be quoted and approved separately. {datePassed ? "Your previous installation date has passed; we will arrange another." : dateDescription}</p>
            ) : (
              <p className="mt-4 text-xs leading-relaxed text-[#5C5954]">No SplitsPro installation is included. Equipment can be purchased independently of SplitsPro installation. Collection or delivery arrangements and any costs are confirmed before the equipment order is accepted.</p>
            )}
          </div>
        </div>
      </section>
      <section className="bg-white px-5 py-12 sm:py-16" id="payment-choice">
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#987544]">3 · Equipment payment</p>
          <h2 className="mt-2 font-serif text-3xl text-[#171717] sm:text-4xl">Ask about paying for the aircon in instalments.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#555]">
            Choose which provider you would like us to check. Approval, repayment terms and whether the equipment purchase is eligible are decided by the provider. An enquiry does not approve finance or reserve an installation time.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Preferred finance provider">
            <button type="button" role="radio" aria-checked={provider === "afterpay"} onClick={() => setProvider("afterpay")}
              className={provider === "afterpay" ? "rounded-xl border-2 border-[#C8A46A] bg-[#FFF9EC] p-5 text-left" : "rounded-xl border border-[#DDD8CF] bg-white p-5 text-left"}>
              <CreditCard className="h-5 w-5 text-[#8F6A34]" /><strong className="mt-2 block text-lg">Afterpay</strong>
              <span className="mt-1 block text-sm text-[#555]">Eligible purchases, subject to approval.</span>
            </button>
            <button type="button" role="radio" aria-checked={provider === "klarna"} onClick={() => setProvider("klarna")}
              className={provider === "klarna" ? "rounded-xl border-2 border-[#C8A46A] bg-[#FFF9EC] p-5 text-left" : "rounded-xl border border-[#DDD8CF] bg-white p-5 text-left"}>
              <CreditCard className="h-5 w-5 text-[#8F6A34]" /><strong className="mt-2 block text-lg">Klarna</strong>
              <span className="mt-1 block text-sm text-[#555]">Payment plans depend on eligibility and transaction.</span>
            </button>
          </div>
          <div className="mt-5 border-l-4 border-[#C8A46A] bg-[#F7F5F1] p-5 text-sm leading-relaxed text-[#454545]">
            <strong>Before you buy:</strong> Equipment-only purchases are available by phone, with or without our installation service. Equipment and optional installation have separate terms. A simple change of mind is not automatically refundable, but all Australian Consumer Law rights apply. Finance checkout is not yet active here; this form starts an enquiry, not a payment.
          </div>
          <div className="mt-8" id="payment-help">
            <h3 className="font-serif text-2xl text-[#171717]">Request your equipment finance options</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#555]">Leave your details and we'll call to confirm the equipment sale, availability, delivery or collection, optional installation and provider eligibility. Don't enter card numbers or credit documents.</p>
            <div className="mt-5 rounded-xl border border-[#E5E0D7] bg-[#FBFAF8] p-5 sm:p-8">
              <QuoteForm
                defaultService="Split System Installation"
                defaultMessage={message}
                submitLabel="Request My Finance Options"
                compact
                hidePhoto
                hidePreferredDate
                hideEmail
                hideCallButton
                includeAttribution
              />
            </div>
            <a href={PHONE_TEL} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#8F6A34] underline"><Phone className="h-4 w-4" /> Prefer to call? {PHONE}</a>
          </div>
        </div>
      </section>
      <section className="bg-[#F7F5F1] px-5 py-10 text-center">
        <Link to="/split-systems/rinnai-local-offer#installed-prices" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#8F6A34] underline"><ArrowLeft className="h-4 w-4" /> Back to supplied-and-installed prices</Link>
      </section>
    </>
  );
}
