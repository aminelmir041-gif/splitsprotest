import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const packages = [
  { name: "Standard", area: "120–140 m²", type: "Single-storey", detail: "Four zones · Up to six outlets", price: "Indicative $8,660", note: "Rinnai 9 kW example including GST; final price and system sizing confirmed by quote." },
  { name: "Larger Home", area: "140–200 m²", type: "Single-storey", detail: "Designed for larger layouts", price: "Custom price", note: "System capacity and final price confirmed after assessment." },
  { name: "Double-Storey", area: "Up to 200 m²", type: "Subject to access and layout", detail: "Upstairs or both floors where feasible", price: "Custom quote", note: "Roof and inter-floor access must be assessed." },
];

export default function DuctedPricingCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = window.setInterval(() => setActive(i => (i + 1) % packages.length), 5500);
    return () => window.clearInterval(id);
  }, [paused, reduceMotion]);
  const p = packages[active];
  const move = n => { setActive(i => (i + n + packages.length) % packages.length); setPaused(true); };
  const touchX = useRef(null);
  return (
    <section aria-label="Ducted air conditioning packages" className="bg-white py-12 sm:py-16" data-testid="ducted-pricing-carousel">
      <div className="sp-container">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6E6E73]">Ducted air conditioning</p>
        <h2 className="mt-3 font-serif text-3xl text-[#1D1D1F] sm:text-4xl">Find the right fit for your home</h2>
        <div className="relative mt-7 overflow-hidden rounded-3xl border border-[#E5E5EA] bg-[#F8F8F8]"
          onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={e => { if (touchX.current !== null) { const dx = e.changedTouches[0].clientX - touchX.current; if (Math.abs(dx) > 45) move(dx < 0 ? 1 : -1); touchX.current = null; } }}>
          <motion.div key={active} initial={reduceMotion ? false : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="grid min-h-[270px] items-center gap-6 p-7 sm:grid-cols-[1fr_auto] sm:p-12" aria-live="polite">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6E6E73]">{active + 1} / {packages.length} · {p.name}</p>
              <h3 className="mt-3 font-serif text-4xl text-[#1D1D1F] sm:text-5xl">{p.area}</h3>
              <p className="mt-3 text-lg text-[#1D1D1F]">{p.type}</p>
              <p className="mt-3 text-sm text-[#6E6E73]">{p.detail}</p>
              <p className="mt-5 text-xs text-[#6E6E73]">{p.note}</p>
            </div>
            <p className="font-serif text-3xl text-[#1D1D1F] sm:text-4xl">{p.price}</p>
          </motion.div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex gap-2" aria-label="Choose package">
            {packages.map((item,i) => <button key={item.name} type="button" onClick={() => {setActive(i);setPaused(true);}} aria-label={`Show ${item.name}`} aria-current={active === i ? "true" : undefined} className={`h-3 w-3 rounded-full border border-[#1D1D1F] ${active === i ? "bg-[#1D1D1F]" : "bg-white"}`} />)}
          </div>
          <div className="flex items-center gap-2">
            {!reduceMotion && <button type="button" onClick={() => setPaused(v => !v)} className="min-h-[44px] px-2 text-xs text-[#6E6E73]">{paused ? "Play" : "Pause"}</button>}
            <button type="button" aria-label="Previous package" onClick={() => move(-1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E5EA]"><ChevronLeft size={20}/></button>
            <button type="button" aria-label="Next package" onClick={() => move(1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E5EA]"><ChevronRight size={20}/></button>
          </div>
        </div>
        <p className="mt-5 max-w-3xl text-xs leading-relaxed text-[#6E6E73]">Indicative home sizes only. Prices assume suitable roof space and safe, clear roof access. Restricted access or complex layouts require a customised quote. Final equipment capacity, scope and price are confirmed before work begins. Pay after installation.</p>
      </div>
    </section>
  );
}
