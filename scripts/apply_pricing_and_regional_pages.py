from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def replace_required(text, old, new, label):
    if old in text:
        return text.replace(old, new)
    if new in text:
        return text
    raise RuntimeError(f"Expected text not found for {label}: {old[:120]!r}")


def patch_prices():
    path = ROOT / "src/lib/data.js"
    text = path.read_text(encoding="utf-8")

    replacements = [
        # Daikin Cora — keep Cora, do not add Lite.
        ('{ kw: "2.5kW", model: "FTKM25WVMA", price: "$1,600" }', '{ kw: "2.5kW", model: "FTKM25WVMA", price: "$1,690" }', "Cora 2.5"),
        ('{ kw: "3.5kW", model: "FTKM35WVMA", price: "$1,750" }', '{ kw: "3.5kW", model: "FTKM35WVMA", price: "$1,890" }', "Cora 3.5"),
        ('{ kw: "5.0kW", model: "FTKM50WVMA", price: "$2,250" }', '{ kw: "5.0kW", model: "FTKM50WVMA", price: "$2,490" }', "Cora 5.0"),
        ('{ kw: "7.1kW", model: "FTKM71WVMA", price: "$2,700" }', '{ kw: "7.1kW", model: "FTKM71WVMA", price: "$2,790" }', "Cora 7.1"),

        # Daikin Alira X.
        ('{ kw: "2.5kW", price: "$1,950" }', '{ kw: "2.5kW", price: "$1,990" }', "Alira X 2.5"),
        ('{ kw: "3.5kW", price: "$2,400" }', '{ kw: "3.5kW", price: "$2,290" }', "Alira X 3.5"),
        ('{ kw: "5.0kW", price: "$3,000" }', '{ kw: "5.0kW", price: "$2,890" }', "Alira X 5.0"),
        ('{ kw: "7.1kW", price: "$3,500" }', '{ kw: "7.1kW", price: "$3,390" }', "Alira X 7.1"),

        # Daikin Zena.
        ('{ kw: "2.5kW", model: "FTXJ25TVMAW / K", price: "$1,850" }', '{ kw: "2.5kW", model: "FTXJ25TVMAW / K", price: "$2,190" }', "Zena 2.5"),
        ('{ kw: "3.5kW", model: "FTXJ35TVMAW / K", price: "$2,050" }', '{ kw: "3.5kW", model: "FTXJ35TVMAW / K", price: "$2,490" }', "Zena 3.5"),
        ('{ kw: "5.0kW", model: "FTXJ50TVMAW / K", price: "$2,450" }', '{ kw: "5.0kW", model: "FTXJ50TVMAW / K", price: "$3,090" }', "Zena 5.0"),
        ('{ kw: "6.0kW", model: "FTXJ60TVMAW / K", price: "$2,700" }', '{ kw: "6.0kW", model: "FTXJ60TVMAW / K", price: "$3,390" }', "Zena 6.0"),

        # Mitsubishi Electric AP — priced above comparable Cora sizes while still in Sydney market bands.
        ('{ kw: "2.5kW", price: "$1,799" }', '{ kw: "2.5kW", price: "$1,890" }', "Mitsubishi Electric 2.5"),
        ('{ kw: "3.5kW", price: "$1,999" }', '{ kw: "3.5kW", price: "$2,090" }', "Mitsubishi Electric 3.5"),
        ('{ kw: "5.0kW", price: "$2,699" }', '{ kw: "5.0kW", price: "$2,690" }', "Mitsubishi Electric 5.0"),
        ('{ kw: "7.1kW", price: "$3,199" }', '{ kw: "7.1kW", price: "$3,190" }', "Mitsubishi Electric 7.1"),

        # Mitsubishi Heavy Industries Ciara. Do these before Rinnai because its old 2.5 price is $1,590.
        ('{ kw: "2.0kW", price: "$1,450" }', '{ kw: "2.0kW", price: "$1,790" }', "MHI 2.0"),
        ('{ kw: "2.5kW", price: "$1,590" }', '{ kw: "2.5kW", price: "$1,890" }', "MHI 2.5"),
        ('{ kw: "3.3kW", price: "$1,790" }', '{ kw: "3.3kW", price: "$2,090" }', "MHI 3.3"),
        ('{ kw: "5.0kW", price: "$2,250" }', '{ kw: "5.0kW", price: "$2,690" }', "MHI 5.0"),
        ('{ kw: "6.3kW", price: "$2,590" }', '{ kw: "6.3kW", price: "$2,890" }', "MHI 6.3"),
        ('{ kw: "7.1kW", price: "$2,690" }', '{ kw: "7.1kW", price: "$2,990" }', "MHI 7.1"),

        # Fujitsu Lifestyle.
        ('{ kw: "2.5kW", model: "ASTG09KMTC", price: "$1,550" }', '{ kw: "2.5kW", model: "ASTG09KMTC", price: "$1,890" }', "Fujitsu 2.5"),
        ('{ kw: "3.5kW", model: "ASTG12KMTC", price: "$1,700" }', '{ kw: "3.5kW", model: "ASTG12KMTC", price: "$2,090" }', "Fujitsu 3.5"),
        ('{ kw: "5.0kW", model: "ASTG18KMTC", price: "$2,200" }', '{ kw: "5.0kW", model: "ASTG18KMTC", price: "$2,690" }', "Fujitsu 5.0"),
        ('{ kw: "6.0kW", model: "ASTG22KMTC", price: "$2,450" }', '{ kw: "6.0kW", model: "ASTG22KMTC", price: "$2,890" }', "Fujitsu 6.0"),
        ('{ kw: "7.1kW", model: "ASTG24KMTC", price: "$2,650" }', '{ kw: "7.1kW", model: "ASTG24KMTC", price: "$2,990" }', "Fujitsu 7.1"),

        # Samsung WindFree.
        ('{ kw: "2.5kW", model: "AR09DXEANWKNSA", price: "$1,650" }', '{ kw: "2.5kW", model: "AR09DXEANWKNSA", price: "$1,890" }', "Samsung 2.5"),
        ('{ kw: "3.5kW", model: "AR12DXEANWKNSA", price: "$1,800" }', '{ kw: "3.5kW", model: "AR12DXEANWKNSA", price: "$2,090" }', "Samsung 3.5"),
        ('{ kw: "5.0kW", model: "AR18DXEANWKNSA", price: "$2,300" }', '{ kw: "5.0kW", model: "AR18DXEANWKNSA", price: "$2,690" }', "Samsung 5.0"),
        ('{ kw: "7.0kW", model: "AR24DXEANWKNSA", price: "$2,700" }', '{ kw: "7.0kW", model: "AR24DXEANWKNSA", price: "$2,990" }', "Samsung 7.0"),
        ('{ kw: "8.0kW", model: "AR30DXEANWKNSA", price: "$3,100" }', '{ kw: "8.0kW", model: "AR30DXEANWKNSA", price: "$3,290" }', "Samsung 8.0"),

        # Rinnai PB and PX deliberately stay identical. These replacements update both occurrences.
        ('{ kw: "2.5kW", price: "$1,450" }', '{ kw: "2.5kW", price: "$1,590" }', "Rinnai PB/PX 2.5"),
        ('{ kw: "3.5kW", price: "$1,550" }', '{ kw: "3.5kW", price: "$1,690" }', "Rinnai PB/PX 3.5"),
        ('{ kw: "5.0kW", price: "$1,900" }', '{ kw: "5.0kW", price: "$1,990" }', "Rinnai PB/PX 5.0"),
        ('{ kw: "7.0kW", price: "$2,300" }', '{ kw: "7.0kW", price: "$2,390" }', "Rinnai PB 7.0"),
        ('{ kw: "7.1kW", price: "$2,300" }', '{ kw: "7.1kW", price: "$2,390" }', "Rinnai PX 7.1"),
    ]

    for old, new, label in replacements:
        text = replace_required(text, old, new, label)

    path.write_text(text, encoding="utf-8")


