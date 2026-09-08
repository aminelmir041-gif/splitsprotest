import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV, PHONE, PHONE_TEL } from "../lib/data.js";
import Logo from "./Logo.js";
export const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const solid = scrolled || open;
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    useEffect(() => setOpen(false), [location.pathname]);
    return (_jsxs("header", { "data-testid": "navbar", className: `fixed inset-x-0 top-0 z-50 transition-all duration-500 ${solid ? "border-b border-[#E5E5EA] bg-[#F8F7F5]/95 py-2 lg:py-0 backdrop-blur-xl" : "py-3 lg:py-0"}`, children: [!solid && _jsx("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" }), _jsxs("nav", { className: "sp-container relative flex items-center justify-between gap-6 lg:gap-14", children: [_jsx(Logo, { onDark: !solid, scrolled: scrolled }), _jsx("div", { className: "hidden items-center gap-6 lg:flex lg:gap-10", children: NAV.map((item) => (_jsx(NavLink, { to: item.to, end: item.to === "/", "data-testid": `nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`, className: ({ isActive }) => `link-line text-sm font-medium tracking-wide transition-colors duration-300 ${solid
                                ? isActive ? "text-[#C8A46A]" : "text-[#1D1D1F] hover:text-[#C8A46A]"
                                : isActive ? "text-white" : "text-white/85 hover:text-white"}`, children: item.label }, item.to))) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("a", { href: PHONE_TEL, "data-testid": "nav-call-btn", className: `hidden items-center gap-2 text-sm font-semibold tracking-wide transition-colors duration-300 sm:flex ${solid ? "text-[#C8A46A]" : "text-white"}`, children: [_jsx(Phone, { className: "h-4 w-4" }), " ", PHONE] }), _jsx("button", { "data-testid": "mobile-menu-toggle", onClick: () => setOpen((v) => !v), className: `flex h-10 w-10 items-center justify-center rounded-full border lg:hidden ${solid ? "border-[#E5E5EA] text-[#1D1D1F]" : "border-white/40 text-white"}`, "aria-label": "Toggle menu", children: open ? _jsx(X, { className: "h-5 w-5" }) : _jsx(Menu, { className: "h-5 w-5" }) })] })] }), _jsx(AnimatePresence, { children: open && (_jsx(motion.div, { "data-testid": "mobile-menu", initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 }, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }, className: "relative overflow-hidden bg-white lg:hidden", children: _jsxs("div", { className: "sp-container grid gap-0.5 py-5", children: [NAV.map((item) => (_jsx(NavLink, { to: item.to, end: item.to === "/", className: ({ isActive }) => `border-b border-[#F5F5F7] py-3.5 font-serif text-lg ${isActive ? "text-[#C8A46A]" : "text-[#1D1D1F]"}`, children: item.label }, item.to))), _jsxs("a", { href: PHONE_TEL, "data-testid": "mobile-call-btn", className: "mt-4 flex items-center justify-center gap-2 rounded-full border border-[#C8A46A] py-3.5 text-sm font-semibold uppercase tracking-wider text-[#C8A46A]", children: [_jsx(Phone, { className: "h-4 w-4" }), " Call ", PHONE] })] }) })) })] }));
};
export default Navbar;
