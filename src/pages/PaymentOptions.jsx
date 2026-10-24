import PayLaterReminder from "../components/PayLaterReminder";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronDown, ArrowLeft } from "lucide-react";

import { PHONE, PHONE_TEL } from "../lib/data";
import { api } from "../lib/api";

// Do not invent separate retail prices for units not yet priced independently.
const DEALS = [
  { id: "rinnai-local:2.5kW", name: "Rinnai PX 2.5kW", installed: 1700, equipment: 1200, installation: 500 },
  { id: "rinnai-local:3.5kW", name: "Rinnai PX 3.5kW", installed: 1850 },
  { id: "rinnai-local:5.0kW", name: "Rinnai 5kW", installed: 2300, equipment: 1700, installation: 600 },
  { id: "rinnai-local:7.0kW", name: "Rinnai 7kW", installed: 2600, equipment: 2000, installation: 600 },
  { id: "rinnai-local:8.0kW", name: "Rinnai 8kW", installed: 3000, equipment: 2400, installation: 600 },
  { id: "daikin-lite-local:2.5kW", name: "Daikin Cora 2.5kW", installed: 2000 },
  { id: "daikin-lite-local:3.5kW", name: "Daikin Cora 3.5kW", installed: 2200 },
  { id: "daikin-lite-local:5.0kW", name: "Daikin Cora 5kW", installed: 2650, equipment: 2050, installation: 600 },
  { id: "daikin-lite-local:7.0kW", name: "Daikin Cora 7kW", installed: 3200, equipment: 2600, installation: 600 },
  { id: "daikin-lite-local:8.0kW", name: "Daikin Cora 8kW", installed: 3650, equipment: 3050, installation: 600 },
  { id: "daikin-lite-local:9.0kW", name: "Daikin Cora 9kW", installed: 4100, equipment: 3500, installation: 600 },
];
const money = (n) => new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
const paymentRow = (chosen) => "flex w-full items-center gap-3 border-b border-[#E7E2DA] px-1 py-3.5 text-left transition-colors " + (chosen ? "text-[#181818]" : "text-[#555] hover:bg-[#FAF9F7]");
const PAYMENT_CHOICES = [
  { id: "stripe", label: "Stripe", note: "Card, Afterpay, Klarna or Zip where available" },
  { id: "paypal", label: "PayPal Pay in 4", note: "For eligible buyers and purchases under $2,000" },
];
// Existing live SplitsPro Stripe payment links. Prices are fixed by Stripe's own
// Product/Price records, never by values supplied by a browser.
const STRIPE_HOSTED_CHECKOUT = {
  "rinnai-local:2.5kW": {
    equipmentOnly: "https://buy.stripe.com/bJebJ38QO90id00cqJcs80b",
    installationInterest: "https://buy.stripe.com/4gMbJ38QO6Sa3pq4Yhcs80c",
  },
};

