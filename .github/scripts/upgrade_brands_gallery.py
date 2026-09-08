from pathlib import Path
import re

# ---------- Shared data / brand catalogue ----------
data_path = Path('src/lib/data.js')
data = data_path.read_text(encoding='utf-8')

if 'const PUBLIC = process.env.PUBLIC_URL || "";' not in data:
    data = data.replace(
        'export const LOGO = `${process.env.PUBLIC_URL || ""}/logo.png`;\n',
        'export const LOGO = `${process.env.PUBLIC_URL || ""}/logo.png`;\nconst PUBLIC = process.env.PUBLIC_URL || "";\n'
    )

old_brands = '''export const BRANDS = [
  { name: "Daikin", color: "#0097E0" },
  { name: "Mitsubishi Electric", color: "#E60012" },
  { name: "Panasonic", color: "#0033A0" },
  { name: "Fujitsu", color: "#E60027" },
  { name: "Rinnai", color: "#E4002B" },
];'''
new_brands = '''export const BRANDS = [
  { name: "Daikin", color: "#0097E0" },
  { name: "Mitsubishi Electric", color: "#E60012" },
  { name: "Fujitsu", color: "#E60027" },
  { name: "Rinnai", color: "#E4002B" },
  { name: "Samsung", color: "#1428A0" },
  { name: "Panasonic", color: "#0033A0" },
];'''
data = data.replace(old_brands, new_brands)

start = data.index('export const SPLIT_BRANDS = [')
end = data.index('// ---- Split System FAQs', start)

