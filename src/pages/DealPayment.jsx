import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight, CheckCircle2, CreditCard, Loader2, Phone } from "lucide-react";
import { PHONE_TEL } from "../lib/data";
import { api } from "../lib/api";

const DEALS = {
  "rinnai-local:2.5kW": ["Rinnai PX 2.5kW", 1700],
  "rinnai-local:3.5kW": ["Rinnai PX 3.5kW", 1850],
  "rinnai-local:5.0kW": ["Rinnai 5kW", 2300],
  "rinnai-local:7.0kW": ["Rinnai 7kW", 2600],
  "rinnai-local:8.0kW": ["Rinnai 8kW", 3000],
  "daikin-lite-local:2.5kW": ["Daikin Cora 2.5kW", 2000],
  "daikin-lite-local:3.5kW": ["Daikin Cora 3.5kW", 2200],
  "daikin-lite-local:5.0kW": ["Daikin Cora 5kW", 2650],
  "daikin-lite-local:7.0kW": ["Daikin Cora 7kW", 3200],
  "daikin-lite-local:8.0kW": ["Daikin Cora 8kW", 3650],
  "daikin-lite-local:9.0kW": ["Daikin Cora 9kW", 4100],
};
const money = (n) => new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
const prettyDay = (day) => new Date(day + "T00:00:00").toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" });
const inputClass = "mt-1 h-12 w-full rounded-md border border-[#D4CEC3] px-3 text-sm outline-[#C8A46A]";
const labelClass = "block text-xs font-extrabold uppercase tracking-wide text-[#554E42]";

