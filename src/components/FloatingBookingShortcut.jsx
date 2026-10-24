import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Check, ShieldCheck, X } from "lucide-react";

export default function FloatingBookingShortcut() {
  const [phase, setPhase] = useState("none");
  const [showTrust, setShowTrust] = useState(false);
  const [returningFromTrust, setReturningFromTrust] = useState(false);
  const trustShown = useRef(false);

  useEffect(() => {
    const update = () => {
      setReturningFromTrust(window.location.hash === "#local-offer-trust");
      const trigger = document.getElementById("local-offer-sticky-trigger");
      const booking = document.getElementById("local-deal-booking");
      if (!trigger || !booking) {
        setPhase("none");
        return;
      }
      // No sales prompt in the hero or opening explanation.
      const hasReadIntro = trigger.getBoundingClientRect().top <= window.innerHeight * 0.65;
      const bookingRect = booking.getBoundingClientRect();
      if (!hasReadIntro) setPhase("none");
      else if (bookingRect.top > window.innerHeight * 0.55) setPhase("before");
      else if (bookingRect.bottom > window.innerHeight * 0.25) setPhase("booking");
      else setPhase("after");
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("hashchange", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("hashchange", update);
    };
  }, []);

  useEffect(() => {
    if (phase !== "booking") {
      setShowTrust(false);
      return undefined;
    }
    if (trustShown.current) return undefined;
    trustShown.current = true;
    setShowTrust(true);
    const timer = window.setTimeout(() => setShowTrust(false), 8500);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (phase === "booking" && showTrust) {
    return (
      <div role="status" data-testid="floating-booking-trust"
        className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-sm rounded-xl border border-[#E5D6B9] bg-[#FFFDF8] px-4 py-3 text-[#252525] shadow-[0_12px_38px_rgba(0,0,0,.22)] sm:bottom-7 sm:left-7 sm:right-auto sm:mx-0"
        style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <button type="button" onClick={() => setShowTrust(false)} aria-label="Dismiss trust message"
          className="absolute right-2 top-2 rounded-full p-1 text-[#777] hover:bg-[#EAE2D4]">
          <X className="h-4 w-4" />
        </button>
        <p className="flex items-center gap-2 pr-5 text-sm font-extrabold"><ShieldCheck className="h-5 w-5 shrink-0 text-[#8F6A34]" /> All our installers are licensed &amp; insured.</p>
        <p className="mt-1.5 flex items-start gap-2 text-xs leading-relaxed text-[#5E5548]"><Check className="h-4 w-4 shrink-0 text-[#8F6A34]" /> Installation guarantee · 7-year Rinnai / 5-year Daikin manufacturer warranties.</p>
        <a href="#local-offer-trust" className="mt-2 inline-block text-xs font-extrabold text-[#8F6A34] underline underline-offset-4">See reviews, licences and guarantees →</a>
      </div>
    );
  }

  if (phase !== "before" && phase !== "after") return null;

  return (
    <a href="#local-deal-booking" data-testid="floating-choose-system"
      className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-32px)] max-w-sm -translate-x-1/2 items-center justify-center gap-2 rounded-full border border-[#E7C98E] bg-[#111] px-6 py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-[0_10px_34px_rgba(0,0,0,0.28)] transition-all hover:bg-[#292929] sm:bottom-7 sm:left-auto sm:right-7 sm:w-auto sm:translate-x-0"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}>
      {phase === "before" && !returningFromTrust ? "Choose your system" : "Back to booking"}
      {phase === "before" && !returningFromTrust ? <ArrowDownRight className="h-5 w-5 text-[#C8A46A]" /> : <ArrowUpRight className="h-5 w-5 text-[#C8A46A]" />}
    </a>
  );
}