export default function PaymentOptions() {
  const [params] = useSearchParams();
  const initial = (params.get("product") || "") + ":" + (params.get("size") || "");
  const [modelId, setModelId] = useState(DEALS.some((d) => d.id === initial) ? initial : DEALS[0].id);
  const [withInstall, setWithInstall] = useState(true);
  const [provider, setProvider] = useState("stripe");
  const [catalog, setCatalog] = useState(null);
  const [buyer, setBuyer] = useState({ name: "", email: "", address: "", phone: "" });
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [paymentResult, setPaymentResult] = useState(null);

  useEffect(() => {
    let active = true;
    api.get("/equipment-catalog", { timeout: 16000 })
      .then((response) => { if (active) setCatalog(response.data); })
      .catch(() => { if (active) setCatalog({ checkout_enabled: false, products: [] }); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    const payment = params.get("equipment_payment");
    const orderId = params.get("order_id");
    if (payment === "cancelled") {
      setPaymentResult({ status: "cancelled" });
      return () => { active = false; };
    }
    if (payment !== "returned" || !orderId) return () => { active = false; };
    setPaymentResult({ status: "processing" });
    const capture = async () => {
      try {
        if (params.get("provider") === "paypal" && params.get("token")) {
          await api.post("/equipment-paypal-capture", {
            order_id: orderId,
            paypal_order_id: params.get("token"),
          });
        }
        const response = await api.get("/equipment-payment-status", {
          params: { order_id: orderId }, timeout: 16000,
        });
        if (active) setPaymentResult(response.data);
      } catch {
        if (active) setPaymentResult({ status: "pending_confirmation" });
      }
    };
    capture();
    return () => { active = false; };
  }, [params]);

  const handleCheckout = async (event) => {
    event.preventDefault();
    if (checkoutBusy) return;
    if (!buyerDetailsComplete) {
      setCheckoutError("Please complete your name, email, address and phone number first.");
      return;
    }
    // Never offer a PayPal Pay in 4 checkout for equipment priced over $2,000
    // or whose standalone retail price has not yet been confirmed.
    if (provider === "paypal" && !(Number.isFinite(retailAmount) && retailAmount > 0 && retailAmount < 2000 && model.installed <= 2000)) {
      setCheckoutError("PayPal Pay in 4 is only available for eligible equipment transactions under $2,000, where the advertised installed deal is not above $2,000.");
      return;
    }
    setCheckoutError("");
    setCheckoutBusy(true);
    try {
      // Do not start Stripe or PayPal until the backend has saved these details.
      const buyerData = {
        model_id: modelId,
        provider,
        include_installation: withInstall,
        name: buyer.name.trim(),
        email: buyer.email.trim(),
        address: buyer.address.trim(),
        phone: buyer.phone.trim(),
        page_url: window.location.href,
        referrer: document.referrer || "",
      };
      let buyerRef = "";
      try {
        const details = await api.post("/equipment-buyer-details", buyerData, { timeout: 55000 });
        if (!details.data?.accepted || !details.data?.buyer_ref) {
          throw new Error("We couldn't save your details. No payment has started.");
        }
        buyerRef = details.data.buyer_ref;
      } catch (saveError) {
        // Backwards-compatible path while Render deploys the upgraded endpoint.
        // Require a confirmed CRM save, rather than accepting an unpersisted form.
        if (saveError?.response?.status !== 404) throw saveError;
        const lead = await api.post("/quotes", {
          name: buyerData.name,
          email: buyerData.email,
          address: buyerData.address,
          phone: buyerData.phone,
          suburb: "See address",
          service: "Air Conditioner Purchase",
          message: model.name + " · " + (withInstall ? "Installation selected" : "Equipment only") + " · " + provider,
          page_url: buyerData.page_url,
          landing_page: buyerData.page_url,
          referrer: buyerData.referrer,
        }, { timeout: 55000 });
        if (!lead.data?.crm_saved) {
          throw new Error("We couldn't confirm your details were saved. No payment has started.");
        }
      }
      // Go straight to the existing merchant's hosted Stripe Checkout for confirmed equipment prices.
      if (provider === "stripe" && STRIPE_HOSTED_CHECKOUT[modelId]) {
        const links = STRIPE_HOSTED_CHECKOUT[modelId];
        // Both links charge only the Stripe product's equipment price. The
        // selected installation preference is recorded, not charged/booked.
        window.location.assign(withInstall ? links.installationInterest : links.equipmentOnly);
        return;
      }
      const response = await api.post("/equipment-checkout", {
        model_id: modelId,
        provider,
        include_installation: withInstall,
        ...(buyerRef ? { buyer_ref: buyerRef } : {}),
      }, { timeout: 55000 });
      if (!response.data?.checkout_url) throw new Error("No secure checkout URL returned");
      window.location.assign(response.data.checkout_url);
    } catch (err) {
      setCheckoutError((typeof err?.response?.data?.detail === "string" ? err.response.data.detail : err?.message) || "Checkout is unavailable. No payment has started.");
      setCheckoutBusy(false);
    }
  };
  const buyerDetailsComplete =
    buyer.name.trim().length >= 2
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email.trim())
    && buyer.address.trim().length >= 6
    && buyer.phone.replace(/\D/g, "").length >= 8
    && buyer.phone.replace(/\D/g, "").length <= 15;
  const updateBuyer = (field, value) => {
    setBuyer((current) => ({ ...current, [field]: value }));
    setCheckoutError("");
  };
  const buyerFieldClass = "h-12 w-full rounded-lg border border-[#D9D3CA] bg-[#FAF9F7] px-3 text-sm text-[#181818] outline-none focus:border-[#B58C4E] focus:ring-2 focus:ring-[#C8A46A]/20";
  const model = DEALS.find((d) => d.id === modelId) || DEALS[0];
  const serverModel = catalog?.products?.find((item) => item.id === modelId);
  const retailAmount = Number.isFinite(model.equipment) ? model.equipment : (Number.isFinite(serverModel?.equipment_cents) ? serverModel.equipment_cents / 100 : undefined);
  const installationAmount = Number.isFinite(model.installation) ? model.installation : (Number.isFinite(serverModel?.installation_cents) ? serverModel.installation_cents / 100 : undefined);
  // The advertised installed deal is authoritative. Do not let an old remote catalogue
  // overwrite the website price or display a split that does not add up.
  const installedAmount = model.installed;
  const hasSeparatePrices = Number.isFinite(retailAmount) && Number.isFinite(installationAmount)
    && Math.round((retailAmount + installationAmount) * 100) === Math.round(installedAmount * 100);
  const serverPriceCurrent = !Number.isFinite(serverModel?.installed_cents) || serverModel.installed_cents === model.installed * 100;
  // Do not send the buyer to a backend checkout with an older supply-only price.
  const serverEquipmentCurrent = !Number.isFinite(model.equipment) || (
    Number.isFinite(serverModel?.equipment_cents)
    && Number.isFinite(serverModel?.installation_cents)
    && serverModel.equipment_cents === model.equipment * 100
    && serverModel.installation_cents === model.installation * 100
  );
  const paypalPayIn4Eligible = Number.isFinite(retailAmount) && retailAmount > 0 && retailAmount < 2000 && model.installed <= 2000;
  const availablePaymentChoices = PAYMENT_CHOICES.filter((choice) => choice.id !== "paypal" || paypalPayIn4Eligible);
  useEffect(() => {
    if (provider === "paypal" && !paypalPayIn4Eligible) {
      setProvider("stripe");
      setCheckoutError("");
    }
  }, [provider, paypalPayIn4Eligible]);
  const connectedProvider = provider === "paypal" ? catalog?.paypal_ready : catalog?.stripe_ready;
  const hasHostedStripeCheckout = provider === "stripe" && !!STRIPE_HOSTED_CHECKOUT[modelId];
  // The confirmed Rinnai 2.5kW PayPal order is validated, priced and created by
  // the backend. Keep a real checkout button visible even while a free Render
  // service wakes up or the catalogue request is still loading.
  const hasDirectPayPalCheckout = provider === "paypal" && paypalPayIn4Eligible && modelId === "rinnai-local:2.5kW";
  const canCheckout = !withInstall && (provider !== "paypal" || paypalPayIn4Eligible) && (
    hasHostedStripeCheckout || hasDirectPayPalCheckout
    || !!(catalog?.checkout_enabled && connectedProvider && hasSeparatePrices && serverPriceCurrent && serverEquipmentCurrent
      && (!withInstall || catalog?.installed_checkout_enabled))
  );
  const paymentName = PAYMENT_CHOICES.find((choice) => choice.id === provider)?.label || "Stripe";
  const selectedDate = params.get("date");
  const selectedWindow = params.get("window");
  const validDate = selectedDate && selectedDate >= new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Sydney" });


  return (
    <div className="finance-page bg-[#F7F5F1] text-[#181818]" data-testid="finance-purchase-page">
      <Helmet>
        <title>Pay for Your Aircon in Instalments | SplitsPro</title>
        <meta name="description" content="Explore aircon equipment finance through SplitsPro with installation selected by default or equipment-only by choice." />
      </Helmet>

      <div id="splitspro-payment-hero-live" className="w-full max-w-none px-4 pt-5 sm:px-6 sm:pt-8 lg:px-0 lg:pt-0">
        <img
          src="/assets/splitspro-payment-hero.png"
          alt="SplitsPro: Get comfort now, pay it off your way. Flexible payment options for air conditioners."
          width={1536}
          height={1024}
          loading="eager"
          fetchPriority="high"
          className="block h-auto w-full"
        />
      </div>

      <div className="px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-12">
        <div className="mx-auto max-w-3xl">
          {paymentResult && (
            <div className="mb-5 rounded-xl border border-[#D7C9AC] bg-white p-4" role="status" data-testid="finance-payment-status">
              <strong className="text-base">
                {paymentResult.status === "paid" ? "Equipment payment received"
                  : paymentResult.status === "cancelled" ? "Checkout cancelled"
                  : paymentResult.status === "processing" ? "Checking your payment" : "Payment confirmation pending"}
              </strong>
              <p className="mt-2 text-sm text-[#555]">
                {paymentResult.status === "paid"
                  ? "Thanks. SplitsPro will contact you about equipment collection or delivery. Installation is not booked or paid for."
                  : paymentResult.status === "cancelled"
                    ? "No booking has been confirmed. You can choose another payment option."
                    : "We are checking your transaction. Do not pay twice; contact SplitsPro if confirmation is delayed."}
              </p>
            </div>
          )}
          <header className="mb-6 sm:mb-9">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#967141]">SPLITSPRO · PAYMENT OPTIONS</p>
            <h1 className="mt-2 font-serif !text-[2rem] !leading-[1.13] tracking-tight sm:!text-[3rem]">Pay for your aircon over time.</h1>
            <p className="mt-3 text-sm leading-relaxed text-[#606064] sm:text-base">
              Choose your air conditioner and pay through Stripe or PayPal.
            </p>
          </header>

          <div className="mb-6" data-testid="equipment-finance-pay-later-reminder">
            <PayLaterReminder kind="equipment" />
          </div>

          <section className="rounded-2xl border border-[#E5DFD5] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:p-8" id="choose-package">
            <label htmlFor="finance-model" className="block text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8F6A34]">1 · Choose your air conditioner</label>
            <div className="relative mt-3">
              <select id="finance-model" value={modelId} onChange={(e) => setModelId(e.target.value)}
                className="h-14 w-full appearance-none rounded-xl border border-[#D9D3CA] bg-[#FAF9F7] px-4 pr-9 text-sm font-semibold text-[#181818] sm:text-base">
                {DEALS.map((d) => <option value={d.id} key={d.id}>{d.name} — {money(d.installed)} installed</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-[18px] h-5 w-5 text-[#8F6A34]" />
            </div>

            <label htmlFor="finance-install" className="mt-5 flex cursor-pointer items-center justify-between gap-4 border-t border-[#E7E2DB] pt-5">
              <span className="text-sm font-bold text-[#212121]">Include No More to Pay installation</span>
              <input id="finance-install" data-testid="finance-installation-checkbox" type="checkbox" checked={withInstall}
                onChange={(event) => setWithInstall(event.target.checked)}
                className="h-6 w-6 shrink-0 accent-[#B38B4D]" />
            </label>
            <p className="mt-2 text-xs leading-relaxed text-[#666]">
              {withInstall ? "Includes up to 3m pipework, 20m electrical circuit if required, wall bracket and isolator. Installation is billed separately." : "Unit only — no SplitsPro installation charge."}
            </p>

            <div className="mt-6 rounded-xl bg-[#F7F5F1] p-4 sm:p-5" data-testid="finance-price-summary">
              {hasSeparatePrices ? (
                <>
                  <div className="flex justify-between gap-4 text-sm"><span>Air conditioner · equipment sale</span><strong>{money(retailAmount)}</strong></div>
                  {withInstall && <div className="mt-3 flex justify-between gap-4 text-sm"><span>Discounted installation · separate agreement</span><strong>{money(installationAmount)}</strong></div>}
                  <div className="mt-4 flex items-end justify-between gap-4 border-t border-[#DED8CE] pt-4">
                    <strong className="text-sm">{withInstall ? "Total installed" : "Aircon only"}</strong>
                    <strong className="font-serif text-3xl text-[#8F6A34]">{money(withInstall ? installedAmount : retailAmount)}</strong>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[#666]">Finance request for equipment: {money(retailAmount)} through {paymentName}. {withInstall ? "Installation is separately itemised and charged at the legally permitted stage, not through the equipment finance purchase." : "You can arrange another licensed installer; SplitsPro won't charge for installation."}</p>
                </>
              ) : (
                <>
                  {withInstall && <div className="flex items-end justify-between gap-3"><strong className="text-sm">Advertised installed total</strong><strong className="font-serif text-3xl text-[#8F6A34]">{money(installedAmount)}</strong></div>}
                  <p className="mt-3 text-sm leading-relaxed text-[#666]">{withInstall ? "Separate equipment and installation prices for this model will be provided in writing before any agreement." : "Call to confirm the equipment-only price, delivery or collection."} No unconfirmed amount will be charged.</p>
                </>
              )}
              {withInstall && <p className="mt-3 text-xs leading-relaxed text-[#666]">Our No More to Pay installation includes labour and commissioning, up to 3m refrigeration pipework, a standard wall bracket or suitable floor placement, an isolator and up to 20m electrical cable and circuit from the switchboard if required. Switchboard upgrades, difficult access and other non-standard work are quoted before proceeding.</p>}
              {validDate && withInstall && <p className="mt-2 text-xs font-semibold text-[#8F6A34]">Requested date: {selectedDate} · {selectedWindow || "time to confirm"} (not reserved — use the deals booking checkout)</p>}
            </div>


            <div className="mt-6 border-t border-[#E7E2DB] pt-4" data-testid="finance-before-customer-form-pay-later-reminder">
              <PayLaterReminder kind="equipment" compact />
            </div>

            <form onSubmit={handleCheckout} data-testid="finance-customer-checkout-form">
              <div className="mt-6 border-t border-[#E7E2DB] pt-5" data-testid="finance-customer-details">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8F6A34]">2 · Your details</p>
                <h2 className="mt-2 font-serif text-2xl">Your contact details</h2>
                <p className="mt-1 text-xs text-[#606064]">Your details are saved before you go to secure checkout.</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block text-xs font-semibold text-[#555]">Full name
                    <input data-testid="finance-customer-name" className={buyerFieldClass + " mt-1.5"} type="text"
                      name="name" autoComplete="name" placeholder="Your full name" value={buyer.name}
                      onChange={(e) => updateBuyer("name", e.target.value)} required minLength={2} maxLength={120} disabled={checkoutBusy} />
                  </label>
                  <label className="block text-xs font-semibold text-[#555]">Phone number
                    <input data-testid="finance-customer-phone" className={buyerFieldClass + " mt-1.5"} type="tel"
                      name="tel" autoComplete="tel" placeholder="04xx xxx xxx" value={buyer.phone}
                      onChange={(e) => updateBuyer("phone", e.target.value)} required minLength={8} maxLength={32} disabled={checkoutBusy} />
                  </label>
                  <label className="block text-xs font-semibold text-[#555]">Email address
                    <input data-testid="finance-customer-email" className={buyerFieldClass + " mt-1.5"} type="email"
                      name="email" autoComplete="email" placeholder="you@example.com" value={buyer.email}
                      onChange={(e) => updateBuyer("email", e.target.value)} required maxLength={254} disabled={checkoutBusy} />
                  </label>
                  <label className="block text-xs font-semibold text-[#555]">Installation or delivery address
                    <input data-testid="finance-customer-address" className={buyerFieldClass + " mt-1.5"} type="text"
                      name="street-address" autoComplete="street-address" placeholder="Street address, suburb and postcode" value={buyer.address}
                      onChange={(e) => updateBuyer("address", e.target.value)} required minLength={6} maxLength={300} disabled={checkoutBusy} />
                  </label>
                </div>
              </div>
              <div className="mt-6 border-t border-[#E7E2DB] pt-5">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8F6A34]">3 · Choose how to pay</p>
              <div className="mt-3 border-t border-[#E7E2DA]" role="radiogroup" aria-label="Equipment payment checkout" data-testid="finance-payment-methods">
                {availablePaymentChoices.map((choice) => (
                  <button key={choice.id} type="button" role="radio"
                    aria-checked={provider === choice.id}
                    onClick={() => setProvider(choice.id)}
                    className={paymentRow(provider === choice.id)}
                    data-testid={"finance-method-" + choice.id}>
                    <span aria-hidden="true" className={"flex h-4 w-4 shrink-0 items-center justify-center rounded-full border " + (provider === choice.id ? "border-[#B58C4E]" : "border-[#C7C1B9]")}>
                      {provider === choice.id && <span className="h-2 w-2 rounded-full bg-[#B58C4E]" />}
                    </span>
                    <span className="flex-1">
                      <strong className="block text-sm sm:text-base">{choice.label}</strong>
                      <span className="mt-0.5 block text-xs leading-snug text-[#666]">{choice.note}</span>
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[#666]">
                {paypalPayIn4Eligible
                  ? "Available payment methods and Pay in 4 eligibility are confirmed in Stripe or PayPal checkout."
                  : "PayPal Pay in 4 is shown only for eligible equipment prices under $2,000 and installed deals no higher than $2,000."}
              </p>
            </div>

            {hasHostedStripeCheckout && (
              <p className="mt-4 text-xs leading-relaxed text-[#555]">
                Stripe checkout charges {money(retailAmount)} for the air conditioner only. {withInstall ? "We've noted your interest in installation; it is not charged or booked during checkout and requires a separate confirmed agreement." : "You are buying the unit without installation."}
              </p>
            )}
            {canCheckout ? (
              <button type="submit" disabled={checkoutBusy || !buyerDetailsComplete}
                className="mt-6 flex min-h-12 w-full items-center justify-center rounded-lg bg-[#C8A46A] px-4 py-3 text-center text-sm font-bold uppercase tracking-wide text-[#171717] disabled:opacity-50">
                {checkoutBusy ? "Opening secure checkout…" : "Continue to " + (provider === "paypal" ? "PayPal" : "Stripe") + " checkout"}
              </button>
            ) : (
              <p className="mt-6 rounded-lg border border-[#E5DFD5] bg-[#FAF9F7] p-3 text-center text-sm leading-relaxed text-[#606064]">
                {withInstall ? <>For an installed air conditioner, first <Link to="/split-system-installation-sydney" className="font-semibold underline">choose your installation day and time</Link>. The next page offers deposit and eligible Stripe pay-later options.</> : <>Equipment-only checkout for this model isn't ready yet. Call <a href={PHONE_TEL} className="font-semibold underline">{PHONE}</a> for help.</>}
              </p>
            )}
            {canCheckout && !buyerDetailsComplete && (
              <p className="mt-3 text-center text-xs text-[#6E6E73]">Complete all four fields above to continue to payment.</p>
            )}
            {checkoutError && <p className="mt-3 text-sm font-semibold text-red-700" role="alert">{checkoutError}</p>}
            <p className="mt-3 text-center text-xs text-[#777]">
              {canCheckout
                ? "Stripe or PayPal shows the actual payable equipment amount before you confirm. Installation, if selected, is a separate transaction."
                : hasSeparatePrices
                  ? "Secure checkout is being finalised. No payment is taken here until the existing merchant connection is enabled."
                  : "The standalone retail price must be confirmed before checkout can be calculated."}
            </p>
            </form>
          </section>

          <p className="mt-5 text-xs leading-relaxed text-[#6E6E73]">
            Equipment-only sales are available by phone and do not require SplitsPro installation. Supply and optional installation are separate agreements only where genuinely offered and accepted. All consumer guarantees and statutory rights apply. Provider and NSW payment-rule eligibility must be confirmed before finance is activated.
          </p>
          <Link to="/split-system-installation-sydney" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8F6A34] underline"><ArrowLeft className="h-4 w-4" /> Back to deals</Link>
        </div>
      </div>
    </div>
  );
}
