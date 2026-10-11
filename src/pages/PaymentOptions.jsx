import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronDown, Check, CreditCard, Phone, ArrowLeft } from "lucide-react";
import QuoteForm from "../components/QuoteForm";
import { PHONE, PHONE_TEL } from "../lib/data";

// Do not invent separate retail prices for units not yet priced independently.
const DEALS = [
  { id: "rinnai-local:2.5kW", name: "Rinnai 2.5kW", installed: 1600, equipment: 1200, installation: 400 },
  { id: "rinnai-local:3.5kW", name: "Rinnai 3.5kW", installed: 1700 },
  { id: "rinnai-local:5.0kW", name: "Rinnai 5kW", installed: 2300 },
  { id: "rinnai-local:7.0kW", name: "Rinnai 7kW", installed: 2600 },
  { id: "daikin-lite-local:2.5kW", name: "Daikin Cora 2.5kW", installed: 1850 },
  { id: "daikin-lite-local:3.5kW", name: "Daikin Cora 3.5kW", installed: 2100 },
  { id: "daikin-lite-local:5.0kW", name: "Daikin Cora 5kW", installed: 2500 },
  { id: "daikin-lite-local:7.0kW", name: "Daikin Cora 7kW", installed: 3000 },
];
const money = (n) => new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
const tile = (chosen) => "rounded-xl border-2 p-4 text-left " + (chosen ? "border-[#C8A46A] bg-[#FBF6EB]" : "border-[#E7E2DA] bg-white");

