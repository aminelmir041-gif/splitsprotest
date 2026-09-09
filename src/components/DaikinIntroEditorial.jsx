import { ArrowLeft, ArrowDownRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function DaikinIntroEditorial({ brand, jumpToRange }) {
  const installs = brand.installEditorial;

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24" data-testid="brand-intro">
      <div className="sp-container">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16 xl:gap-20">
          <div className="max-w-[600px]">
            <Link
              to="/split-systems"
              data-testid="brand-back"
              className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#C8A46A] link-line"
            >
              <ArrowLeft className="h-4 w-4" /> Split System Air Conditioning
            </Link>

            <p className="mt-8 max-w-[585px] text-[18px] leading-[1.68] text-[#555861] sm:text-[20px] lg:text-[21px] lg:leading-[1.68]">
              {brand.body}
            </p>

            {brand.ranges.length > 1 && (
              <div className="mt-10 flex flex-wrap items-center gap-3" data-testid="range-tabs">
                {brand.ranges.map((range) => (
                  <button
                    key={range.slug}
                    type="button"
                    onClick={() => jumpToRange(range.slug)}
                    data-testid={`range-tab-${range.slug}`}
                    className="rounded-full border border-[#0B0B0B]/20 bg-white px-7 py-3 text-[12px] font-semibold uppercase tracking-[0.17em] text-[#0B0B0B] transition-all hover:border-[#C8A46A] hover:text-[#C8A46A] sm:px-8 sm:text-[13px]"
                  >
                    {range.tabLabel || range.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {installs && (
            <div className="mx-auto w-full max-w-[670px]" data-testid="brand-install-editorial">
              <div className="grid gap-4 sm:grid-cols-2 lg:relative lg:block lg:min-h-[555px]">
                <figure className="col-span-2 overflow-hidden rounded-[26px] bg-[#F7F6F3] shadow-[0_14px_36px_rgba(11,11,11,0.07)] lg:absolute lg:right-0 lg:top-0 lg:w-[76%]">
                  <img
                    src={installs.primary.src}
                    alt={installs.primary.alt}
                    loading="eager"
                    data-no-fallback="true"
                    className="aspect-[16/9] w-full object-cover object-center"
                  />
                </figure>

                <div className="order-3 flex items-center sm:order-none lg:absolute lg:left-[2%] lg:top-[330px] lg:w-[38%]">
                  <div className="max-w-[200px]">
                    <p className="font-serif text-[22px] italic leading-[1.08] text-[#555861] sm:text-[25px]">
                      Real installs<br />by SplitsPro
                    </p>
                    <ArrowDownRight className="mt-2 ml-20 h-8 w-8 text-[#C8A46A]" strokeWidth={1.4} />
                  </div>
                </div>

                <figure className="overflow-hidden rounded-[24px] bg-[#F7F6F3] shadow-[0_14px_36px_rgba(11,11,11,0.08)] lg:absolute lg:right-[1%] lg:top-[180px] lg:w-[49%]">
                  <img
                    src={installs.secondary.src}
                    alt={installs.secondary.alt}
                    loading="eager"
                    data-no-fallback="true"
                    className="aspect-[3/4] w-full object-cover object-center"
                  />
                </figure>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
