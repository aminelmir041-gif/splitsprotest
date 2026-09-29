import { useEffect, useMemo, useState } from "react";

// Dynamic booking page for installed split-system offers.
// Booking slot selector: customer chooses a preferred date and daypart.
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Check, ShieldCheck, Zap, CalendarDays, Sun, Clock3, Loader2 } from "lucide-react";
import QuoteForm from "../components/QuoteForm";
import { getBookingSlots } from "../lib/api";

const PACKAGES = {
  "rinnai-local": {
    brand: "Rinnai",
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
    brand: "Daikin",
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
      setSlots(Array.isArray(data?.slots) ? data.slots : []);
    } catch (err) {
      setSlots([]);
      setSlotsError("We couldn’t load live installation times. Please try again.");
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

  return (
    <>
      <Helmet>
        <title>{`Book ${pack.model} ${size} Installation | SplitsPro`}</title>
        <meta
          name="description"
          content={`Book your ${pack.model} ${size} supplied and installed with SplitsPro.`}
        />
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      <section className="bg-[#F7F5F1] pb-16 pt-10 sm:pb-24 sm:pt-14">
        <div className="sp-container">
          <div className="mx-auto max-w-5xl">
            <Link
              to="/split-systems/rinnai-local-offer#installed-prices"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#8F6A34]"
            >
              <ArrowLeft className="h-4 w-4" /> Change system
            </Link>

            <div className="mt-6 grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="rounded-[28px] bg-[#0B0B0B] p-6 text-white shadow-[0_20px_60px_rgba(11,11,11,0.14)] sm:p-8">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#E4CFA6]">Your selected installation</p>
                <h1 className="mt-3 font-serif text-4xl font-medium leading-[1.02] tracking-tight sm:text-5xl">
                  {pack.model} {size}
                </h1>
                <p className="mt-5 font-serif text-5xl text-[#E4CFA6]">{price}</p>
                <p className="mt-2 text-sm font-semibold text-white/70">Supplied &amp; installed</p>

                <div className="mt-7 grid gap-3 border-t border-white/10 pt-6 text-sm">
                  <span className="flex items-start gap-3"><Zap className="mt-0.5 h-4 w-4 shrink-0 text-[#E4CFA6]" /> {slotsLoading ? "Checking live installation times" : hasTwoDaySlot ? "2-day installation slots available" : "Next available time shown live"}</span>
                  <span className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#E4CFA6]" /> {pack.warranty}</span>
                  <span className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#E4CFA6]" /> SplitsPro installation guarantee</span>
                </div>
              </div>

              <div className="rounded-[28px] bg-white p-6 shadow-[0_18px_55px_rgba(11,11,11,0.07)] sm:p-8">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#C8A46A]">Confirm your standard install</p>
                <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-[#0B0B0B] sm:text-4xl">
                  Quick check before we lock in the 2-day installation.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#606064]">
                  The advertised installed price covers the standard job below. If something outside this is genuinely required, we tell you before the extra work starts.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    "Up to 3m refrigeration pipework",
                    "Up to 20m power circuit if required",
                    "Isolation switch included",
                    "Standard wall bracket or suitable floor position",
                    "Labour + commissioning included",
                    "Reasonable standard access",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5 border-b border-[#EEEAE3] pb-3 text-sm font-semibold text-[#303034]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#C8A46A]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#E5E0D7] bg-[#FBFAF8] p-4">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-[#C8A46A]"
                  />
                  <span className="text-sm leading-relaxed text-[#444449]">
                    I believe my installation fits these standard conditions. If it doesn&apos;t, SplitsPro will confirm any change before extra work proceeds.
                  </span>
                </label>

                {!confirmed ? (
                  <div className="mt-6 rounded-2xl bg-[#F3E9D2] p-4 text-sm leading-relaxed text-[#6D5125]">
                    Tick the box above to continue with your booking.
                  </div>
                ) : (
                  <div className="mt-7 border-t border-[#E8E4DD] pt-7">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#C8A46A]">Live installation availability</p>
                    <h3 className="mt-2 font-serif text-2xl font-medium text-[#0B0B0B]">Choose one of the times that&apos;s actually available.</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#606064]">
                      Full times disappear automatically, so you don&apos;t have to keep trying different dates.
                    </p>

                    {slotsLoading ? (
                      <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#FBFAF8] p-5 text-sm text-[#606064]">
                        <Loader2 className="h-5 w-5 animate-spin text-[#C8A46A]" /> Checking the next available installation times…
                      </div>
                    ) : slotsError ? (
                      <div className="mt-5 rounded-2xl bg-[#FFF3D6] p-5 text-sm leading-relaxed text-[#6D5125]">
                        {slotsError}
                        <button type="button" onClick={() => loadSlots()} className="ml-2 font-bold underline">Try again</button>
                      </div>
                    ) : slots.length === 0 ? (
                      <div className="mt-5 rounded-2xl bg-[#FFF3D6] p-5 text-sm leading-relaxed text-[#6D5125]">
                        Our online installation times are currently full. Call us and we&apos;ll check the next opening for you.
                      </div>
                    ) : (
                      <>
                        {!hasTwoDaySlot && (
                          <div className="mt-5 rounded-2xl bg-[#FFF3D6] p-4 text-sm font-semibold leading-relaxed text-[#6D5125]">
                            The next 2-day slots are full. These are the next available times.
                          </div>
                        )}
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
                                className={`flex min-h-[84px] items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition-all ${active ? "border-[#C8A46A] bg-[#F3E9D2] shadow-sm" : "border-[#DDD8CF] bg-white hover:border-[#C8A46A]"}`}
                                aria-pressed={active}
                              >
                                <span>
                                  <span className={`block text-sm font-extrabold ${active ? "text-[#6D5125]" : "text-[#202024]"}`}>{formatSlotDate(slot.date)}</span>
                                  <span className="mt-1 block text-xs text-[#6E6E73]">{slot.window}</span>
                                </span>
                                {slot.window === "Morning"
                                  ? <Sun className="h-5 w-5 shrink-0 text-[#C8A46A]" />
                                  : <Clock3 className="h-5 w-5 shrink-0 text-[#C8A46A]" />}
                              </button>
                            );
                          })}
                        </div>
                        {slots.length > 4 && (
                          <button
                            type="button"
                            onClick={() => setShowMoreSlots((value) => !value)}
                            className="mt-4 text-sm font-bold text-[#8F6A34] underline decoration-[#C8A46A]/50 underline-offset-4"
                          >
                            {showMoreSlots ? "Show fewer times" : "See more available times"}
                          </button>
                        )}
                      </>
                    )}

                    {preferredDate && timeWindow ? (
                      <div className="mt-7 border-t border-[#E8E4DD] pt-7">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#C8A46A]">Your details</p>
                        <p className="mt-2 text-sm leading-relaxed text-[#606064]">We&apos;ll call to confirm your {timeWindow.toLowerCase()} installation slot and final site details.</p>
                        <div className="mt-5">
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
                            tight
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5 rounded-2xl bg-[#FBFAF8] p-4 text-sm leading-relaxed text-[#606064]">
                        Choose one of the available times above to continue.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mx-auto mt-7 max-w-3xl text-center">
              <p className="text-xs leading-relaxed text-[#77777B]">
                No surprise extras on the day. Non-standard requirements such as switchboard upgrades, pipe runs over 3m, difficult access or asbestos-related work are confirmed before proceeding.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
