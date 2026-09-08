from pathlib import Path
from io import BytesIO
import base64
import re
from PIL import Image

# 1) Correct the three images whose original JPEGs relied on EXIF orientation=6.
# The EXIF metadata was lost when they were embedded as WebP, leaving the pixels sideways.
def rotate_embedded_webp(path_str):
    path = Path(path_str)
    text = path.read_text(encoding="utf-8")
    match = re.search(r'data:image/webp;base64,([^\"]+)', text)
    if not match:
        raise SystemExit(f"Could not decode embedded image in {path}")

    raw = base64.b64decode(match.group(1))
    image = Image.open(BytesIO(raw)).convert("RGB")

    # These three source files are landscape only because EXIF orientation was stripped.
    # Rotate 90 degrees clockwise once. If this script is ever re-run, portrait files are left alone.
    if image.width > image.height:
        image = image.transpose(Image.Transpose.ROTATE_270)

    # Keep enough detail for the gallery while avoiding huge JS bundles.
    if max(image.size) > 1000:
        image.thumbnail((1000, 1000), Image.Resampling.LANCZOS)

    out = BytesIO()
    image.save(out, format="WEBP", quality=76, method=6)
    encoded = base64.b64encode(out.getvalue()).decode("ascii")
    path.write_text(
        f'const image = "data:image/webp;base64,{encoded}";\nexport default image;\n',
        encoding="utf-8",
    )

for embedded in [
    "src/lib/embedded/daikinInstallIndoorCorner.js",
    "src/lib/embedded/daikinInstallOutdoorBracket.js",
    "src/lib/embedded/daikinInstallIndoorLabel.js",
]:
    rotate_embedded_webp(embedded)

# 2) Data: keep all five photos in Gallery, remove the forced portrait/crop hack,
# remove model-by-model install photos, and give Daikin one tasteful editorial pair.
data_path = Path("src/lib/data.js")
data = data_path.read_text(encoding="utf-8")

daikin_start = data.find('    slug: "daikin",')
daikin_end = data.find('    slug: "rinnai",')
if daikin_start < 0 or daikin_end < 0:
    raise SystemExit("Could not find Daikin brand block")

daikin = data[daikin_start:daikin_end]

daikin = re.sub(r'\n\s*installPhoto: \{[^\n]+\},', '', daikin)

if "installEditorial:" not in daikin:
    anchor = '    image: IMAGES.splitBedroom,\n'
    editorial = '''    image: IMAGES.splitBedroom,\n    installEditorial: {\n      primary: {\n        src: IMAGES.installDaikinIndoorStraight,\n        alt: "Clean Daikin split system installation completed by SplitsPro",\n      },\n      secondary: {\n        src: IMAGES.installDaikinOutdoorBracket,\n        alt: "Daikin outdoor unit installed neatly on a wall bracket by SplitsPro",\n      },\n    },\n'''
    if anchor not in daikin:
        raise SystemExit("Could not find Daikin brand image anchor")
    daikin = daikin.replace(anchor, editorial, 1)

data = data[:daikin_start] + daikin + data[daikin_end:]

# Let corrected images display in their natural orientation in the masonry gallery.
data = data.replace(', portrait: true', '')

data_path.write_text(data, encoding="utf-8")

# 3) Brand page: remove the awkward per-model install photo and weave the proof imagery
# into the existing intro as an editorial image pair, not a separate sales section.
brand_path = Path("src/pages/BrandPage.jsx")
brand = brand_path.read_text(encoding="utf-8")

brand = re.sub(
    r'''\n\s*\{range\.installPhoto && \(\n\s*<figure[^>]*data-testid=\{`range-install-photo-\$\{range\.slug\}`\}[^>]*>.*?</figure>\n\s*\)\}''',
    '',
    brand,
    flags=re.S,
)

intro_pattern = re.compile(
    r'''      /\*\* Compact intro \+ range jump tabs \(price-focused, no trust badges chrome\) \*/\n'''
    r'''      <section className="bg-white py-14 sm:py-20" data-testid="brand-intro">.*?      </section>\n\n'''
    r'''      /\*\* Ranges \+ pricing tables \*/''',
    flags=re.S,
)

# The comments in this file use JSX comment braces, so match the actual current text if needed.
if not intro_pattern.search(brand):
    intro_pattern = re.compile(
        r'''      \{\/\* Compact intro \+ range jump tabs \(price-focused, no trust badges chrome\) \*\/\}\n'''
        r'''      <section className="bg-white py-14 sm:py-20" data-testid="brand-intro">.*?      </section>\n\n'''
        r'''      \{\/\* Ranges \+ pricing tables \*\/\}''',
        flags=re.S,
    )

new_intro = '''      {/* Compact intro + range jump tabs (price-focused, no trust badges chrome) */}\n      <section className="bg-white py-14 sm:py-20" data-testid="brand-intro">\n        <div className="sp-container">\n          <div className={brand.installEditorial ? "grid gap-12 lg:grid-cols-[1fr_.82fr] lg:items-center lg:gap-16" : ""}>\n            <div>\n              <Link to="/split-systems" data-testid="brand-back" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#C8A46A] link-line">\n                <ArrowLeft className="h-4 w-4" /> Split System Air Conditioning\n              </Link>\n              <div className="mt-5 max-w-3xl">\n                <p className="leading-relaxed text-[#6E6E73]">{brand.body}</p>\n              </div>\n              {brand.ranges.length > 1 && (\n                <div className="mt-8 flex flex-wrap items-center gap-2" data-testid="range-tabs">\n                  {brand.ranges.map((r) => (\n                    <button key={r.slug} onClick={() => jumpToRange(r.slug)} data-testid={`range-tab-${r.slug}`}\n                      className="rounded-full border border-[#0B0B0B]/15 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0B0B0B] transition-all hover:border-[#C8A46A] hover:text-[#C8A46A]">\n                      {r.tabLabel || r.name}\n                    </button>\n                  ))}\n                </div>\n              )}\n            </div>\n\n            {brand.installEditorial && (\n              <div className="relative mx-auto w-full max-w-[520px] pb-12 sm:pb-16" data-testid="brand-install-editorial">\n                <figure className="ml-auto w-[82%] overflow-hidden rounded-[24px]">\n                  <img\n                    src={brand.installEditorial.primary.src}\n                    alt={brand.installEditorial.primary.alt}\n                    loading="eager"\n                    data-no-fallback="true"\n                    className="aspect-[4/3] w-full object-cover"\n                  />\n                </figure>\n                <figure className="absolute bottom-0 left-0 w-[38%] overflow-hidden rounded-[18px]">\n                  <img\n                    src={brand.installEditorial.secondary.src}\n                    alt={brand.installEditorial.secondary.alt}\n                    loading="lazy"\n                    data-no-fallback="true"\n                    className="aspect-[3/4] w-full object-cover"\n                  />\n                </figure>\n                <p className="absolute bottom-2 right-0 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77777B]">\n                  <span className="h-1.5 w-1.5 rounded-full bg-[#C8A46A]" /> Recent Daikin installs by SplitsPro\n                </p>\n              </div>\n            )}\n          </div>\n        </div>\n      </section>\n\n      {/* Ranges + pricing tables */}'''

if not intro_pattern.search(brand):
    raise SystemExit("Could not find current brand intro section")
brand = intro_pattern.sub(new_intro, brand, count=1)

brand_path.write_text(brand, encoding="utf-8")

print("Corrected EXIF orientation and restyled Daikin install proof as an editorial intro collage")
