from pathlib import Path

# PageHero: add a desktop-only standard brand banner while preserving mobile.
path = Path('src/components/sections.jsx')
text = path.read_text(encoding='utf-8')
text = text.replace(
    'export const PageHero = ({ overline, title, sub, image, note, imgPos = "object-center" }) => {',
    'export const PageHero = ({ overline, title, sub, image, note, imgPos = "object-center", desktopBrand = false }) => {'
)
old = '''  if (image) {
    return (
      <section className="relative flex min-h-[58vh] items-end overflow-hidden">
        <div className="img-reveal absolute inset-0 -z-10">
          <motion.img src={image} alt={title} initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }} className={`h-full w-full object-cover ${imgPos}`} />
          <div className="absolute inset-0 hero-overlay-lr" />
          <div className="absolute inset-0 hero-overlay-base" />
        </div>
        <div className="sp-container pb-16 pt-40">
          <Reveal><Overline light>{overline}</Overline></Reveal>
          <Reveal delay={0.05}><h1 className="mt-5 max-w-4xl font-serif text-5xl font-medium leading-none tracking-tight text-white md:text-6xl lg:text-7xl text-balance">{title}</h1></Reveal>
          {sub && <Reveal delay={0.1}><p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">{sub}</p></Reveal>}
        </div>
      </section>
    );
  }'''
new = '''  if (image) {
    return (
      <>
        <section className={`${desktopBrand ? "lg:hidden" : ""} relative flex min-h-[58vh] items-end overflow-hidden`}>
          <div className="img-reveal absolute inset-0 -z-10">
            <motion.img src={image} alt={title} initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }} className={`h-full w-full object-cover ${imgPos}`} />
            <div className="absolute inset-0 hero-overlay-lr" />
            <div className="absolute inset-0 hero-overlay-base" />
          </div>
          <div className="sp-container pb-16 pt-40">
            <Reveal><Overline light>{overline}</Overline></Reveal>
            <Reveal delay={0.05}><h1 className="mt-5 max-w-4xl font-serif text-5xl font-medium leading-none tracking-tight text-white md:text-6xl lg:text-7xl text-balance">{title}</h1></Reveal>
            {sub && <Reveal delay={0.1}><p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">{sub}</p></Reveal>}
          </div>
        </section>
        {desktopBrand && (
          <section className="relative hidden h-[390px] items-end overflow-hidden bg-[#17191C] lg:flex">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(200,164,106,0.18),transparent_34%),linear-gradient(110deg,#0B0B0B_0%,#17191C_62%,#25272A_100%)]" />
            <div aria-hidden className="absolute right-[7%] top-1/2 h-[250px] w-[430px] -translate-y-1/2 rounded-full border border-white/[0.035]" />
            <div className="sp-container relative z-10 pb-12 pt-24">
              <Reveal><Overline light>{overline}</Overline></Reveal>
              <Reveal delay={0.05}><h1 className="mt-5 max-w-5xl font-serif text-[58px] font-medium leading-[0.98] tracking-tight text-white text-balance">{title}</h1></Reveal>
              {sub && <Reveal delay={0.1}><p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/75">{sub}</p></Reveal>}
            </div>
          </section>
        )}
      </>
    );
  }'''
if old not in text:
    raise SystemExit('PageHero image block not found')
text = text.replace(old, new, 1)
path.write_text(text, encoding='utf-8')

# BrandPage: enable desktop standard hero and compact form for brand landing pages.
path = Path('src/pages/BrandPage.jsx')
text = path.read_text(encoding='utf-8')
old_hero = '<PageHero overline={brand.brand} title={brand.h1} sub={brand.tagline} image={brand.image} />'
new_hero = '<PageHero overline={brand.brand} title={brand.h1} sub={brand.tagline} image={brand.image} desktopBrand />'
if old_hero not in text:
    raise SystemExit('Brand PageHero call not found')
text = text.replace(old_hero, new_hero, 1)
old_form = '''                submitLabel={submitLabel}
              />'''
new_form = '''                submitLabel={submitLabel}
                compact
              />'''
if old_form not in text:
    raise SystemExit('Brand QuoteForm call not found')
text = text.replace(old_form, new_form, 1)
path.write_text(text, encoding='utf-8')

