import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Clock3, Loader2, Sun } from "lucide-react";
import { getBookingSlots } from "../lib/api";

// Reuses the same live backend availability and checkout routes as /book-installation.
// No client-side date list is invented: manual blackouts and full slots stay server-controlled.
export default function InlineDealsBooking({ productKey, size, model, price }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [standardConfirmed, setStandardConfirmed] = useState(false);
  const [paymentChoice, setPaymentChoice] = useState("deposit");
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await getBookingSlots(12);
        if (!active) return;
        const available = (Array.isArray(result?.slots) ? result.slots : [])
          .filter((slot) => slot && slot.date && slot.window);
        setSlots(available);
        setSelected((previous) =>
          previous && available.some((slot) =>
            slot.date === previous.date && slot.window === previous.window)
            ? previous : null
        );
      } catch {
        if (active) setError("Live installation dates could not load. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    refresh();
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      active = false;
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [refreshCount]);

  const dateLabel = (value) =>
    new Date(value + "T00:00:00").toLocaleDateString("en-AU", {
      weekday: "short", day: "numeric", month: "short"
    });

  const targetParams = new URLSearchParams({
    product: productKey,
    size,
    date: selected?.date || "",
    window: selected?.window || ""
  });
  const bookedHref = "/secure-installation?" + targetParams.toString();
  const payLaterParams = new URLSearchParams(targetParams);
  payLaterParams.set("mode", "full");
  const financeHref = "/payment-options?" + payLaterParams.toString();

  return (
    <div className="scroll-mt-24 border-t-2 border-[#C8A46A] bg-[#F7F5F1] px-4 py-7 sm:px-8 sm:py-9"
      data-testid="local-deal-inline-booking">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#8F6A34]">
        Your selected air conditioner
      </p>
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-serif text-2xl text-[#0B0B0B] sm:text-3xl">{model} {size}</h3>
        <p className="font-serif text-3xl text-[#0B0B0B]">{price}</p>
      </div>
      <p className="mt-1 text-xs text-[#55555A]">Supplied &amp; installed on our No More to Pay standard installation model.</p>

      <h4 className="mt-7 font-serif text-2xl text-[#0B0B0B]">Choose your installation date</h4>
      <p className="mt-2 text-sm text-[#55555A]">
        These are live openings. Fully booked dates and blocked-out times are not offered.
      </p>

      {loading && (
        <p className="mt-4 flex items-center gap-2 text-sm text-[#55555A]" role="status">
          <Loader2 className="h-4 w-4 animate-spin text-[#C8A46A]" />
          {slots.length ? "Refreshing availability..." : "Loading available dates..."}
        </p>
      )}
      {error && (
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[#7B5A28]" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setRefreshCount((value) => value + 1)}
            className="font-bold underline underline-offset-4">Retry</button>
        </div>
      )}
      {!loading && !error && slots.length === 0 && (
        <p className="mt-4 text-sm text-[#55555A]">
          No online installation slots are available at the moment. Contact SplitsPro to check another date.
        </p>
      )}
      {slots.length > 0 && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label="Available installation dates">
            {(showAll ? slots : slots.slice(0, 6)).map((slot) => {
              const isSelected = selected?.date === slot.date && selected?.window === slot.window;
              return (
                <button
                  type="button"
                  key={slot.date + "-" + slot.window}
                  onClick={() => setSelected({ date: slot.date, window: slot.window })}
                  disabled={loading || !!error}
                  aria-pressed={isSelected}
                  className={"flex min-h-[66px] items-center justify-between gap-2 rounded-lg border px-3 py-3 text-left transition-colors disabled:opacity-60 " +
                    (isSelected ? "border-[#B88A48] bg-[#F3E9D2]" : "border-[#DDD8CF] bg-white hover:border-[#B88A48]")}
                >
                  <span>
                    <span className="block text-[13px] font-bold text-[#0B0B0B]">{dateLabel(slot.date)}</span>
                    <span className="mt-1 block text-xs text-[#606064]">{slot.window}</span>
                  </span>
                  {slot.window === "Morning" ? <Sun className="h-4 w-4 shrink-0 text-[#B88A48]" /> :
                    <Clock3 className="h-4 w-4 shrink-0 text-[#B88A48]" />}
                </button>
              );
            })}
          </div>
          {slots.length > 6 && (
            <button type="button" className="mt-3 text-xs font-bold text-[#8F6A34] underline underline-offset-4"
              onClick={() => setShowAll((value) => !value)}>
              {showAll ? "Show fewer dates" : "See more available dates"}
            </button>
          )}
        </>
      )}

      {selected && !loading && !error && (
        <div className="mt-7 border-t border-[#DDD8CF] pt-6">
          <p className="flex items-center gap-2 text-sm font-bold text-[#0B0B0B]">
            <Check className="h-4 w-4 text-[#8F6A34]" />
            {dateLabel(selected.date)} · {selected.window} selected
          </p>
          <label className="mt-4 flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-[#3A3A3C]">
            <input type="checkbox" checked={standardConfirmed}
              onChange={(event) => setStandardConfirmed(event.target.checked)}
              className="mt-1 h-4 w-4 accent-[#C8A46A]" />
            <span>
              My job fits the No More to Pay installation conditions: up to 3m refrigerant pipework,
              up to 20m electrical cable and a dedicated circuit where required, an isolator and a
              standard wall bracket or suitable floor placement. Any non-standard extras are quoted first.
            </span>
          </label>
          <div className="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="How would you like to book?">
            <button type="button" role="radio" aria-checked={paymentChoice === "deposit"}
              onClick={() => setPaymentChoice("deposit")}
              className={"rounded-lg border p-4 text-left " +
                (paymentChoice === "deposit" ? "border-[#B88A48] bg-[#F3E9D2]" : "border-[#DDD8CF] bg-white")}>
              <span className="block text-sm font-bold">Book</span>
              <span className="mt-1 block text-xs text-[#55555A]">Continue to booking details and deposit payment.</span>
            </button>
            <button type="button" role="radio" aria-checked={paymentChoice === "instalments"}
              onClick={() => setPaymentChoice("instalments")}
              className={"rounded-lg border p-4 text-left " +
                (paymentChoice === "instalments" ? "border-[#B88A48] bg-[#F3E9D2]" : "border-[#DDD8CF] bg-white")}>
              <span className="block text-sm font-bold">Pay in instalments</span>
              <span className="mt-1 block text-xs text-[#55555A]">Review available Stripe and eligible PayPal options.</span>
            </button>
          </div>
          {standardConfirmed ? (
            <Link to={paymentChoice === "deposit" ? bookedHref : financeHref}
              className="mt-5 flex min-h-12 items-center justify-center bg-[#0B0B0B] px-6 py-3 text-center text-xs font-bold uppercase tracking-[0.1em] text-white">
              {paymentChoice === "deposit" ? "Continue to booking" : "See payment options"} →
            </Link>
          ) : (
            <p className="mt-4 text-xs font-semibold text-[#7B5A28]">
              Confirm the standard-install conditions above to continue.
            </p>
          )}
          <p className="mt-3 text-xs text-[#77777B]">
            Your time is only secured after the booking and payment are confirmed.
          </p>
        </div>
      )}
    </div>
  );
}