split_brands = r'''export const SPLIT_BRANDS = [
  {
    slug: "daikin",
    brand: "Daikin",
    label: "Daikin",
    tagline: "Cora, Alira X and the slimline Zena — quiet, refined Daikin comfort for Australian homes.",
    metaTitle: "Daikin Split System Prices, Features & Installation | SplitsPro",
    h1: "Daikin Split System Air Conditioning",
    metaDesc: "Compare Daikin Cora, Alira X and Zena split systems. See easy-to-understand features, model sizes and supplied & installed prices from SplitsPro.",
    body: "Daikin gives you three clear choices: Cora for dependable everyday comfort, Alira X for advanced air quality and smart features, and Zena when you want premium technology in a very slim designer indoor unit. Below we explain what the features actually do in plain English.",
    image: IMAGES.splitBedroom,
    ranges: [
      {
        slug: "cora",
        name: "Cora",
        blurb: "A quiet, efficient all-rounder for bedrooms and living areas. Cora focuses on comfortable airflow, accurate temperature control and cleaner air without making the controls complicated.",
        features: ["Coanda Airflow", "Intelligent Eye", "Enzyme Blue Filter", "0.5°C Control", "Quiet Operation", "R32"],
        featureDetails: [
          { title: "Coanda Airflow", desc: "Instead of blasting cold air straight at you, the louvre sends it along the ceiling so it travels farther and mixes through the room more evenly." },
          { title: "Intelligent Eye", desc: "On applicable models, a sensor can detect people in the room and help manage airflow for comfort. When the room is empty it can move into an energy-saving operation." },
          { title: "Enzyme Blue air filter", desc: "The deodorising filter helps trap microscopic particles, break down odours and deactivate bacteria captured by the filter." },
          { title: "Precision temperature control", desc: "You can set the room temperature in 0.5°C steps, so you are not stuck choosing between one whole degree too warm or too cold." },
          { title: "Quiet fan design", desc: "A large cross-flow fan and efficient motor move more air with less noise — useful for bedrooms and living rooms." },
          { title: "R32 refrigerant", desc: "R32 is the modern refrigerant used by this range. It has a lower global-warming impact than older R410A systems and helps support efficient operation." },
        ],
        image: `${PUBLIC}/products/daikin-cora.png`,
        prices: [
          { kw: "2.5kW", model: "FTKM25WVMA", price: "$1,600" },
          { kw: "3.5kW", model: "FTKM35WVMA", price: "$1,750" },
          { kw: "5.0kW", model: "FTKM50WVMA", price: "$2,250" },
          { kw: "7.1kW", model: "FTKM71WVMA", price: "$2,700" },
        ],
      },
      {
        slug: "alira-x",
        name: "Alira X",
        blurb: "Daikin's air-quality focused premium split. It combines three-stage filtration, Streamer technology, mould-control functions, smart control and comfortable airflow.",
        features: ["Streamer", "3-Stage Filtration", "Mould-Proof Operation", "Coanda Airflow", "Intelligent Eye", "Built-In Wi-Fi"],
        featureDetails: [
          { title: "Streamer air cleaning", desc: "Streamer uses a high-power plasma discharge to break down unwanted substances captured inside the unit. Daikin laboratory research using a test Streamer generator also showed inactivation of SARS-CoV-2. This is an air-cleaning feature — it is not a medical guarantee and does not mean an installed air conditioner prevents COVID-19." },
          { title: "Three layers of filtration", desc: "A pre-filter catches larger dust, the Enzyme Blue filter helps with odours and particles, and Streamer works on pollutants captured inside the unit." },
          { title: "Mould-Proof Operation", desc: "After cooling or dry mode, the unit can run a drying operation to reduce moisture left inside the indoor unit, helping limit mould and stale odours." },
          { title: "Coanda Airflow", desc: "Air is guided along the ceiling for a longer throw and more even room temperature instead of a harsh draught straight at you." },
          { title: "2-Area Intelligent Eye", desc: "The people sensor can manage airflow around occupants and move to energy-saving operation when nobody is detected." },
          { title: "Built-in Wi-Fi", desc: "Control temperature, mode and schedules from your phone through Daikin's supported mobile control system." },
        ],
        note: "Streamer coronavirus figures come from Daikin laboratory testing of a test Streamer generator, not a claim that the installed air conditioner prevents infection.",
        image: "https://www.daikin.co.nz/cdn/shop/files/Alira_FTXM46WVMA_IDU_28c296f1-f9a4-434f-bcb4-b90d51c02a1c.png?v=1703027226",
        prices: [
          { kw: "2.5kW", price: "$1,950" },
          { kw: "3.5kW", price: "$2,400" },
          { kw: "5.0kW", price: "$3,000" },
          { kw: "7.1kW", price: "$3,500" },
        ],
      },
      {
        slug: "zena",
        name: "Zena",
        blurb: "Zena is the designer Daikin. It is only 185 mm deep and comes in White Hair Line or Black Wood, so it sits closer to the wall and looks much less bulky than a typical split system.",
        features: ["Slimline Design", "White or Black", "Streamer", "Built-In Wi-Fi", "Coanda Airflow", "Intelligent Eye", "Grid Eye", "Saw Edge Fan"],
        featureDetails: [
          { title: "Ultra-slim designer body", desc: "The indoor unit is about 295 mm high, 798 mm wide and only 185 mm deep. In simple terms: it sticks out from the wall less and looks cleaner in modern rooms." },
          { title: "White Hair Line or Black Wood", desc: "Choose the light finish to blend into a white wall, or the dark Black Wood finish when you want the air conditioner to look like part of the room design." },
          { title: "Streamer air cleaning", desc: "Streamer breaks down bacteria, mould and other unwanted substances captured inside the unit. Daikin has also published laboratory SARS-CoV-2 inactivation results for a test Streamer generator; that does not mean the installed unit guarantees protection from COVID-19." },
          { title: "Advanced titanium apatite filter", desc: "The filter helps trap microscopic particles, break down smells and deactivate bacteria captured on the filter." },
          { title: "Coanda + Vertical Airflow", desc: "In cooling, air can travel along the ceiling for a long, gentle throw. In heating, the louvres can push warm air down the wall toward the floor so your feet do not stay cold." },
          { title: "Intelligent Eye", desc: "A presence sensor notices when the room is empty and can automatically use an energy-saving operation after around 20 minutes." },
          { title: "Grid Eye floor sensor", desc: "During heating it also checks the floor temperature and adjusts airflow direction to help warm the room more evenly from bottom to top." },
          { title: "Saw Edge fan", desc: "The fan blade shape is designed to move a strong volume of air quietly while still fitting inside Zena's very slim casing." },
          { title: "Built-in Wi-Fi", desc: "Phone control is built into the indoor unit, so you can change temperature and operation without adding a bulky external Wi-Fi box." },
        ],
        note: "Zena is available in 2.5, 3.5, 5.0 and 6.0 kW reverse-cycle sizes. White models end in W; Black Wood models end in K.",
        image: `${PUBLIC}/products/daikin-zena.jpg`,
        prices: [
          { kw: "2.5kW", model: "FTXJ25TVMAW / K", price: "$1,850" },
          { kw: "3.5kW", model: "FTXJ35TVMAW / K", price: "$2,050" },
          { kw: "5.0kW", model: "FTXJ50TVMAW / K", price: "$2,450" },
          { kw: "6.0kW", model: "FTXJ60TVMAW / K", price: "$2,700" },
        ],
      },
    ],
  },
  {
    slug: "rinnai",
    brand: "Rinnai",
    label: "Rinnai",
    tagline: "Rinnai reverse cycle split systems — PB Series and T Series.",
    metaTitle: "Rinnai Split System Prices & Installation | SplitsPro",
    h1: "Rinnai Split System Air Conditioning",
    metaDesc: "Compare Rinnai PB Series and Rinnai T Series supplied & installed prices from SplitsPro. Book your Rinnai split system installation online.",
    body: "The Rinnai PB Series and T Series are dependable reverse cycle split systems — a great value choice for bedrooms, living rooms, home offices and granny flats.",
    image: IMAGES.outdoorRinnai,
    ranges: [
      {
        slug: "pb-series",
        name: "PB Series",
        blurb: "Smart, reliable heating and cooling designed for Australian conditions. The PB Series includes Wi-Fi control, quiet inverter operation, self-cleaning, 3D airflow, dehumidifying and sleep functions for comfortable everyday use.",
        features: ["Wi-Fi Control", "Self-Cleaning", "3D Airflow", "Quiet Operation"],
        image: IMAGES.outdoorRinnai,
        prices: [
          { kw: "2.5kW", price: "$1,450" },
          { kw: "3.5kW", price: "$1,550" },
          { kw: "5.0kW", price: "$1,900" },
          { kw: "7.0kW", price: "$2,300" },
        ],
      },
      {
        slug: "t-series",
        name: "T Series",
        blurb: "Affordable smart comfort with modern controls. The Rinnai T Series includes Wi-Fi and voice control, Turbo heating and cooling, dehumidifying mode, Sleep Mode and a high-density air filter.",
        features: ["Wi-Fi + Voice Control", "Turbo Mode", "Sleep Mode", "High-Density Filter"],
        image: IMAGES.outdoorRinnai2,
        prices: [
          { kw: "2.5kW", price: "$1,450" },
          { kw: "3.5kW", price: "$1,550" },
          { kw: "5.0kW", price: "$1,900" },
          { kw: "7.1kW", price: "$2,300" },
        ],
      },
    ],
  },
  {
    slug: "mitsubishi-electric",
    brand: "Mitsubishi Electric",
    label: "Mitsubishi Electric",
    tagline: "Mitsubishi Electric AP Series — refined, whisper-quiet performance.",
    metaTitle: "Mitsubishi Electric Split System Prices & Installation | SplitsPro",
    h1: "Mitsubishi Electric Split System Air Conditioning",
    metaDesc: "Mitsubishi Electric AP Series split systems supplied and installed by SplitsPro. View sizes, supplied & installed prices and book your installation.",
    body: "The Mitsubishi Electric AP Series is renowned for quiet, refined performance and long-term reliability — a premium choice for living areas, bedrooms and open-plan spaces where sound levels matter.",
    image: IMAGES.splitLiving,
    ranges: [
      {
        slug: "ap-series",
        name: "MSZ-AP Series",
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
    ],
  },
  {
    slug: "mitsubishi-heavy-industries",
    brand: "Mitsubishi Heavy Industries",
    label: "Mitsubishi Heavy Industries",
    tagline: "Mitsubishi Heavy Industries Ciara Series — Japanese-engineered comfort.",
    metaTitle: "Mitsubishi Heavy Industries Split System Prices & Installation | SplitsPro",
    h1: "Mitsubishi Heavy Industries Split System Air Conditioning",
    metaDesc: "Mitsubishi Heavy Industries Ciara Series split systems supplied and installed by SplitsPro. View sizes, supplied & installed prices and book online.",
    body: "Mitsubishi Heavy Industries is a separate manufacturer from Mitsubishi Electric. The Ciara Series offers Japanese engineering, quiet operation and strong warranty support at a competitive price.",
    image: IMAGES.splitIndoor,
    ranges: [
      {
        slug: "ciara-series",
        name: "Ciara Series",
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
  {
    slug: "fujitsu",
    brand: "Fujitsu",
    label: "Fujitsu",
    tagline: "Fujitsu Lifestyle Range — quiet, efficient comfort with smart energy-saving features.",
    metaTitle: "Fujitsu Split System Prices & Installation | SplitsPro",
    h1: "Fujitsu Split System Air Conditioning",
    metaDesc: "Compare Fujitsu Lifestyle KMTC split systems from 2.5kW to 7.1kW with supplied & installed prices, model numbers and easy feature explanations.",
    body: "Fujitsu's Lifestyle KMTC range is a strong all-round choice. It is designed to be quiet, efficient and easy to live with, with useful functions such as a human sensor, economy mode, powerful mode and air-cleaning filters.",
    image: IMAGES.heroInterior,
    ranges: [
      {
        slug: "lifestyle-kmtc",
        name: "Lifestyle KMTC",
        blurb: "A practical premium range for bedrooms through to large living rooms. The smaller 2.5kW model can run as low as 19 dBA in quiet cooling, while the range adds energy-management and air-cleaning features.",
        features: ["Human Sensor", "Economy Mode", "Super Quiet", "Powerful Mode", "Apple-Catechin Filter", "Blue Fin"],
        featureDetails: [
          { title: "Human Sensor", desc: "The indoor unit can detect movement in the room. This helps the system avoid wasting energy when the space is not being used." },
          { title: "Economy Mode", desc: "Limits maximum power demand when you do not need full output — useful when you want steady comfort with lower electricity use." },
          { title: "Powerful Mode", desc: "Temporarily drives the compressor and fan harder to pull a hot or cold room toward the set temperature faster." },
          { title: "Super Quiet Mode", desc: "Drops the indoor fan speed for quieter operation. The 2.5kW Lifestyle model is rated down to about 19 dBA in quiet cooling." },
          { title: "Apple-Catechin Filter", desc: "Uses static electricity and apple-derived polyphenol treatment to help capture fine dust, mould spores and microorganisms on the filter." },
          { title: "Long-Life Ion Deodorisation", desc: "Helps break down absorbed smells using ions generated by very fine ceramic particles." },
          { title: "Blue Fin outdoor coil", desc: "Adds corrosion resistance to the outdoor heat exchanger, which is especially useful in humid or coastal conditions." },
          { title: "Wi-Fi options", desc: "Wi-Fi control is available on supported Lifestyle systems, and Fujitsu also sells Lifestyle Next packages with compatible Wi-Fi control included." },
        ],
        prices: [
          { kw: "2.5kW", model: "ASTG09KMTC", price: "$1,550" },
          { kw: "3.5kW", model: "ASTG12KMTC", price: "$1,700" },
          { kw: "5.0kW", model: "ASTG18KMTC", price: "$2,200" },
          { kw: "6.0kW", model: "ASTG22KMTC", price: "$2,450" },
          { kw: "7.1kW", model: "ASTG24KMTC", price: "$2,650" },
        ],
      },
    ],
  },
  {
    slug: "samsung",
    brand: "Samsung",
    label: "Samsung",
    tagline: "Samsung GEO WindFree — soft draught-free comfort, SmartThings control and advanced self-cleaning.",
    metaTitle: "Samsung WindFree Split System Prices & Installation | SplitsPro",
    h1: "Samsung WindFree Split System Air Conditioning",
    metaDesc: "Compare Samsung GEO WindFree split systems from 2.5kW to 8.0kW with model numbers, supplied & installed prices and simple feature explanations.",
    body: "Samsung WindFree is for people who dislike a cold stream of air blowing directly at them. It cools quickly first, then can maintain comfort by gently dispersing air through thousands of tiny holes across the front panel.",
    image: IMAGES.heroInterior,
    ranges: [
      {
        slug: "geo-windfree",
        name: "GEO WindFree AI Smart",
        blurb: "Samsung's current WindFree range combines quiet micro-hole airflow with AI Auto Cooling, built-in Wi-Fi, SmartThings, air-cleaning filters and automatic coil-cleaning functions.",
        features: ["WindFree Cooling", "AI Auto Cooling", "SmartThings Wi-Fi", "Quad-Care Filter", "Freeze Wash", "Good Sleep"],
        featureDetails: [
          { title: "WindFree Cooling", desc: "The unit cools the room quickly, then can close the main blade and maintain comfort through thousands of tiny holes. That means much less of the cold draught feeling on your face or body." },
          { title: "AI Auto Cooling", desc: "With Wi-Fi enabled, the system can use room conditions and learned usage patterns to choose suitable operating modes automatically." },
          { title: "SmartThings control", desc: "Built-in Wi-Fi lets you turn it on, change temperature, schedule it and monitor it from the Samsung SmartThings app." },
          { title: "Quad-Care filter", desc: "Designed to collect fine dust including PM2.5 and reduce certain viruses, bacteria and allergens on the filter under Samsung's laboratory test conditions." },
          { title: "Freeze Wash", desc: "Freezes the heat exchanger, melts the ice to wash contaminants away, then dries the coil. In simple terms, it gives the indoor coil a deeper automatic clean." },
          { title: "3-step Auto Clean", desc: "After use, the indoor fan can keep running to dry moisture left on the heat exchanger, helping reduce the damp environment where smells and bacteria can build up." },
          { title: "Good Sleep", desc: "Adjusts temperature and airflow through the night and can use WindFree airflow so you are not sleeping under a harsh cold blast." },
          { title: "Fast Cooling", desc: "Uses a larger fan and wide airflow path to pull the room temperature down quickly before switching to gentler comfort operation." },
        ],
        note: "Samsung's virus-reduction claims relate to specific filter laboratory tests and do not mean the air conditioner prevents viral infection in a room.",
        prices: [
          { kw: "2.5kW", model: "AR09DXEANWKNSA", price: "$1,650" },
          { kw: "3.5kW", model: "AR12DXEANWKNSA", price: "$1,800" },
          { kw: "5.0kW", model: "AR18DXEANWKNSA", price: "$2,300" },
          { kw: "7.0kW", model: "AR24DXEANWKNSA", price: "$2,700" },
          { kw: "8.0kW", model: "AR30DXEANWKNSA", price: "$3,100" },
        ],
      },
    ],
  },
];


'''

