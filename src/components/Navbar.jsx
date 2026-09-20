import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV, PHONE, PHONE_TEL } from "../lib/data";
import Logo from "./Logo";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const solid = scrolled || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <header
      data-testid="navbar"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid ? "border-b border-[#E5E5EA] bg-[#F8F7F5]/95 py-2 lg:py-0 backdrop-blur-xl" : "py-3 lg:py-0"
      }`}
    >
      {!solid && <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />}
      <nav className="sp-container relative flex items-center justify-between gap-6 lg:gap-14">
        <Logo onDark={!solid} scrolled={scrolled} />

        <div className="hidden items-center gap-6 lg:flex lg:gap-10">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) =>
                `link-line text-sm font-medium tracking-wide transition-colors duration-300 ${
                  solid
                    ? isActive ? "text-[#C8A46A]" : "text-[#1D1D1F] hover:text-[#C8A46A]"
                    : isActive ? "text-white" : "text-white/85 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={PHONE_TEL}
            data-testid="nav-call-btn"
            className={`hidden items-center gap-2 text-sm font-semibold tracking-wide transition-colors duration-300 sm:flex ${solid ? "text-[#C8A46A]" : "text-white"}`}
          >
            <Phone className="h-4 w-4" /> {PHONE}
          </a>
          <button
            type="button"
            data-testid="mobile-menu-toggle"
            onClick={() => setOpen((value) => !value)}
            className={`flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border lg:hidden ${
              solid ? "border-[#E5E5EA] bg-white text-[#1D1D1F]" : "border-white/40 bg-black/10 text-white"
            }`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-controls="mobile-navigation"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            data-testid="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full z-[60] max-h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain border-t border-[#E5E5EA] bg-white shadow-xl lg:hidden"
          >
            <div className="sp-container grid gap-0.5 py-4">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `border-b border-[#F5F5F7] py-3.5 font-serif text-lg ${isActive ? "text-[#C8A46A]" : "text-[#1D1D1F]"}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <a
                href={PHONE_TEL}
                data-testid="mobile-call-btn"
                onClick={() => setOpen(false)}
                className="mt-4 flex items-center justify-center gap-2 rounded-full border border-[#C8A46A] py-3.5 text-sm font-semibold uppercase tracking-wider text-[#C8A46A]"
              >
                <Phone className="h-4 w-4" /> Call {PHONE}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
