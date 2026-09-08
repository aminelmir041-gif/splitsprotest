import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ReactLenis, useLenis } from "lenis/react";
import { motion, AnimatePresence } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/sonner";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import CustomCursor from "@/components/CustomCursor";
import PageLoader from "@/components/PageLoader";

import Home from "@/pages/Home";
import About from "@/pages/About";
import SplitSystems from "@/pages/SplitSystems";
import Ducted from "@/pages/Ducted";
import Cleaning from "@/pages/Cleaning";
import Repairs from "@/pages/Repairs";
import Servicing from "@/pages/Servicing";
import Gallery from "@/pages/Gallery";
import Reviews from "@/pages/Reviews";
import ServiceAreas from "@/pages/ServiceAreas";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import BrandPage from "@/pages/BrandPage";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const lenis = useLenis();
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, lenis]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/split-systems" element={<SplitSystems />} />
          <Route path="/split-systems/:slug" element={<BrandPage />} />
          <Route path="/ducted" element={<Ducted />} />
          <Route path="/cleaning" element={<Cleaning />} />
          <Route path="/repairs" element={<Repairs />} />
          <Route path="/servicing" element={<Servicing />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/service-areas" element={<ServiceAreas />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  const basename = window.location.hostname.endsWith("github.io") ? "/splitsprotest" : "/";

  return (
    <HelmetProvider>
      <div className="App">
        <PageLoader />
        <CustomCursor />
        <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
          <BrowserRouter basename={basename}>
            <ScrollToTop />
            <Navbar />
            <main>
              <AnimatedRoutes />
            </main>
            <Footer />
            <FloatingCTA />
            <Toaster position="top-center" richColors />
          </BrowserRouter>
        </ReactLenis>
      </div>
    </HelmetProvider>
  );
}

export default App;