data = data[:start] + split_brands + data[end:]
data_path.write_text(data, encoding='utf-8')

# ---------- Loader: use the same site logo and correct GitHub Pages path ----------
loader_path = Path('src/components/PageLoader.jsx')
loader = loader_path.read_text(encoding='utf-8')
if 'import { LOGO } from "../lib/data";' not in loader:
    loader = loader.replace(
        'import { motion, AnimatePresence } from "framer-motion";\n',
        'import { motion, AnimatePresence } from "framer-motion";\nimport { LOGO } from "../lib/data";\n'
    )
loader = loader.replace('src="/logo.png"', 'src={LOGO}')
loader = loader.replace(
    'className="mx-auto h-20 w-auto [filter:brightness(0)_invert(1)]"',
    'className="mx-auto h-20 w-auto object-contain sm:h-24"'
)
loader = loader.replace(
    '<div className="text-center">',
    '<div className="rounded-2xl border border-[#C8A46A]/40 bg-white px-8 py-7 text-center shadow-2xl sm:px-12">'
)
loader = loader.replace('bg-white/15', 'bg-[#C8A46A]/25').replace('className="h-full bg-white"', 'className="h-full bg-[#C8A46A]"')
loader_path.write_text(loader, encoding='utf-8')

# ---------- Gallery / rotated-photo hover bug ----------
css_path = Path('src/index.css')
css = css_path.read_text(encoding='utf-8')
rotation_fix = '''\n/* Preserve portrait-photo rotation while hover zooming. Without this, hover replaced rotate(90deg) with scale(). */\n.img-zoom.rotate-90 { transform: rotate(90deg); }\n.group:hover .img-zoom.rotate-90 { transform: rotate(90deg) scale(1.05); }\n'''
if '.group:hover .img-zoom.rotate-90' not in css:
    css += rotation_fix
