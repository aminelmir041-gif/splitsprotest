import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Clock3, Loader2, Sun } from "lucide-react";
import { getBookingSlots } from "../lib/api";

// The same live installation calendar powers BOTH deposits and Stripe pay-later.
// Choose the air conditioner, DAY, then Morning/Afternoon before any payment choice.
export default function InlineDealsBooking({ selectedUnit, offerRanges = [], onChooseUnit }) {
  const productKey = selectedUnit?.productKey || "";
  const size = selectedUnit?.kw || "";
  const model = selectedUnit?.displayName || "";
  const price = selectedUnit?.price || "";
  const hasChosenUnit = Boolean(productKey && size);
  const unitOptionValue = hasChosenUnit ? productKey + "|" + size : "";
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedWindow, setSelectedWindow] = useState("");
  const [standardConfirmed, setStandardConfirmed] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  const chooseUnitFromList = (value) => {
    const [slug, kw] = value.split("|");
    const range = offerRanges.find((item) => item.slug === slug);
    const row = range?.prices.find((item) => item.kw === kw);
    if (range && row) onChooseUnit(range, row);
  };

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getBookingSlots(12);
        if (!active) return;
        const available = (Array.isArray(data?.slots) ? data.slots : [])
          .filter((slot) => slot?.date && ["Morning", "Afternoon"].includes(slot.window));
        setSlots(available);
        if (selectedDate && !available.some((slot) => slot.date === selectedDate && slot.window === selectedWindow)) {
          setSelectedDate("");
          setSelectedWindow("");
        }
      } catch {
        if (active) setError("Live installation dates could not load. Please retry.");
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

  const formatDay = (value) => new Date(value + "T00:00:00")
    .toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
  const availableDays = [...new Set(slots.map((slot) => slot.date))];
  const windowsForDay = slots.filter((slot) => slot.date === selectedDate);
  const selectedValid = slots.some((slot) => slot.date === selectedDate && slot.window === selectedWindow);
  const params = new URLSearchParams({
    product: productKey, size, date: selectedDate, window: selectedWindow
  });
  const nextPage = "/deal-payment?" + params.toString();

  return (
    <div className="scroll-mt-24 border-t-2 border-[#C8A46A] bg-[#F7F5F1] px-4 py-7 sm:px-8 sm:py-9"
      data-testid="local-deal-inline-booking">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#8F6A34]">Book your local installed deal</p>
      <h3 className="mt-2 font-serif text-3xl text-[#0B0B0B] sm:text-4xl">Pick your system. Pick your day and time.</h3>

      <label htmlFor="deals-booking-unit" className="mt-6 block text-sm font-extrabold text-[#0B0B0B]">
        1 · Choose your air conditioner
      </label>
      <select id="deals-booking-unit" data-testid="local-deal-unit-select" value={unitOptionValue}
        onChange={(event) => chooseUnitFromList(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-lg border border-[#CBBEAD] bg-white px-4 py-3 text-sm font-semibold text-[#0B0B0B] outline-[#B88A48]">
        <option value="">Choose Rinnai or Daikin Cora and size</option>
        {offerRanges.flatMap((range) => range.prices.map((row) => (
          <option key={range.slug + "-" + row.kw} value={range.slug + "|" + row.kw}>
            {range.displayName} · {row.kw} · {row.localOfferPrice || row.price} installed
          </option>
        )))}
      </select>
      {hasChosenUnit ? (
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3 border-b border-[#DDD8CF] pb-5">
          <p className="text-sm font-bold text-[#0B0B0B]">{model} {size} supplied &amp; installed</p>
          <strong className="font-serif text-3xl text-[#0B0B0B]">{price}</strong>
        </div>
      ) : <p className="mt-2 text-xs text-[#55555A]">You can also select a system by pressing “Book installed” above.</p>}

      <h4 className="mt-8 font-serif text-2xl text-[#0B0B0B]">2 · Choose your installation day</h4>
      <p className="mt-2 text-sm text-[#55555A]">Select a day first. Then choose Morning or Afternoon. Only live available appointments are shown.</p>
      {loading && <p className="mt-4 flex items-center gap-2 text-sm text-[#55555A]" role="status">
        <Loader2 className="h-4 w-4 animate-spin" /> Checking available dates…
      </p>}
      {error && <div className="mt-4 text-sm text-[#7B5A28]" role="alert">
        {error} <button type="button" className="font-bold underline" onClick={() => setRefreshCount((v) => v + 1)}>Retry</button>
      </div>}
      {!loading && !error && !availableDays.length && <p className="mt-4 text-sm">No openings are available online right now. Please call SplitsPro.</p>}
      {!!availableDays.length && <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label="Available installation days">
        {(showAll ? availableDays : availableDays.slice(0, 6)).map((day) => (
          <button type="button" key={day} disabled={loading || !!error} aria-pressed={selectedDate === day}
            onClick={() => { setSelectedDate(day); setSelectedWindow(""); }}
            className={"min-h-14 rounded-lg border px-3 py-3 text-sm font-bold transition-colors disabled:opacity-50 " +
              (selectedDate === day ? "border-[#B88A48] bg-[#F3E9D2] text-[#0B0B0B]" : "border-[#DDD8CF] bg-white text-[#0B0B0B] hover:border-[#B88A48]")}>
            {formatDay(day)}
          </button>
        ))}
      </div>}
      {availableDays.length > 6 && <button type="button" className="mt-3 text-sm font-bold text-[#8F6A34] underline"
        onClick={() => setShowAll((v) => !v)}>{showAll ? "Show fewer dates" : "See more dates"}</button>}

      {selectedDate && <section className="mt-7 border-t border-[#DDD8CF] pt-6" data-testid="deals-select-time">
        <h4 className="font-serif text-2xl text-[#0B0B0B]">3 · Choose morning or afternoon</h4>
        <p className="mt-2 text-sm font-semibold">{formatDay(selectedDate)}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {windowsForDay.map((slot) => (
            <button type="button" key={slot.window} aria-pressed={selectedWindow === slot.window}
              onClick={() => setSelectedWindow(slot.window)}
              disabled={loading || !!error}
              className={"flex min-h-[68px] items-center justify-center gap-3 rounded-lg border text-sm font-extrabold disabled:opacity-50 " +
                (selectedWindow === slot.window ? "border-[#B88A48] bg-[#F3E9D2]" : "border-[#DDD8CF] bg-white hover:border-[#B88A48]")}>
              {slot.window === "Morning" ? <Sun className="h-5 w-5 text-[#8F6A34]" /> : <Clock3 className="h-5 w-5 text-[#8F6A34]" />}
              {slot.window}
            </button>
          ))}
        </div>
      </section>}

      {selectedValid && hasChosenUnit && !loading && !error &&
        <div className="mt-7 border-t border-[#DDD8CF] pt-6">
          <p className="flex items-center gap-2 text-sm font-bold"><Check className="h-4 w-4 text-[#8F6A34]" />
            {model} {size} · {formatDay(selectedDate)} · {selectedWindow}
          </p>
          <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[#3A3A3C]">
            <input type="checkbox" checked={standardConfirmed} onChange={(e) => setStandardConfirmed(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[#C8A46A]" />
            <span>My installation fits the standard package: up to 3 metres of pipe, standard mounting,
            isolator and up to 20 metres of electrical connection where required. I understand
            non-standard extras (roof, stairs, cavities or longer runs) need a separate quote.</span>
          </label>
          {standardConfirmed ? <Link to={nextPage} data-testid="deals-continue-to-payment"
            className="mt-5 flex min-h-14 w-full items-center justify-center rounded-md bg-[#0B0B0B] px-6 py-3 text-center text-sm font-bold uppercase text-white">
            Continue to payment options →
          </Link> : <p className="mt-4 text-xs font-semibold text-[#7B5A28]">
            Confirm the standard-install conditions above to continue.
          </p>}
          <p className="mt-3 text-xs text-[#666]">The date is not booked until payment is verified. On the next page, choose your deposit or Stripe payment option.</p>
        </div>}
    </div>
  );
}
