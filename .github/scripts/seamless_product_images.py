from pathlib import Path

# ---- Daikin Zena: only the two actual Zena product images ----
p = Path('src/lib/data.js')
text = p.read_text(encoding='utf-8')
text = text.replace('import zenaRoomUserImage from "./embedded/zenaRoom";\n', '')
text = text.replace('          { src: zenaRoomUserImage, alt: "Daikin Zena Black Wood installed in a modern room" },\n', '')
p.write_text(text, encoding='utf-8')

# ---- Brand product images: clean, borderless, seamless ----
p = Path('src/pages/BrandPage.jsx')
text = p.read_text(encoding='utf-8')
old = '''            {range.image && (\n              <div\n                className="mx-auto w-full max-w-xl lg:mx-0 lg:justify-self-end"\n                data-testid={`range-image-${range.slug}`}\n              >\n                <div className="product-media flex min-h-[270px] items-center justify-center overflow-hidden rounded-2xl border border-[#E5E5EA] bg-white px-5 py-7 soft-shadow-sm sm:min-h-[330px] sm:px-7 lg:min-h-[380px]">\n                  <img\n                    src={range.image}\n                    alt={`${brand.brand} ${range.name} split system air conditioner`}\n                    loading="lazy"\n                    className="block max-h-[330px] w-full object-contain sm:max-h-[390px] lg:max-h-[440px]"\n                  />\n                </div>\n                {range.gallery?.length > 1 && (\n                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3" data-testid={`range-gallery-${range.slug}`}>\n                    {range.gallery.slice(0, 3).map((item, idx) => (\n                      <div key={`${range.slug}-${idx}`} className="product-thumb flex h-24 items-center justify-center overflow-hidden rounded-xl border border-[#E5E5EA] bg-white p-2 sm:h-28">\n                        <img src={item.src} alt={item.alt} loading="lazy" className="h-full w-full object-contain" />\n                      </div>\n                    ))}\n                  </div>\n                )}\n              </div>\n            )}\n'''
new = '''            {range.image && (\n              <div\n                className="mx-auto w-full max-w-2xl lg:mx-0 lg:justify-self-end"\n                data-testid={`range-image-${range.slug}`}\n              >\n                <div className="product-media-seamless flex min-h-[250px] items-center justify-center px-1 py-4 sm:min-h-[320px] lg:min-h-[380px]">\n                  <img\n                    src={range.image}\n                    alt={`${brand.brand} ${range.name} split system air conditioner`}\n                    loading="lazy"\n                    data-no-fallback="true"\n                    onError={(e) => { e.currentTarget.style.display = "none"; }}\n                    className="product-unit-image block max-h-[340px] w-full object-contain sm:max-h-[410px] lg:max-h-[470px]"\n                  />\n                </div>\n                {range.gallery?.length > 1 && (\n                  <div className="mt-1 flex flex-wrap items-center justify-center gap-4 sm:gap-6" data-testid={`range-gallery-${range.slug}`}>\n                    {range.gallery.slice(0, 3).map((item, idx) => (\n                      <div key={`${range.slug}-${idx}`} className="product-thumb-seamless flex h-24 w-[44%] max-w-[190px] items-center justify-center sm:h-28 sm:w-[30%]">\n                        <img\n                          src={item.src}\n                          alt={item.alt}\n                          loading="lazy"\n                          data-no-fallback="true"\n                          onError={(e) => { e.currentTarget.style.display = "none"; }}\n                          className="product-unit-image h-full w-full object-contain"\n                        />\n                      </div>\n                    ))}\n                  </div>\n                )}\n              </div>\n            )}\n'''
if old not in text:
    raise SystemExit('Could not find current BrandPage product media block')
text = text.replace(old, new, 1)
p.write_text(text, encoding='utf-8')

# ---- Do not replace product photos with the SplitsPro logo if an image fails ----
p = Path('src/App.js')
text = p.read_text(encoding='utf-8')
old = '      if (!(img instanceof HTMLImageElement) || img.dataset.fallbackApplied === "true") return;\n'
new = '      if (!(img instanceof HTMLImageElement) || img.dataset.fallbackApplied === "true" || img.dataset.noFallback === "true") return;\n'
if old not in text:
    raise SystemExit('Could not find App image fallback guard')
text = text.replace(old, new, 1)
p.write_text(text, encoding='utf-8')

# ---- CSS: no cards/boxes; blend white product backgrounds into page ----
p = Path('src/index.css')
text = p.read_text(encoding='utf-8')
css = '''\n\n/* Seamless split-system product photography */\n.product-media-seamless,\n.product-thumb-seamless {\n  background: transparent !important;\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n}\n.product-unit-image {\n  mix-blend-mode: multiply;\n  background: transparent !important;\n  filter: none;\n  transition: transform 240ms ease;\n}\n.product-media-seamless:hover .product-unit-image {\n  transform: scale(1.02);\n}\n@media (max-width: 640px) {\n  .product-unit-image {\n    max-width: 100%;\n  }\n}\n'''
if '/* Seamless split-system product photography */' not in text:
    text += css
p.write_text(text, encoding='utf-8')

print('Seamless split-system product image patch applied')
