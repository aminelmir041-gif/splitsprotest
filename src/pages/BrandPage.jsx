import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLenis } from "lenis/react";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { PageHero, CTASection } from "../components/sections";
import Reveal from "../components/Reveal";
import QuoteForm from "../components/QuoteForm";
import { SPLIT_BRANDS, FORM_TRUST_STRIP } from "../lib/data";

const BrandPage = () => {
  const { slug } = useParams();
  const brand = SPLIT_BRANDS.find((b) => b.slug === slug);
  const lenis = useLenis();
  const [selected, setSelected] = useState(null);

  if (!brand) return <Navigate to="/split-systems" replace />;

  const handleBook = (rangeName, priceRow) => {
    const sel = { rangeName, kw: priceRow.kw, price: priceRow.price };
    setSelected(sel);
    setTimeout(() => {
      const el = document.getElementById("book");
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { offset: -20 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const jumpToRange = (rangeSlug) => {
    const el = document.getElementById(`range-${rangeSlug}`);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -20 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectionMessage = selected
    ? `I'd like to book installation for ${brand.brand} ${selected.rangeName} ${selected.kw} — advertised at ${selected.price} supplied & installed.`
    : "";

  const formKey = selected ? `${brand.slug}-${selected.rangeName}-${selected.kw}` : `${brand.slug}-default`;
  const submitLabel = selected
    ? `Book ${brand.brand} ${selected.rangeName} ${selected.kw}`
    : `Get My ${brand.brand} Quote`;

  return (
    <>
      <Helmet>
        <title>{brand.metaTitle}</title>
        <meta name="description" content={brand.metaDesc} />
        <link rel="canonical" href={`https://splitspro.com.au/split-systems/${brand.slug}`} />
        <meta property="og:title" content={brand.metaTitle} />
        <meta property="og:description" content={brand.metaDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={brand.image} />
      </Helmet>

      <PageHero overline={brand.brand} title={brand.h1} sub={brand.tagline} image={brand.image} />

      {/* Compact intro + range jump tabs (price-focused, no trust badges chrome) */}
      <section className="bg-white py-14 sm:py-20" data-testid="brand-intro">
        <div className="sp-container">
          <Link to="/split-systems" data-testid="brand-back" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#C8A46A] link-line">
            <ArrowLeft className="h-4 w-4" /> Split System Air Conditioning
          </Link>
          <div className="mt-5 max-w-3xl">
            <p className="leading-relaxed text-[#6E6E73]">{brand.body}</p>
          </div>
          {brand.ranges.length > 1 && (
            <div className="mt-8 flex flex-wrap items-center gap-2" data-testid="range-tabs">
              {brand.ranges.map((r) => (
                <button key={r.slug} onClick={() => jumpToRange(r.slug)} data-testid={`range-tab-${r.slug}`}
                  className="rounded-full border border-[#0B0B0B]/15 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0B0B0B] transition-all hover:border-[#C8A46A] hover:text-[#C8A46A]">
                  {r.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Ranges + pricing tables */}
      {brand.ranges.map((range, ri) => (
        <section
          key={range.slug}
          id={`range-${range.slug}`}
          data-testid={`range-${range.slug}`}
          className={`scroll-mt-24 py-16 sm:py-20 ${ri % 2 === 0 ? "bg-[#F5F5F7]" : "bg-white"}`}
        >
          <div className="sp-container">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-12">
            <div className="max-w-3xl">
              <span className="overline text-[#C8A46A]">{brand.brand}</span>
              <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-[#0B0B0B] md:text-4xl text-balance">
                {brand.brand} {range.name}
              </h2>
              <p className="mt-4 leading-relaxed text-[#6E6E73]">{range.blurb}</p>
              {range.features && (
                <p className="mt-4 text-sm text-[#0B0B0B]" data-testid={`features-${range.slug}`}>
                  {range.features.join("  •  ")}
                </p>
              )}
              {range.featureDetails && (
                <div className="mt-7 grid gap-3 sm:grid-cols-2" data-testid={`feature-details-${range.slug}`}>
                  {range.featureDetails.map((feature) => (
                    <div key={feature.title} className="rounded-xl border border-[#E5E5EA] bg-white p-5 soft-shadow-sm">
                      <h3 className="font-serif text-lg text-[#0B0B0B]">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#6E6E73]">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              )}
              {range.note && (
                <p className="mt-5 rounded-xl border border-[#C8A46A]/30 bg-[#F3E9D2]/50 px-4 py-3 text-xs leading-relaxed text-[#5F5140]">{range.note}</p>
              )}
            </div>
            {range.image && (
              <div
                className="mx-auto w-full max-w-sm lg:mx-0 lg:justify-self-end"
                data-testid={`range-image-${range.slug}`}
              >
                {/* Product media is intentionally image-only. No video blocks on brand/range pages. */}
                <div className="flex min-h-[190px] items-center justify-center bg-white px-4 py-6">
                  <img
                    src={range.image}
                    alt={`${brand.brand} ${range.name} split system air conditioner`}
                    loading="lazy"
                    className="block max-h-[230px] w-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-[#6E6E73]">Supplied &amp; Installed</p>
            <div className="mt-3 overflow-hidden rounded-2xl border border-[#E5E5EA] bg-white soft-shadow-sm">
              {range.prices.map((row, i) => (
                <div
                  key={row.kw}
                  data-testid={`price-row-${range.slug}-${row.kw.replace(/[^0-9a-z]/gi, "")}`}
                  className={`grid gap-3 px-6 py-5 sm:grid-cols-[1fr_1fr_auto] sm:items-center sm:gap-8 ${i > 0 ? "border-t border-[#E5E5EA]" : ""}`}
                >
                  <span>
                    <span className="block font-serif text-xl text-[#0B0B0B] sm:text-2xl">{row.kw}</span>
                    {row.model && <span className="mt-1 block text-xs font-medium text-[#6E6E73]">Model {row.model}</span>}
                  </span>
                  <span className="font-serif text-xl text-[#0B0B0B] sm:text-2xl">{row.price}</span>
                  <button
                    onClick={() => handleBook(range.name, row)}
                    data-testid={`book-btn-${range.slug}-${row.kw.replace(/[^0-9a-z]/gi, "")}`}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0B0B0B] border border-[#C8A46A]/60 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#F8F7F5] transition-all hover:border-[#C8A46A] hover:text-[#E4CFA6] hover:-translate-y-[2px]"
                  >
                    Book Installation <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-[#6E6E73]" data-testid={`disclaimer-${range.slug}`}>
              Standard back-to-back installation pricing. Additional pipework, electrical work, brackets or non-standard access may cost extra. Any additional costs are confirmed before work proceeds.
            </p>
          </div>
        </section>
      ))}

      {/* Booking form — pre-filled with selection */}
      <section id="book" className="scroll-mt-24 bg-[#0B0B0B] py-24 sm:py-32" data-testid="brand-book-section">
        <div className="sp-container grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="overline text-[#C8A46A]">Book Installation</span>
            <h2 className="mt-5 font-serif text-4xl font-medium leading-tight tracking-tight text-white md:text-5xl text-balance">
              {selected
                ? `Book your ${brand.brand} ${selected.rangeName} ${selected.kw}`
                : `Book your ${brand.brand} installation`}
            </h2>
            {selected && (
              <p className="mt-5 text-lg text-[#C8A46A]" data-testid="brand-selected-summary">
                {selected.price} · Supplied &amp; Installed
              </p>
            )}
            <p className="mt-6 max-w-md leading-relaxed text-white/70">
              Send us your details and we&apos;ll be in touch to confirm your booking and site details. No obligation.
            </p>
          </div>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md sm:p-10" data-testid="brand-quote-card">
              <QuoteForm
                key={formKey}
                onDark
                defaultService="Split System Installation"
                defaultMessage={selectionMessage}
                submitLabel={submitLabel}
              />
              <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 pt-5">
                {FORM_TRUST_STRIP.slice(0, 5).map((t) => (
                  <li key={t} className="flex items-center gap-1.5 text-xs font-medium text-white/70">
                    <Check className="h-3.5 w-3.5 text-[#C8A46A]" strokeWidth={2.5} /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sibling brand nav — compact */}
      <section className="bg-white py-14">
        <div className="sp-container flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2" data-testid="sibling-brands">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6E6E73]">Other brands:</span>
            {SPLIT_BRANDS.filter((b) => b.slug !== brand.slug).map((b) => (
              <Link key={b.slug} to={`/split-systems/${b.slug}`} data-testid={`brand-link-${b.slug}`}
                className="rounded-full border border-[#0B0B0B]/15 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0B0B0B] transition-all hover:border-[#C8A46A] hover:text-[#C8A46A]">
                {b.brand}
              </Link>
            ))}
          </div>
          <Link to="/split-systems" data-testid="brand-back-main" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#C8A46A] link-line">
            <ArrowLeft className="h-4 w-4" /> All split systems
          </Link>
        </div>
      </section>

      <CTASection />
    </>
  );
};

export default BrandPage;
