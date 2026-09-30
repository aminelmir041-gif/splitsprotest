import { Helmet } from "react-helmet-async";
import {
  ArrowUpRight,
  BadgeCheck,
  Check,
  Clock3,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";
import QuoteForm from "../components/QuoteForm";
import { GoogleRating } from "../components/sections";
import { ABN, PHONE, PHONE_TEL, SPLIT_BRANDS } from "../lib/data";

const rinnaiImage =
  SPLIT_BRANDS.find((brand) => brand.slug === "rinnai")?.ranges?.[0]?.image || "";
const daikinImage =
  SPLIT_BRANDS.find((brand) => brand.slug === "daikin")?.ranges?.find((range) => range.slug === "cora")?.image || "";

const OFFERS = [
  {
    brand: "Rinnai",
    warranty: "7-year warranty",
    image: rinnaiImage,
    note: "Fast supplied-and-installed pricing with clear standard-install inclusions.",
    prices: [
      { kw: "2.5kW", price: "$1,450" },
      { kw: "3.5kW", price: "$1,550" },
      { kw: "5.0kW", price: "$1,900" },
      { kw: "7.0kW", price: "$2,300" },
    ],
  },
  {
    brand: "Daikin Cora",
    warranty: "5-year warranty",
    image: daikinImage,
    note: "Daikin Cora supplied and installed, including Blue Fin anti-corrosive coating.",
    prices: [
      { kw: "2.5kW", price: "$1,550" },
      { kw: "3.5kW", price: "$1,750" },
      { kw: "5.0kW", price: "$2,150" },
      { kw: "7.0kW", price: "$2,600" },
    ],
  },
];

const INCLUDED = [
  "Air conditioner supplied",
  "Professional installation labour",
  "Up to 3 metres of refrigeration pipework",
  "Standard wall bracket or suitable floor placement",
  "Isolation switch",
  "Up to 20 metres of electrical connection if required",
  "Commissioning and system test",
  "Installation guarantee",
];

const EXTRA_ITEMS = [
  "Pipe runs over 3 metres",
  "Switchboard upgrades",
  "Difficult or unusual access",
  "Asbestos-related work",
  "Other non-standard installation requirements",
];

const FAQS = [
  {
    q: "How much does split system air conditioning installation cost in Sydney?",
    a: "Our current supplied-and-installed specials start from $1,450 for a 2.5kW Rinnai and $1,550 for a 2.5kW Daikin Cora on qualifying standard installations. Larger capacities are shown on this page.",
  },
  {
    q: "What does supplied and installed include?",
    a: "For a qualifying standard installation, the advertised price includes the unit, labour, up to 3 metres of refrigeration pipework, a standard wall bracket or suitable floor placement, an isolation switch, up to 20 metres of electrical connection if required, commissioning and our installation guarantee.",
  },
  {
    q: "Can you install within 2 business days?",
    a: "Eligible standard installations booked from this offer can be installed within 2 business days, subject to appointment availability and site suitability.",
  },
  {
    q: "Do you install Rinnai and Daikin split systems?",
    a: "Yes. This page features Rinnai and Daikin Cora supplied-and-installed specials, and SplitsPro also installs other leading brands.",
  },
  {
    q: "Which areas do you service?",
    a: "We service Sydney-wide, plus the Central Coast and Wollongong. Send your suburb and we will confirm availability for your area.",
  },
];

const serviceAreas = [
  "Bass Hill",
  "Bankstown",
  "Greenacre",
  "Chester Hill",
  "Guildford",
  "Liverpool",
  "Parramatta",
  "Blacktown",
  "Oran Park",
  "Quakers Hill",
  "Central Coast",
  "Wollongong",
];

const GoogleAdsLanding = () => {
  const selectOffer = (brand, row) => {
    window.dispatchEvent(
      new CustomEvent("splitspro:quote-preset", {
        detail: {
          service: "Split System Installation",
          message: `Google Ads landing page enquiry: ${brand} ${row.kw} at ${row.price} supplied & installed. Please confirm eligibility and installation availability.`,
        },
      }),
    );

    document.getElementById("google-quote")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    name: "SplitsPro",
    url: "https://splitspro.com.au/split-system-installation-sydney",
    telephone: "+61414698435",
    priceRange: "$$",
    areaServed: ["Sydney", "Central Coast NSW", "Wollongong NSW"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bass Hill",
      addressRegion: "NSW",
      addressCountry: "AU",
    },
    makesOffer: {
      "@type": "OfferCatalog",
      name: "Split System Air Conditioning Supplied & Installed",
      itemListElement: OFFERS.flatMap((offer) =>
        offer.prices.map((row) => ({
          "@type": "Offer",
          priceCurrency: "AUD",
          price: row.price.replace(/[^0-9]/g, ""),
          itemOffered: {
            "@type": "Service",
            name: `${offer.brand} ${row.kw} split system supplied and installed`,
          },
        })),
      ),
    },
  };

  return (
    <>
      <Helmet>
        <title>Split System Air Conditioning Installation Sydney | Supplied & Installed | SplitsPro</title>
        <meta
          name="description"
          content="Split system air conditioning supplied and installed across Sydney from $1,450. Rinnai and Daikin Cora pricing, clear standard-install inclusions and fast installation."
        />
        <link rel="canonical" href="https://splitspro.com.au/split-system-installation-sydney" />
        <meta property="og:title" content="Split System Air Conditioning Supplied & Installed | SplitsPro" />
        <meta
          property="og:description"
          content="Clear installed prices for Rinnai and Daikin Cora split systems across Sydney, Central Coast and Wollongong."
        />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <section className="relative overflow-hidden bg-[#0B0B0B] text-white" data-testid="google-ads-hero">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(200,164,106,0.22),transparent_38%)]" />
        <div className="sp-container relative grid min-h-[660px] items-center gap-12 py-20 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
          <div className="max-w-3xl">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.19em] text-[#E4CFA6]">
              Split System Air Conditioning Installation Sydney
            </div>
            <h1 className="mt-5 font-serif text-[clamp(46px,7vw,82px)] font-medium leading-[0.98] tracking-[-0.045em]">
              Split systems supplied &amp; installed
              <span className="block text-[#E4CFA6]">from $1,450.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              Rinnai and Daikin Cora installed with clear standard-install pricing, fast booking and no guessing what the advertised price includes.
            </p>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white/85">
              <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-[#C8A46A]" /> Installation within 2 business days*</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#C8A46A]" /> Installation guarantee</span>
              <span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[#C8A46A]" /> Licensed &amp; insured</span>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Rinnai", "2.5kW", "$1,450"],
                ["Rinnai", "5.0kW", "$1,900"],
                ["Daikin", "2.5kW", "$1,550"],
                ["Daikin", "7.0kW", "$2,600"],
              ].map(([brand, kw, price]) => (
                <div key={`${brand}-${kw}`} className="rounded-xl border border-white/10 bg-white/[0.055] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">{brand}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{kw}</p>
                  <p className="mt-1 font-serif text-2xl text-[#E4CFA6]">{price}</p>
                </div>
              ))}
            </div>

            <a href={PHONE_TEL} className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-white">
              <Phone className="h-4 w-4 text-[#C8A46A]" /> Prefer to call? {PHONE}
            </a>
          </div>

          <div id="google-quote" className="scroll-mt-24 rounded-2xl border border-white/10 bg-white p-7 text-[#1D1D1F] shadow-2xl sm:p-9" data-testid="google-ads-quote-card">
            <div className="mb-6 border-b border-[#E5E5EA] pb-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#8F6A34]">Fast quote check</p>
              <h2 className="mt-2 font-serif text-3xl font-medium text-[#0B0B0B]">Get your installed price</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#6E6E73]">
                Send your name, phone and suburb. We&apos;ll confirm the correct system, standard-install eligibility and next available installation time.
              </p>
            </div>
            <QuoteForm
              defaultService="Split System Installation"
              defaultMessage="Google Ads landing page enquiry — please confirm supplied-and-installed pricing and installation availability."
              submitLabel="Get My Installed Price"
              compact
              hideEmail
              hideMessage
              hidePhoto
              hidePreferredDate
              includeAttribution
              successTitle="Price request received"
              successMessage="We’ll call you shortly to confirm the system, price and installation availability."
              tight
            />
            <p className="mt-5 text-center text-[11px] leading-relaxed text-[#8A8A8E]">
              No obligation. Your details are only used for this air conditioning enquiry.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#E5E5EA] bg-[#FBFAF8] py-5" data-testid="google-ads-trust-strip">
        <div className="sp-container flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-semibold text-[#4E4E52]">
          <GoogleRating />
          <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#C8A46A]" /> Rinnai 7-year warranty</span>
          <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#C8A46A]" /> Daikin 5-year warranty</span>
          <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#C8A46A]" /> Fast installation appointments</span>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24" id="installed-prices">
        <div className="sp-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="overline text-[#C8A46A]">Supplied &amp; Installed Air Conditioning</p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-tight tracking-tight text-[#0B0B0B] sm:text-5xl">
              See the installed price before you enquire.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#6E6E73]">
              Choose the brand and capacity that suits your room. These prices are for qualifying standard installations under the conditions explained below.
            </p>
          </div>

          <div className="mt-12 grid gap-7 lg:grid-cols-2">
            {OFFERS.map((offer) => (
              <article key={offer.brand} className="overflow-hidden rounded-2xl border border-[#E5E5EA] bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
                <div className="grid min-h-[230px] grid-cols-[1fr_145px] items-center gap-5 bg-[#F8F7F5] p-6 sm:grid-cols-[1fr_210px] sm:p-8">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#8F6A34]">Current installed special</p>
                    <h3 className="mt-2 font-serif text-4xl font-medium text-[#0B0B0B]">{offer.brand}</h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#6E6E73]">{offer.note}</p>
                    <p className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#3A3A3C]">
                      <ShieldCheck className="h-4 w-4 text-[#C8A46A]" /> {offer.warranty}
                    </p>
                  </div>
                  {offer.image && (
                    <img
                      src={offer.image}
                      alt={`${offer.brand} split system air conditioner`}
                      loading="lazy"
                      className="max-h-[180px] w-full object-contain"
                    />
                  )}
                </div>

                <div className="px-6 sm:px-8">
                  {offer.prices.map((row, index) => (
                    <div key={row.kw} className={`grid grid-cols-[1fr_auto] items-center gap-4 py-5 ${index ? "border-t border-[#E5E5EA]" : ""}`}>
                      <div>
                        <p className="font-serif text-2xl text-[#0B0B0B]">{row.kw}</p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A8A8E]">Supplied &amp; installed</p>
                      </div>
                      <div className="text-right">
                        <p className="font-serif text-3xl text-[#0B0B0B]">{row.price}</p>
                        <button
                          type="button"
                          onClick={() => selectOffer(offer.brand, row)}
                          className="mt-2 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#8F6A34]"
                        >
                          Check availability <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#E5E5EA] bg-[#FFF9EE] px-6 py-4 text-xs font-bold text-[#7B5A28] sm:px-8">
                  No more to pay on qualifying standard installations*
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F7] py-20 sm:py-24" data-testid="google-ads-inclusions">
        <div className="sp-container grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
          <div>
            <p className="overline text-[#C8A46A]">What the advertised price includes</p>
            <h2 className="mt-4 max-w-3xl font-serif text-4xl font-medium leading-tight tracking-tight text-[#0B0B0B] sm:text-5xl">
              A real installed price should tell you what is actually included.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#6E6E73]">
              For a qualifying standard split-system installation, these items are already included in the price shown above.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {INCLUDED.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-[#E1DED7] bg-white p-4">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A46A]" />
                  <span className="text-sm font-semibold leading-relaxed text-[#3A3A3C]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="self-start rounded-2xl bg-[#0B0B0B] p-7 text-white sm:p-9">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#E4CFA6]">What can cost extra?</p>
            <h3 className="mt-3 font-serif text-3xl font-medium">Only non-standard requirements.</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              If your installation needs something outside the standard conditions, we confirm it before the work proceeds.
            </p>
            <div className="mt-6 grid gap-3">
              {EXTRA_ITEMS.map((item) => (
                <div key={item} className="flex items-start gap-3 border-b border-white/10 pb-3 text-sm text-white/80 last:border-b-0">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C8A46A]" />
                  {item}
                </div>
              ))}
            </div>
            <a href="#google-quote" className="mt-7 inline-flex items-center gap-2 rounded-md bg-[#C8A46A] px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white">
              Check My Installation <ArrowUpRight className="h-4 w-4" />
            </a>
          </aside>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="sp-container grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="overline text-[#C8A46A]">Local air conditioning installers</p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-tight text-[#0B0B0B] sm:text-5xl">
              Sydney-wide, plus Central Coast &amp; Wollongong.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#6E6E73]">
              SplitsPro is based in South Western Sydney and travels across the wider Sydney region for split system installations.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {serviceAreas.map((area) => (
                <span key={area} className="rounded-full border border-[#DDD8CF] bg-[#FBFAF8] px-3 py-2 text-xs font-semibold text-[#4E4E52]">
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E5EA] bg-[#FBFAF8] p-7 sm:p-9">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-[#C8A46A]" />
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#3A3A3C]">Tell us your suburb</p>
            </div>
            <p className="mt-4 text-lg leading-relaxed text-[#6E6E73]">
              We&apos;ll confirm whether the advertised standard-install price applies and the next available installation appointment.
            </p>
            <a href="#google-quote" className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#0B0B0B] px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white">
              Get My Installed Price <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#0B0B0B] py-20 text-white sm:py-24" data-testid="google-ads-proof">
        <div className="sp-container grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#E4CFA6]">Why homeowners choose SplitsPro</p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-tight sm:text-5xl">
              Clear price. Careful installation. No run-around.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/65">
              We focus on straightforward advice, tidy workmanship and confirming any non-standard costs before the job starts.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Licensed & insured", "Qualified installation with the right trade cover."],
              ["Installation guarantee", "Workmanship backed after the installation is complete."],
              ["Manufacturer warranty", "7 years on this Rinnai special and 5 years on Daikin Cora."],
              ["Fast response", "Send the suburb and system size and we can quickly confirm the next step."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-xl border border-white/10 bg-white/[0.055] p-5">
                <Star className="h-4 w-4 fill-[#C8A46A] text-[#C8A46A]" />
                <h3 className="mt-3 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="sp-container grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-16">
          <div>
            <p className="overline text-[#C8A46A]">Google Ads landing page FAQ</p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-tight text-[#0B0B0B]">Questions before you book.</h2>
          </div>
          <div>
            {FAQS.map((item) => (
              <details key={item.q} className="group border-b border-[#E5E5EA] py-5">
                <summary className="cursor-pointer list-none pr-8 font-serif text-xl text-[#0B0B0B] marker:hidden">
                  {item.q}
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#6E6E73]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F7] py-20 sm:py-24">
        <div className="sp-container text-center">
          <p className="overline text-[#C8A46A]">Ready for a price?</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-serif text-4xl font-medium leading-tight text-[#0B0B0B] sm:text-5xl">
            Get the installed price for your home.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#6E6E73]">
            Send your suburb and we&apos;ll confirm the right system, advertised price eligibility and next available installation date.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="#google-quote" className="inline-flex items-center gap-2 rounded-md bg-[#C8A46A] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-white">
              Get My Installed Price <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href={PHONE_TEL} className="inline-flex items-center gap-2 rounded-md border border-[#0B0B0B]/15 bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-[#0B0B0B]">
              <Phone className="h-4 w-4" /> Call {PHONE}
            </a>
          </div>
          <p className="mt-7 text-xs text-[#8A8A8E]">SplitsPro · ABN {ABN} · Fully licensed &amp; insured</p>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-black/10 bg-white shadow-[0_-6px_24px_rgba(0,0,0,0.10)] md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <a href={PHONE_TEL} className="flex h-[64px] items-center justify-center gap-2 bg-[#1D1D1F] text-xs font-bold uppercase tracking-[0.08em] text-white">
          <Phone className="h-4 w-4" /> Call Now
        </a>
        <a href="#google-quote" className="flex h-[64px] items-center justify-center gap-2 bg-[#C8A46A] text-xs font-bold uppercase tracking-[0.08em] text-white">
          Get Price <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </>
  );
};

export default GoogleAdsLanding;
