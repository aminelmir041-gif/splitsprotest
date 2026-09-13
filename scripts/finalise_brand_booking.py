from pathlib import Path

path = Path('src/pages/BrandPage.jsx')
text = path.read_text(encoding='utf-8')

old = '''                submitLabel={submitLabel}\n                compact\n              />'''
new = '''                submitLabel={submitLabel}\n                compact\n                hideMessage\n              />'''
if old in text:
    text = text.replace(old, new, 1)

text = text.replace('                  "Licensed & Insured",\n', '', 1)

path.write_text(text, encoding='utf-8')
