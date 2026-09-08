from pathlib import Path
import re

# --- Merge the two Mitsubishi brand records into one customer-facing brand page ---
data_path = Path('src/lib/data.js')
data = data_path.read_text(encoding='utf-8')

pattern = re.compile(
    r'  \{\n    slug: "mitsubishi-electric",.*?(?=  \{\n    slug: "fujitsu",)',
    re.S,
)

replacement = '''  {
    slug: "mitsubishi",
    brand: "Mitsubishi",
    label: "Mitsubishi",
    tagline: "Mitsubishi Electric AP Series and Mitsubishi Heavy Industries Ciara Series — compare both in one place.",
    metaTitle: "Mitsubishi Split System Prices & Installation | SplitsPro",
    h1: "Mitsubishi Split System Air Conditioning",
    metaDesc: "Compare Mitsubishi Electric AP Series and Mitsubishi Heavy Industries Ciara split systems, supplied and installed by SplitsPro.",
    body: "For easier comparison, we group the two Mitsubishi air conditioning options on one page. Mitsubishi Electric and Mitsubishi Heavy Industries are separate manufacturers: choose the AP Series for refined ultra-quiet comfort, or the Ciara Series for compact design, smart control and strong clean-air features.",
    image: IMAGES.splitLiving,
    ranges: [
      {
        slug: "electric-ap",
        manufacturer: "Mitsubishi Electric",
        name: "AP Series",
        displayName: "Mitsubishi Electric AP Series",
        tabLabel: "Electric AP",
        blurb: "Premium Mitsubishi Electric comfort designed around exceptionally quiet operation. The AP Series combines Quiet Mode, Night Mode, built-in Wi-Fi on current applicable models and Dual Barrier Coating to help reduce dust and greasy dirt building up inside the unit.",
        features: ["Ultra-Quiet", "Night Mode", "Wi-Fi Control", "Dual Barrier Coating"],
        image: "https://customer-assets-lxgj4vgw.emergentagent.net/job_splitspro-preview/artifacts/gam9w14y_Screenshot_20260817_152036_ChatGPT.jpg",
        prices: [
          { kw: "2.5kW", price: "$1,799" },
          { kw: "3.5kW", price: "$1,999" },
          { kw: "5.0kW", price: "$2,699" },
          { kw: "7.1kW", price: "$3,199" },
        ],
      },
      {
        slug: "heavy-ciara",
        manufacturer: "Mitsubishi Heavy Industries",
        name: "Ciara Series",
        displayName: "Mitsubishi Heavy Industries Ciara Series",
        tabLabel: "Heavy Ciara",
        blurb: "A compact premium split system with smart control and strong clean-air features. Ciara includes built-in Wi-Fi, voice control compatibility, Allergen Clear filtration, Self-Clean Operation, quiet operation and advanced 3D airflow.",
        features: ["Built-In Wi-Fi", "Voice Control", "Allergen Clear", "Self-Cleaning"],
        image: "https://wholesaleaircon.com.au/cdn/shop/files/ciara-indoor_9a2bc94f-50b5-48a5-a76f-dd227a9ce584_1200x.png?v=1719892493",
        prices: [
          { kw: "2.0kW", price: "$1,450" },
          { kw: "2.5kW", price: "$1,590" },
          { kw: "3.3kW", price: "$1,790" },
          { kw: "5.0kW", price: "$2,250" },
          { kw: "6.3kW", price: "$2,590" },
          { kw: "7.1kW", price: "$2,690" },
        ],
      },
    ],
  },
'''

new_data, count = pattern.subn(replacement, data, count=1)
if count != 1:
    raise SystemExit(f'Expected to replace Mitsubishi records once, replaced {count}')
data_path.write_text(new_data, encoding='utf-8')

# --- Main Split Systems page: one Mitsubishi brand/card ---
split_path = Path('src/pages/SplitSystems.jsx')
split = split_path.read_text(encoding='utf-8')
split = split.replace(
    '  "mitsubishi-electric": "Mitsubishi Electric",\n  "mitsubishi-heavy-industries": "Mitsubishi Heavy",',
    '  mitsubishi: "Mitsubishi",',
)
split = split.replace('Mitsubishi Electric, Mitsubishi Heavy Industries', 'Mitsubishi')
split = split.replace('Mitsubishi Electric or Mitsubishi Heavy Industries', 'Mitsubishi')
split_path.write_text(split, encoding='utf-8')

# --- Brand page: support manufacturer/display labels cleanly ---
brand_path = Path('src/pages/BrandPage.jsx')
brand = brand_path.read_text(encoding='utf-8')
brand = brand.replace(
    '  const handleBook = (rangeName, priceRow) => {\n    const sel = { rangeName, kw: priceRow.kw, price: priceRow.price };',
    '  const handleBook = (range, priceRow) => {\n    const sel = { rangeName: range.name, displayName: range.displayName || `${brand.brand} ${range.name}`, kw: priceRow.kw, price: priceRow.price };',
)
brand = brand.replace(
    "    ? `I'd like to book installation for ${brand.brand} ${selected.rangeName} ${selected.kw} — advertised at ${selected.price} supplied & installed.`",
    "    ? `I'd like to book installation for ${selected.displayName} ${selected.kw} — advertised at ${selected.price} supplied & installed.`",
)
brand = brand.replace(
    '  const formKey = selected ? `${brand.slug}-${selected.rangeName}-${selected.kw}` : `${brand.slug}-default`;',
    '  const formKey = selected ? `${brand.slug}-${selected.displayName}-${selected.kw}` : `${brand.slug}-default`;'
)
brand = brand.replace(
    '    ? `Book ${brand.brand} ${selected.rangeName} ${selected.kw}`',
    '    ? `Book ${selected.displayName} ${selected.kw}`',
)
brand = brand.replace('{r.name}\n                </button>', '{r.tabLabel || r.name}\n                </button>')
brand = brand.replace('<span className="overline text-[#C8A46A]">{brand.brand}</span>', '<span className="overline text-[#C8A46A]">{range.manufacturer || brand.brand}</span>')
brand = brand.replace(
    '{brand.brand} {range.name}\n              </h2>',
    '{range.displayName || `${brand.brand} ${range.name}`}\n              </h2>',
)
brand = brand.replace('onClick={() => handleBook(range.name, row)}', 'onClick={() => handleBook(range, row)}')
brand = brand.replace(
    '? `Book your ${brand.brand} ${selected.rangeName} ${selected.kw}`',
    '? `Book your ${selected.displayName} ${selected.kw}`',
)
brand_path.write_text(brand, encoding='utf-8')

# --- Preserve old deep links by redirecting both old Mitsubishi slugs ---
app_path = Path('src/App.js')
app = app_path.read_text(encoding='utf-8')
app = app.replace(
    'import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";',
    'import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";',
)
app = app.replace(
    '          <Route path="/split-systems" element={<SplitSystems />} />\n          <Route path="/split-systems/:slug" element={<BrandPage />} />',
    '          <Route path="/split-systems" element={<SplitSystems />} />\n          <Route path="/split-systems/mitsubishi-electric" element={<Navigate to="/split-systems/mitsubishi" replace />} />\n          <Route path="/split-systems/mitsubishi-heavy-industries" element={<Navigate to="/split-systems/mitsubishi" replace />} />\n          <Route path="/split-systems/:slug" element={<BrandPage />} />',
)
app_path.write_text(app, encoding='utf-8')

print('Combined Mitsubishi Electric AP and Mitsubishi Heavy Industries Ciara under one Mitsubishi brand page')
