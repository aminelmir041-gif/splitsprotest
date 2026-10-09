import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Check, CreditCard, ShieldCheck } from "lucide-react";
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

            <div className="mt-5 overflow-hidden rounded-[3px] bg-[#E7E4DB] shadow-[0_10px_30px_rgba(25,30,36,0.08)]">
              <img
                src="/landing/splitspro-deposit-hero.webp"
                alt="SplitsPro installer with a booking calendar: your $300 deposit secures your installation date and comes off the final price."
                width="1122"
                height="1402"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/landing/overheated-bulldog-hero.webp";
                }}
                className="block h-auto w-full object-cover"
              />
            </div>

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

            <div className="py-7 sm:py-9">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#8F6A34]">
                Why the $300 deposit?
              </p>
              <h2 className="mt-3 font-serif text-[1.75rem] font-medium leading-[1.15] text-[#151515] sm:text-4xl">
                Because we start getting things ready before we knock on your door.
              </h2>
              <p className="mt-4 text-[15px] leading-[1.8] text-[#4C4C52]">
                Once you book, we put your installation time aside, organise your air conditioner,
                arrange the installer and get the materials ready. No double-booking your spot
                and no last-minute mucking around.
              </p>
              <p className="mt-5 border-l-[4px] border-[#D5AE52] bg-[#F0EBE1] px-4 py-4 text-[15px] font-semibold leading-[1.65] text-[#232529]">
                The $300 comes straight off your final installation price.
                <span className="block font-normal text-[#59595B]">
                  It's part of the price already shown above — not an extra fee.
                </span>
              </p>
              <p className="mt-5 text-[13px] leading-[1.8] text-[#66666A]">
                Your selected date is secured once your deposit payment is confirmed.
                You'll complete the payment through Stripe's secure checkout.
                If your installation needs non-standard work, we'll discuss any extra costs
                before proceeding.
              </p>
            </div>

            <div className="border-t border-[#DDD8CF] py-7">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#C8A46A]">
                Your booking details
              </p>
              <h2 className="mt-2 font-serif text-2xl font-medium text-[#0B0B0B] sm:text-3xl">
                The last bit, then we&apos;ll lock it in.
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-[#606064]">
                Tell us where the air con is going. Next, you’ll pay the $300 deposit securely through Stripe.
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
