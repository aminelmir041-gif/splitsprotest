import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
export const PageLoader = () => {
    const [done, setDone] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setDone(true), 1250);
        return () => clearTimeout(t);
    }, []);
    return (_jsx(AnimatePresence, { children: !done && (_jsx(motion.div, { className: "loader-wrap", initial: { opacity: 1 }, exit: { y: "-100%" }, transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] }, children: _jsxs("div", { className: "text-center", children: [_jsx(motion.img, { src: "./logo.png", alt: "SplitsPro", className: "mx-auto h-20 w-auto [filter:brightness(0)_invert(1)]", initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }), _jsx(motion.div, { className: "mx-auto mt-6 h-px w-40 overflow-hidden bg-white/15", children: _jsx(motion.div, { className: "h-full bg-white", initial: { x: "-100%" }, animate: { x: "0%" }, transition: { duration: 1, ease: "easeInOut" } }) })] }) })) }));
};
export default PageLoader;
