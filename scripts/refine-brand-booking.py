from pathlib import Path

# Keep the compact brand form lean, but restore optional email.
q = Path('src/components/QuoteForm.jsx')
text = q.read_text(encoding='utf-8')
old = '''      {compact ? (\n        <div>\n          <label htmlFor="q-suburb" className={labelClass}>Suburb</label>\n          <Input id="q-suburb" data-testid="quote-suburb-input" value={form.suburb}\n            onChange={(e) => update("suburb", e.target.value)} placeholder="Enter your suburb" className={fieldClass} />\n        </div>\n      ) : ('''
new = '''      {compact ? (\n        <div className="grid gap-5 sm:grid-cols-2">\n          <div>\n            <label htmlFor="q-email" className={labelClass}>Email (optional)</label>\n            <Input id="q-email" type="email" data-testid="quote-email-input" value={form.email}\n              onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" className={fieldClass} />\n          </div>\n          <div>\n            <label htmlFor="q-suburb" className={labelClass}>Suburb</label>\n            <Input id="q-suburb" data-testid="quote-suburb-input" value={form.suburb}\n              onChange={(e) => update("suburb", e.target.value)} placeholder="Enter your suburb" className={fieldClass} />\n          </div>\n        </div>\n      ) : ('''
if old not in text:
    raise SystemExit('Compact form block not found')
text = text.replace(old, new, 1)
q.write_text(text, encoding='utf-8')

# Replace generic booking copy with practical friction-removal reassurance.
b = Path('src/pages/BrandPage.jsx')
text = b.read_text(encoding='utf-8')
old = '''            <p className="mt-6 max-w-md leading-relaxed text-white/70">\n              Choose your system above, then send us your details to confirm the installation. Prefer to speak now? Call us directly.\n            </p>'''
new = '''            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">\n              A standard split-system installation is usually a small, contained job. You can normally keep using the rest of your home while we work.\n            </p>\n            <div className="mt-8 grid max-w-lg gap-5" data-testid="installation-reassurance">\n              <div className="flex items-start gap-3">\n                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A46A]" />\n                <div><p className="font-semibold text-white">Small work area</p><p className="mt-1 text-sm leading-relaxed text-white/60">We only need access around the indoor and outdoor unit positions, not your whole home.</p></div>\n              </div>\n              <div className="flex items-start gap-3">\n                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A46A]" />\n                <div><p className="font-semibold text-white">Minimal disruption</p><p className="mt-1 text-sm leading-relaxed text-white/60">You can normally carry on using the rest of the house while the installation is underway.</p></div>\n              </div>\n              <div className="flex items-start gap-3">\n                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A46A]" />\n                <div><p className="font-semibold text-white">Power stays on</p><p className="mt-1 text-sm leading-relaxed text-white/60">Only the necessary circuit is isolated for the electrical connection, usually for about 10–15 minutes on a standard job.</p></div>\n              </div>\n              <div className="flex items-start gap-3">\n                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A46A]" />\n                <div><p className="font-semibold text-white">Clean when we leave</p><p className="mt-1 text-sm leading-relaxed text-white/60">We manage the mess as we work, pack everything up and leave the installation area neat and tidy.</p></div>\n              </div>\n            </div>'''
if old not in text:
    raise SystemExit('Booking reassurance paragraph not found')
text = text.replace(old, new, 1)
text = text.replace('                  "Licensed & Insured",\n', '', 1)
b.write_text(text, encoding='utf-8')
