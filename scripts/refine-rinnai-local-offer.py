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
                A qualifying back-to-back install is a short, direct ground-floor installation. The pipe route can run straight horizontally through the wall or straight vertically up or down.
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
                <article className="relative min-h-[360px] overflow-hidden border-b border-white/10 bg-[#B86743] lg:border-b-0 lg:border-r">
                  <img
                    src={`${process.env.PUBLIC_URL || ""}/installs/rinnai-outdoor.webp`}
                    alt="Horizontal back-to-back Rinnai installation example"
                    className="absolute inset-0 h-full w-full scale-[1.35] object-cover object-[52%_68%] opacity-95"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" />

                  <div className="absolute left-[18%] top-[26%] h-[92px] w-[118px] rounded-md border border-black/20 bg-[#F4F4F1] shadow-2xl sm:h-[116px] sm:w-[150px]">
                    <div className="absolute left-[10px] top-[12px] h-[68px] w-[68px] rounded-full border-[6px] border-[#D2D2CE] bg-[#292929] sm:h-[88px] sm:w-[88px]" />
                    <div className="absolute right-3 top-3 text-[9px] font-extrabold text-[#D71920]">Rinnai</div>
                    <div className="absolute -bottom-4 left-4 h-5 w-3 bg-[#B0B0AC]" />
                    <div className="absolute -bottom-4 right-4 h-5 w-3 bg-[#B0B0AC]" />
                  </div>
                  <div className="absolute left-[40%] right-[9%] top-[37%] h-7 rounded-r-md border border-[#D6D6D2] bg-white shadow-md sm:h-8" />
                  <div className="absolute right-[7%] top-[35.5%] h-10 w-5 rounded-r-full border border-[#D6D6D2] bg-white shadow-md" />

                  <div className="absolute left-5 top-5 rounded-md bg-black/78 px-3 py-2 text-white backdrop-blur-sm sm:left-6 sm:top-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F0C46E]">Horizontal installation</p>
                    <p className="mt-1 text-sm font-semibold">Straight through the wall</p>
                  </div>
                  <div className="absolute left-[42%] right-[10%] top-[47%] flex items-center gap-2 text-[#F0C46E]">
                    <span className="text-xl">←</span>
                    <span className="flex-1 border-t-2 border-[#F0C46E]" />
                    <span className="rounded-full bg-black/75 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.1em] text-white">Under 2m</span>
                    <span className="flex-1 border-t-2 border-[#F0C46E]" />
                    <span className="text-xl">→</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-6 pb-6 pt-20">
                    <p className="text-sm font-semibold leading-relaxed text-white">Outdoor unit mounted at a practical height, with white trunking running straight horizontally to the wall penetration.</p>
                  </div>
                </article>

                <article className="relative min-h-[360px] overflow-hidden bg-[#B86743]">
                  <img
                    src={`${process.env.PUBLIC_URL || ""}/installs/rinnai-outdoor.webp`}
                    alt="Vertical back-to-back Rinnai installation example"
                    className="absolute inset-0 h-full w-full object-cover object-center opacity-95"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" />

                  <div className="absolute bottom-[14%] left-[35%] h-[92px] w-[118px] rounded-md border border-black/20 bg-[#F4F4F1] shadow-2xl sm:h-[116px] sm:w-[150px]">
                    <div className="absolute left-[10px] top-[12px] h-[68px] w-[68px] rounded-full border-[6px] border-[#D2D2CE] bg-[#292929] sm:h-[88px] sm:w-[88px]" />
                    <div className="absolute right-3 top-3 text-[9px] font-extrabold text-[#D71920]">Rinnai</div>
                  </div>
                  <div className="absolute bottom-[38%] left-[45%] top-[13%] w-7 rounded-t-md border border-[#D6D6D2] bg-white shadow-md sm:w-8" />
                  <div className="absolute left-[43.5%] top-[10%] h-7 w-11 rounded-t-md border border-[#D6D6D2] bg-white shadow-md" />

                  <div className="absolute left-5 top-5 rounded-md bg-black/78 px-3 py-2 text-white backdrop-blur-sm sm:left-6 sm:top-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F0C46E]">Vertical installation</p>
                    <p className="mt-1 text-sm font-semibold">Straight up or down</p>
                  </div>
                  <div className="absolute right-[12%] bottom-[38%] top-[17%] flex flex-col items-center justify-between text-[#F0C46E]">
                    <span className="text-xl">↑</span>
                    <span className="border-l-2 border-[#F0C46E] grow" />
                    <span className="my-2 rounded-full bg-black/75 px-3 py-2 text-center text-[9px] font-extrabold uppercase leading-tight tracking-[0.1em] text-white">Under<br />2m</span>
                    <span className="border-l-2 border-[#F0C46E] grow" />
                    <span className="text-xl">↓</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-6 pb-6 pt-20">
                    <p className="text-sm font-semibold leading-relaxed text-white">Outdoor unit on the floor or a wall bracket, with the refrigeration pipework travelling straight vertically inside white trunking.</p>
                  </div>
                </article>
              </div>
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
if not count:
    raise SystemExit("Could not find the back-to-back explanation section")

PATH.write_text(text)
print("updated: back-to-back section now uses horizontal and vertical examples")
