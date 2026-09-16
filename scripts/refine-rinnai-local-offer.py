from pathlib import Path
import re

PATH = Path("src/pages/BrandPage.jsx")
text = PATH.read_text()

text = text.replace(
    "advertised single-storey back-to-back terms",
    "advertised ground-floor back-to-back terms",
)
text = text.replace(
    "qualifying single-storey back-to-back installations: units aligned vertically or horizontally, under 1 metre of pipework, one bend or less, outdoor unit on a wall bracket or floor, with standard electrical work included.",
    "qualifying ground-floor back-to-back installations: units aligned vertically or horizontally, under 2 metres of refrigeration pipework, one bend or less, outdoor unit on a wall bracket or floor, electrical run under 10 metres, with standard electrical work included.",
)

section_pattern = re.compile(
    r'''      \{isRinnaiLocalOffer && \(\n        <section className="[^"]*" data-testid="back-to-back-explained">.*?      \)\}\n\n      \{/\* Ranges \+ pricing tables \*/\}''',
    re.S,
)

new_section = r'''      {isRinnaiLocalOffer && (
        <section className="border-y border-[#E8E6E1] bg-[#F8F7F4] py-14 sm:py-18" data-testid="back-to-back-explained">
          <div className="sp-container">
            <div className="mx-auto max-w-4xl text-center">
              <span className="overline text-[#C8A46A]">What the local price includes</span>
              <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-[#0B0B0B] sm:text-4xl lg:text-5xl">Back-to-back installation explained</h2>
              <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-[#6E6E73] sm:text-base">
                This is what qualifies for the advertised local Rinnai sale: a short, direct ground-floor installation with under 2 metres of refrigeration pipework, one bend or less and an electrical run under 10 metres.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-2" data-testid="back-to-back-layout-diagrams">
              <figure className="m-0 overflow-hidden rounded-2xl border border-[#E2DED7] bg-white shadow-sm">
                <figcaption className="flex items-end justify-between gap-4 border-b border-[#ECE8E1] px-5 py-4 sm:px-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A46A]">Horizontal</p>
                    <p className="mt-1 text-sm font-semibold text-[#0B0B0B] sm:text-base">Straight through the wall</p>
                  </div>
                  <span className="rounded-full border border-[#C8A46A]/40 bg-[#C8A46A]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8F6A34]">Under 2m pipe</span>
                </figcaption>
                <div className="relative aspect-[390/272] overflow-hidden bg-[#C9B7A8]">
                  <img
                    src={`${process.env.PUBLIC_URL || ""}/installs/rinnai-back-to-back-guide.webp`}
                    alt="Rinnai outdoor unit with a short straight horizontal pipe route under two metres"
                    className="absolute left-0 top-[-23.9%] block h-auto w-[192.307%] max-w-none"
                    loading="eager"
                  />
                </div>
                <p className="px-5 py-4 text-xs leading-relaxed text-[#6E6E73] sm:px-6">
                  The outdoor unit can sit close to the wall penetration with the refrigeration pipework running in one short, straight horizontal route.
                </p>
              </figure>

              <figure className="m-0 overflow-hidden rounded-2xl border border-[#E2DED7] bg-white shadow-sm">
                <figcaption className="flex items-end justify-between gap-4 border-b border-[#ECE8E1] px-5 py-4 sm:px-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A46A]">Vertical</p>
                    <p className="mt-1 text-sm font-semibold text-[#0B0B0B] sm:text-base">Straight up or down</p>
                  </div>
                  <span className="rounded-full border border-[#C8A46A]/40 bg-[#C8A46A]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8F6A34]">Under 2m pipe</span>
                </figcaption>
                <div className="relative aspect-[360/272] overflow-hidden bg-[#C9B7A8]">
                  <img
                    src={`${process.env.PUBLIC_URL || ""}/installs/rinnai-back-to-back-guide.webp`}
                    alt="Rinnai outdoor unit with a short straight vertical pipe route under two metres"
                    className="absolute left-[-108.33%] top-[-23.9%] block h-auto w-[208.333%] max-w-none"
                    loading="eager"
                  />
                </div>
                <p className="px-5 py-4 text-xs leading-relaxed text-[#6E6E73] sm:px-6">
                  The outdoor unit can sit on the floor or a wall bracket below the indoor unit with the pipework running in one short, straight vertical route.
                </p>
              </figure>
            </div>

            <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-2xl border border-[#E2DED7] bg-white sm:grid-cols-3 lg:grid-cols-6" data-testid="back-to-back-inclusions">
              <div className="flex min-h-[112px] flex-col items-center justify-center border-b border-r border-[#ECE8E1] p-4 text-center sm:border-b lg:border-b-0">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C8A46A]/50 text-[#C8A46A]"><MoveHorizontal className="h-4 w-4" /></span>
                <p className="mt-3 text-xs font-semibold text-[#0B0B0B]">Under 2 metres</p>
                <p className="mt-1 text-[10px] text-[#8A8A8E]">refrigeration pipe</p>
              </div>
              <div className="flex min-h-[112px] flex-col items-center justify-center border-b border-[#ECE8E1] p-4 text-center sm:border-r lg:border-b-0">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C8A46A]/50 text-[#C8A46A]"><MoveHorizontal className="h-4 w-4" /></span>
                <p className="mt-3 text-xs font-semibold text-[#0B0B0B]">Straight line</p>
                <p className="mt-1 text-[10px] text-[#8A8A8E]">vertical or horizontal</p>
              </div>
              <div className="flex min-h-[112px] flex-col items-center justify-center border-b border-r border-[#ECE8E1] p-4 text-center sm:border-b lg:border-b-0">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C8A46A]/50 text-[#C8A46A]"><ArrowDown className="h-4 w-4 -rotate-45" /></span>
                <p className="mt-3 text-xs font-semibold text-[#0B0B0B]">1 bend or less</p>
                <p className="mt-1 text-[10px] text-[#8A8A8E]">simple pipe route</p>
              </div>
              <div className="flex min-h-[112px] flex-col items-center justify-center border-b border-[#ECE8E1] p-4 text-center sm:border-r lg:border-b-0">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C8A46A]/50 text-[#C8A46A]"><LayoutGrid className="h-4 w-4" /></span>
                <p className="mt-3 text-xs font-semibold text-[#0B0B0B]">Ground floor</p>
                <p className="mt-1 text-[10px] text-[#8A8A8E]">installation</p>
              </div>
              <div className="flex min-h-[112px] flex-col items-center justify-center border-r border-[#ECE8E1] p-4 text-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C8A46A]/50 text-[#C8A46A]"><Zap className="h-4 w-4" /></span>
                <p className="mt-3 text-xs font-semibold text-[#0B0B0B]">Under 10 metres</p>
                <p className="mt-1 text-[10px] text-[#8A8A8E]">electrical run</p>
              </div>
              <div className="flex min-h-[112px] flex-col items-center justify-center p-4 text-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C8A46A]/50 text-[#C8A46A]"><Check className="h-4 w-4" /></span>
                <p className="mt-3 text-xs font-semibold text-[#0B0B0B]">Standard electricals</p>
                <p className="mt-1 text-[10px] text-[#8A8A8E]">included</p>
              </div>
            </div>

            <p className="mx-auto mt-6 max-w-4xl text-center text-xs leading-relaxed text-[#7A7A7E]">
              Outdoor unit can be installed on a wall bracket or on the floor. Switchboard defects, upgrades, asbestos-related work, difficult access or other non-standard site conditions are quoted before any extra work proceeds.
            </p>
          </div>
        </section>
      )}

      {/* Ranges + pricing tables */}'''

text, count = section_pattern.subn(new_section, text, count=1)
if not count:
    raise SystemExit("Could not find the back-to-back explanation section")

PATH.write_text(text)
print("updated: Rinnai back-to-back examples are integrated into the website layout without the embedded guide header or logo")
