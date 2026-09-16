from pathlib import Path
import re

PATH = Path("src/pages/BrandPage.jsx")
text = PATH.read_text()

# Keep the local-offer wording aligned with the final advertised installation definition.
text = text.replace(
    "advertised single-storey back-to-back terms",
    "advertised ground-floor back-to-back terms",
)
text = text.replace(
    "qualifying single-storey back-to-back installations: units aligned vertically or horizontally, under 1 metre of pipework, one bend or less, outdoor unit on a wall bracket or floor, with standard electrical work included.",
    "qualifying ground-floor back-to-back installations: units aligned vertically or horizontally, under 2 metres of refrigeration pipework, one bend or less, outdoor unit on a wall bracket or floor, electrical run under 10 metres, with standard electrical work included.",
)

# Replace the old text + small-photo explanation with an integrated black/gold website diagram.
section_pattern = re.compile(
    r'''      \{isRinnaiLocalOffer && \(\n        <section className="[^"]*" data-testid="back-to-back-explained">.*?      \)\}\n\n      \{/\* Ranges \+ pricing tables \*/\}''',
    re.S,
)

new_section = r'''      {isRinnaiLocalOffer && (
        <section className="border-y border-white/10 bg-[#0B0B0B] py-14 text-white sm:py-18" data-testid="back-to-back-explained">
          <div className="sp-container">
            <div className="mx-auto max-w-4xl text-center">
              <span className="overline text-[#C8A46A]">What the local price includes</span>
              <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-5xl">Back-to-back installation explained</h2>
              <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-white/65 sm:text-base">
                The advertised price is for a simple ground-floor installation with a short, direct pipe route. The outdoor unit can sit to the side of the wall penetration or directly below it.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-2" data-testid="back-to-back-layout-diagrams">
              <div className="overflow-hidden rounded-2xl border border-[#C8A46A]/35 bg-[#151515]">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A46A]">Horizontal</p>
                    <p className="mt-1 text-sm font-semibold text-white">Straight through the wall</p>
                  </div>
                  <span className="rounded-full border border-[#C8A46A]/40 bg-[#C8A46A]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#E4CFA6]">Under 2m pipe</span>
                </div>

                <div
                  className="relative h-[330px] overflow-hidden sm:h-[370px]"
                  style={{
                    backgroundColor: "#B76742",
                    backgroundImage: "linear-gradient(rgba(255,255,255,.13) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.10) 1px, transparent 1px)",
                    backgroundSize: "62px 28px",
                  }}
                >
                  <div className="absolute left-6 top-10 h-36 w-44 rounded-md border border-black/20 bg-[#F4F4F1] shadow-xl sm:left-8 sm:h-40 sm:w-52">
                    <div className="absolute left-4 top-4 h-24 w-24 rounded-full border-[8px] border-[#D0D0CC] bg-[#292929] shadow-inner sm:h-28 sm:w-28" />
                    <div className="absolute right-4 top-4 text-[11px] font-extrabold text-[#D71920]">Rinnai</div>
                    <div className="absolute bottom-5 right-5 h-[2px] w-10 bg-[#BEBEBA]" />
                    <div className="absolute -bottom-5 left-5 h-6 w-4 bg-[#AFAFAB]" />
                    <div className="absolute -bottom-5 right-5 h-6 w-4 bg-[#AFAFAB]" />
                  </div>

                  <div className="absolute left-[12.6rem] right-10 top-[6.45rem] h-8 rounded-r-md border border-[#D9D9D5] bg-white shadow-md sm:left-[15rem] sm:top-[7.2rem]" />
                  <div className="absolute right-6 top-[6.05rem] h-10 w-6 rounded-r-full border border-[#D9D9D5] bg-white sm:top-[6.8rem]" />

                  <div className="absolute left-[13rem] right-11 top-[10.2rem] flex items-center justify-between text-[#F0C46E] sm:left-[15.4rem] sm:top-[11.1rem]">
                    <span className="text-xl">←</span>
                    <span className="rounded-full bg-black/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em]">Under 2 metres</span>
                    <span className="text-xl">→</span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/15 bg-black/75 px-4 py-3 backdrop-blur-sm">
                    <p className="text-xs font-semibold text-white">Outdoor unit mounted high on a wall bracket, with straight white trunking running horizontally to the wall penetration.</p>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#C8A46A]/35 bg-[#151515]">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A46A]">Vertical</p>
                    <p className="mt-1 text-sm font-semibold text-white">Straight up or down</p>
                  </div>
                  <span className="rounded-full border border-[#C8A46A]/40 bg-[#C8A46A]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#E4CFA6]">Under 2m pipe</span>
                </div>

                <div
                  className="relative h-[330px] overflow-hidden sm:h-[370px]"
                  style={{
                    backgroundColor: "#B76742",
                    backgroundImage: "linear-gradient(rgba(255,255,255,.13) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.10) 1px, transparent 1px)",
                    backgroundSize: "62px 28px",
                  }}
                >
                  <div className="absolute bottom-10 left-1/2 h-32 w-40 -translate-x-1/2 rounded-md border border-black/20 bg-[#F4F4F1] shadow-xl sm:h-36 sm:w-48">
                    <div className="absolute left-4 top-4 h-20 w-20 rounded-full border-[7px] border-[#D0D0CC] bg-[#292929] shadow-inner sm:h-24 sm:w-24" />
                    <div className="absolute right-4 top-4 text-[10px] font-extrabold text-[#D71920]">Rinnai</div>
                    <div className="absolute -bottom-5 left-5 h-6 w-4 bg-[#AFAFAB]" />
                    <div className="absolute -bottom-5 right-5 h-6 w-4 bg-[#AFAFAB]" />
                  </div>

                  <div className="absolute bottom-[9.9rem] left-1/2 top-8 w-8 -translate-x-1/2 rounded-t-md border border-[#D9D9D5] bg-white shadow-md sm:bottom-[11rem]" />
                  <div className="absolute left-1/2 top-5 h-7 w-11 -translate-x-1/2 rounded-t-md border border-[#D9D9D5] bg-white" />

                  <div className="absolute bottom-[10rem] right-8 top-9 flex flex-col items-center justify-between text-[#F0C46E] sm:bottom-[11rem]">
                    <span className="text-xl">↑</span>
                    <span className="rounded-full bg-black/70 px-2 py-2 text-center text-[9px] font-bold uppercase leading-tight tracking-[0.1em]">Under<br />2 metres</span>
                    <span className="text-xl">↓</span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/15 bg-black/75 px-4 py-3 backdrop-blur-sm">
                    <p className="text-xs font-semibold text-white">Outdoor unit on the ground or a wall bracket, with the refrigeration pipework covered by straight vertical trunking.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] sm:grid-cols-3 lg:grid-cols-6" data-testid="back-to-back-inclusions">
              {[
                ["Under 2 metres", "of refrigeration piping"],
                ["Straight line", "vertical or horizontal"],
                ["1 bend or less", "in the pipe route"],
                ["Ground floor", "installation"],
                ["Under 10 metres", "electrical run"],
                ["Electricals included", "standard connection"],
              ].map(([title, sub], index) => (
                <div key={title} className={`px-4 py-5 text-center ${index % 2 ? "border-l border-white/10" : ""} sm:border-l sm:first:border-l-0`}>
                  <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#C8A46A]/55 text-[#C8A46A]">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <p className="mt-3 text-xs font-bold text-white">{title}</p>
                  <p className="mt-1 text-[10px] leading-relaxed text-white/45">{sub}</p>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-6 max-w-4xl text-center text-xs leading-relaxed text-white/50">
              Outdoor unit can be installed on a wall bracket or on the floor. Switchboard defects, upgrades, asbestos-related work, difficult access or other non-standard site conditions are quoted before any extra work proceeds.
            </p>
          </div>
        </section>
      )}

      {/* Ranges + pricing tables */}'''

text, count = section_pattern.subn(new_section, text, count=1)
if count:
    print("updated: integrated back-to-back diagram section")
elif 'data-testid="back-to-back-layout-diagrams"' in text:
    print("already updated: integrated back-to-back diagram section")
else:
    raise SystemExit("Could not find the back-to-back explanation section to replace")

PATH.write_text(text)
print("Rinnai local offer refinement complete")
