import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PHONE_TEL } from "../lib/data";

export const FloatingCTA = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Appear only once the hero has completely scrolled off screen (hero is full viewport height).
      const threshold = window.innerHeight * 0.95;
      setShow(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const ease = [0.16, 1, 0.3, 1];

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Mobile: full-width two-button bottom bar */}
          <motion.div
            key="mobile-bar"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.45, ease }}
            className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-black/10 bg-white shadow-[0_-6px_24px_rgba(0,0,0,0.10)] md:hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          >
            <a
              href={PHONE_TEL}
              data-testid="sticky-call-btn"
              className="flex h-[66px] items-center justify-center gap-2 rounded-none bg-[#1D1D1F] text-sm font-semibold uppercase tracking-[0.08em] text-white"
            >
              <Phone className="h-4 w-4" /> Call Now
            </a>
            <Link
              to="/contact"
              data-testid="sticky-quote-btn"
              className="flex h-[66px] items-center justify-center gap-2 rounded-none bg-[#C8A46A] text-sm font-semibold uppercase tracking-[0.08em] text-white"
            >
              Get Free Quote <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Desktop: compact lower-right action group */}
          <motion.div
            key="desktop-group"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.45, ease }}
            className="fixed bottom-6 right-6 z-40 hidden items-center gap-2.5 md:flex"
          >
            <a
              href={PHONE_TEL}
              data-testid="floating-call-btn"
              className="flex items-center gap-2 rounded-md border border-[#1D1D1F]/15 bg-[#1D1D1F] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-md transition-colors duration-300 hover:bg-black"
            >
              <Phone className="h-4 w-4" /> Call Now
            </a>
            <Link
              to="/contact"
              data-testid="floating-quote-btn"
              className="flex items-center gap-2 rounded-md bg-[#C8A46A] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-md transition-colors duration-300 hover:bg-[#16306e]"
            >
              Get Free Quote <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FloatingCTA;
