import { useEffect, useState } from "react";
import { BadgeCheck, ExternalLink, ShieldCheck, Star, Wrench } from "lucide-react";
import HomeComfortPage from "./HomeComfortPage";
import DuctedPricingSelector from "../components/DuctedPricingSelector";
import { getReviews } from "../lib/api";
import { FEATURED_REVIEW, GOOGLE_RATING, IMAGES } from "../lib/data";

const GOOGLE_MAPS_URL = "https://g.page/r/CYTvO1ipeYUtEBM/";

const FALLBACK_GOOGLE_REVIEWS = [
  FEATURED_REVIEW,
  {
    id: "gill-mcphee-ducted-top",
    name: "Gill McPhee",
    rating: 5,
    service: "Air Conditioning Installation",
    text: "Excellent installers. They work very well as a team. Heatwave arrives tomorrow, 34 degrees, and we have cooling! So happy.",
  },
  {
    id: "mat-134-ducted-top",
    name: "Mat 134",
    rating: 5,
    service: "Air Conditioning Installation",
    text: "Best in the business, amazing work.",
  },
];

const TRUST_FACTORS = [
  { icon: Star, value: `${GOOGLE_RATING.score}★`, label: `${GOOGLE_RATING.count} Google Reviews` },
  { icon: ShieldCheck, value: "Licensed", label: "& Insured" },
  { icon: BadgeCheck, value: "5+ Years", label: "Manufacturer Warranty" },
  { icon: Wrench, value: "Backed", label: "Workmanship Guarantee" },
];

const DuctedTopTrust = () => {
  const [reviews, setReviews] = useState(FALLBACK_GOOGLE_REVIEWS.slice(0, 3));

  useEffect(() => {
    getReviews()
      .then((items) => {
        if (!Array.isArray(items) || !items.length) return;
        const valid = items.filter((r) => r?.text && (Number(r.rating) || 0) >= 4);
        const ducted = valid.filter((r) => r.category === "ducted");
        const other = valid.filter((r) => r.category !== "ducted");
        const picked = [...ducted, ...other].slice(0, 3);
        if (picked.length === 3) setReviews(picked);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="border-b border-[#E5E5EA] bg-white py-7 sm:py-9" data-testid="ducted-top-trust">
      <div className="sp-container">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-[#ECEAE6] py-3.5 sm:justify-between">
          {TRUST_FACTORS.map((factor) => (
            <div key={factor.label} className="flex items-center gap-2.5">
              <factor.icon className="h-4 w-4 shrink-0 text-[#C8A46A]" strokeWidth={2} />
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-semibold text-[#1D1D1F]">{factor.value}</span>
                <span className="text-xs text-[#6E6E73]">{factor.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C8A46A]">Google Reviews</p>
              <h2 className="mt-1.5 font-serif text-2xl font-medium leading-tight text-[#1D1D1F] sm:text-3xl">Trusted by local homeowners</h2>
            </div>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6E6E73] transition-colors hover:text-[#C8A46A]"
            >
              View on Google <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {reviews.slice(0, 3).map((review, i) => {
              const stars = Math.max(1, Math.min(5, Number(review.rating) || 5));
              return (
                <figure key={review.id || `${review.name}-${i}`} className="border-t border-[#E5E5EA] pt-3 md:border-l md:border-t-0 md:pl-4 md:pt-0 first:md:border-l-0 first:md:pl-0">
                  <div className="flex items-center gap-0.5" aria-label={`${stars} star Google review`}>
                    {Array.from({ length: stars }).map((_, star) => (
                      <Star key={star} className="h-3.5 w-3.5 fill-[#FBBC04] text-[#FBBC04]" />
                    ))}
                  </div>
                  <blockquote className="mt-2 text-sm leading-relaxed text-[#1D1D1F]">&ldquo;{review.text}&rdquo;</blockquote>
                  <figcaption className="mt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                    {review.name} · Google Review
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const Ducted = () => (
  <HomeComfortPage
    slug="ducted"
    overline="Ducted Air Conditioning"
    title="Whole-home comfort, elegantly hidden"
    sub="Zoned ducted air conditioning concealed within your ceiling — seamless comfort with discreet vents and intelligent control."
    image={IMAGES.controller}
    introImage={IMAGES.controller}
    imgPos="object-center"
    afterHero={(
      <>
        <DuctedTopTrust />
        <DuctedPricingSelector />
      </>
    )}
    intro={{
      heading: "Designed around your home, not the other way around",
      body: "Ducted systems reward careful planning. We map zones to how you live, plan ceiling access to minimise disruption and integrate discreet vents and intuitive controls throughout your home. The result is even, effortless comfort at the touch of a controller.",
    }}
    features={[
      "Custom zoning for room-by-room control",
      "Discreet ductwork and designer vents",
      "Intuitive wall controllers",
      "Ideal for new builds and established homes",
      "Energy-efficient inverter technology",
      "Commercial ducted solutions available",
    ]}
  />
);

export default Ducted;
