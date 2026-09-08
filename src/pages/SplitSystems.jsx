import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowUpRight, Check, Ruler, HomeIcon, RefreshCcw } from "lucide-react";
import HomeComfortPage from "./HomeComfortPage";
import { SectionHeading, Overline } from "../components/sections";
import Reveal from "../components/Reveal";
import { IMAGES, SPLIT_BRANDS, SPLIT_FAQS } from "../lib/data";

const CANONICAL = "https://splitspro.com.au/split-systems";

const BrandNav = ({ heading = "View split system prices", overline = "Split System Prices — Supplied & Installed", sub = "Choose a brand or range to see current supplied & installed pricing and book your installation.", className = "" }) => (
  <section className={`bg-[#F5F5F7] py-24 sm:py-32 ${className}`} data-testid="brand-pricing-nav">
    <div className="sp-container">
      <SectionHeading overline={overline} title={heading} sub={sub} />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SPLIT_BRANDS.map((b, i) => (
          <Reveal key={b.slug} delay={(i % 3) * 0.06}>
            <Link to={`/split-systems/${b.slug}`} data-testid={`brand-card-${b.slug}`}
              className="group flex h-full items-center justify-between rounded-xl border border-[#E5E5EA] bg-white p-6 transition-all duration-300 hover:border-[#C8A46A] hover:-translate-y-[3px] soft-shadow-sm">
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6E6E73]">Brand</span>
                <span className="mt-1 block font-serif text-xl text-[#1D1D1F]">{b.brand}</span>
                <span className="mt-2 block text-xs text-[#6E6E73]">View {b.brand} prices</span>
              </span>
              <ArrowUpRight className="h-5 w-5 text-[#C8A46A] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// Compact clickable brand price pills — swipeable strip immediately under the hero.
const SHORT_BRAND = {
  daikin: "Daikin",
  rinnai: "Rinnai",
  "mitsubishi-electric": "Mitsubishi Electric",
  "mitsubishi-heavy-industries": "Mitsubishi Heavy",
};

const MobileBrandRow = () => (
  <nav
    data-testid="mobile-brand-row"
    aria-label="Split system brand pricing"
    className="border-b border-[#E5E5EA] bg-white"
  >
    <div className="sp-container">
      <div className="-mx-6 flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto whitespace-nowrap px-6 py-4 sm:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SPLIT_BRANDS.map((b) => (
          <Link
            key={b.slug}
            to={`/split-systems/${b.slug}`}
            data-testid={`mobile-brand-link-${b.slug}`}
            className="group snap-start flex min-w-[188px] shrink-0 items-center justify-between gap-3 rounded-full border border-[#E5E5EA] bg-white px-5 py-2.5 transition-all duration-300 hover:border-[#C8A46A] hover:-translate-y-[1px] hover:soft-shadow-sm"
          >
            <span className="flex flex-col leading-tight">
              <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#0B0B0B]">{SHORT_BRAND[b.slug] || b.brand}</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#C8A46A]">See Prices</span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-[#C8A46A] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        ))}
      </div>
    </div>
  </nav>
);

const SplitSystemsSeo = () => (
  <>
    {/* Brand pricing navigation — near the top (desktop only; mobile uses the compact row under the hero) */}
    <BrandNav heading="View split system prices" overline="Pricing" sub="Choose a brand or range to see current supplied & installed pricing and book your installation." className="hidden lg:block" />

    {/* Split systems for your home */}
    <section className="bg-white py-24 sm:py-32" data-testid="split-for-home">
      <div className="sp-container grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <Reveal><Overline>Split System Air Conditioning</Overline></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-serif text-4xl font-medium leading-tight tracking-tight text-[#1D1D1F] md:text-5xl text-balance">
              Split system air conditioning for your home
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 leading-relaxed text-[#6E6E73]">
              A reverse cycle split system is one of the most efficient ways to heat and cool an individual room. We supply and install split system air conditioners suited to:
            </p>
          </Reveal>
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {["Bedrooms", "Living rooms", "Home offices", "Granny flats", "Apartments", "Individual rooms", "Replacing older air conditioners"].map((t) => (
              <li key={t} className="flex items-start gap-3 text-[#1D1D1F]">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A46A]" strokeWidth={2} /> {t}
              </li>
            ))}
          </ul>
          <Reveal delay={0.15}>
            <p className="mt-6 leading-relaxed text-[#6E6E73]">
              We&apos;ll help you choose the correct kW capacity for your room and confirm the best position for the indoor and outdoor unit before you commit.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.12}>
          <div className="img-reveal overflow-hidden rounded-2xl soft-shadow">
            <div className="relative aspect-square w-full overflow-hidden">
              <img src={IMAGES.installDaikinBathroom} alt="Daikin split system air conditioner installed in a modern ensuite" loading="lazy" className="absolute inset-0 h-full w-full rotate-90 object-cover" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    {/* Sizing */}
    <section className="bg-[#F5F5F7] py-24 sm:py-32" data-testid="split-sizing">
      <div className="sp-container grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal><Overline>Sizing</Overline></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-serif text-4xl font-medium leading-tight tracking-tight text-[#1D1D1F] md:text-5xl text-balance">
              What size split system do I need?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 leading-relaxed text-[#6E6E73]">
              Getting the right size matters. Under-sized units struggle in summer, over-sized ones short-cycle and waste energy. The correct capacity depends on:
            </p>
          </Reveal>
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {["Room dimensions", "Ceiling height", "Windows", "Insulation", "Sun exposure", "Room use"].map((t) => (
              <li key={t} className="flex items-start gap-3 text-[#1D1D1F]">
                <Ruler className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A46A]" strokeWidth={1.8} /> {t}
              </li>
            ))}
          </ul>
        </div>
        <Reveal delay={0.12}>
          <div className="rounded-2xl border border-[#E5E5EA] bg-white p-10 soft-shadow" data-testid="sizing-cta">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C8A46A]/30 bg-[#F3E9D2] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#C8A46A]">
              <HomeIcon className="h-3.5 w-3.5" /> Free advice
            </span>
            <h3 className="mt-5 font-serif text-2xl text-[#1D1D1F]">Not sure what size you need?</h3>
            <p className="mt-3 leading-relaxed text-[#6E6E73]">Send us your room details and we&apos;ll help you choose the right system — no obligation.</p>
            <Link to="/contact" data-testid="sizing-advice-btn"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#0B0B0B] border border-[#C8A46A]/60 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-[#F8F7F5] transition-all hover:border-[#C8A46A] hover:-translate-y-[2px]">
              Get free sizing advice <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>

    {/* Professional installation */}
    <section className="bg-white py-24 sm:py-32" data-testid="pro-install">
      <div className="sp-container">
        <SectionHeading overline="Installation" title="Professional split system installation" sub="Real installs by SplitsPro across Western Sydney — Daikin, Rinnai, Mitsubishi Electric and Mitsubishi Heavy Industries." />
        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.25fr] lg:gap-14">
          <ul className="grid gap-4">
            {[
              "Neat installation with careful unit positioning",
              "Tidy pipework and clean cabling",
              "Full testing and system commissioning",
              "Clear walkthrough of the controls",
              "Work area cleaned when finished",
              "Old split system replacement, where relevant",
            ].map((t, i) => (
              <Reveal key={t} delay={i * 0.05}>
                <li className="flex items-start gap-4 rounded-xl border border-[#E5E5EA] bg-white p-5 soft-shadow-sm">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A46A]" strokeWidth={2} />
                  <span className="text-[#1D1D1F]">{t}</span>
                </li>
              </Reveal>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-4">
            {[
              { src: IMAGES.installDaikinGarage, alt: "Daikin split system air conditioner installed with neat pipework in a utility room" },
              { src: IMAGES.installRinnaiWall, alt: "Rinnai split system air conditioner installed on a living room wall" },
              { src: IMAGES.installDaikinOutdoor2, alt: "Daikin outdoor condenser bracket-mounted to a brick exterior wall" },
              { src: IMAGES.installDaikinBathroom, alt: "Daikin split system air conditioner installed in a modern ensuite" },
            ].map((img, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="img-reveal overflow-hidden rounded-2xl soft-shadow-sm">
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <img src={img.src} alt={img.alt} loading="lazy" className="img-zoom absolute inset-0 h-full w-full rotate-90 object-cover" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Supply & install prices — repeat brand nav under this heading */}
    <BrandNav heading="Split system air conditioner prices — supplied & installed" overline="Compare Prices" sub="Choose a brand or range below to view supplied & installed pricing for your room." />

    {/* Replacement */}
    <section className="bg-white py-24 sm:py-32" data-testid="split-replacement">
      <div className="sp-container grid gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="img-reveal overflow-hidden rounded-2xl soft-shadow">
            <div className="relative aspect-square w-full overflow-hidden">
              <img src={IMAGES.installDaikinOutdoor2} alt="Daikin outdoor condenser replaced on a Western Sydney home" loading="lazy" className="absolute inset-0 h-full w-full rotate-90 object-cover" />
            </div>
          </div>
        </Reveal>
        <div>
          <Reveal><Overline>Replacement</Overline></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-serif text-4xl font-medium leading-tight tracking-tight text-[#1D1D1F] md:text-5xl text-balance">
              Replacing an old split system?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 leading-relaxed text-[#6E6E73]">
              We regularly assess and replace older wall-mounted split systems with a new Daikin, Rinnai, Mitsubishi Electric or Mitsubishi Heavy Industries unit — reusing existing wall penetrations wherever possible for a neat finish.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <Link to="/contact" data-testid="replacement-cta"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#0B0B0B] border border-[#C8A46A]/60 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-[#F8F7F5] transition-all hover:border-[#C8A46A] hover:-translate-y-[2px]">
              <RefreshCcw className="h-4 w-4" /> Get a replacement quote
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  </>
);

const helmet = (
  <Helmet>
    <title>Split System Air Conditioning Supply & Installation | SplitsPro</title>
    <meta name="description" content="Compare split system air conditioners from Daikin, Rinnai, Mitsubishi Electric and Mitsubishi Heavy Industries. View supplied & installed prices, get free sizing advice and book your installation with SplitsPro." />
    <link rel="canonical" href={CANONICAL} />
    <meta property="og:title" content="Split System Air Conditioning Supply & Installation | SplitsPro" />
    <meta property="og:description" content="Compare Daikin, Rinnai, Mitsubishi Electric and Mitsubishi Heavy Industries split systems. Supplied and installed by SplitsPro across Western Sydney." />
    <meta property="og:type" content="website" />
    <meta property="og:image" content={IMAGES.splitLiving} />
  </Helmet>
);

const SplitSystems = () => (
  <HomeComfortPage
    slug="split-systems"
    overline="Split System Air Conditioning"
    title="Split System Air Conditioning Supply & Installation"
    sub="Compare trusted air conditioning brands, view supplied and installed prices and find the right split system for your room."
    image={IMAGES.splitLiving}
    introImage={IMAGES.splitBedroom}
    intro={{
      heading: "Considered installation. Chosen brands.",
      body: "We take the time to plan every split system installation — positioning the indoor unit for even airflow, keeping pipe runs tidy and choosing from Daikin, Rinnai, Mitsubishi Electric and Mitsubishi Heavy Industries so you get the right fit for the room.",
    }}
    features={[
      "Fixed supplied-and-installed price",
      "Daikin, Rinnai, Mitsubishi Electric and Mitsubishi Heavy Industries",
      "Correct kW capacity for the room",
      "Neat pipework and considered unit placement",
      "Full testing and system commissioning",
      "Complete post-install clean-up",
    ]}
    helmet={helmet}
    afterHero={<MobileBrandRow />}
    seoBlocks={<SplitSystemsSeo />}
    extraFaqs={SPLIT_FAQS}
  />
);

export default SplitSystems;
