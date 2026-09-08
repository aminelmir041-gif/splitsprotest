from pathlib import Path


def replace_once(text, old, new, label):
    if new in text:
        return text
    if old not in text:
        raise SystemExit(f"Could not find {label}")
    return text.replace(old, new, 1)

# --- src/lib/data.js: use user-supplied Daikin images ---
p = Path("src/lib/data.js")
text = p.read_text(encoding="utf-8")
imports = '''import coraUserImage from "./embedded/cora";\nimport aliraXUserImage from "./embedded/aliraX";\nimport aliraXAltUserImage from "./embedded/aliraXAlt";\nimport zenaBlackUserImage from "./embedded/zenaBlack";\nimport zenaStreamerUserImage from "./embedded/zenaStreamer";\n'''
anchor = '} from "lucide-react";\n'
if 'import coraUserImage from "./embedded/cora";' not in text:
    text = text.replace(anchor, anchor + imports, 1)

text = replace_once(
    text,
    '        image: `${PUBLIC}/products/daikin-cora.png`,\n',
    '        image: coraUserImage,\n        gallery: [\n          { src: coraUserImage, alt: "Daikin Cora indoor unit" },\n        ],\n',
    "Cora image",
)
text = replace_once(
    text,
    '        image: "https://www.daikin.co.nz/cdn/shop/files/Alira_FTXM46WVMA_IDU_28c296f1-f9a4-434f-bcb4-b90d51c02a1c.png?v=1703027226",\n',
    '        image: aliraXUserImage,\n        gallery: [\n          { src: aliraXUserImage, alt: "Daikin Alira X indoor unit" },\n          { src: aliraXAltUserImage, alt: "Daikin Alira X front view" },\n        ],\n',
    "Alira X image",
)
text = replace_once(
    text,
    '        image: `${PUBLIC}/products/daikin-zena.jpg`,\n',
    '        image: zenaBlackUserImage,\n        gallery: [\n          { src: zenaBlackUserImage, alt: "Daikin Zena Black Wood indoor unit" },\n          { src: zenaStreamerUserImage, alt: "Daikin Zena White Hair Line with Streamer" },\n          { src: IMAGES.splitBedroom, alt: "Daikin Zena installed in a room" },\n        ],\n',
    "Zena image",
)
p.write_text(text, encoding="utf-8")

# --- Brand page: make model images much larger and add compact image gallery ---
p = Path("src/pages/BrandPage.jsx")
text = p.read_text(encoding="utf-8")
old_media = '''            {range.image && (\n              <div\n                className="mx-auto w-full max-w-sm lg:mx-0 lg:justify-self-end"\n                data-testid={`range-image-${range.slug}`}\n              >\n                {/* Product media is intentionally image-only. No video blocks on brand/range pages. */}\n                <div className="flex min-h-[190px] items-center justify-center bg-white px-4 py-6">\n                  <img\n                    src={range.image}\n                    alt={`${brand.brand} ${range.name} split system air conditioner`}\n                    loading="lazy"\n                    className="block max-h-[230px] w-full object-contain"\n                  />\n                </div>\n              </div>\n            )}\n'''
new_media = '''            {range.image && (\n              <div\n                className="mx-auto w-full max-w-xl lg:mx-0 lg:justify-self-end"\n                data-testid={`range-image-${range.slug}`}\n              >\n                <div className="product-media flex min-h-[270px] items-center justify-center overflow-hidden rounded-2xl border border-[#E5E5EA] bg-white px-5 py-7 soft-shadow-sm sm:min-h-[330px] sm:px-7 lg:min-h-[380px]">\n                  <img\n                    src={range.image}\n                    alt={`${brand.brand} ${range.name} split system air conditioner`}\n                    loading="lazy"\n                    className="block max-h-[330px] w-full object-contain sm:max-h-[390px] lg:max-h-[440px]"\n                  />\n                </div>\n                {range.gallery?.length > 1 && (\n                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3" data-testid={`range-gallery-${range.slug}`}>\n                    {range.gallery.slice(0, 3).map((item, idx) => (\n                      <div key={`${range.slug}-${idx}`} className="product-thumb flex h-24 items-center justify-center overflow-hidden rounded-xl border border-[#E5E5EA] bg-white p-2 sm:h-28">\n                        <img src={item.src} alt={item.alt} loading="lazy" className="h-full w-full object-contain" />\n                      </div>\n                    ))}\n                  </div>\n                )}\n              </div>\n            )}\n'''
text = replace_once(text, old_media, new_media, "Brand product media")
p.write_text(text, encoding="utf-8")

