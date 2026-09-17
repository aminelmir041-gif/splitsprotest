from pathlib import Path

path = Path("src/pages/BrandPage.jsx")
text = path.read_text()
original = text

text = text.replace(
    'const RINNAI_LOCAL_DISCOUNT_LABEL = "12% OFF";',
    'const RINNAI_LOCAL_DISCOUNT_LABEL = "LOCAL DEAL";'
)

old_prices = '''    prices: [
      { kw: "2.5kW", price: "$1,590" },
      { kw: "3.5kW", price: "$1,690" },
      { kw: "5.0kW", price: "$1,990" },
      { kw: "7.0kW", price: "$2,390" },
    ],'''
new_prices = '''    prices: [
      { kw: "2.5kW", price: "$1,590", localOfferPrice: "$1,400" },
      { kw: "3.5kW", price: "$1,690", localOfferPrice: "$1,500" },
      { kw: "5.0kW", price: "$1,990", localOfferPrice: "$1,750" },
      { kw: "7.1kW", price: "$2,390", localOfferPrice: "$2,100" },
    ],'''

if old_prices not in text and new_prices not in text:
    raise SystemExit("Rinnai local price block not found; refusing to patch")
text = text.replace(old_prices, new_prices)

old_submit = '''                submitLabel={submitLabel}
                compact
                hideMessage
              />'''
new_submit = '''                submitLabel={isRinnaiLocalOffer ? "Get My Installed Price" : submitLabel}
                compact
                hideMessage
                hidePhoto={isRinnaiLocalOffer}
              />'''

if old_submit not in text and new_submit not in text:
    raise SystemExit("Quote form block not found; refusing to patch")
text = text.replace(old_submit, new_submit)

if text == original:
    print("Rinnai local campaign source already up to date")
else:
    path.write_text(text)
    print("Updated Rinnai local campaign source")
