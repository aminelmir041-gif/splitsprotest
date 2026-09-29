import { useMemo, useState } from "react";

// Dynamic booking page for installed split-system offers.
// Booking slot selector: customer chooses a preferred date and daypart.
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Check, ShieldCheck, Zap, CalendarDays, Sun, Clock3 } from "lucide-react";
import QuoteForm from "../components/QuoteForm";

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

  const today = useMemo(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 10);
  }, []);

  const productKey = params.get("product") || "";
  const size = params.get("size") || "";
  const pack = PACKAGES[productKey];
  const price = pack?.prices?.[size];

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
                  <span className="flex items-start gap-3"><Zap className="mt-0.5 h-4 w-4 shrink-0 text-[#E4CFA6]" /> Installations within 2 days</span>
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
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#C8A46A]">Choose your preferred time</p>
                    <h3 className="mt-2 font-serif text-2xl font-medium text-[#0B0B0B]">Pick a date, then morning or afternoon.</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#606064]">This is your preferred installation slot. We&apos;ll confirm the exact arrival window with you.</p>

                    <div className="mt-5">
                      <label htmlFor="install-date" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#6E6E73]">Preferred date</label>
                      <div className="relative">
                        <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C8A46A]" />
                        <input
                          id="install-date"
                          type="date"
                          min={today}
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="h-12 w-full rounded-xl border border-[#DDD8CF] bg-white pl-11 pr-4 text-sm text-[#1D1D1F] outline-none transition-colors focus:border-[#C8A46A]"
                        />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setTimeWindow("Morning")}
                        className={`flex min-h-[74px] items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition-all ${timeWindow === "Morning" ? "border-[#C8A46A] bg-[#F3E9D2] text-[#6D5125] shadow-sm" : "border-[#DDD8CF] bg-white text-[#303034] hover:border-[#C8A46A]"}`}
                        aria-pressed={timeWindow === "Morning"}
                      >
                        <Sun className="h-5 w-5" /> Morning
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimeWindow("Afternoon")}
                        className={`flex min-h-[74px] items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition-all ${timeWindow === "Afternoon" ? "border-[#C8A46A] bg-[#F3E9D2] text-[#6D5125] shadow-sm" : "border-[#DDD8CF] bg-white text-[#303034] hover:border-[#C8A46A]"}`}
                        aria-pressed={timeWindow === "Afternoon"}
                      >
                        <Clock3 className="h-5 w-5" /> Afternoon
                      </button>
                    </div>

                    {preferredDate && timeWindow ? (
                      <div className="mt-7 border-t border-[#E8E4DD] pt-7">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#C8A46A]">Your details</p>
                        <p className="mt-2 text-sm leading-relaxed text-[#606064]">We&apos;ll call to confirm your {timeWindow.toLowerCase()} installation slot and final site details.</p>
                        <div className="mt-5">
                          <QuoteForm
                            defaultService="Split System Installation"
                            defaultMessage={selectionMessage}
                            defaultPreferredDate={preferredDate}
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
                        Choose a date and either morning or afternoon to continue.
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
