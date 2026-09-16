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
                A qualifying back-to-back install is a short, direct ground-floor installation. The refrigeration pipework can run straight horizontally or vertically, with under 2 metres of pipework and one bend or less.
              </p>
            </div>

            <div className="mt-10 overflow-hidden rounded-[22px] border border-[#2A2A2A] bg-[#0B0B0B] shadow-lg" data-testid="back-to-back-layout-diagrams">
              <div className="grid border-b border-white/10 bg-[#101010] lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="px-6 py-5 sm:px-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D7AE61]">Back-to-back installation</p>
                  <h3 className="mt-1 font-serif text-2xl font-medium text-white sm:text-3xl">Straight line. Simple install.</h3>
                </div>
                <div className="border-t border-white/10 px-6 py-4 lg:border-l lg:border-t-0 sm:px-8">
                  <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-[#F0C46E]">Under 2 metres of piping</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2">
                <article className="overflow-hidden border-b border-white/10 bg-[#101010] lg:border-b-0 lg:border-r">
                  <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 sm:px-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F0C46E]">Horizontal installation</p>
                      <p className="mt-1 text-sm font-semibold text-white">Straight horizontal pipe route</p>
                    </div>
                    <span className="rounded-full border border-[#C8A46A]/45 bg-[#C8A46A]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#F0C46E]">Under 2m</span>
                  </div>
                  <div className="bg-black">
                    <img
                      src={`${process.env.PUBLIC_URL || ""}/installs/rinnai-horizontal-example.webp`}
                      alt="Horizontal Rinnai back-to-back installation example with straight trunking under two metres"
                      className="block h-auto w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="px-5 py-4 sm:px-6">
                    <p className="text-sm leading-relaxed text-white/70">Outdoor unit mounted at a practical height on a wall bracket, with the refrigeration pipework covered by straight white trunking running horizontally.</p>
                  </div>
                </article>

                <article className="overflow-hidden bg-[#101010]">
                  <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 sm:px-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F0C46E]">Vertical installation</p>
                      <p className="mt-1 text-sm font-semibold text-white">Straight vertical pipe route</p>
                    </div>
                    <span className="rounded-full border border-[#C8A46A]/45 bg-[#C8A46A]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#F0C46E]">Under 2m</span>
                  </div>
                  <div className="bg-black">
                    <img
                      src={`${process.env.PUBLIC_URL || ""}/installs/rinnai-vertical-example.webp`}
                      alt="Vertical Rinnai back-to-back installation example with straight trunking under two metres"
                      className="block h-auto w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="px-5 py-4 sm:px-6">
                    <p className="text-sm leading-relaxed text-white/70">Outdoor unit on the floor or a wall bracket, with the refrigeration pipework travelling straight vertically inside white trunking.</p>
                  </div>
                </article>
              </div>

              <div className="grid grid-cols-2 border-t border-white/10 bg-[#101010] sm:grid-cols-3 lg:grid-cols-6" data-testid="back-to-back-inclusions">
                {[
                  ["Under 2 metres", "of refrigeration piping"],
                  ["Straight line", "vertical or horizontal"],
                  ["1 bend or less", "in the pipe route"],
                  ["Ground floor", "installation"],
                  ["Under 10 metres", "electrical run"],
                  ["Electricals included", "standard connection"],
                ].map(([title, sub], index) => (
                  <div key={title} className={`px-4 py-5 text-center ${index % 2 ? "border-l border-white/10" : ""} sm:border-l sm:first:border-l-0`}>
                    <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#C8A46A]/60 text-[#F0C46E]">
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                    <p className="mt-3 text-xs font-bold text-white">{title}</p>
                    <p className="mt-1 text-[10px] leading-relaxed text-white/50">{sub}</p>
                  </div>
                ))}
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
print("updated: back-to-back section now uses the approved horizontal and vertical examples")
