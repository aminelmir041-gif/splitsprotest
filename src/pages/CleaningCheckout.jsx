import { useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { api, getBookingSlots } from "../lib/api";

const OFFERS = {
  one: { title: "1 Deep Clean", price: 220, note: "One wall-mounted split system" },
  two: { title: "2 Deep Cleans", price: 300, note: "Two systems, same property and visit" },
};
const money = (n) => new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
const labelStyle = "block text-xs font-bold uppercase tracking-wide text-[#5D6064]";
const inputStyle = "mt-2 h-12 w-full rounded-md border border-[#D9D5CD] bg-white px-4 text-sm text-[#171717] outline-none focus:border-[#9C753A]";
const formatDate = (s) => new Date(s + "T00:00:00").toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" });

export default function CleaningCheckout() {
  const [params] = useSearchParams();
  const packageId = params.get("package") || "";
  const bookingDate = params.get("date") || "";
  const bookingWindow = params.get("window") || "";
  const selectedOffer = OFFERS[packageId];
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(bookingDate) && bookingDate >= new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Sydney" });
  const validWindow = ["Morning", "Afternoon"].includes(bookingWindow);
  const [customer, setCustomer] = useState({ name: "", address: "", phone: "", email: "" });
  const [provider, setProvider] = useState("stripe");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const finished = params.get("payment") === "success" || params.get("cleaning_payment") === "returned";
  const cancelled = ["cancel", "cancelled"].includes(params.get("payment")) || params.get("cleaning_payment") === "cancelled";
  const checkoutRef = params.get("checkout_ref") || params.get("order_id") || params.get("session_id") || "";
  const backHref = "/split-system-cleaning/#cleaning-booking";

  useEffect(() => {
    if (!finished || !checkoutRef) return undefined;
    let stopped = false;
    let timeout;
    let tries = 0;
    const check = async () => {
      tries += 1;
      try {
        const response = await api.get("/cleaning-payment-status", { params: { checkout_ref: checkoutRef }, timeout: 15000 });
        if (stopped) return;
        const next = response.data;
        setPaymentStatus(next);
        if (next?.status === "processing" && tries < 12) timeout = setTimeout(check, 1200);
      } catch {
        if (!stopped) setPaymentStatus({ status: "pending_confirmation" });
      }
    };
    check();
    return () => { stopped = true; clearTimeout(timeout); };
  }, [finished, checkoutRef]);

  if (!selectedOffer || !validDate || !validWindow) return <Navigate to={backHref} replace />;

  const update = (key, value) => { setCustomer((old) => ({ ...old, [key]: value })); setError(""); };
  const isComplete = customer.name.trim().length >= 2
    && customer.address.trim().length >= 6
    && customer.phone.replace(/\D/g, "").length >= 8
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim());

  const submit = async (event) => {
    event.preventDefault();
    if (submitting || !isComplete) return;
    setError("");
    setSubmitting(true);
    try {
      // The server, not browser parameters, MUST set the amount, save the
      // customer and hold this slot atomically before returning a checkout.
      const available = await getBookingSlots(12);
      if (!(available?.slots || []).some((s) => s.date === bookingDate && s.window === bookingWindow)) {
        throw new Error("That time is no longer available. Go back and choose another date.");
      }
      const response = await api.post("/cleaning-checkout", {
        package_id: packageId,
        booking_date: bookingDate,
        booking_window: bookingWindow,
        payment_provider: provider,
        name: customer.name.trim(),
        address: customer.address.trim(),
        phone: customer.phone.trim(),
        email: customer.email.trim(),
        page_url: window.location.href,
        referrer: document.referrer || "",
      }, { timeout: 55000 });
      const url = response.data?.checkout_url;
      if (!url || !/^https:\/\//.test(url)) throw new Error("Secure checkout is not available for this booking. No payment has started.");
      window.location.assign(url);
    } catch (e) {
      const status = e?.response?.status;
      const serverMessage = typeof e?.response?.data?.detail === "string" ? e.response.data.detail : "";
      setError(status === 404 || status === 501
        ? "Cleaning payment checkout is not connected yet. No payment was taken — please call SplitsPro to book."
        : status === 409 ? "That date has filled up. Go back and choose another available time."
        : serverMessage || e?.message || "Could not start secure payment. Nothing has been charged.");
      setSubmitting(false);
    }
  };

  if (finished) {
    const confirmed = paymentStatus?.status === "confirmed";
    return <section className="min-h-[60vh] bg-[#F7F5F1] px-4 pb-20 pt-36">
      <div className="mx-auto max-w-xl border-t-4 border-[#C8A46A] bg-white p-7">
        <ShieldCheck className="h-9 w-9 text-[#C8A46A]" />
        <h1 className="mt-4 font-serif text-3xl">{confirmed ? "Cleaning booking confirmed" : "Checking your payment"}</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#5B6066]">{confirmed
          ? "Your " + selectedOffer.title + " is booked for " + formatDate(bookingDate) + " · " + bookingWindow + "."
          : "We're checking the payment with your provider. Please don't pay twice. Your date is not confirmed until our payment system verifies it."}</p>
        <Link to="/split-system-cleaning/" className="mt-6 inline-flex text-sm font-semibold text-[#906932] underline">Back to cleaning</Link>
      </div>
    </section>;
  }

  return (
    <div className="bg-[#F7F5F1] pb-20 pt-32 text-[#171717]" data-testid="cleaning-secure-checkout">
      <Helmet><title>Secure Cleaning Booking | SplitsPro</title><meta name="robots" content="noindex,follow" /></Helmet>
      <div className="sp-container mx-auto max-w-4xl">
        <Link to={backHref} className="inline-flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[#92703C]"><ArrowLeft className="h-4 w-4" /> Back to cleaning dates</Link>
        <div className="mt-5 grid gap-9 lg:grid-cols-[.85fr_1.15fr] lg:gap-12">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#946C35]">2 · Your details and secure payment</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight">Nearly there. Let's lock it in.</h1>
            <div className="mt-7 border-y border-[#DBD6CD] py-5">
              <p className="text-sm font-bold">{selectedOffer.title}</p>
              <p className="mt-1 text-xs text-[#5E646A]">{selectedOffer.note}</p>
              <p className="mt-3 text-4xl font-extrabold text-[#8F6A34]">{money(selectedOffer.price)}</p>
              <p className="mt-4 text-sm font-bold">{formatDate(bookingDate)} · {bookingWindow}</p>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-[#686D73]">The date is a requested opening until checkout is paid and confirmed. Final availability is rechecked before payment.</p>
            <a href="tel:0414698435" className="mt-4 inline-flex text-sm font-bold text-[#8F6A34] underline underline-offset-4">Need help? Call 0414 698 435</a>
          </div>
          <div className="border border-[#E3DED5] bg-white p-5 shadow-sm sm:p-8">
            <h2 className="font-serif text-2xl">Your booking details</h2>
            <p className="mt-2 text-xs text-[#63676D]">Just four details, then checkout in your existing Stripe or PayPal account.</p>
            <form className="mt-6 space-y-4" onSubmit={submit}>
              <label className={labelStyle}>Full name<input required type="text" autoComplete="name" value={customer.name} onChange={(e) => update("name", e.target.value)} className={inputStyle} placeholder="Full name" minLength={2} maxLength={120} /></label>
              <label className={labelStyle}>Street address<input required type="text" autoComplete="street-address" value={customer.address} onChange={(e) => update("address", e.target.value)} className={inputStyle} placeholder="Street, suburb and postcode" minLength={6} maxLength={300} /></label>
              <label className={labelStyle}>Phone number<input required type="tel" autoComplete="tel" value={customer.phone} onChange={(e) => update("phone", e.target.value)} className={inputStyle} placeholder="04xx xxx xxx" minLength={8} maxLength={32} /></label>
              <label className={labelStyle}>Email address<input required type="email" autoComplete="email" value={customer.email} onChange={(e) => update("email", e.target.value)} className={inputStyle} placeholder="you@example.com" maxLength={254} /></label>
              <fieldset className="border-t border-[#E5E0D8] pt-5">
                <legend className="text-xs font-extrabold uppercase tracking-[0.1em] text-[#676B70]">Choose payment method</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {[{ id: "stripe", title: "Stripe", detail: "Pay securely by card" }, { id: "paypal", title: "PayPal", detail: "Use PayPal checkout" }].map((choice) => (
                    <label key={choice.id} className={"flex cursor-pointer items-start gap-3 rounded-lg border p-3 " + (provider === choice.id ? "border-[#C8A46A] bg-[#FBF5E8]" : "border-[#E3DED5]")}>
                      <input type="radio" className="mt-1 accent-[#C8A46A]" name="cleaning-provider" value={choice.id} checked={provider === choice.id} onChange={() => setProvider(choice.id)} />
                      <span><strong className="block text-sm">{choice.title}</strong><span className="mt-0.5 block text-xs text-[#676B70]">{choice.detail}</span></span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <button type="submit" disabled={!isComplete || submitting} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#C8A46A] px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-[#111] disabled:cursor-not-allowed disabled:opacity-40">
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Starting secure checkout…</> : <><CreditCard className="h-4 w-4" /> Continue to {provider === "stripe" ? "Stripe" : "PayPal"} · {money(selectedOffer.price)}</>}
              </button>
              {error && <p role="alert" className="border-l-2 border-red-600 pl-3 text-sm leading-relaxed text-red-700">{error}</p>}
              {cancelled && <p role="status" className="text-sm text-[#816329]">Payment was cancelled. No booking was confirmed; try again when ready.</p>}
              <p className="text-center text-[11px] leading-relaxed text-[#777]">No payment is taken on this page. Your payment provider displays the final amount before you confirm.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
