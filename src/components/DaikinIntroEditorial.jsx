import { Link } from "react-router-dom";
import { GOOGLE_RATING } from "../lib/data";

export default function DaikinIntroEditorial({ brand, jumpToRange }) {
  const installs = brand.installEditorial;

  return (
    <section className="overflow-hidden bg-white pb-10 pt-4 sm:pb-14 sm:pt-5 lg:pb-16 lg:pt-6" data-testid="brand-intro">
      <div className="sp-container">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-14 xl:gap-20">
          <div className="max-w-[640px] pt-2 lg:pt-10">
            <Link
              to="/split-systems"
              data-testid="brand-back"
              className="inline-flex items-center gap-4 text-[13px] font-semibold uppercase tracking-[0.20em] text-[#C8A46A]"
            >
              <svg viewBox="0 0 54 18" className="h-[18px] w-[54px]" aria-hidden="true">
                <path d="M1 9h42" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M36 3l8 6-8 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Split System Air Conditioning
            </Link>

            <p className="mt-8 max-w-[620px] text-[19px] leading-[1.62] text-[#343842] sm:text-[22px] sm:leading-[1.60] lg:text-[25px] lg:leading-[1.56] xl:text-[28px] xl:leading-[1.54]">
              {brand.body}
            </p>

            {brand.ranges.length > 1 && (
              <div className="mt-9 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4" data-testid="range-tabs">
                {brand.ranges.map((range) => (
                  <button
                    key={range.slug}
                    type="button"
                    onClick={() => jumpToRange(range.slug)}
                    data-testid={`range-tab-${range.slug}`}
                    className="min-w-[118px] rounded-full border border-[#0B0B0B]/20 bg-white px-7 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#15171C] transition-all hover:border-[#C8A46A] hover:text-[#C8A46A] sm:min-w-[150px] sm:px-8 sm:py-3.5 sm:text-[13px]"
                  >
                    {range.tabLabel || range.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {installs && (
            <div className="relative mx-auto w-full max-w-[760px] min-h-[520px] sm:min-h-[610px] lg:min-h-[660px]" data-testid="brand-install-editorial">
              <figure className="absolute right-[7%] top-0 w-[74%] overflow-hidden rounded-[28px] bg-[#F6F5F2] shadow-[0_18px_50px_rgba(11,11,11,0.08)]">
                <img
                  src={installs.primary.src}
                  alt={installs.primary.alt}
                  loading="eager"
                  data-no-fallback="true"
                  className="aspect-[16/9] w-full object-cover object-center"
                />
              </figure>

              <figure className="absolute right-0 top-[30%] z-20 w-[52%] overflow-hidden rounded-[28px] bg-[#F6F5F2] shadow-[0_22px_56px_rgba(11,11,11,0.10)] sm:top-[27%] lg:top-[26%]">
                <img
                  src={installs.secondary.src}
                  alt={installs.secondary.alt}
                  loading="eager"
                  data-no-fallback="true"
                  className="aspect-[3/4] w-full object-cover object-center"
                />
              </figure>

              <div className="absolute left-[2%] top-[55%] z-30 w-[45%] sm:left-[4%] sm:top-[57%] lg:left-[6%] lg:top-[58%]">
                <p className="font-serif text-[22px] italic leading-[1.05] text-[#4E5158] sm:text-[28px] lg:text-[31px]">
                  Real installs<br />by SplitsPro
                </p>
                <svg viewBox="0 0 220 90" className="mt-1 h-[74px] w-[190px] overflow-visible text-[#C8A46A] sm:w-[220px]" aria-hidden="true">
                  <path
                    d="M8 18 C48 58, 112 78, 184 38"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M171 29 L188 37 L179 53"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="absolute bottom-[3%] left-[2%] z-10 max-w-[270px] rounded-[22px] border border-[#E6E1D8] bg-white/95 px-5 py-4 shadow-[0_12px_32px_rgba(11,11,11,0.05)] backdrop-blur-sm sm:left-[4%] sm:px-6 sm:py-5">
                <div className="flex items-center gap-2">
                  <span className="text-[#FBBC04]">★★★★★</span>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#343842]">Google {GOOGLE_RATING.score}</span>
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-[#6A6D73]">{GOOGLE_RATING.count} verified reviews</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