css_path.write_text(css, encoding='utf-8')

# ---------- Brand page: detailed feature cards + model numbers ----------
brand_page_path = Path('src/pages/BrandPage.jsx')
brand_page = brand_page_path.read_text(encoding='utf-8')
old_feature = '''              {range.features && (\n                <p className="mt-4 text-sm text-[#0B0B0B]" data-testid={`features-${range.slug}`}>\n                  {range.features.join("  •  ")}\n                </p>\n              )}'''
new_feature = '''              {range.features && (\n                <p className="mt-4 text-sm text-[#0B0B0B]" data-testid={`features-${range.slug}`}>\n                  {range.features.join("  •  ")}\n                </p>\n              )}\n              {range.featureDetails && (\n                <div className="mt-7 grid gap-3 sm:grid-cols-2" data-testid={`feature-details-${range.slug}`}>\n                  {range.featureDetails.map((feature) => (\n                    <div key={feature.title} className="rounded-xl border border-[#E5E5EA] bg-white p-5 soft-shadow-sm">\n                      <h3 className="font-serif text-lg text-[#0B0B0B]">{feature.title}</h3>\n                      <p className="mt-2 text-sm leading-relaxed text-[#6E6E73]">{feature.desc}</p>\n                    </div>\n                  ))}\n                </div>\n              )}\n              {range.note && (\n                <p className="mt-5 rounded-xl border border-[#C8A46A]/30 bg-[#F3E9D2]/50 px-4 py-3 text-xs leading-relaxed text-[#5F5140]">{range.note}</p>\n              )}'''
if old_feature not in brand_page:
    raise SystemExit('BrandPage feature block not found')