# --- Global image fallback on every React page ---
p = Path("src/App.js")
text = p.read_text(encoding="utf-8")
if 'import { LOGO } from "@/lib/data";' not in text:
    text = text.replace('import PageLoader from "@/components/PageLoader";\n', 'import PageLoader from "@/components/PageLoader";\nimport { LOGO } from "@/lib/data";\n', 1)
old_app = '''function App() {\n  const basename = window.location.hostname.endsWith("github.io") ? "/splitsprotest" : "/";\n\n  return (\n'''
new_app = '''function App() {\n  const basename = window.location.hostname.endsWith("github.io") ? "/splitsprotest" : "/";\n\n  useEffect(() => {\n    const handleImageError = (event) => {\n      const img = event.target;\n      if (!(img instanceof HTMLImageElement) || img.dataset.fallbackApplied === "true") return;\n      img.dataset.fallbackApplied = "true";\n      img.src = LOGO;\n      img.classList.add("site-image-fallback");\n    };\n    document.addEventListener("error", handleImageError, true);\n    return () => document.removeEventListener("error", handleImageError, true);\n  }, []);\n\n  return (\n'''
text = replace_once(text, old_app, new_app, "App image fallback")
p.write_text(text, encoding="utf-8")

# --- Gallery: keep rotation on wrapper so hover zoom cannot flip orientation ---
p = Path("src/pages/Gallery.jsx")
text = p.read_text(encoding="utf-8")
old_rotated = '''                <div className="relative aspect-square w-full overflow-hidden">\n                  <img\n                    src={g.src}\n                    alt={g.title}\n                    loading="lazy"\n                    data-testid={`gallery-img-rotated-${i}`}\n                    className="img-zoom absolute inset-0 h-full w-full rotate-90 object-cover"\n                  />\n                </div>\n'''
new_rotated = '''                <div className="relative aspect-square w-full overflow-hidden">\n                  <div className="absolute inset-0 rotate-90">\n                    <img\n                      src={g.src}\n                      alt={g.title}\n                      loading="lazy"\n                      data-testid={`gallery-img-rotated-${i}`}\n                      className="img-zoom h-full w-full object-cover"\n                    />\n                  </div>\n                </div>\n'''
text = replace_once(text, old_rotated, new_rotated, "Gallery rotation")
p.write_text(text, encoding="utf-8")

# --- CSS polish for all images ---
p = Path("src/index.css")
text = p.read_text(encoding="utf-8")
css = '''\n\n/* Site-wide image resilience and product media polish */\nimg {\n  max-width: 100%;\n}\n.site-image-fallback {\n  object-fit: contain !important;\n  background: #fff !important;\n  padding: 1rem !important;\n}\n.product-media {\n  background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);\n}\n.product-media img,\n.product-thumb img {\n  transition: transform 260ms ease, opacity 260ms ease;\n}\n.product-media:hover img {\n  transform: scale(1.025);\n}\n@media (max-width: 640px) {\n  .product-media {\n    border-radius: 16px;\n  }\n}\n'''
if '/* Site-wide image resilience and product media polish */' not in text:
    text += css
p.write_text(text, encoding="utf-8")

# --- Root static homepage: same broken-image safety net ---
p = Path("index.html")
text = p.read_text(encoding="utf-8")
script = '''\n<script id="splitspro-image-fallback">\ndocument.addEventListener('error', function(event) {\n  var img = event.target;\n  if (!img || img.tagName !== 'IMG' || img.dataset.fallbackApplied === 'true') return;\n  img.dataset.fallbackApplied = 'true';\n  var base = location.hostname.endsWith('github.io') ? '/splitsprotest' : '';\n  img.src = base + '/logo.png';\n  img.style.objectFit = 'contain';\n  img.style.background = '#fff';\n}, true);\n</script>\n'''
if 'id="splitspro-image-fallback"' not in text:
    if '</body>' not in text:
        raise SystemExit('Could not find </body> in index.html')
    text = text.replace('</body>', script + '</body>', 1)
p.write_text(text, encoding="utf-8")

print("Image upgrade applied")
