import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";

import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { ReactLenis, useLenis } from "lenis/react";
import { motion, AnimatePresence } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "./components/ui/sonner.js";
import Navbar from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import FloatingCTA from "./components/FloatingCTA.js";
import CustomCursor from "./components/CustomCursor.js";
import PageLoader from "./components/PageLoader.js";
import Home from "./pages/Home.js";
import About from "./pages/About.js";
import SplitSystems from "./pages/SplitSystems.js";
import Ducted from "./pages/Ducted.js";
import Cleaning from "./pages/Cleaning.js";
import Repairs from "./pages/Repairs.js";
import Servicing from "./pages/Servicing.js";
import Gallery from "./pages/Gallery.js";
import Reviews from "./pages/Reviews.js";
import ServiceAreas from "./pages/ServiceAreas.js";
import FAQ from "./pages/FAQ.js";
import Contact from "./pages/Contact.js";
import BrandPage from "./pages/BrandPage.js";
const ScrollToTop = () => {
    const { pathname } = useLocation();
    const lenis = useLenis();
    useEffect(() => {
        if (lenis)
            lenis.scrollTo(0, { immediate: true });
        else
            window.scrollTo(0, 0);
    }, [pathname, lenis]);
    return null;
};
const AnimatedRoutes = () => {
    const location = useLocation();
    return (_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }, children: _jsxs(Routes, { location: location, children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/about", element: _jsx(About, {}) }), _jsx(Route, { path: "/split-systems", element: _jsx(SplitSystems, {}) }), _jsx(Route, { path: "/split-systems/:slug", element: _jsx(BrandPage, {}) }), _jsx(Route, { path: "/ducted", element: _jsx(Ducted, {}) }), _jsx(Route, { path: "/cleaning", element: _jsx(Cleaning, {}) }), _jsx(Route, { path: "/repairs", element: _jsx(Repairs, {}) }), _jsx(Route, { path: "/servicing", element: _jsx(Servicing, {}) }), _jsx(Route, { path: "/gallery", element: _jsx(Gallery, {}) }), _jsx(Route, { path: "/reviews", element: _jsx(Reviews, {}) }), _jsx(Route, { path: "/service-areas", element: _jsx(ServiceAreas, {}) }), _jsx(Route, { path: "/faq", element: _jsx(FAQ, {}) }), _jsx(Route, { path: "/contact", element: _jsx(Contact, {}) })] }) }, location.pathname) }));
};
function App() {
    return (_jsx(HelmetProvider, { children: _jsxs("div", { className: "App", children: [_jsx(PageLoader, {}), _jsx(CustomCursor, {}), _jsx(ReactLenis, { root: true, options: { lerp: 0.08, smoothWheel: true }, children: _jsxs(HashRouter, { children: [_jsx(ScrollToTop, {}), _jsx(Navbar, {}), _jsx("main", { children: _jsx(AnimatedRoutes, {}) }), _jsx(Footer, {}), _jsx(FloatingCTA, {}), _jsx(Toaster, { position: "top-center", richColors: true })] }) })] }) }));
}
export default App;
