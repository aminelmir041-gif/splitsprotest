import { Link } from "react-router-dom";

/**
 * Shared reminder on SplitsPro selection, booking and payment pages.
 * Do not advertise payment approval or a provider that is disconnected.
 * Stripe handles Afterpay / Klarna / Zip; PayPal Pay in 4 is separate.
 */
export default function PayLaterReminder({
  kind = "equipment",
  theme = "light",
  stripeReady,
  paypalReady,
  equipmentHref,
  compact = false,
}) {
  const dark = theme === "dark";
  const stripe = stripeReady !== false;
  const paypal = paypalReady !== false;
  const bodyColor = dark ? "text-white/80" : "text-[#395368]";
  const headingColor = dark ? "text-[#F4C620]" : "text-[#067FA5]";

  return (
    <aside
      data-testid="splitspro-pay-later-reminder"
      className={
        "border-l-[4px] border-[#F4C620] py-4 pl-5 pr-2 " +
        (dark ? "text-white" : "text-[#0B2641]")
      }
      aria-label="Pay later options and eligibility"
    >
      <p className={"text-sm font-black uppercase tracking-[0.08em] sm:text-base " + headingColor}>
        WANT TO SPREAD THE PAYMENTS?
      </p>
      {kind === "cleaning" && compact ? (
        <p className={"mt-2 text-sm font-semibold leading-relaxed " + bodyColor}>
          <strong>PayPal Pay in 4</strong> may be offered to eligible customers{paypalReady === false ? " when PayPal becomes available" : ""}.
          {" "}<strong>Afterpay, Klarna and Zip</strong> may appear through Stripe{stripeReady === false ? " once Stripe checkout is connected" : " where enabled and eligible"}.
          <span className="mt-1 block text-xs font-normal">SplitsPro receives the full service amount upfront. Approved instalments are repaid to the payment provider under its terms.</span>
        </p>
      ) : kind === "cleaning" ? (
        <>
          <p className={"mt-2 text-sm font-medium leading-relaxed " + bodyColor}>
            {paypal && <><strong>PayPal Pay in 4</strong> may be offered to eligible customers through PayPal. </>}
            {stripe
              ? <>Through Stripe, eligible checkouts may offer <strong>Afterpay, Klarna or Zip</strong>. </>
              : <>Afterpay, Klarna and Zip require Stripe checkout, which is not currently connected for cleaning. </>}
            You choose the provider at checkout; the full cleaning price is paid to SplitsPro upfront, while an approved pay-later plan is repaid to your provider.
          </p>
          <p className={"mt-2 text-xs leading-relaxed " + bodyColor}>
            Options depend on provider availability, spending limits and approval. Fees, interest and repayment terms vary; review the provider's terms before paying.
          </p>
        </>
      ) : kind === "equipment" && compact ? (
        <p className={"mt-2 text-sm font-semibold leading-relaxed " + bodyColor}>
          Eligible equipment purchases may offer <strong>Afterpay, Klarna or Zip through Stripe</strong>, or
          {" "}<strong>PayPal Pay in 4</strong> for qualifying smaller units.
          <span className="mt-1 block text-xs font-normal">Availability, spending limits and approval are confirmed at the provider checkout. Installation is separately charged where applicable.</span>
        </p>
      ) : kind === "deposit" ? (
        <>
          <p className={"mt-2 text-sm font-medium leading-relaxed " + bodyColor}>
            Eligible aircon equipment purchases may offer <strong>Afterpay, Klarna or Zip through Stripe</strong>, or <strong>PayPal Pay in 4</strong> separately for qualifying smaller units. These are equipment payment options — <strong>your 10% installation booking deposit is a separate payment</strong>.
          </p>
          <p className={"mt-2 text-xs leading-relaxed " + bodyColor}>
            Options aren't guaranteed. Provider approval, unit price limits and terms apply; installation is not automatically financed.
          </p>
          {equipmentHref && (
            <Link to={equipmentHref} className={"mt-3 inline-block text-sm font-black underline underline-offset-4 " + (dark ? "text-[#F4C620]" : "text-[#057C9D]")}>
              Check equipment payment options ↗
            </Link>
          )}
        </>
      ) : (
        <>
          <p className={"mt-2 text-sm font-medium leading-relaxed " + bodyColor}>
            Depending on the unit and your eligibility, <strong>Afterpay, Klarna and Zip</strong> may be available through Stripe, with <strong>PayPal Pay in 4</strong> as a separate option for qualifying smaller aircon purchases.
          </p>
          <p className={"mt-2 text-xs leading-relaxed " + bodyColor}>
            Availability, purchase limits and approval vary. Equipment and installation may be separate purchases; any instalment plan applies only to what the provider approves and charges at checkout.
          </p>
          {equipmentHref && (
            <Link to={equipmentHref} className={"mt-3 inline-block text-sm font-black underline underline-offset-4 " + (dark ? "text-[#F4C620]" : "text-[#057C9D]")}>
              Explore available payment methods ↗
            </Link>
          )}
        </>
      )}
    </aside>
  );
}
