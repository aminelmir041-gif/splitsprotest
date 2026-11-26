import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const brands = [
  { name: "Rinnai", image: "https://wholesaleaircon.com.au/cdn/shop/products/Rinnai2.png?v=1736922188", models: [["9",8660],["11",9020],["13",9470],["15",9760],["18",10780],["20",12180]] },
  { name: "Mitsubishi Heavy Industries", image: "https://cdn.shopify.com/s/files/1/0594/1759/2016/products/Mitsubishi-Heavy-Industries-10kW-FDUA100VNPWVH_1600x.png?v=1660607899", models: [["10",9030],["12.1",9720],["14",11580],["16",12260]] },
  { name: "Daikin", image: "https://wholesaleaircon.com.au/cdn/shop/files/ducted-inverter2_ab41b070-1452-4402-a0a8-5df909949f74_1600x.png?v=1739337318", models: [["10",9910],["12.5",10810],["14",11610],["16",12310],["20",12910]] },
];
// Rinnai/MHI: earlier indicative quotes + revised materials allowance.
// Daikin: existing four-zone guide prices + provisional $320 allowance, pending recosting.
// Omit disputed 25 kW labels until supplier confirms exact model/cooling capacity.
const money = value => "$" + value.toLocaleString("en-AU");

export default function DuctedPricingCarousel() {
  const [selected, setSelected] = useState(0);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const touch = useRef(null);
  const brand = brands[selected];
  const count = brand.models.length;
  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = window.setInterval(() => setActive(i => (i + 1) % count), 5000);
    return () => window.clearInterval(id);
  }, [paused, reduceMotion, count, selected]);
  const move = n => { setActive(i => (i + n + count) % count); };
  const choose = i => { setSelected(i); setActive(0); setPaused(false); };
  return (
    <section aria-label="Ducted air conditioning prices" className="bg-white py-8 sm:py-12" data-testid="ducted-pricing-carousel">
      <div className="sp-container">
        <h2 className="font-serif text-3xl tracking-tight text-[#1D1D1F] sm:text-4xl">Ducted air conditioning prices</h2>
        <div className="mt-4 grid grid-cols-[1fr_1.7fr_1fr] gap-2" aria-label="Select ducted brand">
          {brands.map((b,i) => <button key={b.name} type="button" aria-pressed={selected===i} onClick={() => choose(i)} className={`min-h-[44px] rounded-full border px-2 py-2 text-xs font-medium transition-colors sm:text-sm ${selected===i ? "border-[#1D1D1F] bg-[#1D1D1F] text-white" : "border-[#E5E5EA] bg-white text-[#1D1D1F] hover:border-[#C8A46A]"}`}>{b.name}</button>)}
        </div>
        <div className="relative mt-4 overflow-hidden rounded-3xl border border-[#E5E5EA] bg-white soft-shadow"
          onTouchStart={e => {touch.current = [e.touches[0].clientX,e.touches[0].clientY];}}
          onTouchEnd={e => {if (!touch.current) return; const dx=e.changedTouches[0].clientX-touch.current[0],dy=e.changedTouches[0].clientY-touch.current[1]; if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)) move(dx<0?1:-1); touch.current=null;}}>
          {brands.map((b,bi) => <div key={b.name} hidden={bi!==selected}>
            <div className="grid grid-cols-[0.95fr_1.05fr] items-center gap-3 px-4 py-5 sm:gap-8 sm:px-12 sm:py-8">
              <figure className="min-w-0">
                <img src={b.image} alt={b.name+" ducted air conditioning indoor and outdoor units, representative product range"} loading={bi===0?"eager":"lazy"} decoding="async" className="mx-auto h-[125px] w-full object-contain sm:h-[205px]" onError={e=>{e.currentTarget.style.visibility="hidden";}} />
                <figcaption className="mt-1 text-center text-[10px] leading-tight text-[#6E6E73]">Range image · models may vary</figcaption>
              </figure>
              <div className="relative min-w-0 overflow-hidden">
                <motion.div className="flex" animate={{x:`-${bi===selected?active*100:0}%`}} transition={{duration:reduceMotion?0:0.45,ease:"easeInOut"}}>
                  {b.models.map(([kw,price],mi)=><article key={kw} aria-hidden={bi!==selected||mi!==active} className="w-full shrink-0">
                    <p className="text-xs font-semibold text-[#6E6E73]">{b.name}</p>
                    <h3 className="mt-2 font-serif text-2xl leading-tight text-[#1D1D1F] sm:text-4xl">{kw} kW ducted</h3>
                    <p className="mt-3 text-xs text-[#6E6E73]">Standard installation from</p>
                    <p className="mt-1 font-serif text-3xl tracking-tight text-[#1D1D1F] sm:text-5xl">{money(price)}</p>
                    <p className="mt-2 text-[11px] leading-snug text-[#6E6E73] sm:text-xs">Incl. GST · Indicative installed price</p>
                  </article>)}
                </motion.div>
              </div>
            </div>
          </div>)}
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center" aria-label="Choose system capacity">
            {brand.models.map(([kw],i)=><button key={kw} type="button" onClick={()=>setActive(i)} aria-label={`Show ${kw} kilowatt ducted system`} aria-current={i===active?"true":undefined} className="flex h-8 w-6 items-center justify-center"><span className={`h-2 rounded-full transition-all ${i===active?"w-4 bg-[#1D1D1F]":"w-2 bg-[#D1D1D6]"}`}/></button>)}
          </div>
          <div className="flex items-center gap-1">
            {!reduceMotion && <button type="button" onClick={()=>setPaused(v=>!v)} className="min-h-[44px] px-2 text-xs text-[#6E6E73]">{paused?"Play":"Pause"}</button>}
            <button type="button" onClick={()=>move(-1)} aria-label="Previous ducted system" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E5EA]"><ChevronLeft size={18}/></button>
            <button type="button" onClick={()=>move(1)} aria-label="Next ducted system" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E5EA]"><ChevronRight size={18}/></button>
          </div>
        </div>
        <div className="mt-3 border-t border-[#E5E5EA] pt-4">
          <h3 className="font-serif text-lg text-[#1D1D1F]">Standard installation · 120–140 m²</h3>
          <p className="mt-1 text-xs leading-relaxed text-[#6E6E73] sm:text-sm">Single-storey homes · 4 zones · up to 6 outlets. Suitable roof space and safe, clear access required. Home sizes are indicative; final system design and price are confirmed before installation.</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-4">
            <div className="rounded-xl border border-[#E5E5EA] px-3 py-3 sm:px-4">
              <h4 className="font-medium text-sm text-[#1D1D1F]">Larger homes</h4>
              <p className="mt-1 text-xs text-[#6E6E73]">140–200 m² · Custom quote</p>
              <p className="mt-1 text-xs leading-snug text-[#6E6E73]">Extra outlets and duct layout tailored to your home.</p>
            </div>
            <div className="rounded-xl border border-[#E5E5EA] px-3 py-3 sm:px-4">
              <h4 className="font-medium text-sm text-[#1D1D1F]">Double-storey homes</h4>
              <p className="mt-1 text-xs text-[#6E6E73]">Up to 200 m² · Custom quote</p>
              <p className="mt-1 text-xs leading-snug text-[#6E6E73]">Roof and between-floor access assessed individually.</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[#6E6E73]">All prices are indicative and subject to equipment availability, suitable airflow and a confirmed written quote. Lifetime installation guarantee. Pay after installation.</p>
        </div>
      </div>
    </section>
  );
}
