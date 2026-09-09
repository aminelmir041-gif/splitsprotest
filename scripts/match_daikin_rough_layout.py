from pathlib import Path
import re

path = Path('src/pages/BrandPage.jsx')
text = path.read_text(encoding='utf-8')

pattern = r'''      \{\/\* Compact intro \+ range jump tabs \(price-focused, no trust badges chrome\) \*\/\}\n      <section className="bg-white py-14 sm:py-20" data-testid="brand-intro">.*?      <\/section>\n\n      \{\/\* Ranges \+ pricing tables \*\/\}'''

replacement = '''      {/* Compact intro + range jump tabs (price-focused, no trust badges chrome) */}
      <section className="bg-white py-14 sm:py-20" data-testid="brand-intro">
        <div className="sp-container">
          <div className={brand.installEditorial ? "grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-16" : ""}>
            <div className="lg:pt-20">
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
            </div>

            {brand.installEditorial && (
              <div className="mx-auto grid w-full max-w-[650px] grid-cols-[0.95fr_1.05fr] items-start gap-5 sm:gap-8 lg:-mt-3" data-testid="brand-install-editorial">
                <figure className="mt-3 overflow-hidden rounded-[18px]">
                  <img
                    src={brand.installEditorial.primary.src}
                    alt={brand.installEditorial.primary.alt}
                    loading="eager"
                    data-no-fallback="true"
                    className="aspect-[16/10] w-full object-cover"
                  />
                </figure>

                <figure className="overflow-hidden rounded-[22px]">
                  <img
                    src={brand.installEditorial.secondary.src}
                    alt={brand.installEditorial.secondary.alt}
                    loading="lazy"
                    data-no-fallback="true"
                    className="aspect-[3/4] w-full object-cover"
                  />
                </figure>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Ranges + pricing tables */}'''

updated, n = re.subn(pattern, replacement, text, count=1, flags=re.S)
if n != 1:
    raise SystemExit(f'Could not replace brand intro block; matches={n}')

path.write_text(updated, encoding='utf-8')
