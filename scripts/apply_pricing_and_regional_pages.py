from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def replace_once(path, old, new):
    p = ROOT / path
    text = p.read_text(encoding="utf-8")
    if old not in text:
        raise RuntimeError(f"Expected text not found in {path}: {old[:100]!r}")
    p.write_text(text.replace(old, new, 1), encoding="utf-8")


def replace_all(path, replacements):
    p = ROOT / path
    text = p.read_text(encoding="utf-8")
    for old, new in replacements:
        if old not in text:
            raise RuntimeError(f"Expected text not found in {path}: {old[:100]!r}")
        text = text.replace(old, new)
    p.write_text(text, encoding="utf-8")


# 1) Pricing. Cora is retained; Lite is not added.
# Rinnai PB and PX deliberately remain identical.
price_replacements = [
    # Daikin Cora
    ('{ kw: "2.5kW", model: "FTKM25WVMA", price: "$1,600" }', '{ kw: "2.5kW", model: "FTKM25WVMA", price: "$1,690" }'),
    ('{ kw: "3.5kW", model: "FTKM35WVMA", price: "$1,750" }', '{ kw: "3.5kW", model: "FTKM35WVMA", price: "$1,890" }'),
    ('{ kw: "5.0kW", model: "FTKM50WVMA", price: "$2,250" }', '{ kw: "5.0kW", model: "FTKM50WVMA", price: "$2,490" }'),
    ('{ kw: "7.1kW", model: "FTKM71WVMA", price: "$2,700" }', '{ kw: "7.1kW", model: "FTKM71WVMA", price: "$2,790" }'),
    # Daikin Alira X
    ('{ kw: "2.5kW", price: "$1,950" }', '{ kw: "2.5kW", price: "$1,990" }'),
    ('{ kw: "3.5kW", price: "$2,400" }', '{ kw: "3.5kW", price: "$2,290" }'),
    ('{ kw: "5.0kW", price: "$3,000" }', '{ kw: "5.0kW", price: "$2,890" }'),
    ('{ kw: "7.1kW", price: "$3,500" }', '{ kw: "7.1kW", price: "$3,390" }'),
    # Daikin Zena
    ('{ kw: "2.5kW", model: "FTXJ25TVMAW / K", price: "$1,850" }', '{ kw: "2.5kW", model: "FTXJ25TVMAW / K", price: "$2,190" }'),
    ('{ kw: "3.5kW", model: "FTXJ35TVMAW / K", price: "$2,050" }', '{ kw: "3.5kW", model: "FTXJ35TVMAW / K", price: "$2,490" }'),
    ('{ kw: "5.0kW", model: "FTXJ50TVMAW / K", price: "$2,450" }', '{ kw: "5.0kW", model: "FTXJ50TVMAW / K", price: "$3,090" }'),
    ('{ kw: "6.0kW", model: "FTXJ60TVMAW / K", price: "$2,700" }', '{ kw: "6.0kW", model: "FTXJ60TVMAW / K", price: "$3,390" }'),
    # Rinnai PB/PX: replace both occurrences for each common size.
    ('{ kw: "2.5kW", price: "$1,450" }', '{ kw: "2.5kW", price: "$1,590" }'),
    ('{ kw: "3.5kW", price: "$1,550" }', '{ kw: "3.5kW", price: "$1,690" }'),
    ('{ kw: "5.0kW", price: "$1,900" }', '{ kw: "5.0kW", price: "$1,990" }'),
    ('{ kw: "7.0kW", price: "$2,300" }', '{ kw: "7.0kW", price: "$2,390" }'),
    ('{ kw: "7.1kW", price: "$2,300" }', '{ kw: "7.1kW", price: "$2,390" }'),
    # Mitsubishi Electric AP - at least $200 over comparable Cora sizes.
    ('{ kw: "2.5kW", price: "$1,799" }', '{ kw: "2.5kW", price: "$1,890" }'),
    ('{ kw: "3.5kW", price: "$1,999" }', '{ kw: "3.5kW", price: "$2,090" }'),
    ('{ kw: "5.0kW", price: "$2,699" }', '{ kw: "5.0kW", price: "$2,690" }'),
    ('{ kw: "7.1kW", price: "$3,199" }', '{ kw: "7.1kW", price: "$3,190" }'),
    # Mitsubishi Heavy Industries Ciara
    ('{ kw: "2.0kW", price: "$1,450" }', '{ kw: "2.0kW", price: "$1,790" }'),
    ('{ kw: "2.5kW", price: "$1,590" }', '{ kw: "2.5kW", price: "$1,890" }'),
    ('{ kw: "3.3kW", price: "$1,790" }', '{ kw: "3.3kW", price: "$2,090" }'),
    ('{ kw: "5.0kW", price: "$2,250" }', '{ kw: "5.0kW", price: "$2,690" }'),
    ('{ kw: "6.3kW", price: "$2,590" }', '{ kw: "6.3kW", price: "$2,890" }'),
    ('{ kw: "7.1kW", price: "$2,690" }', '{ kw: "7.1kW", price: "$2,990" }'),
    # Fujitsu Lifestyle
    ('{ kw: "2.5kW", model: "ASTG09KMTC", price: "$1,550" }', '{ kw: "2.5kW", model: "ASTG09KMTC", price: "$1,890" }'),
    ('{ kw: "3.5kW", model: "ASTG12KMTC", price: "$1,700" }', '{ kw: "3.5kW", model: "ASTG12KMTC", price: "$2,090" }'),
    ('{ kw: "5.0kW", model: "ASTG18KMTC", price: "$2,200" }', '{ kw: "5.0kW", model: "ASTG18KMTC", price: "$2,690" }'),
    ('{ kw: "6.0kW", model: "ASTG22KMTC", price: "$2,450" }', '{ kw: "6.0kW", model: "ASTG22KMTC", price: "$2,890" }'),
    ('{ kw: "7.1kW", model: "ASTG24KMTC", price: "$2,650" }', '{ kw: "7.1kW", model: "ASTG24KMTC", price: "$2,990" }'),
    # Samsung WindFree
    ('{ kw: "2.5kW", model: "AR09DXEANWKNSA", price: "$1,650" }', '{ kw: "2.5kW", model: "AR09DXEANWKNSA", price: "$1,890" }'),
    ('{ kw: "3.5kW", model: "AR12DXEANWKNSA", price: "$1,800" }', '{ kw: "3.5kW", model: "AR12DXEANWKNSA", price: "$2,090" }'),
    ('{ kw: "5.0kW", model: "AR18DXEANWKNSA", price: "$2,300" }', '{ kw: "5.0kW", model: "AR18DXEANWKNSA", price: "$2,690" }'),
    ('{ kw: "7.0kW", model: "AR24DXEANWKNSA", price: "$2,700" }', '{ kw: "7.0kW", model: "AR24DXEANWKNSA", price: "$2,990" }'),
    ('{ kw: "8.0kW", model: "AR30DXEANWKNSA", price: "$3,100" }', '{ kw: "8.0kW", model: "AR30DXEANWKNSA", price: "$3,290" }'),
]
replace_all("src/lib/data.js", price_replacements)

