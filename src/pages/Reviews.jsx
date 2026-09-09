import { useEffect, useState } from "react";
import { BadgeCheck, ExternalLink, ShieldCheck, Star, Wrench } from "lucide-react";
import { PageHero, CTASection, GoogleRating } from "../components/sections";
import Reveal from "../components/Reveal";
import { getReviews } from "../lib/api";
import { FEATURED_REVIEW, GOOGLE_RATING } from "../lib/data";

const GOOGLE_MAPS_URL = "https://g.page/r/CYTvO1ipeYUtEBM/";

const FALLBACK_REVIEWS = [
  { id: "sia", ...FEATURED_REVIEW },
  {
    id: "gill-mcphee",
    name: "Gill McPhee",
    rating: 5,
    service: "Rinnai Installation",
    text: "Excellent installers. They work very well as a team. Heatwave arrives tomorrow, 34 degrees, and we have cooling! So happy.",
  },
  {
    id: "mat-134",
    name: "Mat 134",
    rating: 5,
    service: "Air Conditioning Installation",
    text: "Best in the business, amazing work.",
  },
];

const TRUST_FACTORS = [
  {
    icon: Star,
    value: GOOGLE_RATING.score,
    label: "Google Rating",
    detail: "Live SplitsPro Google rating",
  },
  {
    icon: BadgeCheck,
    value: GOOGLE_RATING.count,
    label: "Verified Reviews",
    detail: "Google customer reviews",
  },
  {
    icon: ShieldCheck,
    value: "Licensed",
    label: "& Insured",
    detail: "Professional installation peace of mind",
  },
  {
    icon: Wrench,
    value: "Backed",
    label: "Workmanship Guarantee",
    detail: "SplitsPro installation workmanship",
  },
];

const Reviews = () => {
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews()
      .then((items) => setReviews(Array.isArray(items) && items.length ? items : FALLBACK_REVIEWS))
      .catch(() => setReviews(FALLBACK_REVIEWS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        overline="Google Reviews"
        title="Kind words from local homeowners"
        sub="Real feedback and clear trust signals from customers who chose SplitsPro for their home comfort."
      />

      <section className="border-b border-[#E8E6E1] bg-[#F5F5F7] py-16 sm:py-20" data-testid="reviews-trust-proof">
        <div className="sp-container">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <GoogleRating />
              <h2 className="mt-5 max-w-2xl font-serif text-3xl font-medium leading-tight text-[#1D1D1F] sm:text-4xl">
                Trusted locally. Backed by real customer feedback.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6E6E73] sm:text-base">
                New systems include a minimum 5-year manufacturer warranty, with SplitsPro workmanship support and a fixed written quote before installation.
              </p>
            </div>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#1D1D1F] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#C8A46A] sm:w-auto"
              data-testid="google-reviews-link"
            >
              View SplitsPro On Google <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_FACTORS.map((factor) => (
              <div key={factor.label} className="rounded-2xl border border-[#E0DDD7] bg-white p-5 soft-shadow-sm sm:p-6">
                <factor.icon className="h-5 w-5 text-[#C8A46A]" strokeWidth={1.9} />
                <div className="mt-4 font-serif text-3xl font-medium text-[#1D1D1F]">{factor.value}</div>
                <div className="mt-1 text-sm font-semibold text-[#1D1D1F]">{factor.label}</div>
                <p className="mt-2 text-xs leading-relaxed text-[#6E6E73]">{factor.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32" data-testid="reviews-grid">
        <div className="sp-container">
          <div className="mb-12 max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C8A46A]">Customer Feedback</p>
            <h2 className="mt-3 font-serif text-3xl font-medium text-[#1D1D1F] sm:text-4xl">What homeowners say about SplitsPro</h2>
            {loading && <p className="mt-3 text-sm text-[#6E6E73]">Checking for the latest review feed…</p>}
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r, i) => {
              const starCount = Math.max(1, Math.min(5, Number(r.rating) || 5));
              return (
                <Reveal key={r.id || `${r.name}-${i}`} delay={(i % 3) * 0.08}>
                  <figure data-testid={`review-card-${i}`} className="flex h-full flex-col rounded-2xl border border-[#E5E5EA] bg-white p-8 soft-shadow-sm">
                    <span className="inline-flex items-center gap-0.5">
                      {Array.from({ length: starCount }).map((_, s) => (
                        <Star key={s} className="h-4 w-4 fill-[#FBBC04] text-[#FBBC04]" />
                      ))}
                    </span>
                    <blockquote className="mt-5 flex-1 text-base leading-relaxed text-[#1D1D1F]">&ldquo;{r.text}&rdquo;</blockquote>
                    <figcaption className="mt-6 flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F3E9D2] font-serif text-lg font-medium text-[#C8A46A]">
                        {r.name?.trim()?.charAt(0)?.toUpperCase() || "S"}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-[#1D1D1F]">{r.name}</span>
                        <span className="block text-xs text-[#6E6E73]">Google Review{r.service ? ` · ${r.service}` : ""}</span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
};

export default Reviews;
