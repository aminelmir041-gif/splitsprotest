from pathlib import Path

p = Path('split-system-cleaning-offer/index.html')
text = p.read_text(encoding='utf-8')
old = 'https://www.canva.com/design/DAHVXLREICQ/view?embed&autoplay=1&muted=0&loop=0'
new = 'https://www.canva.com/d/jYZX7MZCthcMjKy?embed=1&autoplay=1&muted=0&loop=0'
if old not in text:
    raise SystemExit('Current Canva embed URL not found')
text = text.replace(old, new, 1)
p.write_text(text, encoding='utf-8')
