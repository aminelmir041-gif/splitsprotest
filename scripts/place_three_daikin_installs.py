from pathlib import Path
import re

# Add third editorial image to Daikin data.
data_path = Path('src/lib/data.js')
data = data_path.read_text(encoding='utf-8')
old = '''      secondary: {\n        src: IMAGES.installDaikinOutdoorBracket,\n        alt: "Daikin outdoor unit installed neatly on a wall bracket by SplitsPro",\n      },\n    },'''
new = '''      secondary: {\n        src: IMAGES.installDaikinOutdoorBracket,\n        alt: "Daikin outdoor unit installed neatly on a wall bracket by SplitsPro",\n      },\n      tertiary: {\n        src: IMAGES.installDaikinIndoorCorner,\n        alt: "Daikin indoor split system installed neatly by SplitsPro",\n      },\n    },'''
if old not in data:
    raise SystemExit('Could not find Daikin installEditorial block')
data = data.replace(old, new, 1)
data_path.write_text(data, encoding='utf-8')

# Replace two-image collage with a three-position editorial composition.
brand_path = Path('src/pages/BrandPage.jsx')
brand = brand_path.read_text(encoding='utf-8')
pattern = re.compile(r'''            \{brand\.installEditorial && \(\n              <div className="relative mx-auto w-full max-w-\[520px\] pb-12 sm:pb-16" data-testid="brand-install-editorial">\n(?:.*\n)*?              </div>\n            \)\}''')
replacement = '''            {brand.installEditorial && (\n              <div\n                className="mx-auto grid w-full max-w-[620px] grid-cols-2 gap-3 sm:relative sm:block sm:min-h-[520px]"\n                data-testid="brand-install-editorial"\n              >\n                <figure className="col-span-2 overflow-hidden rounded-[24px] sm:absolute sm:right-0 sm:top-0 sm:w-[72%] soft-shadow-sm">\n                  <img\n                    src={brand.installEditorial.primary.src}\n                    alt={brand.installEditorial.primary.alt}\n                    loading="eager"\n                    data-no-fallback="true"\n                    className="aspect-[4/3] w-full object-cover"\n                  />\n                </figure>\n\n                <figure className="overflow-hidden rounded-[20px] sm:absolute sm:left-0 sm:top-[145px] sm:w-[34%] soft-shadow-sm">\n                  <img\n                    src={brand.installEditorial.secondary.src}\n                    alt={brand.installEditorial.secondary.alt}\n                    loading="lazy"\n                    data-no-fallback="true"\n                    className="aspect-[3/4] w-full object-cover"\n                  />\n                </figure>\n\n                {brand.installEditorial.tertiary && (\n                  <figure className="overflow-hidden rounded-[20px] sm:absolute sm:bottom-0 sm:left-[22%] sm:w-[44%] soft-shadow-sm">\n                    <img\n                      src={brand.installEditorial.tertiary.src}\n                      alt={brand.installEditorial.tertiary.alt}\n                      loading="lazy"\n                      data-no-fallback="true"\n                      className="aspect-[16/10] w-full object-cover"\n                    />\n                  </figure>\n                )}\n\n                <p className="col-span-2 mt-1 flex items-center justify-end gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77777B] sm:absolute sm:bottom-1 sm:right-0 sm:mt-0">\n                  <span className="h-1.5 w-1.5 rounded-full bg-[#C8A46A]" /> Recent Daikin installs by SplitsPro\n                </p>\n              </div>\n            )}'''
brand, n = pattern.subn(replacement, brand, count=1)
if n != 1:
    raise SystemExit('Could not replace Daikin editorial collage')
brand_path.write_text(brand, encoding='utf-8')
print('Placed three Daikin install images in the requested editorial positions')
