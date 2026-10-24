import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Clock3, Loader2, Phone, Sun } from "lucide-react";
import { getBookingSlots } from "../lib/api";
import { PHONE_TEL } from "../lib/data";

// Brand -> system size -> live installation day/time -> payment options.
export default function InlineDealsBooking({ selectedUnit, offerRanges = [], onChooseUnit, onClearUnit }) {
  const productKey = selectedUnit?.productKey || "";
  const size = selectedUnit?.kw || "";
  const model = selectedUnit?.displayName || "";
  const price = selectedUnit?.price || "";
  const [activeBrand, setActiveBrand] = useState(productKey || "");
  const hasChosenUnit = Boolean(productKey && size && productKey === activeBrand);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedWindow, setSelectedWindow] = useState("");
  const [standardConfirmed, setStandardConfirmed] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    if (productKey) setActiveBrand(productKey);
  }, [productKey]);

  const chooseBrand = (range) => {
    if (activeBrand === range.slug) return;
    setActiveBrand(range.slug);
    setSelectedDate("");
    setSelectedWindow("");
    setStandardConfirmed(false);
    onClearUnit?.();
  };

  const chooseUnit = (range, row) => {
    setActiveBrand(range.slug);
    setSelectedDate("");
    setSelectedWindow("");
    setStandardConfirmed(false);
    onChooseUnit(range, row);
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
        setSelectedDate((current) => available.some((slot) => slot.date === current) ? current : "");
      } catch {
        if (active) setError("Live installation dates could not load. Please retry or call us.");
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
  const nextPage = "/deal-payment?" + new URLSearchParams({
    product: productKey, size, date: selectedDate, window: selectedWindow
  }).toString();
  const selectedRange = offerRanges.find((range) => range.slug === activeBrand);

  return (
    <div className="scroll-mt-24 rounded-2xl border border-[#DED4C3] bg-[#F7F5F1] px-4 py-7 shadow-sm sm:px-8 sm:py-9"
      data-testid="local-deal-inline-booking">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#8F6A34]">Book your local installed deal</p>
      <h3 className="mt-2 font-serif text-3xl text-[#0B0B0B] sm:text-4xl">Choose your system, then your installation date.</h3>
      <p className="mt-2 text-sm text-[#5E5E60]">Only one system and one appointment to choose. You select how to pay after that.</p>

      <h4 className="mt-7 font-serif text-2xl text-[#0B0B0B]">1 · Choose Rinnai or Daikin</h4>
      <div className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-2 md:overflow-visible md:pb-0" role="group" aria-label="Choose air conditioning brand">
        {offerRanges.map((range) => {
          const isActive = activeBrand === range.slug;
          return (
            <button type="button" key={range.slug} id={"range-" + range.slug}
              data-testid={"brand-card-" + range.slug}
              aria-pressed={isActive} onClick={() => chooseBrand(range)}
              className={"min-w-[85%] snap-center overflow-hidden rounded-2xl border-2 bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md md:min-w-0 " +
                (isActive ? "border-[#B88A48] ring-2 ring-[#EAD5B3]" : "border-[#DDD8CF] hover:border-[#B88A48]")}>
              <div className="flex items-center gap-4 p-4 sm:p-5">
                {range.image && <img src={range.image} alt="" loading="lazy" className="h-24 w-24 shrink-0 rounded-lg bg-[#F6F6F6] object-contain sm:h-32 sm:w-32" />}
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8F6A34]">{range.localBrand === "Rinnai" ? "7-year warranty" : "5-year warranty"}</span>
                  <strong className="mt-1 block font-serif text-2xl text-[#111] sm:text-3xl">{range.displayName}</strong>
                  <span className="mt-2 block text-sm font-semibold text-[#606064]">{range.prices.length} installed sizes available</span>
                  <span className="mt-3 inline-block rounded-full bg-[#F3E9D2] px-3 py-1.5 text-xs font-extrabold text-[#6F5026]">{isActive ? "Selected ✓" : "Choose " + range.localBrand + " →"}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedRange && <section className="mt-7" data-testid="local-deal-size-cards">
        <h4 className="font-serif text-2xl text-[#0B0B0B]">2 · Select your {selectedRange.localBrand} system size</h4>
        <p className="mt-2 text-sm text-[#666]">Each price includes supply and standard installation.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {selectedRange.prices.map((row) => {
            const chosen = hasChosenUnit && size === row.kw;
            return (
              <button key={row.kw} type="button" onClick={() => chooseUnit(selectedRange, row)}
                data-testid={"unit-card-" + selectedRange.slug + "-" + row.kw}
                aria-pressed={chosen}
                className={"min-h-32 rounded-xl border-2 bg-white p-3 text-left transition-colors sm:p-5 " +
                  (chosen ? "border-[#B88A48] bg-[#FFF8EA] ring-2 ring-[#EAD5B3]" : "border-[#DDD8CF] hover:border-[#B88A48]")}>
                <span className="block text-xl font-black text-[#0B0B0B] sm:text-2xl">{row.kw}</span>
                <strong className="mt-2 block text-xl text-[#8F6A34] sm:text-2xl">{row.localOfferPrice || row.price}</strong>
                <span className="mt-2 block text-[11px] font-bold uppercase tracking-wide text-[#666]">{chosen ? "Selected ✓" : "Select system →"}</span>
              </button>
            );
          })}
        </div>
      </section>}

      {hasChosenUnit && <section className="mt-8 border-t border-[#DDD8CF] pt-7" data-testid="deals-select-day">
        <p className="text-sm font-bold text-[#4C4C4C]">{model} {size} · <span className="text-[#8F6A34]">{price} installed</span></p>
        <h4 className="mt-3 font-serif text-2xl text-[#0B0B0B]">3 · Choose your installation day</h4>
        <p className="mt-2 text-sm text-[#55555A]">Pick an available day, then morning or afternoon.</p>
        {loading && <p className="mt-4 flex items-center gap-2 text-sm text-[#55555A]" role="status">
          <Loader2 className="h-4 w-4 animate-spin" /> Checking live dates…
        </p>}
        {error && <div className="mt-4 text-sm text-[#7B5A28]" role="alert">
          {error} <button type="button" className="font-bold underline" onClick={() => setRefreshCount((v) => v + 1)}>Retry dates</button>
        </div>}
        {!loading && !error && !availableDays.length && <p className="mt-4 text-sm">No online times are open right now. Please call us for a date.</p>}
        {!!availableDays.length && <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label="Available installation days">
          {(showAll ? availableDays : availableDays.slice(0, 6)).map((day) => (
            <button type="button" key={day} disabled={loading || !!error} aria-pressed={selectedDate === day}
              onClick={() => { setSelectedDate(day); setSelectedWindow(""); setStandardConfirmed(false); }}
              className={"min-h-14 rounded-lg border px-3 py-3 text-sm font-bold transition-colors disabled:opacity-50 " +
                (selectedDate === day ? "border-[#B88A48] bg-[#F3E9D2] text-[#0B0B0B]" : "border-[#DDD8CF] bg-white text-[#0B0B0B] hover:border-[#B88A48]")}>
              {formatDay(day)}
            </button>
          ))}
        </div>}
        {availableDays.length > 6 && <button type="button" className="mt-3 text-sm font-bold text-[#8F6A34] underline"
          onClick={() => setShowAll((v) => !v)}>{showAll ? "Show fewer dates" : "See more dates"}</button>}

        {selectedDate && <section className="mt-7 border-t border-[#DDD8CF] pt-6" data-testid="deals-select-time">
          <h4 className="font-serif text-2xl text-[#0B0B0B]">4 · Morning or afternoon?</h4>
          <p className="mt-2 text-sm font-semibold">{formatDay(selectedDate)}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {windowsForDay.map((slot) => (
              <button type="button" key={slot.window} aria-pressed={selectedWindow === slot.window}
                onClick={() => { setSelectedWindow(slot.window); setStandardConfirmed(false); }}
                disabled={loading || !!error}
                className={"flex min-h-[68px] items-center justify-center gap-3 rounded-lg border text-sm font-extrabold disabled:opacity-50 " +
                  (selectedWindow === slot.window ? "border-[#B88A48] bg-[#F3E9D2]" : "border-[#DDD8CF] bg-white hover:border-[#B88A48]")}>
                {slot.window === "Morning" ? <Sun className="h-5 w-5 text-[#8F6A34]" /> : <Clock3 className="h-5 w-5 text-[#8F6A34]" />}
                {slot.window}
              </button>
            ))}
          </div>
        </section>}

        {selectedValid && !loading && !error &&
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
              Continue to deposit, full payment or pay later →
            </Link> : <p className="mt-4 text-xs font-semibold text-[#7B5A28]">
              Confirm the standard-install conditions above to continue.
            </p>}
            <p className="mt-3 text-xs text-[#666]">Your date is only booked after successful payment.</p>
          </div>}
      </section>}

      <a href={PHONE_TEL} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#765627] underline">
        <Phone className="h-4 w-4" /> Need help choosing? Call SplitsPro
      </a>
    </div>
  );
}