export default function DealPayment() {
  const [params] = useSearchParams();
  const productKey = params.get("product") || "";
  const size = params.get("size") || "";
  const date = params.get("date") || "";
  const bookingWindow = params.get("window") || "";
  const model = DEALS[productKey + ":" + size];
  const paymentReturn = params.get("deal_payment") === "returned";
  const cancelled = params.get("deal_payment") === "cancelled";
  const ref = params.get("booking_ref") || "";
  const sessionId = params.get("session_id") || "";
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Sydney" });
  const valid = !!model && /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    ["Morning", "Afternoon"].includes(bookingWindow) && (paymentReturn || cancelled || date > today);
  const [choice, setChoice] = useState("deposit");
  const [buyer, setBuyer] = useState({ name: "", phone: "", email: "", address: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState({ status: "processing" });
  const tracked = useRef("");
  const total = model?.[1] || 0;
  const backendChoice = choice === "deposit" ? "deposit" : "full";
  const dueNow = choice === "deposit" ? total / 10 : total;
  const remaining = total - dueNow;

  useEffect(() => {
    if (!paymentReturn || !ref || !sessionId) return undefined;
    let live = true;
    let timeout;
    let tries = 0;
    const poll = async () => {
      tries++;
      try {
        const response = await api.get("/installed-deal-payment-status", {
          params: { booking_ref: ref, session_id: sessionId }, timeout: 16000
        });
        if (!live) return;
        setStatus(response.data);
        if (["confirmed", "needs_reschedule"].includes(response.data?.status)) return;
      } catch {}
      if (live && tries < 15) timeout = window.setTimeout(poll, 1800);
    };
    poll();
    return () => { live = false; window.clearTimeout(timeout); };
  }, [paymentReturn, ref, sessionId]);

  useEffect(() => {
    if (status?.status !== "confirmed" || tracked.current === ref || !ref) return;
    const amount = Number(status.deposit_amount);
    if (!Number.isFinite(amount) || amount <= 0) return;
    tracked.current = ref;
    if (typeof window.fbq === "function") {
      try {
        const key = "splitspro-deal-purchase-" + ref;
        if (window.localStorage.getItem(key) === "sent") return;
        window.fbq("track", "Purchase", { value: amount, currency: "AUD", content_name: model?.[0] + " installed" },
          { eventID: "installed-deal-" + ref });
        window.localStorage.setItem(key, "sent");
      } catch {}
    }
  }, [status?.status, status?.deposit_amount, ref, model]);

  if (!valid) return <Navigate to="/split-systems/rinnai-local-offer#local-deal-booking" replace />;

  const update = (key, value) => { setBuyer((old) => ({ ...old, [key]: value })); setError(""); };
  const ready = buyer.name.trim().length >= 2 && buyer.address.trim().length >= 6 &&
    buyer.phone.replace(/\D/g, "").length >= 8 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email.trim());

  const submit = async (event) => {
    event.preventDefault();
    if (!ready || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await api.post("/installed-deal-checkout", {
        product_key: productKey, size, booking_date: date, booking_window: bookingWindow,
        payment_choice: backendChoice, name: buyer.name.trim(), phone: buyer.phone.trim(),
        email: buyer.email.trim(), address: buyer.address.trim(), suburb: buyer.address.trim(),
        service: "Split System Installation",
        message: model[0] + " supplied and installed; standard installation conditions confirmed",
        page_url: window.location.href, referrer: document.referrer || ""
      }, { timeout: 45000 });
      const data = response.data;
      if (!/^https:\/\/checkout\.stripe\.com\//.test(data?.checkout_url || "") ||
          Number(data.total_amount) !== total || Number(data.amount_due_now) !== dueNow ||
          Number(data.balance_amount) !== remaining || data.payment_choice !== backendChoice) {
        throw new Error("The payment total could not be verified. No payment started.");
      }
      if (typeof window.fbq === "function") {
        window.fbq("track", "InitiateCheckout", { currency: "AUD", value: dueNow, content_name: model[0] + " installed" });
      }
      window.location.assign(data.checkout_url);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : detail?.message || err?.message || "Unable to start payment. No charge made.");
      setBusy(false);
    }
  };

  if (paymentReturn) {
    const confirmed = status?.status === "confirmed";
    const needsHelp = status?.status === "needs_reschedule";
    return <main className="min-h-[70vh] bg-[#F7F5F1] px-4 pb-20 pt-36">
      <Helmet><title>Installation Payment Status | SplitsPro</title><meta name="robots" content="noindex" /></Helmet>
      <section className="mx-auto max-w-xl border-t-4 border-[#C8A46A] bg-white p-8">
        <h1 className="font-serif text-3xl">{confirmed ? "Installation booked" : needsHelp ? "Payment received — new time needed" : "Verifying your payment"}</h1>
        <p className="mt-4 text-sm leading-relaxed text-[#555]">
          {confirmed ? model[0] + " booked for " + prettyDay(date) + " " + bookingWindow.toLowerCase() +
              ". Payment received: " + money(Number(status.deposit_amount)) +
              ". Remaining balance: " + money(Number(status.balance_amount)) + "."
            : needsHelp ? "Your payment was received, but the selected time needs rescheduling. SplitsPro will contact you. Do not pay twice."
            : "Stripe has returned you to SplitsPro. We're verifying payment before confirming your installation time. Do not pay again."}
        </p>
        <Link to="/split-systems/rinnai-local-offer" className="mt-6 inline-block font-bold text-[#85622F] underline">Back to deals</Link>
      </section>
    </main>;
  }

  return <main className="min-h-screen bg-[#F7F5F1] pb-20 pt-28 text-[#181818]" data-testid="installed-deal-payment-page">
    <Helmet><title>Choose How to Pay | SplitsPro</title><meta name="robots" content="noindex,follow" /></Helmet>
    <div className="mx-auto max-w-4xl px-4">
      <Link to="/split-systems/rinnai-local-offer#local-deal-booking" className="inline-flex items-center gap-2 text-sm font-bold text-[#876338] underline">
        <ArrowLeft className="h-4 w-4" /> Change unit, day or time
      </Link>
      {cancelled && <p role="status" className="mt-5 border-l-4 border-[#C8A46A] bg-white p-4 text-sm">
        Payment cancelled. No appointment was booked. You can retry, subject to availability.
      </p>}
      <p className="mt-8 text-xs font-black uppercase tracking-wider text-[#876338]">Step 5 · Secure the installation</p>
      <h1 className="mt-2 font-serif text-4xl">Choose how you'd like to pay.</h1>
      <p className="deal-step-win mt-4 flex items-start gap-2 rounded-lg border border-[#E2CDAA] bg-[#FFF9EC] px-4 py-3 text-sm font-semibold text-[#4E3A1F]">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#A3793B]" />
        Nice work — your system and preferred time are chosen. Nothing is charged until you confirm the secure checkout.
      </p>
      <div className="mt-7 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <section className="h-fit border-t-4 border-[#C8A46A] bg-white p-6">
          <h2 className="text-xl font-black">{model[0]}</h2>
          <p className="mt-3 text-sm font-semibold">{prettyDay(date)} · {bookingWindow}</p>
          <strong className="mt-4 block text-4xl text-[#8F6A34]">{money(total)}</strong>
          <p className="mt-2 text-sm text-[#666]">Supplied and fully installed at the advertised standard-install price.</p>
          <h3 className="mt-5 border-t border-[#DDD8CF] pt-4 font-bold">Your price includes</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#555]">
            Air conditioner, installation and commissioning, up to 3m pipework, isolator,
            standard mounting and up to 20m electrical connection where required.
          </p>
          <p className="mt-4 text-xs text-[#666]">Non-standard work is quoted separately. The date is only confirmed after payment succeeds.</p>
        </section>
        <section className="border-t-4 border-[#C8A46A] bg-white p-6 sm:p-8">
          <h2 className="text-xl font-black">Payment options</h2>
          <div className="mt-4 grid gap-3" role="radiogroup" aria-label="Payment choice">
            <button type="button" role="radio" aria-checked={choice === "deposit"} onClick={() => setChoice("deposit")}
              className={"rounded-lg border-2 p-4 text-left " + (choice === "deposit" ? "border-[#C8A46A] bg-[#FBF2E2]" : "border-[#DDD8CF]")}>
              <strong className="block">Book with 10% · {money(total / 10)}</strong>
              <span className="mt-1 block text-sm text-[#555]">Remaining balance: {money(total * .9)} under your installation agreement.</span>
            </button>
            <button type="button" role="radio" aria-checked={choice === "paylater"} onClick={() => setChoice("paylater")}
              className={"rounded-lg border-2 p-4 text-left " + (choice === "paylater" ? "border-[#C8A46A] bg-[#FBF2E2]" : "border-[#DDD8CF]")}>
              <strong className="block">Buy now, pay later · {money(total)}</strong>
              <span className="mt-1 block text-sm text-[#555]">Continue to Stripe to see eligible Afterpay, Klarna or Zip instalment plans. Provider approval and limits apply.</span>
            </button>
            <button type="button" role="radio" aria-checked={choice === "full"} onClick={() => setChoice("full")}
              className={"rounded-lg border-2 p-4 text-left " + (choice === "full" ? "border-[#C8A46A] bg-[#FBF2E2]" : "border-[#DDD8CF]")}>
              <strong className="block">Pay the full installed price · {money(total)}</strong>
              <span className="mt-1 block text-sm text-[#555]">Pay by card at the full installed price.</span>
            </button>
          </div>
          <a href={PHONE_TEL} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#80602F] underline"><Phone className="h-4 w-4" /> Prefer to call before booking?</a>
          <div className="mt-5 flex items-end justify-between border-y border-[#DDD8CF] py-4">
            <div><small className="block font-bold">{choice === "paylater" ? "CHECKOUT TOTAL" : "PAY NOW"}</small><strong className="text-3xl">{money(dueNow)}</strong></div>
            <div className="text-right"><small className="block font-bold">BALANCE</small><strong className="text-xl">{money(remaining)}</strong></div>
          </div>
          {choice === "paylater" && <p className="mt-3 text-xs text-[#666]">Any instalment schedule and initial payment are set by your eligible provider at Stripe checkout.</p>}
          <h3 className="mt-6 text-xl font-black">Your details</h3>
          <p className="mt-2 text-sm text-[#666]">Next, you'll go to secure Stripe checkout.</p>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <label className={labelClass}>Full name<input className={inputClass} value={buyer.name} onChange={(e) => update("name", e.target.value)} autoComplete="name" required /></label>
            <label className={labelClass}>Mobile<input className={inputClass} value={buyer.phone} onChange={(e) => update("phone", e.target.value)} autoComplete="tel" type="tel" required /></label>
            <label className={labelClass}>Email<input className={inputClass} value={buyer.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" type="email" required /></label>
            <label className={labelClass}>Installation address<input className={inputClass} value={buyer.address} onChange={(e) => update("address", e.target.value)} autoComplete="street-address" placeholder="Street address, suburb and postcode" required /></label>
            <button type="submit" disabled={!ready || busy}
              className="flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-[#C8A46A] p-4 text-sm font-black uppercase disabled:opacity-40">
              {busy ? <><Loader2 className="h-5 w-5 animate-spin" /> Opening Stripe…</> :
                <><CreditCard className="h-5 w-5" /> {choice === "paylater" ? "See pay-later at secure checkout" : "Pay " + money(dueNow) + " · secure checkout"} <ArrowRight className="h-5 w-5" /></>}
            </button>
            {error && <p role="alert" className="text-sm font-bold text-red-700">{error} <Link to="/split-systems/rinnai-local-offer#local-deal-booking" className="underline">Choose another time</Link></p>}
            <p className="text-xs text-[#666]">Your time is temporarily held when Stripe checkout opens, but is only booked after the payment is verified. An unpaid hold expires automatically.</p>
          </form>
        </section>
      </div>
    </div>
    <a href={PHONE_TEL} data-testid="deal-payment-floating-call"
      className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-[#111] px-5 py-3 text-sm font-extrabold uppercase text-white shadow-2xl sm:bottom-7 sm:right-7">
      <Phone className="h-4 w-4" /> Call now
    </a>
  </main>;
}