def patch_routes():
    path = ROOT / "src/App.js"
    text = path.read_text(encoding="utf-8")
    if '/split-systems/oran-park' in text:
        return
    anchor = '          <Route path="/split-systems" element={<SplitSystems />} />\n'
    if anchor not in text:
        raise RuntimeError("Split system route anchor not found in App.js")
    routes = anchor + ''.join([
        '          <Route path="/split-systems/oran-park" element={<SplitSystems />} />\n',
        '          <Route path="/split-systems/willoughby-north-sydney" element={<SplitSystems />} />\n',
        '          <Route path="/split-systems/central-coast-newcastle" element={<SplitSystems />} />\n',
        '          <Route path="/split-systems/wollongong" element={<SplitSystems />} />\n',
        '          <Route path="/split-systems/quakers-hill-austral-richmond" element={<SplitSystems />} />\n',
    ])
    path.write_text(text.replace(anchor, routes, 1), encoding="utf-8")


def patch_split_page():
    path = ROOT / "src/pages/SplitSystems.jsx"
    text = path.read_text(encoding="utf-8")

    text = replace_required(
        text,
        'import { Link } from "react-router-dom";',
        'import { Link, useLocation } from "react-router-dom";',
        "SplitSystems useLocation import",
    )

    canonical_line = 'const CANONICAL = "https://splitspro.com.au/split-systems";'
    regional_config = '''const CANONICAL = "https://splitspro.com.au/split-systems";

const REGIONAL_PAGES = {
  "oran-park": {
    name: "Oran Park & South-West Sydney",
    shortName: "Oran Park",
    canonical: "https://splitspro.com.au/split-systems/oran-park",
    areas: "Oran Park, Gregory Hills, Harrington Park, Narellan, Camden, Leppington, Austral and surrounding South-West Sydney suburbs",
  },
  "willoughby-north-sydney": {
    name: "Willoughby & North Sydney",
    shortName: "Willoughby & North Sydney",
    canonical: "https://splitspro.com.au/split-systems/willoughby-north-sydney",
    areas: "Willoughby, Chatswood, Artarmon, Lane Cove, North Sydney, Crows Nest, Neutral Bay and surrounding Lower North Shore suburbs",
  },
  "central-coast-newcastle": {
    name: "Central Coast & Newcastle",
    shortName: "Central Coast & Newcastle",
    canonical: "https://splitspro.com.au/split-systems/central-coast-newcastle",
    areas: "Gosford, Erina, Terrigal, Wyong, Tuggerah, Morisset, Lake Macquarie, Newcastle and surrounding suburbs",
  },
  wollongong: {
    name: "Wollongong & Illawarra",
    shortName: "Wollongong",
    canonical: "https://splitspro.com.au/split-systems/wollongong",
    areas: "Wollongong, Corrimal, Figtree, Dapto, Shellharbour, Albion Park, Kiama and surrounding Illawarra suburbs",
  },
  "quakers-hill-austral-richmond": {
    name: "Quakers Hill, Austral & Richmond",
    shortName: "Quakers Hill, Austral & Richmond",
    canonical: "https://splitspro.com.au/split-systems/quakers-hill-austral-richmond",
    areas: "Quakers Hill, Schofields, Marsden Park, Riverstone, Richmond, Windsor, Austral, Leppington and surrounding suburbs",
  },
};'''
    if "const REGIONAL_PAGES" not in text:
        text = replace_required(text, canonical_line, regional_config, "regional page config")

    text = replace_required(
        text,
        'const SplitSystemsSeo = () => (',
        'const SplitSystemsSeo = ({ regionLabel = "Western Sydney" }) => (',
        "SplitSystemsSeo regional prop",
    )
    text = replace_required(
        text,
        '<SectionHeading overline="Installation" title="Professional split system installation" sub="Real installs by SplitsPro across Western Sydney — Daikin, Rinnai, Mitsubishi, Fujitsu and Samsung." />',
        '<SectionHeading overline="Installation" title="Professional split system installation" sub={`Real installs by SplitsPro across ${regionLabel} — Daikin, Rinnai, Mitsubishi, Fujitsu and Samsung.`} />',
        "regional install heading",
    )
    text = replace_required(
        text,
        'alt="Daikin outdoor condenser replaced on a Western Sydney home"',
        'alt={`Daikin outdoor condenser replaced for a home in ${regionLabel}`}',
        "regional replacement alt",
    )

    tail_marker = 'const helmet = (\n'
    if tail_marker not in text:
        if 'const buildHelmet = (page) => (' in text:
            path.write_text(text, encoding="utf-8")
            return
        raise RuntimeError("SplitSystems helmet tail marker not found")

    prefix = text.split(tail_marker, 1)[0]
    new_tail = r'''const buildHelmet = (page) => (
  <Helmet>
    <title>{page.metaTitle}</title>
    <meta name="description" content={page.metaDescription} />
    <link rel="canonical" href={page.canonical} />
    <meta property="og:title" content={page.metaTitle} />
    <meta property="og:description" content={page.ogDescription} />
    <meta property="og:type" content="website" />
    <meta property="og:image" content={IMAGES.splitLiving} />
  </Helmet>
);

const SplitSystems = () => {
  const { pathname } = useLocation();
  const slug = pathname.split("/").filter(Boolean).pop();
  const regional = REGIONAL_PAGES[slug];

  const page = regional
    ? {
        canonical: regional.canonical,
        metaTitle: `Split System Air Conditioning ${regional.shortName} | Supply & Install | SplitsPro`,
        metaDescription: `Split system air conditioning supply and installation across ${regional.areas}. Compare Daikin, Rinnai, Mitsubishi, Fujitsu and Samsung supplied & installed prices.`,
        ogDescription: `Split system supply and installation across ${regional.areas}. Compare trusted brands and book with SplitsPro.`,
        heroTitle: `Split System Air Conditioning ${regional.name}`,
        heroSub: `Compare trusted air conditioning brands, view supplied and installed prices and book professional split system installation across ${regional.areas}.`,
        introHeading: `Split system installation across ${regional.name}`,
        introBody: `SplitsPro supplies and installs split systems across ${regional.areas}. We take the time to size the unit correctly, plan neat indoor and outdoor placement and finish the pipework carefully so the installation looks clean and performs properly.`,
        regionLabel: regional.name,
      }
    : {
        canonical: CANONICAL,
        metaTitle: "Split System Air Conditioning Supply & Installation | SplitsPro",
        metaDescription: "Compare split system air conditioners from Daikin, Rinnai, Mitsubishi, Fujitsu and Samsung. View supplied & installed prices, get free sizing advice and book your installation with SplitsPro.",
        ogDescription: "Compare Daikin, Rinnai, Mitsubishi, Fujitsu and Samsung split systems. Supplied and installed by SplitsPro across Western Sydney.",
        heroTitle: "Split System Air Conditioning Supply & Installation",
        heroSub: "Compare trusted air conditioning brands, view supplied and installed prices and find the right split system for your room.",
        introHeading: "Considered installation. Chosen brands.",
        introBody: "We take the time to plan every split system installation — positioning the indoor unit for even airflow, keeping pipe runs tidy and choosing from Daikin, Rinnai, Mitsubishi Electric and Mitsubishi Heavy Industries so you get the right fit for the room.",
        regionLabel: "Western Sydney",
      };

  return (
    <HomeComfortPage
      slug="split-systems"
      bookingForm
      overline="Split System Air Conditioning"
      title={page.heroTitle}
      sub={page.heroSub}
      image={IMAGES.splitLiving}
      introImage={IMAGES.splitBedroom}
      intro={{
        heading: page.introHeading,
        body: page.introBody,
      }}
      features={[
        "Fixed supplied-and-installed price",
        "Daikin, Rinnai, Mitsubishi Electric and Mitsubishi Heavy Industries",
        "Correct kW capacity for the room",
        "Neat pipework and considered unit placement",
        "Full testing and system commissioning",
        "Complete post-install clean-up",
      ]}
      helmet={buildHelmet(page)}
      afterHero={<MobileBrandRow />}
      seoBlocks={<SplitSystemsSeo regionLabel={page.regionLabel} />}
      extraFaqs={SPLIT_FAQS}
    />
  );
};

export default SplitSystems;
'''
    path.write_text(prefix + new_tail, encoding="utf-8")


