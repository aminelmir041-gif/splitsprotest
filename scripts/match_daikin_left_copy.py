from pathlib import Path

path = Path('src/pages/BrandPage.jsx')
text = path.read_text(encoding='utf-8')

replacements = [
    (
        'grid gap-12 lg:grid-cols-[1fr_1.08fr] lg:items-center lg:gap-16',
        'grid gap-12 lg:grid-cols-[0.98fr_1.08fr] lg:items-center lg:gap-16'
    ),
    (
        'className="mt-5 max-w-3xl">\n                <p className="leading-relaxed text-[#6E6E73]">{brand.body}</p>',
        'className="mt-7 max-w-[620px]">\n                <p className="text-[17px] leading-[1.65] text-[#5F6065] sm:text-[19px] lg:text-[20px] lg:leading-[1.72]">{brand.body}</p>'
    ),
    (
        'className="mt-8 flex flex-wrap items-center gap-2" data-testid="range-tabs"',
        'className="mt-10 flex flex-wrap items-center gap-3" data-testid="range-tabs"'
    ),
    (
        'className="rounded-full border border-[#0B0B0B]/15 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0B0B0B] transition-all hover:border-[#C8A46A] hover:text-[#C8A46A]"',
        'className="rounded-full border border-[#0B0B0B]/18 bg-white px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0B0B0B] transition-all hover:border-[#C8A46A] hover:text-[#C8A46A] sm:px-7 sm:py-3 sm:text-[13px]"'
    ),
    (
        'lg:absolute lg:left-[7%] lg:top-[325px] lg:w-[34%]',
        'lg:absolute lg:left-[7%] lg:top-[335px] lg:w-[34%]'
    ),
    (
        'lg:absolute lg:right-[2%] lg:top-[165px] lg:w-[50%]',
        'lg:absolute lg:right-0 lg:top-[175px] lg:w-[50%]'
    ),
]

for old, new in replacements:
    if old not in text:
        raise SystemExit(f'Could not find expected snippet: {old[:90]}')
    text = text.replace(old, new, 1)

path.write_text(text, encoding='utf-8')
