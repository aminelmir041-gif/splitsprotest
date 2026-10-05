import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Check, ShieldCheck, Zap, Sun, Clock3, Loader2 } from "lucide-react";
import QuoteForm from "../components/QuoteForm";
import { getBookingSlots } from "../lib/api";

// Compact live booking checkout.\n\nconst BLOCKED_INSTALLATION_DATES = new Set(["2026-10-06", "2026-10-09"]);

const PACKAGES = {
  "rinnai-local": {
    model: "Rinnai Split System",
    warranty: "7-year manufacturer warranty",
    prices: {
      "2.5kW": "$1,450",
      "3.5kW": "$1,550",
      "5.0kW": "$1,900",
      "7.0kW": "$2,300",
    },
  },
  "daikin-lite-local": {
    model: "Daikin Cora",
    warranty: "5-year manufacturer warranty",
    prices: {
      "2.5kW": "$1,550",
      "3.5kW": "$1,750",
      "5.0kW": "$2,150",
      "7.0kW": "$2,600",
    },
  },
};

export default function InstallationBooking() {
  const [params] = useSearchParams();
  const [confirmed, setConfirmed] = useState(false);
  const [preferredDate, setPreferredDate] = useState("");
  const [timeWindow, setTimeWindow] = useState("");
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotsError, setSlotsError] = useState("");
  const [showMoreSlots, setShowMoreSlots] = useState(false);

  const productKey = params.get("product") || "";
  const size = params.get("size") || "";
  const pack = PACKAGES[productKey];
  const price = pack?.prices?.[size];

  const loadSlots = async (fallbackSlots = null) => {
    setSlotsLoading(true);
    setSlotsError("");
    try {
      const data = fallbackSlots ? { slots: fallbackSlots } : await getBookingSlots(12);
      setSlots(Array.isArray(data?.slots) ? data.slots.filter((slot) => !BLOCKED_INSTALLATION_DATES.has(slot.date)) : []);
    } catch (err) {
      setSlots([]);
      setSlotsError("Live times are taking a moment to load.");
    } finally {
      setSlotsLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const handleBookingConflict = (detail) => {
    setPreferredDate("");
    setTimeWindow("");
    setShowMoreSlots(false);
    const alternatives = Array.isArray(detail?.slots) ? detail.slots : null;
    loadSlots(alternatives);
  };

  const formatSlotDate = (value) => {
    const slotDate = new Date(`${value}T00:00:00`);
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    if (
      slotDate.getFullYear() === tomorrow.getFullYear()
      && slotDate.getMonth() === tomorrow.getMonth()
      && slotDate.getDate() === tomorrow.getDate()
    ) return "Tomorrow";
    return slotDate.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
  };

  const visibleSlots = showMoreSlots ? slots : slots.slice(0, 4);
  const hasTwoDaySlot = slots.some((slot) => slot.within_two_days);

  const selectionMessage = useMemo(() => {
    if (!pack || !price) return "";
    const slot = preferredDate && timeWindow
      ? ` Preferred installation: ${preferredDate} — ${timeWindow}.`
      : "";
    return `I'd like to book the ${pack.model} ${size} — ${price} supplied & installed.${slot} I understand the advertised price applies to the standard installation conditions shown on the booking page.`;
  }, [pack, price, size, preferredDate, timeWindow]);

  if (!pack || !price) {
    return <Navigate to="/split-systems/rinnai-local-offer#installed-prices" replace />;
  }

  const standardItems = [
    "Up to 3m refrigeration pipework",
    "Up to 20m power circuit if required",
    "Isolation switch included",
    "Standard wall bracket or suitable floor position",
  ];

  return (
    <>
      <Helmet>
        <title>{`Book ${pack.model} ${size} Installation | SplitsPro`}</title>
        <meta name="description" content={`Book your ${pack.model} ${size} supplied and installed with SplitsPro.`} />
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      <section className="booking-page-section bg-[#F7F5F1] pb-10 pt-3 sm:pb-16 sm:pt-6">
        <div className="sp-container">
          <div className="mx-auto max-w-2xl">
            <Link
              to="/split-systems/rinnai-local-offer#installed-prices"
              className="inline-flex items-center gap-2 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8F6A34]"
            >
              <ArrowLeft className="h-4 w-4" /> Change system
            </Link>

            <div className="mt-2 border-y border-[#DDD8CF] py-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#8F6A34]">Your selected installation</p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="font-serif text-[2rem] font-medium leading-none tracking-tight text-[#0B0B0B] sm:text-4xl">
                    {pack.model} {size}
                  </h1>
                  <p className="mt-2 text-xs font-semibold text-[#6E6E73]">Supplied &amp; installed</p>
                </div>
                <p className="shrink-0 font-serif text-[2.2rem] leading-none text-[#8F6A34] sm:text-4xl">{price}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold text-[#55555A]">
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-[#C8A46A]" />
                  {slotsLoading ? "Checking live times" : hasTwoDaySlot ? "2-day slots available" : "Next available time shown live"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#C8A46A]" /> {pack.warranty}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#C8A46A]" /> Installation guarantee
                </span>
              </div>
            </div>

            <div className="py-6">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#C8A46A]">1 · Quick standard-install check</p>
              <h2 className="mt-2 font-serif text-2xl font-medium leading-tight text-[#0B0B0B] sm:text-3xl">
                Make sure your job fits the advertised price.
              </h2>

              <div className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {standardItems.map((item) => (
                  <div key={item} className="flex items-start gap-2 border-b border-[#E7E2D9] py-2.5 text-[13px] font-semibold text-[#38383C]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#C8A46A]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <label className="mt-4 flex cursor-pointer items-start gap-3 border-y border-[#DDD8CF] py-4">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#C8A46A]"
                />
                <span className="text-[13px] leading-relaxed text-[#444449]">
                  My installation fits these standard conditions. If anything extra is genuinely needed, SplitsPro will tell me before the extra work starts.
                </span>
              </label>
            </div>

            {confirmed && (
              <div className="border-t border-[#DDD8CF] py-6">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#C8A46A]">2 · Choose an available time</p>
                <h2 className="mt-2 font-serif text-2xl font-medium leading-tight text-[#0B0B0B] sm:text-3xl">
                  Pick a time that&apos;s actually free.
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-[#606064]">Full times disappear automatically.</p>

                {slotsLoading ? (
                  <div className="mt-4 flex items-center gap-2 py-3 text-sm text-[#606064]">
                    <Loader2 className="h-4 w-4 animate-spin text-[#C8A46A]" /> Checking the next available times…
                  </div>
                ) : slotsError ? (
                  <div className="mt-4 flex items-center justify-between gap-3 border-y border-[#E2DDD3] py-3 text-[13px] text-[#6D5125]">
                    <span>{slotsError}</span>
                    <button type="button" onClick={() => loadSlots()} className="shrink-0 font-bold underline underline-offset-4">Try again</button>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="mt-4 border-y border-[#E2DDD3] py-4 text-[13px] leading-relaxed text-[#6D5125]">
                    Online times are full right now. Call us and we&apos;ll check the next opening.
                  </div>
                ) : (
                  <>
                    {!hasTwoDaySlot && (
                      <p className="mt-4 text-[13px] font-semibold text-[#6D5125]">
                        The next 2 days are full — these are the next available times.
                      </p>
                    )}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {visibleSlots.map((slot) => {
                        const active = preferredDate === slot.date && timeWindow === slot.window;
                        return (
                          <button
                            key={`${slot.date}-${slot.window}`}
                            type="button"
                            onClick={() => {
                              setPreferredDate(slot.date);
                              setTimeWindow(slot.window);
                            }}
                            className={`flex min-h-[62px] items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left transition-all ${active ? "border-[#C8A46A] bg-[#F3E9D2]" : "border-[#DDD8CF] bg-white hover:border-[#C8A46A]"}`}
                            aria-pressed={active}
                          >
                            <span>
                              <span className={`block text-[13px] font-extrabold ${active ? "text-[#6D5125]" : "text-[#202024]"}`}>{formatSlotDate(slot.date)}</span>
                              <span className="mt-0.5 block text-[11px] text-[#6E6E73]">{slot.window}</span>
                            </span>
                            {slot.window === "Morning"
                              ? <Sun className="h-4 w-4 shrink-0 text-[#C8A46A]" />
                              : <Clock3 className="h-4 w-4 shrink-0 text-[#C8A46A]" />}
                          </button>
                        );
                      })}
                    </div>
                    {slots.length > 4 && (
                      <button
                        type="button"
                        onClick={() => setShowMoreSlots((value) => !value)}
                        className="mt-3 text-[12px] font-bold text-[#8F6A34] underline decoration-[#C8A46A]/50 underline-offset-4"
                      >
                        {showMoreSlots ? "Show fewer times" : "See more available times"}
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {confirmed && preferredDate && timeWindow && (
              <div className="border-t border-[#DDD8CF] py-6">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#C8A46A]">3 · Your details</p>
                <h2 className="mt-2 font-serif text-2xl font-medium text-[#0B0B0B]">Finish your booking.</h2>
                <p className="mt-2 text-[13px] text-[#606064]">{formatSlotDate(preferredDate)} · {timeWindow}</p>

                <div className="mt-4">
                  <QuoteForm
                    defaultService="Split System Installation"
                    defaultMessage={selectionMessage}
                    defaultPreferredDate={preferredDate}
                    bookingDate={preferredDate}
                    bookingWindow={timeWindow}
                    onBookingConflict={handleBookingConflict}
                    successTitle="Installation booked"
                    successMessage={`We’ve saved ${formatSlotDate(preferredDate)} — ${timeWindow}. We’ll contact you to confirm the exact arrival window.`}
                    submitLabel="Book This Installation"
                    compact
                    hideMessage
                    hidePhoto
                    hidePreferredDate
                    hideEmail
                    requireAddress
                    hideCallButton
                    tight
                  />
                </div>
              </div>
            )}

            <p className="border-t border-[#DDD8CF] py-5 text-center text-[10px] leading-relaxed text-[#77777B]">
              Non-standard requirements such as switchboard upgrades, pipe runs over 3m, difficult access or asbestos-related work are confirmed before proceeding.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
