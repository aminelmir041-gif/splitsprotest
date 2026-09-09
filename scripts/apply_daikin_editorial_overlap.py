from pathlib import Path
import re

# 1) Use the daytime outdoor Daikin photo in the editorial proof layout.
data_path = Path('src/lib/data.js')
data = data_path.read_text(encoding='utf-8')
old_secondary = '''      secondary: {
        src: IMAGES.installDaikinOutdoorBracket,
        alt: "Daikin outdoor unit installed neatly on a wall bracket by SplitsPro",
      },'''
new_secondary = '''      secondary: {
        src: IMAGES.installDaikinOutdoorClose,
        alt: "Daytime Daikin R32 outdoor unit installation completed by SplitsPro",
      },'''
if old_secondary not in data:
    raise SystemExit('Could not find current Daikin editorial secondary image block')
data = data.replace(old_secondary, new_secondary, 1)
data_path.write_text(data, encoding='utf-8')

# 2) Match the selected #2 editorial-overlap composition.
page_path = Path('src/pages/BrandPage.jsx')
text = page_path.read_text(encoding='utf-8')
pattern = r'''      \{/\* Compact intro \+ range jump tabs \(price-focused, no trust badges chrome\) \*/\}\n      <section className="bg-white py-14 sm:py-20" data-testid="brand-intro">.*?      </section>\n\n      \{/\* Ranges \+ pricing tables \*/\}'''
replacement = '''      {/* Compact intro + range jump tabs (price-focused, no trust badges chrome) */}
      <section className="bg-white py-14 sm:py-20" data-testid="brand-intro">
        <div className="sp-container">
          <div className={brand.installEditorial ? "grid gap-12 lg:grid-cols-[1fr_1.08fr] lg:items-center lg:gap-16" : ""}>
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
            </div>

            {brand.installEditorial && (
              <div
                className="mx-auto grid w-full max-w-[680px] grid-cols-2 gap-3 sm:gap-4 lg:relative lg:block lg:min-h-[520px]"
                data-testid="brand-install-editorial"
              >
                <figure className="col-span-2 overflow-hidden rounded-[24px] lg:absolute lg:right-0 lg:top-0 lg:w-[74%]">
                  <img
                    src={brand.installEditorial.primary.src}
                    alt={brand.installEditorial.primary.alt}
                    loading="eager"
                    data-no-fallback="true"
                    className="aspect-[16/10] w-full object-cover"
                  />
                </figure>

                <div className="col-span-1 flex items-end px-2 pb-3 lg:absolute lg:left-[7%] lg:top-[325px] lg:w-[34%] lg:px-0 lg:pb-0">
                  <div className="max-w-[190px]">
                    <p className="font-serif text-xl italic leading-tight text-[#5F6065] sm:text-2xl">Real installs<br />by SplitsPro</p>
                    <div className="mt-3 h-px w-16 bg-[#C8A46A]" />
                  </div>
                </div>

                <figure className="col-span-1 overflow-hidden rounded-[24px] lg:absolute lg:right-[2%] lg:top-[165px] lg:w-[50%]">
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
page_path.write_text(updated, encoding='utf-8')
