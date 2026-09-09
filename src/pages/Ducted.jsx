import { useEffect, useState } from "react";
import { BadgeCheck, ExternalLink, ShieldCheck, Star, Wrench } from "lucide-react";
import HomeComfortPage from "./HomeComfortPage";
import DuctedPricingSelector from "../components/DuctedPricingSelector";
import { getReviews } from "../lib/api";
import { FEATURED_REVIEW, GOOGLE_RATING, IMAGES } from "../lib/data";

const GOOGLE_MAPS_URL = "https://g.page/r/CYTvO1ipeYUtEBM/";
const PREMIUM_VERTICAL_VENT = "https://images.pexels.com/photos/33451939/pexels-photo-33451939.jpeg?cs=srgb&dl=pexels-hngstrm-33451939.jpg&fm=jpg";

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
  {
    icon: Star,
    value: `${GOOGLE_RATING.score}★`,
    label: `${GOOGLE_RATING.count} Google Reviews`,
  },
  {
    icon: ShieldCheck,
    value: "Licensed",
    label: "& Insured",
  },
  {
    icon: BadgeCheck,
    value: "5+ Years",
    label: "Manufacturer Warranty",
  },
  {
    icon: Wrench,
    value: "Backed",
    label: "Workmanship Guarantee",
  },
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

        if (picked.length) setReviews(picked);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="border-b border-[#E7E3DC] bg-white py-10 sm:py-14" data-testid="ducted-top-trust">
      <div className="sp-container">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_FACTORS.map((factor) => (
            <div key={factor.label} className="flex items-center gap-4 rounded-2xl border border-[#E5E5EA] bg-[#FAFAFA] p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F3E9D2] text-[#C8A46A]">
                <factor.icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <span>
                <span className="block font-serif text-xl font-medium text-[#1D1D1F]">{factor.value}</span>
                <span className="mt-0.5 block text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">{factor.label}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 grid overflow-hidden rounded-3xl border border-[#E5E5EA] bg-[#F7F5F1] lg:grid-cols-[0.9fr_1.1fr]">
          <figure className="relative min-h-[310px] overflow-hidden sm:min-h-[390px] lg:min-h-full">
            <img
              src={PREMIUM_VERTICAL_VENT}
              alt="Premium home interior with discreet vertical ducted air conditioning vent"
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 pt-20 text-white sm:p-8">
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#E4CFA6]">Ducted Design Inspiration</span>
              <span className="mt-2 block font-serif text-2xl">Discreet airflow for premium interiors</span>
              <span className="mt-2 block text-xs text-white/75">Design inspiration · not a SplitsPro installation</span>
            </figcaption>
          </figure>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C8A46A]">Google Customer Reviews</p>
                <h2 className="mt-2 font-serif text-3xl font-medium leading-tight text-[#1D1D1F] sm:text-4xl">Trusted before we enter your home</h2>
              </div>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#1D1D1F] transition-colors hover:text-[#C8A46A]"
              >
                View on Google <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-7 grid gap-4">
              {reviews.map((review, i) => {
                const stars = Math.max(1, Math.min(5, Number(review.rating) || 5));
                return (
                  <figure key={review.id || `${review.name}-${i}`} className="rounded-2xl border border-[#E2DED6] bg-white p-5 soft-shadow-sm sm:p-6">
                    <div className="flex items-center gap-1" aria-label={`${stars} star Google review`}>
                      {Array.from({ length: stars }).map((_, star) => (
                        <Star key={star} className="h-4 w-4 fill-[#FBBC04] text-[#FBBC04]" />
                      ))}
                    </div>
                    <blockquote className="mt-3 font-serif text-lg leading-relaxed text-[#1D1D1F] sm:text-xl">&ldquo;{review.text}&rdquo;</blockquote>
                    <figcaption className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                      {review.name} · Verified Google Review
                    </figcaption>
                  </figure>
                );
              })}
            </div>
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
