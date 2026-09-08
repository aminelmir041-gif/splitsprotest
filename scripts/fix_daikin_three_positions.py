from pathlib import Path
import re

path = Path('src/pages/BrandPage.jsx')
text = path.read_text(encoding='utf-8')

old = r'''      \{\/\* Compact intro \+ range jump tabs \(price-focused, no trust badges chrome\) \*\/\}\n      <section className="bg-white py-14 sm:py-20" data-testid="brand-intro">.*?      <\/section>\n\n      \{\/\* Ranges \+ pricing tables \*\/\}'''

new = '''      {/* Compact intro + range jump tabs (price-focused, no trust badges chrome) */}
      <section className="bg-white py-14 sm:py-20" data-testid="brand-intro">
        <div className="sp-container">
          <div className={brand.installEditorial ? "grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-start lg:gap-14" : ""}>
            <div>
              <Link to="/split-systems" data-testid="brand-back" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#C8A46A] link-line">
                <ArrowLeft className="h-4 w-4" /> Split System Air Conditioning
              </Link>
              <div className="mt-5 max-w-3xl">
                <p className="leading-relaxed text-[#6E6E73]">{brand.body}</p>
              </div>
              {brand.ranges.length > 1 && (
                <div className="mt-8 flex flex-wrap items-center gap-2" data-testid="range-tabs">
                  {brand.ranges.map((r) => (
                    <button key={r.slug} onClick={() => jumpToRange(r.slug)} data-testid={`range-tab-${r.slug}`}
                      className="rounded-full border border-[#0B0B0B]/15 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0B0B0B] transition-all hover:border-[#C8A46A] hover:text-[#C8A46A]">
                      {r.tabLabel || r.name}
                    </button>
                  ))}
                </div>
              )}

              {brand.installEditorial?.tertiary && (
                <figure className="mt-8 w-full max-w-[360px] overflow-hidden rounded-[18px]" data-testid="brand-install-tertiary">
                  <img
                    src={brand.installEditorial.tertiary.src}
                    alt={brand.installEditorial.tertiary.alt}
                    loading="lazy"
                    data-no-fallback="true"
                    className="aspect-[16/9] w-full object-cover"
                  />
                </figure>
              )}
            </div>

            {brand.installEditorial && (
              <div className="relative mx-auto w-full max-w-[560px] pb-16 pt-1 sm:min-h-[430px]" data-testid="brand-install-editorial">
                <figure className="ml-auto w-[82%] overflow-hidden rounded-[22px]">
                  <img
                    src={brand.installEditorial.primary.src}
                    alt={brand.installEditorial.primary.alt}
                    loading="eager"
                    data-no-fallback="true"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </figure>

                <figure className="absolute bottom-[44px] left-0 w-[38%] overflow-hidden rounded-[18px]">
                  <img
                    src={brand.installEditorial.secondary.src}
                    alt={brand.installEditorial.secondary.alt}
                    loading="lazy"
                    data-no-fallback="true"
                    className="aspect-[3/4] w-full object-cover"
                  />
                </figure>

                <p className="absolute bottom-2 right-0 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77777B]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C8A46A]" /> Recent Daikin installs by SplitsPro
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Ranges + pricing tables */}'''

updated, n = re.subn(old, new, text, count=1, flags=re.S)
if n != 1:
    raise SystemExit(f'Could not replace brand intro block; matches={n}')

path.write_text(updated, encoding='utf-8')