def patch_publish_workflow():
    path = ROOT / ".github/workflows/publish-original-pages.yml"
    text = path.read_text(encoding="utf-8")
    if '"split-systems/oran-park"' in text:
        return
    anchor = '            "split-systems/samsung"\n'
    addition = anchor + ''.join([
        '            "split-systems/oran-park"\n',
        '            "split-systems/willoughby-north-sydney"\n',
        '            "split-systems/central-coast-newcastle"\n',
        '            "split-systems/wollongong"\n',
        '            "split-systems/quakers-hill-austral-richmond"\n',
    ])
    if anchor not in text:
        raise RuntimeError("Publish workflow route anchor not found")
    path.write_text(text.replace(anchor, addition, 1), encoding="utf-8")


def patch_sitemaps():
    urls = [
        "https://splitspro.com.au/split-systems/oran-park",
        "https://splitspro.com.au/split-systems/willoughby-north-sydney",
        "https://splitspro.com.au/split-systems/central-coast-newcastle",
        "https://splitspro.com.au/split-systems/wollongong",
        "https://splitspro.com.au/split-systems/quakers-hill-austral-richmond",
    ]
    for rel in ["sitemap.xml", "public/sitemap.xml"]:
        path = ROOT / rel
        text = path.read_text(encoding="utf-8")
        if urls[0] in text:
            continue
        entries = "\n".join(
            f"  <url><loc>{url}</loc><lastmod>2026-09-13</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>"
            for url in urls
        )
        if "</urlset>" not in text:
            raise RuntimeError(f"No </urlset> found in {rel}")
        path.write_text(text.replace("</urlset>", entries + "\n</urlset>", 1), encoding="utf-8")


if __name__ == "__main__":
    patch_prices()
    patch_routes()
    patch_split_page()
    patch_publish_workflow()
    patch_sitemaps()
    print("Updated pricing, regional split-system landing pages, routes and sitemaps.")
