from pathlib import Path
import re

PATH = Path("src/pages/BrandPage.jsx")
text = PATH.read_text()

# Keep local-offer wording aligned with the final advertised installation definition.
text = text.replace(
    "advertised single-storey back-to-back terms",
    "advertised ground-floor back-to-back terms",
)
text = text.replace(
    "qualifying single-storey back-to-back installations: units aligned vertically or horizontally, under 1 metre of pipework, one bend or less, outdoor unit on a wall bracket or floor, with standard electrical work included.",
    "qualifying ground-floor back-to-back installations: units aligned vertically or horizontally, under 2 metres of refrigeration pipework, one bend or less, outdoor unit on a wall bracket or floor, electrical run under 10 metres, with standard electrical work included.",
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
                A qualifying back-to-back install is a short, direct ground-floor installation. The pipe route can run straight horizontally through the wall or straight vertically up or down.
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2" data-testid="back-to-back-layout-diagrams">
              <article className="overflow-hidden rounded-2xl border border-[#DEDAD2] bg-white shadow-sm">
                <div className="flex items-center justify-between gap-4 border-b border-[#EEEAE2] px-5 py-4 sm:px-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A46A]">Horizontal installation</p>
                    <p className="mt-1 text-base font-semibold text-[#0B0B0B]">Straight through the wall</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-[#C8A46A]/45 bg-[#F7EEDC] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#8A642E]">Under 2m</span>
                </div>

                <div className="relative bg-[#ECE9E2]">
                  <img
                    src={`${process.env.PUBLIC_URL || ""}/installs/rinnai-outdoor.webp`}
                    alt="Rinnai outdoor unit example for a horizontal back-to-back installation"
                    className="h-72 w-full object-cover sm:h-80"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-5 pb-5 pt-16 sm:px-6">
                    <div className="flex items-center gap-3 text-white">
                      <span className="text-xl text-[#F0C46E]">←</span>
                      <div className="h-1 flex-1 rounded-full bg-white shadow" />
                      <span className="text-xl text-[#F0C46E]">→</span>
                    </div>
                    <p className="mt-2 text-center text-xs font-bold uppercase tracking-[0.16em] text-white">Straight horizontal pipe route · under 2 metres</p>
                  </div>
                </div>

                <div className="px-5 py-5 sm:px-6">
                  <p className="text-sm leading-relaxed text-[#5F5F63]">Outdoor unit mounted at a practical height on a wall bracket or positioned on the floor, with the refrigeration pipework running directly across to the wall penetration.</p>
                </div>
              </article>

              <article className="overflow-hidden rounded-2xl border border-[#DEDAD2] bg-white shadow-sm">
                <div className="flex items-center justify-between gap-4 border-b border-[#EEEAE2] px-5 py-4 sm:px-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A46A]">Vertical installation</p>
                    <p className="mt-1 text-base font-semibold text-[#0B0B0B]">Straight up or down</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-[#C8A46A]/45 bg-[#F7EEDC] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#8A642E]">Under 2m</span>
                </div>

                <div className="relative bg-[#ECE9E2]">
                  <img
                    src={`${process.env.PUBLIC_URL || ""}/installs/rinnai-outdoor.webp`}
                    alt="Rinnai outdoor unit example for a vertical back-to-back installation"
                    className="h-72 w-full object-cover sm:h-80"
                    loading="lazy"
                  />
                  <div className="absolute right-5 top-5 bottom-5 flex w-16 flex-col items-center justify-between rounded-full bg-black/65 px-2 py-3 text-[#F0C46E] backdrop-blur-sm">
                    <span className="text-xl">↑</span>
                    <span className="text-center text-[9px] font-extrabold uppercase leading-tight tracking-[0.1em] text-white">Under<br />2m</span>
                    <span className="text-xl">↓</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-5 pb-5 pt-16 sm:px-6">
                    <p className="text-center text-xs font-bold uppercase tracking-[0.16em] text-white">Straight vertical pipe route · covered with trunking</p>
                  </div>
                </div>

                <div className="px-5 py-5 sm:px-6">
                  <p className="text-sm leading-relaxed text-[#5F5F63]">Outdoor unit on the ground or a wall bracket, with the refrigeration pipework travelling straight vertically in white trunking to the wall penetration.</p>
                </div>
              </article>
            </div>

            <div className="mt-7 grid grid-cols-2 overflow-hidden rounded-2xl border border-[#DEDAD2] bg-white sm:grid-cols-3 lg:grid-cols-6" data-testid="back-to-back-inclusions">
              {[
                ["Under 2 metres", "refrigeration piping"],
                ["Straight line", "vertical or horizontal"],
                ["1 bend or less", "pipe route"],
                ["Ground floor", "installation"],
                ["Under 10 metres", "electrical run"],
                ["Electricals included", "standard connection"],
              ].map(([title, sub], index) => (
                <div key={title} className={`px-4 py-5 text-center ${index % 2 ? "border-l border-[#EEEAE2]" : ""} sm:border-l sm:first:border-l-0`}>
                  <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#C8A46A]/55 bg-[#FBF6EA] text-[#B58C4E]">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <p className="mt-3 text-xs font-bold text-[#0B0B0B]">{title}</p>
                  <p className="mt-1 text-[10px] leading-relaxed text-[#8A8A8E]">{sub}</p>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-6 max-w-4xl text-center text-xs leading-relaxed text-[#7A7A7E]">
              Outdoor unit can be installed on a wall bracket or on the floor. Switchboard defects, upgrades, asbestos-related work, difficult access or other non-standard site conditions are quoted before any extra work proceeds.
            </p>
          </div>
        </section>
      )}

      {/* Ranges + pricing tables */}'''

text, count = section_pattern.subn(new_section, text, count=1)
if count:
    print("updated: real-image back-to-back section")
elif 'data-testid="back-to-back-layout-diagrams"' in text:
    # If an earlier version is already present, replace from its section marker to the pricing marker.
    fallback = re.compile(
        r'''      \{isRinnaiLocalOffer && \(\n        <section className="[^"]*" data-testid="back-to-back-explained">.*?      \)\}\n\n      \{/\* Ranges \+ pricing tables \*/\}''',
        re.S,
    )
    text, count = fallback.subn(new_section, text, count=1)
    if count:
        print("updated: replaced earlier back-to-back section")
    else:
        raise SystemExit("Could not replace existing back-to-back section")
else:
    raise SystemExit("Could not find the back-to-back explanation section")

PATH.write_text(text)
print("Rinnai local offer refinement complete")
