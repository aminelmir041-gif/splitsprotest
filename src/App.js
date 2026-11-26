import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ReactLenis, useLenis } from "lenis/react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/sonner";

import Navbar from "@/components/Navbar";
import AnalyticsTracking from "@/components/AnalyticsTracking";
import Footer from "@/components/Footer";
import AfterHoursCallback from "@/components/AfterHoursCallback";
import FloatingCTA from "@/components/FloatingCTA";
import CustomCursor from "@/components/CustomCursor";
import { LOGO } from "@/lib/data";

import searchPages from "@/lib/search-pages.json";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Workmanship from "@/pages/Workmanship";
import SplitSystems from "@/pages/SplitSystems";
import Ducted from "@/pages/Ducted";
import DuctedDaikinRinnai from "@/pages/DuctedDaikinRinnai";
import Cleaning from "@/pages/Cleaning";
import SplitSystemCleaning from "@/pages/SplitSystemCleaning";
import CleaningCheckout from "@/pages/CleaningCheckout";
import ColonyFormingUnits from "@/pages/ColonyFormingUnits";
import AirconColonyStudy from "@/pages/AirconColonyStudy";
import DuctedCleaning from "@/pages/DuctedCleaning";
import Repairs from "@/pages/Repairs";
import Servicing from "@/pages/Servicing";
import Gallery from "@/pages/Gallery";
import Reviews from "@/pages/Reviews";
import ServiceAreas from "@/pages/ServiceAreas";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import BrandPage from "@/pages/BrandPage";
import ZenaSpecial from "@/pages/ZenaSpecial";
import GoogleAdsLanding from "@/pages/GoogleAdsLanding";
import AirconDeals from "@/pages/AirconDeals";
import PaymentOptions from "@/pages/PaymentOptions";
import DealPayment from "@/pages/DealPayment";

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
          <Route path="/our-approach" element={<iframe title="SplitsPro — Our Approach" src="/our-approach/index.html" style={{display:"block",width:"100%",height:"100vh",border:0}} />} />
          <Route path="/workmanship" element={<Workmanship />} />
          <Route path="/workmanship-and-trust" element={<Navigate to="/workmanship" replace />} />
          <Route path="/payment-options" element={<PaymentOptions />} />
          <Route path="/deal-payment" element={<DealPayment />} />
          <Route path="/deals" element={<Navigate to="/aircon-deals" replace />} />
          <Route path="/split-systems" element={<SplitSystems />} />
          <Route path="/split-systems/oran-park" element={<SplitSystems />} />
          <Route path="/split-systems/willoughby-north-sydney" element={<SplitSystems />} />
          <Route path="/split-systems/central-coast-newcastle" element={<SplitSystems />} />
          <Route path="/split-systems/wollongong" element={<SplitSystems />} />
          <Route path="/split-systems/quakers-hill-austral-richmond" element={<SplitSystems />} />
          <Route path="/split-systems/mitsubishi-electric" element={<Navigate to="/split-systems/mitsubishi" replace />} />
          <Route path="/split-systems/mitsubishi-heavy-industries" element={<Navigate to="/split-systems/mitsubishi" replace />} />
          <Route path="/split-systems/rinnai-local-offer" element={<Navigate to="/aircon-deals?brand=rinnai" replace />} />
          <Route path="/book-installation" element={<Navigate to="/split-system-installation-sydney" replace />} />
          <Route path="/secure-installation" element={<Navigate to="/split-system-installation-sydney" replace />} />
          <Route path="/split-system-installation-sydney" element={<Navigate to="/aircon-deals" replace />} />
          <Route path="/aircon-deals" element={<AirconDeals />} />
          <Route path="/daikin-zena-special" element={<ZenaSpecial />} />
          <Route path="/split-systems/:slug" element={<BrandPage />} />
          <Route path="/ducted" element={<Ducted />} />
          <Route path="/ducted/daikin-rinnai" element={<DuctedDaikinRinnai />} />
          <Route path="/cleaning" element={<Cleaning />} />
          <Route path="/split-system-cleaning" element={<SplitSystemCleaning />} />
          <Route path="/colony-forming-units" element={<ColonyFormingUnits />} />
          <Route path="/aircon-colony-forming-units" element={<AirconColonyStudy />} />
          <Route path="/secure-cleaning" element={<CleaningCheckout />} />
          <Route path="/ducted-cleaning" element={<DuctedCleaning />} />
          <Route path="/repairs" element={<Repairs />} />
          <Route path="/servicing" element={<Servicing />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/service-areas" element={<ServiceAreas />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const SiteShell = () => {
  const { pathname } = useLocation();
  const searchPath = pathname.replace(/\/$/, "") + "/";
  const searchPage = searchPages[searchPath];
  const isDealsPage = pathname === "/aircon-deals" || pathname === "/aircon-deals/";
  return (
    <>
      {searchPage && (
        <Helmet>
          <title>{searchPage.title}</title>
          <meta name="description" content={searchPage.description} />
          <meta property="og:title" content={searchPage.title} />
          <meta property="og:description" content={searchPage.description} />
          <link rel="canonical" href={`https://splitspro.com.au${searchPath}`} />
        </Helmet>
      )}
      {isDealsPage ? (
        <header className="sticky top-0 z-[60] border-b border-[#E6E1D9] bg-[#FFFCF7]">
          <div className="sp-container flex min-h-16 items-center justify-between gap-4 py-2">
            <img src={LOGO} alt="SplitsPro Air Conditioning" className="h-11 w-auto object-contain" />
            <span className="max-w-[180px] text-right text-[11px] font-semibold text-[#70552F] sm:max-w-none sm:text-sm">No payment until after installation</span>
          </div>
        </header>
      ) : <Navbar />}
      <main className={isDealsPage ? "" : "pt-[36px]"}>
        <AnimatedRoutes />
      </main>
      {!isDealsPage && <Footer />}
      <AfterHoursCallback />
      <FloatingCTA />
      <Toaster position="top-center" richColors />
    </>
  );
};

function App() {
  const basename = window.location.hostname.endsWith("github.io") ? "/splitsprotest" : "/";

  useEffect(() => {
    const handleImageError = (event) => {
      const img = event.target;
      if (!(img instanceof HTMLImageElement) || img.dataset.fallbackApplied === "true" || img.dataset.noFallback === "true") return;
      const src = img.getAttribute("src") || "";
      // Never replace large landing-page imagery with the SplitsPro logo.
      if (src.includes("/landing/")) {
        img.style.display = "none";
        return;
      }
      img.dataset.fallbackApplied = "true";
      img.src = LOGO;
      img.classList.add("site-image-fallback");
    };
    document.addEventListener("error", handleImageError, true);
    return () => document.removeEventListener("error", handleImageError, true);
  }, []);

  return (
    <HelmetProvider>
      <div className="App">
        <CustomCursor />
        <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
          <BrowserRouter basename={basename}>
            <ScrollToTop />
            <AnalyticsTracking />
            <SiteShell />
          </BrowserRouter>
        </ReactLenis>
      </div>
    </HelmetProvider>
  );
}

export default App;
