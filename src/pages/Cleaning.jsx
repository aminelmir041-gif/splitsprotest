import { Link } from "react-router-dom";
import { ArrowUpRight, Bug, Fan, Gauge, Sparkles, Wind } from "lucide-react";
import { PageHero, TrustBadges } from "../components/sections";
import Reveal from "../components/Reveal";

const SERVICE_CARDS = [
  {
    href: "/split-system-cleaning",
    eyebrow: "Wall-mounted units",
    title: "Split System Cleaning",
    price: "From $100",
    cheeky: "Two simple options. No confusing service menu.",
    body: "Standard Clean $100: filters, covers, accessible coil surface, drain and operation check. Deep Clean $180 limited-time local offer: full indoor wash including coil, blower wheel and drain area.",
    icons: [Bug, Sparkles, Wind],
    chips: ["$100 Standard", "$180 Deep Clean · Limited Offer"],
  },
  {
    href: "/ducted-cleaning",
    eyebrow: "Whole-home systems",
    title: "Ducted Cleaning",
    price: "From $299",
    cheeky: "Whole-home air deserves a proper clean too.",
    body: "Standard ducted cleaning covers the return-air area, filters, outlets and accessible indoor components. Choose a deeper clean when the system needs more detailed attention.",
    icons: [Fan, Gauge, Wind],
    chips: ["From $299 Standard", "From $399 Deep"],
  },
];

const Cleaning = () => (
  <>
    <PageHero
      overline="Air Conditioner Cleaning"
      title="Pick your system. We’ll handle the dirty part."
      sub="Split system on the wall or ducted vents through the ceiling? Choose your system and see a simple summary of what each clean includes before you book."
    />

    <TrustBadges />

    <section className="bg-white py-16 sm:py-20">
      <div className="sp-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C8A46A]">What are we cleaning?</p>
          <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-[#1D1D1F] sm:text-4xl md:text-5xl">
            Split or ducted. See the service at a glance.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#6E6E73] sm:text-base">
            We’ve simplified the cleaning section so you can quickly compare the two services, see the starting price and know what is included before opening the full booking page.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-5 lg:grid-cols-2">
          {SERVICE_CARDS.map((service, index) => (
            <Reveal key={service.href} delay={index * 0.08}>
              <Link
                to={service.href}
                className="group relative block h-full overflow-hidden rounded-3xl border border-[#E3DFD7] bg-[#F7F6F3] p-6 transition-all hover:-translate-y-1 hover:border-[#C8A46A]/70 hover:shadow-[0_20px_48px_rgba(11,11,11,0.08)] sm:p-8"
              >
                <div aria-hidden className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#C8A46A]/10 blur-2xl transition-transform duration-500 group-hover:scale-125" />

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C8A46A]">{service.eyebrow}</p>
                    <h3 className="mt-3 font-serif text-3xl font-medium leading-tight text-[#1D1D1F] sm:text-4xl">{service.title}</h3>
                  </div>
                  <span className="shrink-0 rounded-full border border-[#DCD7CE] bg-white px-3 py-1.5 text-xs font-semibold text-[#1D1D1F]">
                    {service.price}
                  </span>
                </div>

                <p className="relative mt-5 text-base font-semibold text-[#1D1D1F]">{service.cheeky}</p>
                <p className="relative mt-2 max-w-xl text-sm leading-relaxed text-[#6E6E73]">{service.body}</p>

                <div className="relative mt-6 flex items-center gap-2">
                  {service.icons.map((Icon, iconIndex) => (
                    <span key={iconIndex} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#B68C4E] shadow-[0_4px_14px_rgba(11,11,11,0.05)]">
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                  ))}
                </div>

                <div className="relative mt-7 flex flex-wrap gap-2">
                  {service.chips.map((chip) => (
                    <span key={chip} className="rounded-full bg-[#1D1D1F] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="relative mt-8 flex items-center justify-between border-t border-[#E0DDD7] pt-5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1D1D1F]">See full service & book</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1D1D1F] text-white transition-colors group-hover:bg-[#C8A46A]">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-[#E6E2DA] bg-white px-5 py-4 text-center sm:px-7">
          <p className="text-xs leading-relaxed text-[#6E6E73] sm:text-sm">
            <span className="font-semibold text-[#1D1D1F]">Not sure which one you have?</span> A unit mounted on the wall = split system. Ceiling vents plus a large return-air grille = ducted. Easy.
          </p>
        </div>
      </div>
    </section>
  </>
);

export default Cleaning;
