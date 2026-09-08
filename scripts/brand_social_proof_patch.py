from pathlib import Path

path = Path("src/pages/BrandPage.jsx")
text = path.read_text(encoding="utf-8")

old_import = 'import { SPLIT_BRANDS, FORM_TRUST_STRIP, FEATURED_REVIEW, PHONE_TEL } from "../lib/data";'
new_import = 'import { SPLIT_BRANDS, FEATURED_REVIEW, PHONE_TEL } from "../lib/data";'
if old_import in text:
    text = text.replace(old_import, new_import)

old_strip = '''                {FORM_TRUST_STRIP.slice(0, 5).map((t) => (
                  <li key={t} className="flex items-center gap-1.5 text-xs font-medium text-white/70">
                    <Check className="h-3.5 w-3.5 text-[#C8A46A]" strokeWidth={2.5} /> {t}
                  </li>
                ))}'''
new_strip = '''                {[
                  "Minimum 5-Year Manufacturer Warranty",
                  "SplitsPro Workmanship Guarantee",
                  "Licensed & Insured",
                  "Standard installation pricing shown above",
                  "Any extras confirmed before work starts",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-1.5 text-xs font-medium text-white/70">
                    <Check className="h-3.5 w-3.5 text-[#C8A46A]" strokeWidth={2.5} /> {t}
                  </li>
                ))}'''
if old_strip not in text:
    raise SystemExit("Could not find old brand booking trust strip")
text = text.replace(old_strip, new_strip)

path.write_text(text, encoding="utf-8")
print("Removed Home Comfort Plan language from brand booking trust strip")
