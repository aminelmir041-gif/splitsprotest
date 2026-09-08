from pathlib import Path
import re

# ----- data.js -----
data_path = Path('src/lib/data.js')
data = data_path.read_text(encoding='utf-8')

# Remove the standalone Daikin installProof block.
data = re.sub(
    r'\n    installProof: \[\n(?:.*\n)*?    \],\n(?=    ranges: \[)',
    '\n',
    data,
    count=1,
)

# Add one subtle real-install photo to each Daikin range.
def add_install_photo(block, image_key, alt):
    if 'installPhoto:' in block:
        return block
    anchor = re.search(r'(        image: [^\n]+,\n)', block)
    if not anchor:
        raise SystemExit('Could not find range image anchor')
    insert = anchor.group(1) + f'        installPhoto: {{ src: IMAGES.{image_key}, alt: "{alt}" }},\n'
    return block[:anchor.start()] + insert + block[anchor.end():]

# Work only inside Daikin brand block.
daikin_start = data.find('    slug: "daikin",')
daikin_end = data.find('    slug: "rinnai",')
if daikin_start < 0 or daikin_end < 0:
    raise SystemExit('Could not find Daikin brand block')
block = data[daikin_start:daikin_end]

for slug, key, alt in [
    ('cora', 'installDaikinIndoorStraight', 'Recent Daikin indoor split system installation by SplitsPro'),
    ('alira-x', 'installDaikinOutdoorBracket', 'Recent Daikin outdoor unit wall bracket installation by SplitsPro'),
    ('zena', 'installDaikinIndoorCorner', 'Recent Daikin indoor split system installation by SplitsPro'),
]:
    start = block.find(f'        slug: "{slug}",')
    if start < 0:
        raise SystemExit(f'Could not find Daikin range {slug}')
    # next range or end of Daikin block
    next_pos = block.find('        slug: "', start + 10)
    if next_pos < 0:
        next_pos = len(block)
    rblock = block[start:next_pos]
    rblock2 = add_install_photo(rblock, key, alt)
    block = block[:start] + rblock2 + block[next_pos:]

data = data[:daikin_start] + block + data[daikin_end:]

# Force the five newly added Daikin gallery photos to portrait presentation.
for title in [
    'Daikin Split — Clean Wall Finish',
    'Daikin Outdoor — Wall Bracket',
    'Daikin Split — Corner Installation',
    'Daikin Split — Indoor Installation',
    'Daikin Outdoor — R32 Installation',
]:
    pattern = re.compile(r'(\{ src: [^\n]+, title: "' + re.escape(title) + r'", tag: "[^"]+")([^\n]*\})')
    data, n = pattern.subn(lambda m: m.group(1) + ', portrait: true' + m.group(2), data, count=1)
    if n != 1 and f'title: "{title}"' in data and 'portrait: true' not in data[data.find(f'title: "{title}"'):data.find(f'title: "{title}"')+180]:
        raise SystemExit(f'Could not mark portrait for {title}')

data_path.write_text(data, encoding='utf-8')

# ----- BrandPage.jsx -----
brand_path = Path('src/pages/BrandPage.jsx')
brand = brand_path.read_text(encoding='utf-8')

# Remove the standalone install-proof block.
brand = re.sub(
    r'\n          \{brand\.installProof\?\.length > 0 && \(\n(?:.*\n)*?          \)\}\n(?=        </div>\n      </section>)',
    '\n',
    brand,
    count=1,
)

# Insert a tiny, seamless real-install photo inside each model media column.
if 'data-testid={`range-install-photo-${range.slug}`}' not in brand:
    # For Zena showcase: append photo after two-finish grid.
    zena_anchor = '''                  </div>\n                ) : (\n'''
    zena_add = '''                  </div>\n                  {range.installPhoto && (\n                    <figure className="mt-5 flex flex-col items-center" data-testid={`range-install-photo-${range.slug}`}>\n                      <img\n                        src={range.installPhoto.src}\n                        alt={range.installPhoto.alt}\n                        loading="lazy"\n                        data-no-fallback="true"\n                        className="max-h-[260px] w-auto max-w-full rounded-lg object-contain sm:max-h-[300px]"\n                      />\n                      <figcaption className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A8A8E]">Recent SplitsPro Daikin install</figcaption>\n                    </figure>\n                  )}\n                ) : (\n'''
    if zena_anchor not in brand:
        raise SystemExit('Could not find Zena media anchor')
    brand = brand.replace(zena_anchor, zena_add, 1)

    # Non-Zena: append photo beneath product/gallery imagery, inside same media column.
    nonz_anchor = '''                  </>\n                )}\n              </div>\n            )}\n'''
    nonz_add = '''                  </>\n                )}\n                {range.installPhoto && (\n                  <figure className="mt-4 flex flex-col items-center" data-testid={`range-install-photo-${range.slug}`}>\n                    <img\n                      src={range.installPhoto.src}\n                      alt={range.installPhoto.alt}\n                      loading="lazy"\n                      data-no-fallback="true"\n                      className="max-h-[250px] w-auto max-w-full rounded-lg object-contain sm:max-h-[290px]"\n                    />\n                    <figcaption className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A8A8E]">Recent SplitsPro Daikin install</figcaption>\n                  </figure>\n                )}\n              </div>\n            )}\n'''
    if nonz_anchor not in brand:
        raise SystemExit('Could not find non-Zena media anchor')
    brand = brand.replace(nonz_anchor, nonz_add, 1)

brand_path.write_text(brand, encoding='utf-8')

# ----- Gallery.jsx -----
gallery_path = Path('src/pages/Gallery.jsx')
gallery = gallery_path.read_text(encoding='utf-8')

if ') : g.portrait ? (' not in gallery:
    anchor = '''            ) : (\n              <>\n                <img src={g.src} alt={g.title} loading="lazy" className="img-zoom w-full object-cover" />\n'''
    insert = '''            ) : g.portrait ? (\n              <>\n                <div className="relative aspect-[3/4] w-full overflow-hidden">\n                  <img\n                    src={g.src}\n                    alt={g.title}\n                    loading="lazy"\n                    className="img-zoom h-full w-full object-cover"\n                  />\n                </div>\n                <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">\n                  <span className="font-serif text-lg text-white">{g.title}</span>\n                  <span className="text-xs uppercase tracking-wider text-white/80">{g.tag}</span>\n                </figcaption>\n              </>\n            ) : (\n              <>\n                <img src={g.src} alt={g.title} loading="lazy" className="img-zoom w-full object-cover" />\n'''
    if anchor not in gallery:
        raise SystemExit('Could not find Gallery normal-image anchor')
    gallery = gallery.replace(anchor, insert, 1)

gallery_path.write_text(gallery, encoding='utf-8')
print('Removed standalone Daikin proof section, blended install photos into model media, and fixed portrait gallery presentation')
