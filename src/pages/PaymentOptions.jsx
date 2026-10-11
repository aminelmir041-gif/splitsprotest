import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import QuoteForm from "../components/QuoteForm";
import { PHONE, PHONE_TEL } from "../lib/data";

export default function PaymentOptions() {
  const [params] = useSearchParams();
  const needsHelp = params.get("help") === "declined";
  const [paymentOption, setPaymentOption] = useState("paypal");
  const fullPurchase = params.get("mode") === "full";
  const product = params.get("product");
  const size = params.get("size");
  const selectedDate = params.get("date");
  const selectedWindow = params.get("window");
  const packages = { "rinnai-local": { label: "Rinnai", prices: { "2.5kW": "$1,600", "3.5kW": "$1,700", "5.0kW": "$2,300", "7.0kW": "$2,600" } }, "daikin-lite-local": { label: "Daikin Cora", prices: { "2.5kW": "$1,850", "3.5kW": "$2,100", "5.0kW": "$2,500", "7.0kW": "$3,000" } } };
  const chosen = packages[product];
  const chosenPrice = chosen?.prices[size];
  const selectionLabel = chosen && chosenPrice ? `${chosen.label} ${size} — ${chosenPrice} installed` : "";
  const datePassed = selectedDate ? selectedDate < new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Sydney" }) : false;
  const selection = fullPurchase
    ? ` Customer selected ${params.get("product") || "air conditioner"} ${params.get("size") || ""}, installation date ${params.get("date") || "not specified"}, ${params.get("window") || ""}. They want instalments on the full price, not just the deposit.`
    : "";
  const message = needsHelp
    ? "Instalment-payment help requested: the customer could not complete an instalment checkout. Please call them to discuss eligible alternatives, including a smaller provider transaction plus separate balance if permitted."
    : "I'd like to talk about flexible payments for an air conditioner installation. Please call me to discuss instalments and a possible combination of payment methods." + selection;
  return (
    <>
      <Helmet><title>Aircon Instalment Payments & Help | SplitsPro</title>
        <meta name="description" content="Explore instalments, deposits and tailored payment arrangements for SplitsPro air conditioning installation. If checkout didn't work, ask our team to call." />
      </Helmet>
      <section className="bg-[#10151C] px-5 pb-14 pt-36 text-white sm:pt-44" data-testid="payment-options-hero">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#D9B573]">SplitsPro flexible payments</p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[1.08] sm:text-7xl">{needsHelp ? "Pay in 4 didn't work? There's still something we can try." : "Get the air con sorted. Talk to us about how you pay."}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">Book with a deposit, pay by card, or explore instalment options. If the provider can't approve the amount, our team can discuss another way to split the payments.</p>
          {fullPurchase && (
            <div className="mt-7 max-w-2xl border border-white/25 bg-white/10 p-5" data-testid="selected-instalment-deal">
              <p className="text-xs font-bold uppercase tracking-widest text-[#D9B573]">Your selected installation</p>
              <p className="mt-2 text-2xl font-semibold">{selectionLabel || "Air conditioning installation"}</p>
              <p className="mt-2 text-sm text-white/85">{selectedDate || "Date not selected"}{selectedWindow ? ` · ${selectedWindow}` : ""}</p>
              {datePassed && <p className="mt-3 text-sm font-bold text-[#FFD68B]">This date has passed. You'll need to choose a new installation date before booking.</p>}
              <p className="mt-3 text-xs text-white/70">Your date is not reserved until payment and booking are confirmed.</p>
            </div>
          )}
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={fullPurchase ? "#instalment-checkout" : "#payment-help"} className="bg-[#D9B573] px-6 py-3 text-sm font-extrabold text-[#10151C]">{fullPurchase ? "See payment options" : "Ask us to call you"}</a>
            <a href={PHONE_TEL} className="border border-white/70 px-6 py-3 text-sm font-extrabold text-white">Call {PHONE}</a>
          </div>
          <p className="mt-4 text-xs text-white/60">All financing is subject to provider approval, transaction rules and eligibility. Our team cannot guarantee approval or override a declined application.</p>
        </div>
      </section>
      {fullPurchase && (
        <section className="bg-white px-5 py-12 sm:py-16" id="instalment-checkout" data-testid="instalment-checkout">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#9A7540]">Secure checkout</p>
            <h2 className="mt-2 font-serif text-4xl text-[#161616]">Choose how you'd like to pay.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#555]">Pay the full installed price through a supported payment provider. Your selected installation time is not reserved until payment and booking confirmation.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => setPaymentOption("paypal")} aria-pressed={paymentOption === "paypal"} className={`rounded-xl border-2 p-5 text-left ${paymentOption === "paypal" ? "border-[#C8A46A] bg-[#FFF9EC]" : "border-[#DDD8CF] bg-white"}`}>
                <strong className="block text-lg">PayPal Pay in 4</strong>
                <span className="mt-2 block text-sm text-[#555]">Four instalments where PayPal offers this option and approves your purchase.</span>
              </button>
              <button type="button" onClick={() => setPaymentOption("stripe")} aria-pressed={paymentOption === "stripe"} className={`rounded-xl border-2 p-5 text-left ${paymentOption === "stripe" ? "border-[#C8A46A] bg-[#FFF9EC]" : "border-[#DDD8CF] bg-white"}`}>
                <strong className="block text-lg">Card, Klarna or Zip</strong>
                <span className="mt-2 block text-sm text-[#555]">Pay in full by card or choose an eligible Stripe instalment method.</span>
              </button>
            </div>
            <div className="mt-6 rounded-xl bg-[#F7F5F1] p-5">
              <strong className="block text-lg text-[#161616]">{paymentOption === "paypal" ? "PayPal checkout" : "Stripe checkout"}</strong>
              <p className="mt-2 text-sm leading-relaxed text-[#555]">We're finalising secure full-price payment confirmation and date locking. Payments for this option are not yet enabled; you will not be charged from this page.</p>
              <a href="#payment-help" className="mt-4 inline-flex min-h-11 items-center justify-center bg-[#C8A46A] px-6 py-3 text-sm font-bold text-[#161616]">Arrange my instalment checkout</a>
            </div>
            <p className="mt-3 text-xs text-[#666]">Pay in 4 is subject to provider eligibility and limits. Never enter card details directly into a SplitsPro enquiry form.</p>
          </div>
        </section>
      )}
      <section className="bg-white px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[#9A7540]">Your options</p>
          <h2 className="mt-3 font-serif text-4xl text-[#161616]">More than one way to pay.</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="border-t-4 border-[#C8A46A] bg-[#F7F5F1] p-5"><h3 className="text-lg font-bold">Pay in instalments</h3><p className="mt-2 text-sm leading-relaxed text-[#555]">Klarna and Zip are supported in our existing Stripe checkout when eligible. PayPal Pay in 4 requires a separate checkout integration and is not yet live through our website.</p></div>
            <div className="border-t-4 border-[#C8A46A] bg-[#F7F5F1] p-5"><h3 className="text-lg font-bold">Book</h3><p className="mt-2 text-sm leading-relaxed text-[#555]">Secure your standard installation booking with a $300 deposit, deducted from the total, and settle the rest on installation day.</p></div>
            <div className="border-t-4 border-[#C8A46A] bg-[#F7F5F1] p-5"><h3 className="text-lg font-bold">Ask for a custom split</h3><p className="mt-2 text-sm leading-relaxed text-[#555]">We can discuss a smaller eligible provider transaction and a separate card, bank-transfer or cash balance, if your provider's terms permit it.</p></div>
          </div>
          <div className="mt-8 border-l-4 border-[#C8A46A] bg-[#FBF7EF] p-5">
            <h3 className="text-xl font-bold">Declined? Don't give up on getting comfortable.</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#555]">An unsuccessful payment doesn't necessarily mean there's no suitable payment arrangement. Tell us what happened and we'll contact you to explore options. We don't give credit approval or financial advice.</p>
            <a href="#payment-help" className="mt-4 inline-block text-sm font-extrabold text-[#8F6A34] underline">Get payment help →</a>
          </div>
        </div>
      </section>
      <section id="payment-help" className="scroll-mt-32 bg-[#F7F5F1] px-5 py-16" data-testid="payment-recovery-form">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#8F6A34]">Talk to SplitsPro</p>
          <h2 className="mt-2 font-serif text-4xl text-[#111]">{needsHelp ? "Let's look at another option." : "Let's work out a payment arrangement."}</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#555]">Leave your name, number and suburb. Our team can call you about the available payment choices. Please don't send banking passwords, full card details or sensitive credit documents.</p>
          <div className="mt-6 bg-white p-5 sm:p-8">
            <QuoteForm defaultService="Split System Installation" defaultMessage={message} submitLabel="Request a Payment Options Call" compact hidePhoto hidePreferredDate hideEmail hideCallButton successTitle="Request received" successMessage="Our team will review the enquiry and contact you about the available payment options." includeAttribution />
          </div>
          <p className="mt-5 text-center text-xs text-[#666]">Prefer to speak now? <a href={PHONE_TEL} className="font-bold underline">Call {PHONE}</a></p>
        </div>
      </section>
      <section className="bg-white px-5 py-12 text-center"><Link to="/split-systems/rinnai-local-offer#installed-prices" className="text-sm font-extrabold text-[#8F6A34] underline">See all Rinnai and Daikin installed deals</Link></section>
    </>
  );
}
