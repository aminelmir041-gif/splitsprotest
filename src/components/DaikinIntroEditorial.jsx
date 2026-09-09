import { Link } from "react-router-dom";

export default function DaikinIntroEditorial({ brand, jumpToRange }) {
  const installs = brand.installEditorial;
  const review = installs?.review || (brand.slug === "daikin"
    ? { text: "Best in the business, amazing work.", author: "Mat 134" }
    : null);

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
            <div className="mx-auto w-full max-w-[760px]" data-testid="brand-install-editorial">
              <div className="relative min-h-[430px] sm:min-h-[560px] lg:min-h-[570px]">
                <figure className="absolute right-[5%] top-0 w-[78%] overflow-hidden rounded-[24px] bg-[#F6F5F2] shadow-[0_18px_50px_rgba(11,11,11,0.08)] sm:right-[7%] sm:w-[74%] sm:rounded-[28px]">
                  <img
                    src={installs.primary.src}
                    alt={installs.primary.alt}
                    loading="eager"
                    data-no-fallback="true"
                    className="aspect-[16/9] w-full object-cover object-center"
                  />
                </figure>

                <figure className="absolute right-0 top-[29%] z-20 w-[54%] overflow-hidden rounded-[24px] bg-[#F6F5F2] shadow-[0_22px_56px_rgba(11,11,11,0.10)] sm:top-[27%] sm:w-[52%] sm:rounded-[28px] lg:top-[26%]">
                  <img
                    src={installs.secondary.src}
                    alt={installs.secondary.alt}
                    loading="eager"
                    data-no-fallback="true"
                    className="aspect-[3/4] w-full object-cover object-center"
                  />
                </figure>

                <div className="absolute left-0 top-[53%] z-30 w-[45%] sm:left-[4%] sm:top-[53%] lg:left-[6%] lg:top-[54%]">
                  <p className="font-serif text-[21px] italic leading-[1.08] text-[#4E5158] sm:text-[28px] lg:text-[31px]">
                    Real installs<br />by SplitsPro
                  </p>
                  <svg viewBox="0 0 300 120" className="-mt-1 h-[72px] w-[190px] max-w-full overflow-visible text-[#C8A46A] sm:h-[92px] sm:w-[285px]" aria-hidden="true">
                    <path
                      d="M10 18 C68 72, 154 98, 255 48"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M240 35 L261 47 L251 68"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {review && (
                <blockquote className="relative z-30 mt-4 max-w-[620px] rounded-[20px] border border-[#ECE9E2] bg-white px-5 py-5 shadow-[0_14px_38px_rgba(11,11,11,0.06)] sm:mt-5 sm:px-7 sm:py-6 lg:max-w-[560px]">
                  <div className="text-[14px] tracking-[0.10em] text-[#FBBC04]">★★★★★</div>
                  <p className="mt-2 font-serif text-[18px] italic leading-[1.42] text-[#343842] sm:text-[20px] lg:text-[21px]">
                    “{review.text}”
                  </p>
                  <footer className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7A7D83] sm:text-[11px]">
                    {review.author} · Google Review
                  </footer>
                </blockquote>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
