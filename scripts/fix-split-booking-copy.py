from pathlib import Path

p = Path('src/pages/HomeComfortPage.jsx')
text = p.read_text(encoding='utf-8')
old = '{["Complimentary — normally valued over $200", "Fixed written quote", "Licensed & insured", "No pressure, no obligation"].map((t) => ('
new = '{(bookingForm ? ["Free booking request", "Final price confirmed before work", "Licensed & insured", "No pressure, no obligation"] : ["Complimentary — normally valued over $200", "Fixed written quote", "Licensed & insured", "No pressure, no obligation"]).map((t) => ('
if new not in text:
    if old not in text:
        raise SystemExit('Booking trust-strip copy not found')
    text = text.replace(old, new, 1)
p.write_text(text, encoding='utf-8')
print('Split booking trust copy cleaned up')
