import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, CalendarDays, Check, CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";
import QuoteForm from "../components/QuoteForm";

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

const formatSlotDate = (value) => {
  const slotDate = new Date(`${value}T00:00:00`);
  return slotDate.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

export default function InstallationDepositCheckout() {
  const [params] = useSearchParams();
  const productKey = params.get("product") || "";
  const size = params.get("size") || "";
  const bookingDate = params.get("date") || "";
  const bookingWindow = params.get("window") || "";
  const pack = PACKAGES[productKey];
  const price = pack?.prices?.[size];

  if (!pack || !price || !bookingDate || !bookingWindow) {
    return <Navigate to="/split-systems/rinnai-local-offer#installed-prices" replace />;
  }

  const backUrl = `/book-installation?product=${encodeURIComponent(productKey)}&size=${encodeURIComponent(size)}`;
  const selectionMessage = `I'd like to book the ${pack.model} ${size} — ${price} supplied & installed. Preferred installation: ${bookingDate} — ${bookingWindow}. I understand the advertised price applies to the standard installation conditions shown on the booking page.`;

  const handleBookingConflict = () => {
    window.location.assign(backUrl);
  };

  return (
    <>
      <Helmet>
        <title>Secure Your Installation | SplitsPro</title>
        <meta
          name="description"
          content={`Secure your ${pack.model} ${size} installation time with SplitsPro.`}
        />
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      <section className="booking-page-section bg-[#F7F5F1] pb-10 pt-3 sm:pb-16 sm:pt-6">
        <div className="sp-container">
          <div className="mx-auto max-w-2xl">
            <Link
              to={backUrl}
              className="inline-flex items-center gap-2 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8F6A34]"
            >
              <ArrowLeft className="h-4 w-4" /> Back to installation times
            </Link>

            <div className="mt-2 border-y border-[#DDD8CF] py-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#8F6A34]">
                Your selected installation
              </p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="font-serif text-[2rem] font-medium leading-none tracking-tight text-[#0B0B0B] sm:text-4xl">
                    {pack.model} {size}
                  </h1>
                  <p className="mt-2 text-xs font-semibold text-[#6E6E73]">
                    {formatSlotDate(bookingDate)} · {bookingWindow}
                  </p>
                </div>
                <p className="shrink-0 font-serif text-[2.2rem] leading-none text-[#8F6A34] sm:text-4xl">
                  {price}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold text-[#55555A]">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#C8A46A]" /> {pack.warranty}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#C8A46A]" /> Installation guarantee
                </span>
              </div>
            </div>

            <div className="py-7">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#C8A46A]">
                Why we take a deposit
              </p>
              <h2 className="mt-2 font-serif text-3xl font-medium leading-tight text-[#0B0B0B] sm:text-4xl">
                Your installation time is yours — not just a maybe.
              </h2>
              <p className="mt-4 text-[14px] leading-relaxed text-[#55555A]">
                Once you choose a time, we stop offering it to someone else and start organising the unit,
                installer and materials for your job. The $300 deposit simply secures that commitment both ways.
              </p>

              <div className="mt-5 grid gap-0 border-y border-[#DDD8CF]">
                <div className="flex items-start gap-3 border-b border-[#E7E2D9] py-4">
                  <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A46A]" />
                  <div>
                    <p className="text-[13px] font-bold text-[#202024]">It locks in your chosen installation time.</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-[#606064]">
                      Your time is held while you complete the secure payment checkout.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 border-b border-[#E7E2D9] py-4">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A46A]" />
                  <div>
                    <p className="text-[13px] font-bold text-[#202024]">It comes straight off your final price.</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-[#606064]">
                      The $300 is part of your installation total — it is not an extra fee.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 py-4">
                  <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A46A]" />
                  <div>
                    <p className="text-[13px] font-bold text-[#202024]">Your payment is handled securely by Stripe.</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-[#606064]">
                      We do not ask you to send card details by message or over the phone.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[12px] leading-relaxed text-[#6E6E73]">
                If your installation needs anything outside the standard conditions, we tell you before that extra work starts.
              </p>
            </div>

            <div className="border-t border-[#DDD8CF] py-7">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#C8A46A]">
                Your booking details
              </p>
              <h2 className="mt-2 font-serif text-2xl font-medium text-[#0B0B0B] sm:text-3xl">
                Tell us where we&apos;re installing it.
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-[#606064]">
                Add your details below. On the next screen, Stripe will securely process the deposit.
              </p>

              <div className="mt-5">
                <QuoteForm
                  defaultService="Split System Installation"
                  defaultMessage={selectionMessage}
                  defaultPreferredDate={bookingDate}
                  bookingDate={bookingDate}
                  bookingWindow={bookingWindow}
                  onBookingConflict={handleBookingConflict}
                  successTitle="Installation booked"
                  successMessage={`We’ve saved ${formatSlotDate(bookingDate)} — ${bookingWindow}. We’ll contact you to confirm the exact arrival window.`}
                  submitLabel="Secure My Installation"
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

              <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#77777B]">
                <CreditCard className="h-3.5 w-3.5 text-[#C8A46A]" />
                Secure Stripe payment
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
