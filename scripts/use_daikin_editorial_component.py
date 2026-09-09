from pathlib import Path
import re

path = Path('src/pages/BrandPage.jsx')
text = path.read_text(encoding='utf-8')

import_line = 'import DaikinIntroEditorial from "../components/DaikinIntroEditorial";\n'
if import_line not in text:
    anchor = 'import QuoteForm from "../components/QuoteForm";\n'
    if anchor not in text:
        raise SystemExit('QuoteForm import anchor not found')
    text = text.replace(anchor, anchor + import_line, 1)

pattern = r'''      \{/\* Compact intro \+ range jump tabs \(price-focused, no trust badges chrome\) \*/\}\n      <section className="bg-white py-14 sm:py-20" data-testid="brand-intro">.*?      </section>\n\n      \{/\* Ranges \+ pricing tables \*/\}'''
replacement = '''      {/* Brand intro */}
      {brand.slug === "daikin" ? (
        <DaikinIntroEditorial brand={brand} jumpToRange={jumpToRange} />
      ) : (
        <section className="bg-white py-14 sm:py-20" data-testid="brand-intro">
          <div className="sp-container">
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
        </section>
      )}

      {/* Ranges + pricing tables */}'''
updated, n = re.subn(pattern, replacement, text, count=1, flags=re.S)
if n != 1:
    raise SystemExit(f'Could not replace intro block, matches={n}')

path.write_text(updated, encoding='utf-8')
