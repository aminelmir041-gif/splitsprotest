import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { PageHero, CTASection, GoogleRating } from "../components/sections";
import Reveal from "../components/Reveal";
import { getReviews } from "../lib/api";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews().then(setReviews).catch(() => setReviews([])).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        overline="Google Reviews"
        title="Kind words from local homeowners"
        sub="Real feedback from Western Sydney customers who trusted SplitsPro with their comfort."
      />

      <section className="bg-white py-24 sm:py-32" data-testid="reviews-grid">
        <div className="sp-container">
          <div className="mb-14"><GoogleRating /></div>
          {loading ? (
            <p className="text-[#6E6E73]">Loading reviews…</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r, i) => (
                <Reveal key={r.id} delay={(i % 3) * 0.08}>
                  <figure data-testid={`review-card-${i}`} className="flex h-full flex-col rounded-2xl border border-[#E5E5EA] bg-white p-8 soft-shadow-sm">
                    <span className="inline-flex items-center gap-0.5">
                      {Array.from({ length: r.rating }).map((_, s) => (
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
                        <span className="block text-xs text-[#6E6E73]">Verified Google Review{r.service ? ` · ${r.service}` : ""}</span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
};

export default Reviews;
