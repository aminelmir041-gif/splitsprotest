from pathlib import Path

PATH = Path("src/pages/BrandPage.jsx")
text = PATH.read_text()


def swap(old, new, label):
    global text
    if old in text:
        text = text.replace(old, new, 1)
        print(f"updated: {label}")
    elif new in text:
        print(f"already updated: {label}")
    else:
        print(f"warning: could not find target for {label}")


swap(
    '      ? "I\'d like to check eligibility for the local Rinnai back-to-back installation offer near Bass Hill Plaza."',
    '      ? "I\'d like to check eligibility for the local Rinnai back-to-back installation offer."',
    "default local-offer enquiry copy",
)

swap(
    '    ? "Limited-time local Rinnai split system sale for selected suburbs around Bankstown, Bass Hill and Chester Hill. Supplied and installed back-to-back by licensed SplitsPro technicians."',
    '    ? "Limited-time Rinnai split system sale for Bankstown, Bass Hill, Chester Hill and nearby listed local areas. Supplied and installed back-to-back by licensed SplitsPro technicians."',
    "meta description",
)

swap(
    '        sub={isRinnaiLocalOffer ? "Limited-time supplied & installed back-to-back pricing for selected local suburbs around Bass Hill Plaza." : brand.tagline}',
    '        sub={isRinnaiLocalOffer ? "Limited-time Rinnai supplied & installed back-to-back sale." : brand.tagline}',
    "hero subtitle",
)

swap(
    '''                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Bankstown · Bass Hill · Chester Hill · nearby suburbs</span>''',
    '''                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Bankstown · Bass Hill · Chester Hill · Local Offer</span>''',
    "hero local-area label",
)

swap(
    '''              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70">
                Local sale pricing applies to qualifying single-storey back-to-back installations in selected suburbs roughly within 25 minutes of Bass Hill Plaza. Enter your suburb below and we&apos;ll confirm eligibility before booking.
              </p>''',
    '''              <div className="mt-4" data-testid="rinnai-local-areas-hero">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#E4CFA6]">Local offer areas</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Bankstown", "Bass Hill", "Chester Hill", "Yagoona", "Greenacre", "Georges Hall", "Condell Park", "Sefton", "Regents Park", "Villawood"].map((area) => (
                    <span key={area} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85">{area}</span>
                  ))}
                </div>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70">
                Sale prices are for the back-to-back installation conditions explained below. Any non-standard work is quoted before the job proceeds.
              </p>''',
    "hero suburb chips",
)

swap(
    '''                  ? "This local Rinnai sale uses the same PB Series and PX Series options shown on our main Rinnai page, with a limited-time discount for qualifying back-to-back installs close to our Bass Hill base. Choose your size below, then send your suburb and we will confirm the offer applies before the job is booked."''',
    '''                  ? "This local Rinnai sale uses the same PB Series and PX Series options shown on our main Rinnai page, with a limited-time discount on qualifying back-to-back installations. Choose your size below and book the offer."''',
    "offer intro copy",
)

swap(
    '''              <p className="mt-4 max-w-2xl leading-relaxed text-[#6E6E73]">For this sale, a back-to-back installation means a simple single-storey layout with the indoor and outdoor units positioned in a straight line vertically or horizontally.</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "Indoor and outdoor units aligned vertically or horizontally",
                  "Under 1 metre of refrigeration pipework",
                  "One bend or less in the pipe route",
                  "Outdoor unit on a wall bracket or on the floor",
                  "Standard electrical work for the installation included",
                  "Single-storey property",
                ].map((item) => (''',
    '''              <p className="mt-4 max-w-2xl leading-relaxed text-[#6E6E73]">For this sale, a back-to-back installation means a simple ground-floor installation with the indoor and outdoor units positioned in a straight line vertically or horizontally.</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "Indoor and outdoor units aligned in a straight line vertically or horizontally",
                  "Under 2 metres of refrigeration pipework",
                  "One bend or less in the pipe route",
                  "Outdoor unit on a wall bracket or on the floor",
                  "Ground-floor installation",
                  "Electrical cable run under 10 metres",
                  "Standard electrical work for the installation included",
                ].map((item) => (''',
    "back-to-back definition",
)

swap(
    '''            <div className="rounded-2xl border border-[#E5E5EA] bg-white p-6 soft-shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A46A]">Local offer area</p>
              <h3 className="mt-3 font-serif text-2xl text-[#0B0B0B]">Around Bass Hill Plaza</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#6E6E73]">Bankstown, Bass Hill and Chester Hill are the core sale area, plus selected nearby suburbs roughly within 25 minutes&apos; drive of Bass Hill Plaza.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Bankstown", "Bass Hill", "Chester Hill", "Yagoona", "Greenacre", "Georges Hall", "Condell Park", "Sefton", "Regents Park", "Villawood"].map((area) => (
                  <span key={area} className="rounded-full border border-[#E5E5EA] bg-[#FBFAF8] px-3 py-1.5 text-xs font-semibold text-[#4E4E52]">{area}</span>
                ))}
              </div>
              <a href="#book" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#0B0B0B] border border-[#C8A46A]/60 px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white">Check My Suburb <ArrowUpRight className="h-4 w-4" /></a>
            </div>''',
    '''            <div className="rounded-2xl border border-[#E5E5EA] bg-white p-6 soft-shadow-sm" data-testid="back-to-back-example">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A46A]">Example back-to-back installation</p>
              <h3 className="mt-3 font-serif text-2xl text-[#0B0B0B]">A short, direct indoor-to-outdoor run</h3>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <figure className="overflow-hidden rounded-xl border border-[#E5E5EA] bg-[#FBFAF8]">
                  <img src={`${process.env.PUBLIC_URL || ""}/installs/rinnai-indoor.webp`} alt="Rinnai indoor split system installation example" className="h-40 w-full object-cover sm:h-48" loading="lazy" />
                  <figcaption className="px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-[#6E6E73]">Indoor unit</figcaption>
                </figure>
                <figure className="overflow-hidden rounded-xl border border-[#E5E5EA] bg-[#FBFAF8]">
                  <img src={`${process.env.PUBLIC_URL || ""}/installs/rinnai-outdoor.webp`} alt="Rinnai outdoor split system installation example" className="h-40 w-full object-cover sm:h-48" loading="lazy" />
                  <figcaption className="px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-[#6E6E73]">Outdoor unit</figcaption>
                </figure>
              </div>
              <div className="mt-4 rounded-xl bg-[#0B0B0B] px-4 py-4 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E4CFA6]">Indoor unit → short straight pipe run → outdoor unit</p>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#6E6E73]">This is the type of simple layout the sale is designed for: ground-floor access, under 2 metres of refrigeration pipe, one bend or less, and less than 10 metres of electrical run.</p>
            </div>''',
    "back-to-back visual example",
)

# Keep the standard qualification note aligned with the offer definition.
swap(
    'Standard electrical work is included for the qualifying installation. Switchboard defects, upgrades, asbestos-related work or other site conditions outside the standard installation are discussed and approved before any extra work proceeds.',
    'Standard electrical work is included for a qualifying ground-floor installation with less than 10 metres of electrical run. Switchboard defects, upgrades, asbestos-related work or other site conditions outside the standard installation are discussed and approved before any extra work proceeds.',
    "electrical qualification note",
)

PATH.write_text(text)
print("Rinnai local offer refinement complete")
