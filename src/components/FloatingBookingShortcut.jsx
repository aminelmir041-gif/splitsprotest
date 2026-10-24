import { useEffect, useState } from "react";
import { ArrowDownRight } from "lucide-react";

export default function FloatingBookingShortcut() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const trigger = document.getElementById("local-offer-sticky-trigger");
      const booking = document.getElementById("local-deal-booking");
      if (!trigger || !booking) {
        setVisible(false);
        return;
      }
      // Let the customer read the opening problem and what is included first.
      const hasReadIntro = trigger.getBoundingClientRect().top <= window.innerHeight * 0.65;
      // Stop floating once the actual selection cards are within reach.
      const bookingAhead = booking.getBoundingClientRect().top > window.innerHeight * 0.55;
      setVisible(hasReadIntro && bookingAhead);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!visible) return null;

  return (
    <a href="#local-deal-booking" data-testid="floating-choose-system"
      className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-32px)] max-w-sm -translate-x-1/2 items-center justify-center gap-2 rounded-full border border-[#E7C98E] bg-[#111] px-6 py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-[0_10px_34px_rgba(0,0,0,0.28)] transition-all hover:bg-[#292929] sm:bottom-7 sm:left-auto sm:right-7 sm:w-auto sm:translate-x-0"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}>
      Choose your system <ArrowDownRight className="h-5 w-5 text-[#C8A46A]" />
    </a>
  );
}
