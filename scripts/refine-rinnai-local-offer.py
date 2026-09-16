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

            <div className="mt-10 overflow-hidden rounded-[22px] border border-[#2A2A2A] bg-[#0B0B0B] shadow-xl" data-testid="back-to-back-layout-diagrams">
              <img
                src={`${process.env.PUBLIC_URL || ""}/installs/rinnai-back-to-back-guide.webp`}
                alt="Back-to-back Rinnai split system installation examples showing straight horizontal and vertical pipe routes under two metres"
                className="block h-auto w-full"
                loading="eager"
              />
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
print("updated: back-to-back section now uses the approved full-width guide image")
