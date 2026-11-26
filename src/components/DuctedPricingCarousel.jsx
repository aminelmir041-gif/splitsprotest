import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Indicative standard-install prices recovered from the prior supplier-price calculation.
// Revised materials allowance adds $200 ex GST at 30% gross margin, rounded up to $10.
const brands = [
  { name: "Rinnai", models: [["9",8660],["11",9020],["13",9470],["15",9760],["18",10780],["20",12180],["25",13620]] },
  { name: "Mitsubishi Heavy Industries", models: [["10",9030],["12.1",9720],["14",11580],["16",12260]] },
];
const money = value => "$" + value.toLocaleString("en-AU");

export default function DuctedPricingCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const touchX = useRef(null);
  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = window.setInterval(() => setActive(i => (i + 1) % brands.length), 6500);
    return () => window.clearInterval(id);
  }, [paused, reduceMotion]);
  const brand = brands[active];
  const move = n => { setActive(i => (i + n + brands.length) % brands.length); setPaused(true); };
  return (
    <section aria-label="Ducted air conditioning prices" className="bg-white py-10 sm:py-14" data-testid="ducted-pricing-carousel">
      <div className="sp-container">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6E6E73]">Ducted air conditioning</p>
        <h2 className="mt-3 font-serif text-3xl text-[#1D1D1F] sm:text-4xl">Ducted air conditioning prices</h2>
        <div className="mt-5 grid gap-3 text-sm text-[#6E6E73] sm:grid-cols-3 sm:gap-5">
          <div><p className="font-medium text-[#1D1D1F]">Standard · 120–140 m²</p><p>Single-storey · 4 zones, up to 6 outlets</p></div>
          <div><p className="font-medium text-[#1D1D1F]">Larger home · 140–200 m²</p><p>Single-storey · tailored installation price</p></div>
          <div><p className="font-medium text-[#1D1D1F]">Double-storey · up to 200 m²</p><p>Custom quote, subject to layout and access</p></div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-[#6E6E73]">Home sizes are indicative. Standard prices assume suitable roof space and safe, clear roof access. Restricted access or complex installations are quoted separately.</p>
        <div className="relative mt-6 overflow-hidden rounded-3xl border border-[#E5E5EA] bg-[#F8F8F8]"
          onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={e => { if (touchX.current !== null) { const dx = e.changedTouches[0].clientX - touchX.current; if (Math.abs(dx) > 45) move(dx < 0 ? 1 : -1); touchX.current = null; } }}>
          <motion.div key={active} initial={reduceMotion ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="grid items-center gap-5 p-6 sm:grid-cols-[0.85fr_1.15fr] sm:p-9">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6E6E73]">Reverse-cycle ducted systems</p>
              <h3 className="mt-2 font-serif text-3xl text-[#1D1D1F] sm:text-4xl">{brand.name}</h3>
              <p className="mt-3 text-xs text-[#6E6E73]">Indicative standard installation from</p>
              <p className="mt-1 font-serif text-4xl text-[#1D1D1F]">{money(brand.models[0][1])}</p>
              <p className="mt-2 text-xs text-[#6E6E73]">Including GST · Lifetime installation guarantee</p>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-1" aria-label={brand.name + " model prices"}>
              {brand.models.map(([kw,price]) => <div key={kw} className="flex flex-wrap items-baseline justify-between gap-x-2 border-b border-[#E5E5EA] py-2 text-sm"><span className="text-[#6E6E73]">{kw} kW</span><span className="font-semibold text-[#1D1D1F]">{money(price)}</span></div>)}
            </div>
          </motion.div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-4">
          <div className="flex gap-2" aria-label="Choose brand">
            {brands.map((item,i) => <button key={item.name} type="button" onClick={() => {setActive(i);setPaused(true);}} aria-label={`Show ${item.name}`} aria-current={active === i ? "true" : undefined} className={`flex h-8 w-8 items-center justify-center rounded-full ${active === i ? "text-[#1D1D1F]" : "text-[#C8C8CC]"}`}><span className="h-2.5 w-2.5 rounded-full bg-current" /></button>)}
          </div>
          <div className="flex items-center gap-2">
            {!reduceMotion && <button type="button" onClick={() => setPaused(v => !v)} className="min-h-[44px] px-2 text-xs text-[#6E6E73]">{paused ? "Play" : "Pause"}</button>}
            <button type="button" aria-label="Previous brand" onClick={() => move(-1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E5EA]"><ChevronLeft size={20}/></button>
            <button type="button" aria-label="Next brand" onClick={() => move(1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E5EA]"><ChevronRight size={20}/></button>
          </div>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-[#6E6E73]">Indicative fully installed prices, including GST. Final system size, installation scope and price are confirmed by quote before work begins. Pay after installation.</p>
      </div>
    </section>
  );
}
