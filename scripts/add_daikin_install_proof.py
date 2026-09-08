from pathlib import Path
import re

# ---- src/lib/data.js ----
data_path = Path('src/lib/data.js')
data = data_path.read_text(encoding='utf-8')

imports = '''import daikinInstallIndoorCorner from "./embedded/daikinInstallIndoorCorner";
import daikinInstallOutdoorBracket from "./embedded/daikinInstallOutdoorBracket";
import daikinInstallIndoorLabel from "./embedded/daikinInstallIndoorLabel";
import daikinInstallOutdoorClose from "./embedded/daikinInstallOutdoorClose";
import daikinInstallIndoorStraight from "./embedded/daikinInstallIndoorStraight";
'''
if 'daikinInstallIndoorStraight' not in data:
    anchor = 'import aliraXAltUserImage from "./embedded/aliraXAlt";\n'
    if anchor not in data:
        raise SystemExit('Could not find embedded image import anchor')
    data = data.replace(anchor, anchor + imports, 1)

image_props = '''  installDaikinIndoorCorner: daikinInstallIndoorCorner,
  installDaikinOutdoorBracket: daikinInstallOutdoorBracket,
  installDaikinIndoorLabel: daikinInstallIndoorLabel,
  installDaikinOutdoorClose: daikinInstallOutdoorClose,
  installDaikinIndoorStraight: daikinInstallIndoorStraight,
'''
if 'installDaikinIndoorStraight:' not in data:
    anchor = '  installDaikinGarage: A + "smto7cvr_IMG-20260811-WA0065.webp",\n'
    if anchor not in data:
        raise SystemExit('Could not find IMAGES anchor')
    data = data.replace(anchor, anchor + image_props, 1)

# Add all five to the main gallery.
if 'Daikin Split — Clean Wall Finish' not in data:
    gallery_anchor = '  { src: IMAGES.installDaikinGarage, title: "Daikin Split — Utility Room", tag: "Split System", rotate: true },\n];'
    gallery_add = '''  { src: IMAGES.installDaikinGarage, title: "Daikin Split — Utility Room", tag: "Split System", rotate: true },
  { src: IMAGES.installDaikinIndoorStraight, title: "Daikin Split — Clean Wall Finish", tag: "Daikin Install" },
  { src: IMAGES.installDaikinOutdoorBracket, title: "Daikin Outdoor — Wall Bracket", tag: "Daikin Install" },
  { src: IMAGES.installDaikinIndoorCorner, title: "Daikin Split — Corner Installation", tag: "Daikin Install" },
  { src: IMAGES.installDaikinIndoorLabel, title: "Daikin Split — Indoor Installation", tag: "Daikin Install" },
  { src: IMAGES.installDaikinOutdoorClose, title: "Daikin Outdoor — R32 Installation", tag: "Daikin Install" },
];'''
    if gallery_anchor not in data:
        raise SystemExit('Could not find gallery anchor')
    data = data.replace(gallery_anchor, gallery_add, 1)

# Add the three strongest photos as Daikin-specific proof.
if 'installProof:' not in data[data.find('slug: "daikin"'):data.find('slug: "rinnai"')]:
    start = data.find('    slug: "daikin",')
    end = data.find('    slug: "rinnai",')
    if start < 0 or end < 0:
        raise SystemExit('Could not locate Daikin brand block')
    block = data[start:end]
    anchor = '    image: IMAGES.splitBedroom,\n'
    proof = '''    image: IMAGES.splitBedroom,
    installProof: [
      { src: IMAGES.installDaikinIndoorStraight, alt: "Real Daikin indoor split system installed by SplitsPro", label: "Clean indoor finish" },
      { src: IMAGES.installDaikinOutdoorBracket, alt: "Real Daikin outdoor condenser installed on a wall bracket by SplitsPro", label: "Outdoor wall-bracket installation" },
      { src: IMAGES.installDaikinIndoorCorner, alt: "Real Daikin indoor unit installed neatly near a ceiling corner by SplitsPro", label: "Neat high-wall installation" },
    ],
'''
    if anchor not in block:
        raise SystemExit('Could not find Daikin image anchor')
    block = block.replace(anchor, proof, 1)
    data = data[:start] + block + data[end:]

data_path.write_text(data, encoding='utf-8')

# ---- src/pages/BrandPage.jsx ----
brand_path = Path('src/pages/BrandPage.jsx')
brand = brand_path.read_text(encoding='utf-8')

if 'data-testid="brand-install-proof"' not in brand:
    anchor = '''          {brand.ranges.length > 1 && (
            <div className="mt-8 flex flex-wrap items-center gap-2" data-testid="range-tabs">
              {brand.ranges.map((r) => (
                <button key={r.slug} onClick={() => jumpToRange(r.slug)} data-testid={`range-tab-${r.slug}`}
                  className="rounded-full border border-[#0B0B0B]/15 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0B0B0B] transition-all hover:border-[#C8A46A] hover:text-[#C8A46A]">
                  {r.tabLabel || r.name}
                </button>
              ))}
            </div>
          )}
'''
    addition = anchor + '''          {brand.installProof?.length > 0 && (
            <div className="mt-10" data-testid="brand-install-proof">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A46A]">Real SplitsPro Installations</span>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6E6E73]">
                    Actual Daikin systems installed by SplitsPro — clean indoor positioning, tidy outdoor mounting and a finished result you can see before you book.
                  </p>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A8A8E]">Our work, not stock photos</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {brand.installProof.map((photo, i) => (
                  <figure key={photo.src} className="min-w-0">
                    <div className="overflow-hidden rounded-xl bg-[#F5F5F7]">
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        loading={i === 0 ? "eager" : "lazy"}
                        data-no-fallback="true"
                        className="h-56 w-full object-cover sm:h-48 lg:h-56"
                      />
                    </div>
                    <figcaption className="mt-2 text-[11px] font-medium text-[#6E6E73]">{photo.label}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}
'''
    if anchor not in brand:
        raise SystemExit('Could not find brand intro range-tabs anchor')
    brand = brand.replace(anchor, addition, 1)

brand_path.write_text(brand, encoding='utf-8')
print('Added five Daikin gallery photos and three seamless Daikin installation proof photos')
