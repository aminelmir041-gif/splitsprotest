import PayLaterReminder from "../components/PayLaterReminder";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { api } from "../lib/api";

const FIRST_PRICE = 300;
const EXTRA_PRICE = 200;
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
  const paymentReturn = params.get("cleaning_payment") === "returned";
  const paymentCancelled = params.get("cleaning_payment") === "cancelled";
  const paymentProvider = params.get("provider") || "";
  const validCount = Number.isInteger(count) && count >= 1 && count <= MAX_UNITS;
  const validTime = ["08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00"].includes(time);
  const localToday = new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Sydney" });
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(day) && day >= localToday;
  const price = validCount ? FIRST_PRICE + EXTRA_PRICE * (count - 1) : FIRST_PRICE;
  const totalDuration = count * 90;
  const backUrl = "/split-system-cleaning/#cleaning-booking";

  const [details, setDetails] = useState({ name: "", address: "", phone: "", email: "" });
  const [provider, setProvider] = useState("stripe");
  const [settings, setSettings] = useState(null);
  const [settingsError, setSettingsError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState({ status: "processing" });
  const paypalCaptureStarted = useRef(false);

  useEffect(() => {
    if (paymentReturn || !validCount) return undefined;
    let live = true;
    api.get("/cleaning-checkout-config", { timeout: 18000 })
      .then(({ data }) => { if (live) {
        setSettings(data);
        if (!data.stripe_ready && data.paypal_ready) setProvider("paypal");
        if (!data.stripe_ready && !data.paypal_ready) setSettingsError("Secure full-payment checkout is temporarily unavailable. Please contact SplitsPro.");
      }})
      .catch(() => { if (live) setSettingsError("Couldn't connect to secure booking checkout. Please try again."); });
    return () => { live = false; };
  }, [paymentReturn, validCount]);

  useEffect(() => {
    if (!paymentReturn || !checkoutRef) return undefined;
    let stopped = false;
    let pendingTimer = null;
    let tries = 0;
    const poll = async () => {
      if (stopped) return;
      tries += 1;
      try {
        const result = await api.get("/cleaning-payment-status", { params: { checkout_ref: checkoutRef }, timeout: 16000 });
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
  }, [paymentReturn, checkoutRef, paymentProvider]);

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
    if (!formReady || processing || settingsError || !settings) return;
    if (provider === "stripe" && !settings.stripe_ready) return;
    if (provider === "paypal" && !settings.paypal_ready) return;
    setProcessing(true);
    setError("");
    try {
      const available = await api.get("/cleaning-slots",
        { params: { quantity: count, limit: 100 }, timeout: 35000 });
      const stillFree = (available.data?.slots || []).some((s) => s.date === day && s.time === time);
      if (!stillFree) throw new Error("That appointment has just filled. Please choose another time.");
      const response = await api.post("/cleaning-checkout", {
        quantity: count,
        booking_date: day,
        start_time: time,
        payment_provider: provider,
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
      if (Number(response.data.total_amount) !== price) {
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
            {confirmed ? "FULLY PAID. YOUR CLEAN IS BOOKED." : needsHelp ? "PAYMENT RECEIVED — TIME NEEDS CONFIRMING." : "VERIFYING YOUR FULL PAYMENT"}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#405768]">
            {confirmed
              ? "Your " + count + " system cleaning appointment is confirmed for " + formatDate(day) + " at " + formatTime(time) + ". Total paid: " + money(price) + "."
              : needsHelp
                ? "Your payment was received, but that time requires rescheduling. Please contact SplitsPro; don't pay again."
                : "Your payment provider has returned you to SplitsPro. We're verifying full payment and the booking. Please do not pay again while confirmation is processing."}
          </p>
          {error && <p className="mt-5 border-l-4 border-[#F4C620] pl-4 text-sm font-semibold text-[#6E4C16]">{error}</p>}
          <a className="mt-7 inline-block text-base font-bold text-[#007DA5] underline" href="tel:0414698435">Call SplitsPro · 0414 698 435</a>
          <div><Link to="/split-system-cleaning/" className="mt-5 inline-block text-sm underline">Back to cleaning page</Link></div>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-[#F4F9FC] pb-20 pt-32 text-[#102A41]" data-testid="cleaning-secure-checkout">
      <Helmet><title>Secure Cleaning Checkout & Pay Later Options | SplitsPro</title><meta name="robots" content="noindex,follow" /></Helmet>
      <div className="sp-container mx-auto max-w-5xl">
        <Link to={backUrl} className="inline-flex items-center gap-2 text-sm font-bold text-[#007FA4]">
          <ArrowLeft className="h-4 w-4" /> Change your cleaning time
        </Link>
        <div className="mt-7 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#078EBA]">STEP 2 · SECURE FULL PAYMENT</p>
            <h1 className="mt-4 text-4xl font-black uppercase leading-tight sm:text-5xl">YOUR CLEAN. YOUR WAY TO PAY.</h1>
            <div className="mt-7 border-y-2 border-[#CDDCE5] py-6">
              <p className="text-lg font-bold">{count} wall-mounted split system{count > 1 ? "s" : ""}</p>
              <p className="mt-3 text-5xl font-black text-[#007FA4]">{money(price)}</p>
              <p className="mt-2 text-sm font-semibold text-[#496070]">No deposit or balance owing to SplitsPro. Eligible pay-later plans are arranged with the payment provider.</p>
              <div className="mt-5 border-t border-[#D3E2EB] pt-4" data-testid="cleaning-checkout-before-payment-reminder">
                <PayLaterReminder kind="cleaning" compact
                  stripeReady={settings?.stripe_ready}
                  paypalReady={settings?.paypal_ready} />
              </div>
              <p className="mt-5 text-lg font-extrabold">{formatDate(day)} · {formatTime(time)}</p>
              <p className="mt-2 text-sm text-[#596E7B]">Allow approximately {Math.floor(totalDuration / 60)}h {totalDuration % 60 ? "30m" : ""} for the full visit.</p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#596E7B]">We'll recheck that the time is still available before starting payment. Your booking is confirmed after we verify payment in full.</p>
          </div>
          <div className="border border-[#D5E3EC] bg-white p-6 shadow-sm sm:p-9">
            <h2 className="text-2xl font-black uppercase">YOUR BOOKING DETAILS</h2>
            <p className="mt-3 text-sm text-[#526677]">Name, address, phone and email. Then pay securely through your selected provider.</p>
            <div className="mt-5 border-t border-[#DEE6EC] pt-4" data-testid="cleaning-before-customer-form-pay-later-reminder">
              <PayLaterReminder kind="cleaning" compact
                stripeReady={settings?.stripe_ready}
                paypalReady={settings?.paypal_ready} />
            </div>
            <form onSubmit={pay} className="mt-7 space-y-5">
              <label className={fieldLabel}>Full name<input className={fieldInput} required autoComplete="name" value={details.name} onChange={(e) => update("name", e.target.value)} placeholder="Full name" /></label>
              <label className={fieldLabel}>Cleaning address<input className={fieldInput} required autoComplete="street-address" value={details.address} onChange={(e) => update("address", e.target.value)} placeholder="Street address, suburb and postcode" /></label>
              <label className={fieldLabel}>Mobile number<input className={fieldInput} required type="tel" autoComplete="tel" value={details.phone} onChange={(e) => update("phone", e.target.value)} placeholder="04xx xxx xxx" /></label>
              <label className={fieldLabel}>Email<input className={fieldInput} required type="email" autoComplete="email" value={details.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" /></label>

              <fieldset className="border-t border-[#DEE6EC] pt-5">
                <legend className="text-sm font-black uppercase tracking-wide">PAYMENT METHOD</legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { id: "stripe", title: "Stripe", note: "Card or eligible pay-later methods", enabled: settings?.stripe_ready },
                    { id: "paypal", title: "PayPal", note: "PayPal or eligible Pay in 4", enabled: settings?.paypal_ready },
                  ].map((method) => (
                    <label key={method.id} className={"flex items-start gap-3 border p-4 " + (provider === method.id ? "border-[#00A1CF] bg-[#EFFAFE]" : "border-[#D6E0E7]") + (!method.enabled ? " opacity-50" : "")}>
                      <input type="radio" name="cleaning-provider" disabled={!method.enabled || processing} checked={provider === method.id} onChange={() => setProvider(method.id)} />
                      <span><strong className="block text-sm">{method.title}</strong><small className="mt-1 block text-xs text-[#586D7D]">{method.enabled ? method.note : "Currently unavailable"}</small></span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <button type="submit" disabled={!formReady || !settings || !!settingsError || processing || !(provider === "stripe" ? settings?.stripe_ready : settings?.paypal_ready)}
                className="flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-[#F4C620] p-4 text-base font-black uppercase text-[#09243B] disabled:opacity-40">
                {processing ? <><Loader2 className="h-5 w-5 animate-spin"/>Checking & opening payment…</>
                  : <><CreditCard className="h-5 w-5"/>PAY {money(price)} IN FULL <ArrowRight className="h-5 w-5"/></>}
              </button>
              {settingsError && <p role="alert" className="text-sm font-semibold text-[#9A441C]">{settingsError}</p>}
              {error && <p role="alert" className="border-l-4 border-[#EDBD42] pl-4 text-sm font-semibold text-[#834E11]">{error}</p>}
              {paymentCancelled && <p role="status" className="text-sm font-semibold">Payment was cancelled. Nothing was confirmed; you can try again.</p>}
              <p className="text-xs leading-relaxed text-[#627888]">Full payment is required to confirm. Eligible instalment methods, where offered by Stripe or PayPal, are subject to their own eligibility and terms. No payment is taken directly on this page.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