# PB and PX each contain the same 2.5/3.5/5.0 price strings; the generic replacements
# above only replace the first occurrence. Ensure the second range matches too.
replace_all("src/lib/data.js", [
    ('{ kw: "2.5kW", price: "$1,450" }', '{ kw: "2.5kW", price: "$1,590" }'),
    ('{ kw: "3.5kW", price: "$1,550" }', '{ kw: "3.5kW", price: "$1,690" }'),
    ('{ kw: "5.0kW", price: "$1,900" }', '{ kw: "5.0kW", price: "$1,990" }'),
])

# 2) Reuse the existing SplitSystems page for local SEO landing routes.
app_path = ROOT / "src/App.js"
app = app_path.read_text(encoding="utf-8")
route_anchor = '          <Route path="/split-systems" element={<SplitSystems />} />\n'
regional_routes = route_anchor + ''.join([
    '          <Route path="/split-systems/oran-park" element={<SplitSystems />} />\n',
    '          <Route path="/split-systems/willoughby-north-sydney" element={<SplitSystems />} />\n',
    '          <Route path="/split-systems/central-coast-newcastle" element={<SplitSystems />} />\n',
    '          <Route path="/split-systems/wollongong" element={<SplitSystems />} />\n',
    '          <Route path="/split-systems/quakers-hill-austral-richmond" element={<SplitSystems />} />\n',
])
if '/split-systems/oran-park' not in app:
    if route_anchor not in app:
        raise RuntimeError("Split system route anchor not found in App.js")
    app = app.replace(route_anchor, regional_routes, 1)
    app_path.write_text(app, encoding="utf-8")

split_path = ROOT / "src/pages/SplitSystems.jsx"
split = split_path.read_text(encoding="utf-8")nsplit = None
