import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { RINNAI_LOCAL_OFFER_RANGES } from "../pages/BrandPage";
import { SPLIT_BRANDS } from "../lib/data";

// Keep the current advertised offers and extend them with the existing product catalogue.
const extraRanges = SPLIT_BRANDS.flatMap(brand => brand.ranges
  .filter(item => !(brand.slug === "rinnai" && item.slug === "px-series") && !(brand.slug === "daikin" && item.slug === "cora"))
  .filter(item => item.prices?.length)
  .map(item => ({
    ...item,
    slug: `${brand.slug}-${item.slug}`,
    displayName: item.displayName || `${brand.brand} ${item.name}`,
    tabLabel: item.displayName || `${brand.brand} ${item.name}`,
  })));
const allRanges = [...RINNAI_LOCAL_OFFER_RANGES, ...extraRanges];

export default function SplitPricingCarousel() {
  const ranges = allRanges;
  const [brandIndex, setBrandIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const touch = useRef(null);
  const brandStrip = useRef(null);
  const range = ranges[brandIndex];
  const count = range.prices.length;

  useEffect(() => {
    if (paused || reducedMotion || count < 2) return;
    const timer = window.setInterval(() => setIndex(i => (i + 1) % count), 5000);
    return () => window.clearInterval(timer);
  }, [brandIndex, count, paused, reducedMotion]);

  const choose = i => { setBrandIndex(i); setIndex(0); setPaused(false); };
  const scrollBrands = direction => brandStrip.current?.scrollBy({left: direction * 190, behavior: reducedMotion ? "auto" : "smooth"});
  const move = direction => { setIndex(i => (i + direction + count) % count); setPaused(true); };

  return (
    <section aria-labelledby="home-split-prices-heading" className="bg-white py-8 sm:py-12" data-testid="home-split-pricing">
      <div className="sp-container">
        <h2 id="home-split-prices-heading" className="font-serif text-[28px] leading-[1.12] tracking-tight text-[#1D1D1F] sm:text-4xl">Split system air conditioner prices</h2>
        <div className="mt-4 flex items-center gap-1.5">
          <button type="button" onClick={()=>scrollBrands(-1)} aria-label="Scroll to previous brands" className="flex h-10 w-8 shrink-0 items-center justify-center rounded-full border border-[#D8C6A8] text-[#956C35]"><ArrowLeft className="h-4 w-4"/></button>
          <div ref={brandStrip} className="flex min-w-0 flex-1 snap-x gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Swipe to choose split system brand or range">
          {ranges.map((item,i) => <button type="button" key={item.slug} onClick={() => choose(i)} aria-pressed={i===brandIndex} className={`min-h-[44px] shrink-0 snap-start whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium sm:text-sm ${i===brandIndex ? "border-[#1D1D1F] bg-[#1D1D1F] text-white" : "border-[#D8C6A8] bg-white text-[#1D1D1F] hover:border-[#C8A46A]"}`}>{item.tabLabel || item.displayName}</button>)}
          </div>
          <button type="button" onClick={()=>scrollBrands(1)} aria-label="Scroll to more brands" className="flex h-10 w-8 shrink-0 items-center justify-center rounded-full border border-[#D8C6A8] text-[#956C35]"><ArrowRight className="h-4 w-4"/></button>
        </div>
        <div className="mt-3 overflow-hidden rounded-2xl border border-[#B98C4F] bg-[#F7F5F1] p-3 sm:p-6"
          onTouchStart={e => {touch.current=[e.touches[0].clientX,e.touches[0].clientY];}}
          onTouchEnd={e => {if(!touch.current)return;const dx=e.changedTouches[0].clientX-touch.current[0],dy=e.changedTouches[0].clientY-touch.current[1];touch.current=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1);}}
          onTouchCancel={()=>{touch.current=null;}}>
          {ranges.map((item,bi) => <div key={item.slug} hidden={bi!==brandIndex}>
            <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center gap-3 sm:gap-8">
              <figure className="min-w-0">
                {item.image && <img src={item.image} alt={item.displayName+" wall-mounted split system air conditioner"} loading="lazy" decoding="async" className="mx-auto h-[135px] w-full object-contain mix-blend-multiply sm:h-[210px]" />}
              </figure>
              <div className="min-w-0 overflow-hidden">
                <motion.div className="flex" animate={{x:`-${bi===brandIndex?index*100:0}%`}} transition={{duration:reducedMotion?0:0.4,ease:"easeInOut"}}>
                  {item.prices.map((unit,i)=><article key={unit.kw} aria-hidden={bi!==brandIndex||i!==index} className="w-full shrink-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#795F36] sm:text-xs">{item.displayName}</p>
                    <h3 className="mt-2 font-serif text-[25px] leading-none text-[#1D1D1F] sm:text-4xl">{unit.kw.replace(/\s*kW/i," kW")}</h3>
                    <div className="my-3 h-px w-9 bg-[#C8A46A]" />
                    <p className="text-[11px] text-[#6E6E73] sm:text-xs">Supplied &amp; installed</p>
                    <p className="mt-1 whitespace-nowrap font-serif text-[28px] leading-none tracking-tight text-[#1D1D1F] sm:text-5xl">{unit.localOfferPrice || unit.price}</p>
                    <p className="mt-2 text-[10px] text-[#6E6E73] sm:text-xs">Standard installation</p>
                  </article>)}
                </motion.div>
              </div>
            </div>
          </div>)}
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center" aria-label="Choose system capacity">
            {range.prices.map((unit,i)=><button key={unit.kw} type="button" onClick={()=>{setIndex(i);setPaused(true);}} aria-label={`Show ${unit.kw} split system`} aria-current={i===index?"true":undefined} className="flex h-10 w-6 items-center justify-center"><span className={`h-2 rounded-full ${i===index?"w-4 bg-[#956C35]":"w-2 bg-[#D1D1D6]"}`}/></button>)}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {!reducedMotion&&<button type="button" onClick={()=>setPaused(v=>!v)} className="min-h-[44px] px-1 text-xs text-[#6E6E73]">{paused?"Play":"Pause"}</button>}
            <button type="button" onClick={()=>move(-1)} aria-label="Previous split system" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#956C35] bg-white text-[#956C35]"><ArrowLeft className="h-5 w-5"/></button>
            <button type="button" onClick={()=>move(1)} aria-label="Next split system" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#956C35] text-white"><ArrowRight className="h-5 w-5"/></button>
          </div>
        </div>
        <div className="mt-3 border-l-2 border-[#C8A46A] bg-[#F7F5F1] px-4 py-4 sm:px-6">
          <h3 className="font-serif text-xl leading-tight text-[#1D1D1F] sm:text-2xl">Fully installed. What does that mean?</h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#555]">The advertised price includes your air conditioner, standard back-to-back installation, up to 3 metres of refrigeration pipe, an isolator, up to 20 metres of electrical cabling where required, suitable standard mounting, fittings and testing.</p>
          <p className="mt-2 max-w-3xl text-xs leading-relaxed text-[#6E6E73]">Non-standard access, longer runs or electrical upgrades are quoted before work begins. Lifetime installation guarantee. No upfront payment; pay after installation.</p>
        </div>
      </div>
    </section>
  );
}