brand_page = brand_page.replace(old_feature, new_feature)

old_kw = '<span className="font-serif text-xl text-[#0B0B0B] sm:text-2xl">{row.kw}</span>'
new_kw = '''<span>\n                    <span className="block font-serif text-xl text-[#0B0B0B] sm:text-2xl">{row.kw}</span>\n                    {row.model && <span className="mt-1 block text-xs font-medium text-[#6E6E73]">Model {row.model}</span>}\n                  </span>'''
brand_page = brand_page.replace(old_kw, new_kw)
brand_page_path.write_text(brand_page, encoding='utf-8')

# ---------- Split Systems navigation / SEO copy ----------
split_path = Path('src/pages/SplitSystems.jsx')
split = split_path.read_text(encoding='utf-8')
split = split.replace(
    '  "mitsubishi-heavy-industries": "Mitsubishi Heavy",\n};',
    '  "mitsubishi-heavy-industries": "Mitsubishi Heavy",\n  fujitsu: "Fujitsu",\n  samsung: "Samsung",\n};'
)
split = split.replace(
    'Real installs by SplitsPro across Western Sydney — Daikin, Rinnai, Mitsubishi Electric and Mitsubishi Heavy Industries.',
    'Real installs by SplitsPro across Western Sydney — Daikin, Rinnai, Mitsubishi Electric, Mitsubishi Heavy Industries, Fujitsu and Samsung.'
)
split = split.replace(
    'a new Daikin, Rinnai, Mitsubishi Electric or Mitsubishi Heavy Industries unit',
    'a new Daikin, Rinnai, Mitsubishi Electric, Mitsubishi Heavy Industries, Fujitsu or Samsung unit'
)
split = split.replace(
    'Compare split system air conditioners from Daikin, Rinnai, Mitsubishi Electric and Mitsubishi Heavy Industries.',
    'Compare split system air conditioners from Daikin, Rinnai, Mitsubishi Electric, Mitsubishi Heavy Industries, Fujitsu and Samsung.'
)
split = split.replace(
    'Compare Daikin, Rinnai, Mitsubishi Electric and Mitsubishi Heavy Industries split systems.',
    'Compare Daikin, Rinnai, Mitsubishi Electric, Mitsubishi Heavy Industries, Fujitsu and Samsung split systems.'
)
split_path.write_text(split, encoding='utf-8')

# ---------- Ensure static GitHub Pages routes exist for the new brands ----------
publish_path = Path('.github/workflows/publish-original-pages.yml')
publish = publish_path.read_text(encoding='utf-8')
if '"split-systems/fujitsu"' not in publish:
    publish = publish.replace(
        '            "split-systems/mitsubishi-heavy-industries"\n',
        '            "split-systems/mitsubishi-heavy-industries"\n            "split-systems/fujitsu"\n            "split-systems/samsung"\n'
    )
publish_path.write_text(publish, encoding='utf-8')

print('Brand, loader, gallery and pricing updates prepared.')
