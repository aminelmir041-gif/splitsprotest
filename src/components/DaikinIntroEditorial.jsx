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

              <div className="absolute left-[2%] top-[51%] z-30 w-[46%] sm:left-[4%] sm:top-[53%] lg:left-[6%] lg:top-[54%]">
                <p className="font-serif text-[22px] italic leading-[1.05] text-[#4E5158] sm:text-[28px] lg:text-[31px]">
                  Real installs<br />by SplitsPro
                </p>
                <svg viewBox="0 0 300 120" className="-mt-1 h-[92px] w-[250px] overflow-visible text-[#C8A46A] sm:w-[285px]" aria-hidden="true">
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

              {review && (
                <blockquote className="absolute bottom-[2%] left-[2%] z-10 max-w-[315px] sm:left-[4%] lg:left-[6%]">
                  <div className="text-[14px] tracking-[0.10em] text-[#FBBC04]">★★★★★</div>
                  <p className="mt-2 font-serif text-[20px] italic leading-[1.35] text-[#343842] sm:text-[22px]">
                    “{review.text}”
                  </p>
                  <footer className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A7D83]">
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