export default function PaymentOptions() {
  const [params] = useSearchParams();
  const initial = (params.get("product") || "") + ":" + (params.get("size") || "");
  const [modelId, setModelId] = useState(DEALS.some((d) => d.id === initial) ? initial : DEALS[0].id);
  const [withInstall, setWithInstall] = useState(true);
  const [provider, setProvider] = useState("afterpay");
  const model = DEALS.find((d) => d.id === modelId) || DEALS[0];
  const hasSeparatePrices = Number.isFinite(model.equipment);
  const selectedDate = params.get("date");
  const selectedWindow = params.get("window");
  const validDate = selectedDate && selectedDate >= new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Sydney" });

  const message = "SplitsPro finance enquiry. " + model.name + ". " +
    (withInstall ? "Customer selected separate equipment purchase and discounted SplitsPro standard installation (default selection). " : "Customer opted out of SplitsPro installation and wants an independent EQUIPMENT-ONLY sale by phone with collection or delivery and their own licensed installer. ") +
    "Requested provider: " + (provider === "afterpay" ? "Afterpay" : "Klarna") + ". " +
    (hasSeparatePrices
      ? "Air conditioner price: " + money(model.equipment) + ". " + (withInstall ? "Optional installation price: " + money(model.installation) + ". Combined installed total: " + money(model.installed) + ". " : "No installation selected. ")
      : "Published installed package: " + money(model.installed) + ". A separate equipment price and installation allocation must be confirmed and accepted before any finance checkout. ") +
    (validDate && withInstall ? "Requested date: " + selectedDate + " " + (selectedWindow || "") + " (not confirmed). " : "") +
    "Please call to confirm independent equipment sale, optional installation contract, stock, delivery, financing eligibility and all customer rights. No finance was charged through this enquiry.";

  return (
    <div className="finance-page bg-[#F7F5F1] text-[#181818]" data-testid="finance-purchase-page">
      <Helmet>
        <title>Pay for Your Aircon in Instalments | SplitsPro</title>
        <meta name="description" content="Explore aircon equipment finance through SplitsPro with installation selected by default or equipment-only by choice." />
      </Helmet>

      <div className="px-4 pb-14 pt-24 sm:px-6 sm:pb-20 sm:pt-36">
        <div className="mx-auto max-w-3xl">
          <header className="mb-6 sm:mb-9">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#967141]">SPLITSPRO · PAYMENT OPTIONS</p>
            <h1 className="mt-2 font-serif !text-[2rem] !leading-[1.13] tracking-tight sm:!text-[3rem]">Pay for your aircon over time.</h1>
            <p className="mt-3 text-sm leading-relaxed text-[#606064] sm:text-base">
              Choose your system. Discounted SplitsPro installation is selected by default. Prefer your own installer? Choose air conditioner only.
            </p>
          </header>

          <section className="rounded-2xl border border-[#E5DFD5] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:p-8" id="choose-package">
            <label htmlFor="finance-model" className="block text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8F6A34]">1 · Choose your air conditioner</label>
            <div className="relative mt-3">
              <select id="finance-model" value={modelId} onChange={(e) => setModelId(e.target.value)}
                className="h-14 w-full appearance-none rounded-xl border border-[#D9D3CA] bg-[#FAF9F7] px-4 pr-9 text-sm font-semibold text-[#181818] sm:text-base">
                {DEALS.map((d) => <option value={d.id} key={d.id}>{d.name} — {money(d.installed)} installed</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-[18px] h-5 w-5 text-[#8F6A34]" />
            </div>

            <div className="mt-6 border-t border-[#E7E2DB] pt-5">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8F6A34]">2 · Installation preference</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Installation preference">
                <button type="button" role="radio" aria-checked={withInstall} onClick={() => setWithInstall(true)} className={tile(withInstall)}>
                  <span className="flex items-center gap-2 font-bold"><Check className="h-4 w-4 text-[#8F6A34]" /> With installation</span>
                  <span className="mt-1 block text-xs text-[#666]">Included by default · SplitsPro installation</span>
                </button>
                <button type="button" role="radio" aria-checked={!withInstall} onClick={() => setWithInstall(false)} className={tile(!withInstall)}>
                  <span className="block font-bold">Air conditioner only</span>
                  <span className="mt-1 block text-xs text-[#666]">Remove installation · Use your own installer</span>
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#F7F5F1] p-4 sm:p-5" data-testid="finance-price-summary">
              {hasSeparatePrices ? (
                <>
                  <div className="flex justify-between gap-4 text-sm"><span>Air conditioner · equipment sale</span><strong>{money(model.equipment)}</strong></div>
                  {withInstall && <div className="mt-3 flex justify-between gap-4 text-sm"><span>Discounted installation · separate agreement</span><strong>{money(model.installation)}</strong></div>}
                  <div className="mt-4 flex items-end justify-between gap-4 border-t border-[#DED8CE] pt-4">
                    <strong className="text-sm">{withInstall ? "Total installed" : "Aircon only"}</strong>
                    <strong className="font-serif text-3xl text-[#8F6A34]">{money(withInstall ? model.installed : model.equipment)}</strong>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[#666]">Equipment finance enquiry: {money(model.equipment)} only. {withInstall ? "Installation is separately agreed and paid at a lawful stage." : "No SplitsPro installation included."}</p>
                </>
              ) : (
                <>
                  {withInstall && <div className="flex items-end justify-between gap-3"><strong className="text-sm">Advertised installed total</strong><strong className="font-serif text-3xl text-[#8F6A34]">{money(model.installed)}</strong></div>}
                  <p className="mt-3 text-sm leading-relaxed text-[#666]">{withInstall ? "Separate equipment and installation prices for this model will be provided in writing before any agreement." : "Call to confirm the equipment-only price, delivery or collection."} No unconfirmed amount will be charged.</p>
                </>
              )}
              {withInstall && <p className="mt-3 text-xs leading-relaxed text-[#666]">Standard installation retains the advertised inclusions and limits, including electrical work and pipework. Non-standard extras need separate approval.</p>}
              {validDate && withInstall && <p className="mt-2 text-xs font-semibold text-[#8F6A34]">Requested date: {selectedDate} · {selectedWindow || "time to confirm"} (not reserved)</p>}
            </div>

            <div className="mt-6 border-t border-[#E7E2DB] pt-5">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8F6A34]">3 · Choose a preferred finance provider</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button type="button" aria-pressed={provider === "afterpay"} onClick={() => setProvider("afterpay")} className={tile(provider === "afterpay")}>
                  <CreditCard className="h-5 w-5 text-[#8F6A34]" /><strong className="mt-2 block text-base">Afterpay</strong>
                </button>
                <button type="button" aria-pressed={provider === "klarna"} onClick={() => setProvider("klarna")} className={tile(provider === "klarna")}>
                  <CreditCard className="h-5 w-5 text-[#8F6A34]" /><strong className="mt-2 block text-base">Klarna</strong>
                </button>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[#666]">Provider approval and terms apply. Online equipment finance checkout is not active yet.</p>
            </div>

            <a href="#payment-help" className="mt-6 flex min-h-12 w-full items-center justify-center rounded-lg bg-[#C8A46A] px-4 py-3 text-center text-sm font-bold uppercase tracking-wide text-[#171717]">
              Continue to finance enquiry
            </a>
            <p className="mt-3 text-center text-xs text-[#777]">No payment taken on this page</p>
          </section>

          <section id="payment-help" className="mt-6 scroll-mt-20 rounded-2xl border border-[#E5DFD5] bg-white p-5 sm:p-8">
            <h2 className="font-serif !text-2xl sm:!text-3xl">We'll confirm your options.</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#606064]">Leave your details. We'll confirm stock, the separate equipment sale, optional installation and which finance arrangements are available before requesting payment.</p>
            <div className="mt-4">
              <QuoteForm
                key={modelId + ":" + withInstall + ":" + provider}
                defaultService="Split System Installation"
                defaultMessage={message}
                submitLabel="Request Finance Options"
                compact hidePhoto hidePreferredDate hideEmail hideCallButton includeAttribution
              />
            </div>
            <a href={PHONE_TEL} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#8F6A34] underline"><Phone className="h-4 w-4" /> Call {PHONE}</a>
          </section>

          <p className="mt-5 text-xs leading-relaxed text-[#6E6E73]">
            Equipment-only sales are available by phone and do not require SplitsPro installation. Supply and optional installation are separate agreements only where genuinely offered and accepted. All consumer guarantees and statutory rights apply. Provider and NSW payment-rule eligibility must be confirmed before finance is activated.
          </p>
          <Link to="/split-systems/rinnai-local-offer#installed-prices" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8F6A34] underline"><ArrowLeft className="h-4 w-4" /> Back to deals</Link>
        </div>
      </div>
    </div>
  );
}
