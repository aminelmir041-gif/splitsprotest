import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PHONE_TEL } from "../lib/data.js";
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
    return (_jsx(AnimatePresence, { children: show && (_jsxs(_Fragment, { children: [_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 30 }, transition: { duration: 0.45, ease }, className: "fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-black/10 bg-white shadow-[0_-6px_24px_rgba(0,0,0,0.10)] md:hidden", style: { paddingBottom: "env(safe-area-inset-bottom, 0px)" }, children: [_jsxs("a", { href: PHONE_TEL, "data-testid": "sticky-call-btn", className: "flex h-[66px] items-center justify-center gap-2 rounded-none bg-[#1D1D1F] text-sm font-semibold uppercase tracking-[0.08em] text-white", children: [_jsx(Phone, { className: "h-4 w-4" }), " Call Now"] }), _jsxs(Link, { to: "/contact", "data-testid": "sticky-quote-btn", className: "flex h-[66px] items-center justify-center gap-2 rounded-none bg-[#C8A46A] text-sm font-semibold uppercase tracking-[0.08em] text-white", children: ["Get Free Quote ", _jsx(ArrowUpRight, { className: "h-4 w-4" })] })] }, "mobile-bar"), _jsxs(motion.div, { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 24 }, transition: { duration: 0.45, ease }, className: "fixed bottom-6 right-6 z-40 hidden items-center gap-2.5 md:flex", children: [_jsxs("a", { href: PHONE_TEL, "data-testid": "floating-call-btn", className: "flex items-center gap-2 rounded-md border border-[#1D1D1F]/15 bg-[#1D1D1F] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-md transition-colors duration-300 hover:bg-black", children: [_jsx(Phone, { className: "h-4 w-4" }), " Call Now"] }), _jsxs(Link, { to: "/contact", "data-testid": "floating-quote-btn", className: "flex items-center gap-2 rounded-md bg-[#C8A46A] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-md transition-colors duration-300 hover:bg-[#16306e]", children: ["Get Free Quote ", _jsx(ArrowUpRight, { className: "h-4 w-4" })] })] }, "desktop-group")] })) }));
};
export default FloatingCTA;