# QuoteForm: compact mode asks only Name, Phone and Suburb, keeping optional photo.
path = Path('src/components/QuoteForm.jsx')
text = path.read_text(encoding='utf-8')
old_sig = 'export const QuoteForm = ({ onDark = false, defaultService = "", defaultMessage = "", submitLabel = "Get Free Quote & Plan" }) => {'
new_sig = 'export const QuoteForm = ({ onDark = false, defaultService = "", defaultMessage = "", submitLabel = "Get Free Quote & Plan", compact = false }) => {'
if old_sig not in text:
    raise SystemExit('QuoteForm signature not found')
text = text.replace(old_sig, new_sig, 1)
text = text.replace(
    '<p className={`mt-2 ${onDark ? "text-white/70" : "text-[#6E6E73]"}`}>One of our team will call you shortly to arrange your free quote and plan.</p>',
    '<p className={`mt-2 ${onDark ? "text-white/70" : "text-[#6E6E73]"}`}>{compact ? "We’ll call you shortly to confirm the installation details." : "One of our team will call you shortly to arrange your free quote and plan."}</p>'
)
old_details = '''      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="q-email" className={labelClass}>Email (optional)</label>
          <Input id="q-email" type="email" data-testid="quote-email-input" value={form.email}
            onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="q-suburb" className={labelClass}>Suburb</label>
          <Input id="q-suburb" data-testid="quote-suburb-input" value={form.suburb}
            onChange={(e) => update("suburb", e.target.value)} placeholder="Enter your suburb" className={fieldClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Service Required</label>
        <Select value={form.service} onValueChange={(v) => update("service", v)}>
          <SelectTrigger data-testid="quote-service-select"
            className="h-12 rounded-sm border-0 border-b border-[#E5E5EA] bg-transparent px-0 text-[#1D1D1F] shadow-none focus:ring-0 data-[placeholder]:text-[#6E6E73]/60">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="q-message" className={labelClass}>Message (optional)</label>
        <Textarea id="q-message" data-testid="quote-message-input" value={form.message}
          onChange={(e) => update("message", e.target.value)} placeholder="Tell us a little about your home or the system you have in mind…"
          className="min-h-24 rounded-sm border-0 border-b border-[#E5E5EA] bg-transparent px-0 text-[#1D1D1F] shadow-none focus-visible:border-[#C8A46A] focus-visible:ring-0 placeholder:text-[#6E6E73]/60" />
      </div>'''
new_details = '''      {compact ? (
        <div>
          <label htmlFor="q-suburb" className={labelClass}>Suburb</label>
          <Input id="q-suburb" data-testid="quote-suburb-input" value={form.suburb}
            onChange={(e) => update("suburb", e.target.value)} placeholder="Enter your suburb" className={fieldClass} />
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="q-email" className={labelClass}>Email (optional)</label>
              <Input id="q-email" type="email" data-testid="quote-email-input" value={form.email}
                onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" className={fieldClass} />
            </div>
            <div>
              <label htmlFor="q-suburb" className={labelClass}>Suburb</label>
              <Input id="q-suburb" data-testid="quote-suburb-input" value={form.suburb}
                onChange={(e) => update("suburb", e.target.value)} placeholder="Enter your suburb" className={fieldClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Service Required</label>
            <Select value={form.service} onValueChange={(v) => update("service", v)}>
              <SelectTrigger data-testid="quote-service-select"
                className="h-12 rounded-sm border-0 border-b border-[#E5E5EA] bg-transparent px-0 text-[#1D1D1F] shadow-none focus:ring-0 data-[placeholder]:text-[#6E6E73]/60">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="q-message" className={labelClass}>Message (optional)</label>
            <Textarea id="q-message" data-testid="quote-message-input" value={form.message}
              onChange={(e) => update("message", e.target.value)} placeholder="Tell us a little about your home or the system you have in mind…"
              className="min-h-24 rounded-sm border-0 border-b border-[#E5E5EA] bg-transparent px-0 text-[#1D1D1F] shadow-none focus-visible:border-[#C8A46A] focus-visible:ring-0 placeholder:text-[#6E6E73]/60" />
          </div>
        </>
      )}'''
if old_details not in text:
    raise SystemExit('QuoteForm detail fields block not found')
text = text.replace(old_details, new_details, 1)
path.write_text(text, encoding='utf-8')
