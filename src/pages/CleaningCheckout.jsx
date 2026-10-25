import PayLaterReminder from "../components/PayLaterReminder";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { api, getCachedCleaningCheckoutConfig, getCleaningCheckoutConfig } from "../lib/api";
import { scheduledCleaningPrice } from "../lib/cleaningPricing";

const EXTRA_PRICE = 150;
const MAX_UNITS = 7;
const money = (n) => new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
const fieldLabel = "block text-xs font-black uppercase tracking-wide text-[#516072]";
const fieldInput = "mt-2 h-12 w-full rounded-md border border-[#D1DBE3] bg-white px-4 text-base text-[#142E43] outline-none focus:border-[#009AC6]";
const formatDate = (s) => new Date(s + "T00:00:00").toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" });
const formatTime = (time) => new Date("2000-01-01T" + time + ":00").toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", hour12: true });

export default function CleaningCheckout() {
  const [params] = useSearchParams();
  const count = Number(params.get("count") || "");
  const day = params.get("date") || "";
  const time = params.get("time") || "";
  const checkoutRef = params.get("checkout_ref") || "";
  const stripeSessionId = params.get("session_id") || "";
  const paymentReturn = params.get("cleaning_payment") === "returned";
  const paymentCancelled = params.get("cleaning_payment") === "cancelled";
  const paymentProvider = params.get("provider") || "";
  const validCount = Number.isInteger(count) && count >= 1 && count <= MAX_UNITS;
  const validTime = ["08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00"].includes(time)
    && ["08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00"].indexOf(time) + count <= 7;
  const localToday = new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Sydney" });
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(day) && day >= localToday;
  const [firstPrice, setFirstPrice] = useState(scheduledCleaningPrice);
  const [priceReady, setPriceReady] = useState(false);
  const price = (validCount ? firstPrice + EXTRA_PRICE * (count - 1) : firstPrice);
  const totalDuration = count * 90;
  const backUrl = "/split-system-cleaning/#cleaning-booking";

  const [details, setDetails] = useState({ name: "", address: "", phone: "", email: "" });
  const [provider, setProvider] = useState("stripe");
  const [paymentChoice, setPaymentChoice] = useState("booking");
  const dueNow = paymentChoice === "booking" ? 50 : price;
  const remainingBalance = price - dueNow;
  const [settings, setSettings] = useState(getCachedCleaningCheckoutConfig);
  const [settingsError, setSettingsError] = useState("");
  const [paymentRefreshKey, setPaymentRefreshKey] = useState(0);
  const [settingsLoading, setSettingsLoading] = useState(() => !getCachedCleaningCheckoutConfig());
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState({ status: "processing" });
  const [cancellationStatus, setCancellationStatus] = useState(paymentCancelled ? "releasing" : "");
  const paypalCaptureStarted = useRef(false);
  const checkoutTracked = useRef("");
  const purchaseTracked = useRef("");

  useEffect(() => {
    if (paymentReturn || !validCount) return undefined;
    let live = true;
    setSettingsLoading(!getCachedCleaningCheckoutConfig());
    setSettingsError("");
    getCleaningCheckoutConfig()
      .then((data) => { if (live) {
        setSettings(data);
        const advertisedPrice = Number(data?.first_system);
        setFirstPrice(scheduledCleaningPrice());
        const matchesOffer = advertisedPrice === scheduledCleaningPrice()
          && Number(data?.each_additional_system) === EXTRA_PRICE
          && Number(data?.booking_payment) === 50
          && data?.enabled === true;
        setPriceReady(matchesOffer);
        if (!matchesOffer) {
          setSettingsError("The $200 deep-clean offer is being synchronized with our payment provider. Please try again shortly.");
        }
        setSettingsLoading(false);
        if (!data.stripe_ready && data.paypal_ready) setProvider("paypal");
        if (!data.stripe_ready && !data.paypal_ready) setSettingsError("Secure full-payment checkout is temporarily unavailable. Please contact SplitsPro.");
      }})
      .catch(() => { if (live) { setSettingsLoading(false); setSettingsError("Payment options could not load. Try again below."); } });
    return () => { live = false; };
  }, [paymentReturn, validCount, paymentRefreshKey]);

  useEffect(() => {
    if (!paymentReturn || !checkoutRef) return undefined;
    let stopped = false;
    let pendingTimer = null;
    let tries = 0;
    const poll = async () => {
      if (stopped) return;
      tries += 1;
      try {
        const result = await api.get("/cleaning-payment-status", { params: { checkout_ref: checkoutRef, ...(paymentProvider === "paypal" ? {} : { session_id: stripeSessionId }) }, timeout: 16000 });
        if (stopped) return;
        setPaymentStatus(result.data);
        if (result.data?.status === "confirmed" || result.data?.status === "needs_reschedule") return;
      } catch {
        if (!stopped) setPaymentStatus({ status: "processing" });
      }
      if (tries < 16 && !stopped) pendingTimer = window.setTimeout(poll, 1700);
    };
    const begin = async () => {
      if (paymentProvider === "paypal" && !paypalCaptureStarted.current) {
        paypalCaptureStarted.current = true;
        try {
          const capture = await api.post("/cleaning-paypal-capture", { checkout_ref: checkoutRef }, { timeout: 42000 });
          if (stopped) return;
          setPaymentStatus(capture.data);
          if (capture.data?.status === "confirmed" || capture.data?.status === "needs_reschedule") return;
        } catch {
          if (!stopped) {
            setError("PayPal payment confirmation is taking longer than expected. Do not pay twice; contact SplitsPro if it doesn't confirm.");
          }
        }
      }
      await poll();
    };
    begin();
    return () => { stopped = true; if (pendingTimer) window.clearTimeout(pendingTimer); };
  }, [paymentReturn, checkoutRef, paymentProvider, stripeSessionId]);

  useEffect(() => {
    if (!paymentCancelled || !checkoutRef) return undefined;
    let active = true;
    api.post("/cleaning-checkout-cancel", { checkout_ref: checkoutRef }, { timeout: 30000 })
      .then(({ data }) => {
        if (!active) return;
        setCancellationStatus(data.status || "released");
      })
      .catch(() => {
        if (active) setCancellationStatus("pending");
      });
    return () => { active = false; };
  }, [paymentCancelled, checkoutRef]);

  // Report funnel progress to Meta now; GA4 will also receive events once connected.
  useEffect(() => {
    if (paymentReturn || paymentCancelled || !validCount || !validDate || !validTime || settingsLoading || settingsError) return;
    const selection = [count, day, time].join("|");
    if (checkoutTracked.current === selection) return;
    checkoutTracked.current = selection;
    const items = [{ item_id: "split_cleaning", item_name: "Split system deep cleaning", quantity: count }];
    if (typeof window.fbq === "function") {
      window.fbq("track", "InitiateCheckout", { value: price, currency: "AUD", num_items: count, content_name: "Split system deep cleaning" });
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", "begin_checkout", { value: price, currency: "AUD", items });
    }
  }, [paymentReturn, paymentCancelled, validCount, validDate, validTime, settingsLoading, settingsError, price, count, day, time]);

  // Report genuine paid bookings only after server-side Stripe/PayPal verification.
  useEffect(() => {
    const status = paymentStatus?.status;
    if (!paymentReturn || !checkoutRef || (status !== "confirmed" && status !== "needs_reschedule")) return;
    const amountPaid = Number(paymentStatus?.amount_paid);
    if (!Number.isFinite(amountPaid) || amountPaid <= 0) return;
    const key = "splitspro:cleaning-purchase:" + checkoutRef;
    if (purchaseTracked.current === key) return;
    try { if (window.localStorage.getItem(key) === "sent") return; } catch {}
    let sent = false;
    if (typeof window.fbq === "function") {
      window.fbq("track", "Purchase", {
        value: amountPaid, currency: "AUD", content_name: "Split system deep cleaning",
        content_type: "product", num_items: count,
      }, { eventID: "cleaning-" + checkoutRef });
      sent = true;
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", "purchase", {
        transaction_id: checkoutRef, value: amountPaid, currency: "AUD",
        items: [{ item_id: "split_cleaning", item_name: "Split system deep cleaning", quantity: count }],
      });
      sent = true;
    }
    if (sent) {
      purchaseTracked.current = key;
      try { window.localStorage.setItem(key, "sent"); } catch {}
    }
  }, [paymentReturn, checkoutRef, paymentStatus?.status, paymentStatus?.amount_paid, count]);

  if (!validCount || (!paymentReturn && (!validDate || !validTime))) {
    return <Navigate to={backUrl} replace />;
  }

  const update = (key, value) => {
    setDetails((previous) => ({ ...previous, [key]: value }));
    setError("");
  };
  const formReady = details.name.trim().length >= 2
    && details.address.trim().length >= 6
    && details.phone.replace(/\D/g, "").length >= 8
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim());

  const pay = async (event) => {
    event.preventDefault();
    if (!formReady || processing || settingsError || !settings || !priceReady) return;
    if (provider === "stripe" && !settings.stripe_ready) return;
    if (provider === "paypal" && !settings.paypal_ready) return;
    setProcessing(true);
    setError("");
    try {
      // Server checks live availability and holds the slot atomically.
      const response = await api.post("/cleaning-checkout", {
        quantity: count,
        booking_date: day,
        start_time: time,
        payment_provider: provider,
        payment_choice: paymentChoice,
        name: details.name.trim(),
        address: details.address.trim(),
        phone: details.phone.trim(),
        email: details.email.trim(),
        page_url: window.location.href,
        referrer: document.referrer || "",
      }, { timeout: 55000 });
      if (!response.data?.checkout_url || !/^https:\/\//.test(response.data.checkout_url)) {
        throw new Error("Secure checkout is temporarily unavailable. No payment has started.");
      }
      if (Number(response.data.total_amount) !== price ||
          Number(response.data.amount_due_now) !== dueNow ||
          Number(response.data.balance_amount) !== remainingBalance ||
          response.data.payment_choice !== paymentChoice) {
        throw new Error("The booking total couldn't be verified. No payment was taken.");
      }
      window.location.assign(response.data.checkout_url);
    } catch (e) {
      const serverDetail = e?.response?.data?.detail;
      const message = typeof serverDetail === "string" ? serverDetail
        : typeof serverDetail?.message === "string" ? serverDetail.message
        : e?.message || "Could not start payment. Nothing has been charged.";
      setError(message);
      setProcessing(false);
    }
  };

  if (paymentReturn) {
    const status = paymentStatus?.status || "processing";
    const confirmed = status === "confirmed";
    const needsHelp = status === "needs_reschedule";
    return (
      <section className="min-h-[70vh] bg-[#F4F9FC] px-4 pb-20 pt-36 text-[#102A41]">
        <div className="mx-auto max-w-2xl border-t-[6px] border-[#05A4CD] bg-white p-7 shadow-sm sm:p-10">
          {confirmed ? <ShieldCheck className="h-12 w-12 text-[#0E9C83]" /> : <Loader2 className="h-9 w-9 text-[#0699C8]" />}
          <h1 className="mt-6 text-3xl font-black uppercase sm:text-4xl">
            {confirmed ? (paymentStatus?.balance_amount > 0 ? "YOUR " + money(Number(paymentStatus?.amount_paid ?? 50)) + " BOOKING IS CONFIRMED." : "FULLY PAID. YOUR CLEAN IS BOOKED.") : needsHelp ? "PAYMENT RECEIVED — TIME NEEDS CONFIRMING." : "VERIFYING YOUR PAYMENT"}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#405768]">
            {confirmed
              ? "Your " + count + " system cleaning appointment is confirmed for " + formatDate(day) + " at " + formatTime(time) + ". Paid now: " + money(Number(paymentStatus?.amount_paid ?? price)) + "." + (paymentStatus?.balance_amount > 0 ? " Remaining " + money(paymentStatus.balance_amount) + " due after cleaning is completed." : " Nothing further to pay for the agreed standard service.")
              : needsHelp
                ? "Your payment was received, but that time requires rescheduling. Please contact SplitsPro; don't pay again."
                : "Your payment provider has returned you to SplitsPro. We're verifying your selected payment and booking. Please do not pay again while confirmation is processing."}
          </p>
          {error && <p className="mt-5 border-l-4 border-[#F4C620] pl-4 text-sm font-semibold text-[#6E4C16]">{error}</p>}
          <a className="mt-7 inline-block text-base font-bold text-[#007DA5] underline" href="tel:0414698435">Call SplitsPro · 0414 698 435</a>
          <div><Link to="/split-system-cleaning/" className="mt-5 inline-block text-sm underline">Back to cleaning page</Link></div>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-[#F4F9FC] pb-20 pt-28 text-[#102A41]" data-testid="cleaning-secure-checkout">
      <Helmet><title>Secure Cleaning Checkout & Pay Later Options | SplitsPro</title><meta name="robots" content="noindex,follow" /></Helmet>
      <div className="sp-container mx-auto max-w-5xl">
        <Link to={backUrl} className="inline-flex items-center gap-2 text-sm font-bold text-[#007FA4]">
          <ArrowLeft className="h-4 w-4" /> Change your cleaning time
        </Link>
        <div className="mt-5 grid gap-5 lg:mt-7 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          <div className="hidden lg:block">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#078EBA]">STEP 2 · SECURE YOUR CLEANING</p>
            <h1 className="mt-4 text-4xl font-black uppercase leading-tight sm:text-5xl">YOUR CLEAN. YOUR WAY TO PAY.</h1>
            <div className="mt-7 border-y-2 border-[#CDDCE5] py-6">
              <p className="text-lg font-bold">{count} wall-mounted split system{count > 1 ? "s" : ""}</p>
              <p className="mt-3 text-5xl font-black text-[#007FA4]">{money(price)}</p>
              <p className="mt-2 text-sm font-semibold text-[#496070]">Pay $50 online to book your cleaning, with the remaining balance due after the service. Or pay the full amount now (including eligible pay-later options).</p>
              <div className="mt-5 border-t border-[#D3E2EB] pt-4" data-testid="cleaning-checkout-before-payment-reminder">
                <PayLaterReminder kind="cleaning" compact
                  stripeReady={settings?.stripe_ready}
                  paypalReady={settings?.paypal_ready} cleaningChoice={paymentChoice} />
              </div>
              <p className="mt-5 text-lg font-extrabold">{formatDate(day)} · {formatTime(time)}</p>
              <p className="mt-2 text-sm text-[#596E7B]">Allow approximately {Math.floor(totalDuration / 60)}h {totalDuration % 60 ? "30m" : ""} for the full visit.</p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#596E7B]">Your booking is confirmed when the selected payment is verified. Any remaining balance is due after the clean is completed.</p>
          </div>
          <div className="border border-[#D5E3EC] bg-white p-6 shadow-sm sm:p-9">
            <div className="mb-6 border-b border-[#D7E5ED] pb-5 lg:hidden" data-testid="cleaning-mobile-payment-summary">
              <p className="text-xs font-black uppercase tracking-[0.13em] text-[#007FA4]">YOUR SELECTED CLEAN</p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <div><p className="font-black text-[#0B2641]">{count} split {count === 1 ? "system" : "systems"}</p><p className="mt-1 text-sm text-[#526677]">{formatDate(day)} · {formatTime(time)}</p></div>
                <strong className="text-4xl font-black text-[#007FA4]">{money(price)}</strong>
              </div>
              <p className="mt-2 text-xs text-[#526677]">Pay {money(dueNow)} now{remainingBalance > 0 ? " · " + money(remainingBalance) + " after cleaning" : " · fully paid"}; the full job price is {money(price)}.</p>
            </div>
            <div className="mb-6 border-b border-[#D7E5ED] pb-6" data-testid="cleaning-payment-choice">
              <p className="text-xs font-black uppercase tracking-[0.15em] text-[#087FA4]">CHOOSE YOUR PAYMENT</p>
              <fieldset className="mt-3 grid gap-3" aria-label="How much to pay for cleaning">
                {[
                  { id: "booking", title: "Pay $50 to book", note: money(price - 50) + " due after cleaning" },
                  { id: "full", title: "Pay the full " + money(price) + " now (or use pay later)", note: "Nothing due after cleaning; eligible full-amount instalment options may appear" }
                ].map((option) => (
                  <label key={option.id} className={"flex cursor-pointer items-center gap-3 rounded-md border-2 p-4 " +
                    (paymentChoice === option.id ? "border-[#F4C620] bg-[#FFF8D8]" : "border-[#D7E2E9] bg-white hover:border-[#65C7E5]")}>
                    <input type="radio" name="cleaning-payment-choice" checked={paymentChoice === option.id}
                      onChange={() => { setPaymentChoice(option.id); setError(""); }} value={option.id}
                      disabled={processing} className="h-5 w-5 shrink-0 accent-[#087FA4]" />
                    <span><strong className="block text-lg font-black text-[#0B2641]">{option.title}</strong>
                      <span className="mt-1 block text-sm font-medium text-[#466073]">{option.note}</span></span>
                  </label>
                ))}
              </fieldset>
              <p className="mt-3 text-sm font-medium text-[#466073]">We accept major credit and debit cards through secure Stripe checkout. PayPal may also be available. Want to spread payments? Select the <strong>full amount</strong>, then choose an eligible <strong>Afterpay, Klarna, Zip or PayPal Pay in 4</strong> option if offered. The provider pays SplitsPro for the full job; you repay the provider.</p>
              <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-t border-[#D7E2E9] pt-4">
                <div><p className="text-xs font-black uppercase tracking-wide text-[#007FA4]">DUE TODAY</p><strong className="block text-3xl font-black text-[#0B2641]">{money(dueNow)}</strong></div>
                <div className="text-right"><p className="text-xs font-black uppercase tracking-wide text-[#526677]">AFTER CLEANING</p><strong className="block text-2xl font-black text-[#0B2641]">{money(remainingBalance)}</strong></div>
              </div>
            </div>
            <h2 className="text-2xl font-black uppercase">YOUR BOOKING DETAILS</h2>
            <p className="mt-3 text-sm text-[#526677]">Choose how much to pay now, then enter your four contact details.</p>
            <div className="mt-5 border-t border-[#DEE6EC] pt-4" data-testid="cleaning-before-customer-form-pay-later-reminder">
              <PayLaterReminder kind="cleaning" compact
                stripeReady={settings?.stripe_ready}
                paypalReady={settings?.paypal_ready} cleaningChoice={paymentChoice} />
            </div>
            <form onSubmit={pay} className="mt-7 space-y-5">
              <label data-clarity-mask="true" className={fieldLabel}>Full name<input className={fieldInput} required autoComplete="name" value={details.name} onChange={(e) => update("name", e.target.value)} placeholder="Full name" /></label>
              <label data-clarity-mask="true" className={fieldLabel}>Cleaning address<input className={fieldInput} required autoComplete="street-address" value={details.address} onChange={(e) => update("address", e.target.value)} placeholder="Street address, suburb and postcode" /></label>
              <label data-clarity-mask="true" className={fieldLabel}>Mobile number<input className={fieldInput} required type="tel" autoComplete="tel" value={details.phone} onChange={(e) => update("phone", e.target.value)} placeholder="04xx xxx xxx" /></label>
              <label data-clarity-mask="true" className={fieldLabel}>Email<input className={fieldInput} required type="email" autoComplete="email" value={details.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" /></label>

              <fieldset className="border-t border-[#DEE6EC] pt-5">
                <legend className="text-sm font-black uppercase tracking-wide">PAYMENT METHOD</legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { id: "stripe", title: "Stripe", note: paymentChoice === "booking" ? "Card or other available methods for your $50 booking" : "Card or eligible full-amount pay-later methods", enabled: settings?.stripe_ready },
                    { id: "paypal", title: "PayPal", note: paymentChoice === "booking" ? "PayPal for your $50 booking" : "PayPal or eligible Pay in 4 on the full amount", enabled: settings?.paypal_ready },
                  ].map((method) => (
                    <label key={method.id} className={"flex items-start gap-3 border p-4 " + (provider === method.id ? "border-[#00A1CF] bg-[#EFFAFE]" : "border-[#D6E0E7]") + (!method.enabled ? " opacity-50" : "")}>
                      <input type="radio" name="cleaning-provider" disabled={!method.enabled || processing} checked={provider === method.id} onChange={() => setProvider(method.id)} />
                      <span><strong className="block text-sm">{method.title}</strong><small className="mt-1 block text-xs text-[#586D7D]">{settingsLoading || !settings ? "Checking payment connection…" : settingsError ? "Connection check failed — retry below" : method.enabled ? method.note : "Currently unavailable for cleaning"}</small></span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <button type="submit" disabled={!formReady || !settings || !!settingsError || !priceReady || processing || !(provider === "stripe" ? settings?.stripe_ready : settings?.paypal_ready)}
                className="flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-[#F4C620] p-4 text-base font-black uppercase text-[#09243B] disabled:opacity-40">
                {processing ? <><Loader2 className="h-5 w-5 animate-spin"/>Opening secure payment…</>
                  : <><CreditCard className="h-5 w-5"/>PAY {money(dueNow)} TO {paymentChoice === "booking" ? "BOOK" : "COMPLETE"} · {provider === "paypal" ? "PAYPAL" : "STRIPE"} <ArrowRight className="h-5 w-5"/></>}
              </button>
              {settingsLoading && <p role="status" className="text-sm font-medium text-[#526677]">Checking available payment methods...</p>}
              {settingsError && <div role="alert" className="border-l-[3px] border-[#F4C620] pl-3"><p className="text-sm font-semibold text-[#9A441C]">{settingsError}</p><button type="button" onClick={() => setPaymentRefreshKey((value) => value + 1)} className="mt-2 text-sm font-black text-[#007FA4] underline underline-offset-2">Retry payment connection</button></div>}
              {error && <p role="alert" className="border-l-4 border-[#EDBD42] pl-4 text-sm font-semibold text-[#834E11]">{error}</p>}
              {paymentCancelled && <p role="status" className="text-sm font-semibold">
                {cancellationStatus === "released"
                  ? "Payment cancelled. Your temporary booking hold has been released; you can select a time again."
                  : cancellationStatus === "releasing"
                    ? "Cancelling your unpaid checkout and releasing the temporary booking hold…"
                    : cancellationStatus === "already_paid" || cancellationStatus === "payment_processing"
                      ? "Stripe may have received a payment. Please contact SplitsPro before trying to pay again."
                      : "Payment was cancelled. The temporary hold will expire automatically if it has not already been released."}
              </p>}
              <p className="text-xs leading-relaxed text-[#627888]">The $50 booking payment is credited toward the full service. Any balance is due after cleaning. To use buy now, pay later on the full service amount, select full payment and an eligible provider. Cancellation and refund rights under Australian Consumer Law still apply.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
