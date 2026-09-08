import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLenis } from "lenis/react";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { PageHero, CTASection } from "../components/sections.js";
import Reveal from "../components/Reveal.js";
import QuoteForm from "../components/QuoteForm.js";
import { SPLIT_BRANDS, FORM_TRUST_STRIP } from "../lib/data.js";
const BrandPage = () => {
    const { slug } = useParams();
    const brand = SPLIT_BRANDS.find((b) => b.slug === slug);
    const lenis = useLenis();
    const [selected, setSelected] = useState(null);
    if (!brand)
        return _jsx(Navigate, { to: "/split-systems", replace: true });
    const handleBook = (rangeName, priceRow) => {
        const sel = { rangeName, kw: priceRow.kw, price: priceRow.price };
        setSelected(sel);
        setTimeout(() => {
            const el = document.getElementById("book");
            if (!el)
                return;
            if (lenis)
                lenis.scrollTo(el, { offset: -20 });
            else
                el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
    };
    const jumpToRange = (rangeSlug) => {
        const el = document.getElementById(`range-${rangeSlug}`);
        if (!el)
            return;
        if (lenis)
            lenis.scrollTo(el, { offset: -20 });
        else
            el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const selectionMessage = selected
        ? `I'd like to book installation for ${brand.brand} ${selected.rangeName} ${selected.kw} — advertised at ${selected.price} supplied & installed.`
        : "";
    const formKey = selected ? `${brand.slug}-${selected.rangeName}-${selected.kw}` : `${brand.slug}-default`;
    const submitLabel = selected
        ? `Book ${brand.brand} ${selected.rangeName} ${selected.kw}`
        : `Get My ${brand.brand} Quote`;
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsx("title", { children: brand.metaTitle }), _jsx("meta", { name: "description", content: brand.metaDesc }), _jsx("link", { rel: "canonical", href: `https://splitspro.com.au/split-systems/${brand.slug}` }), _jsx("meta", { property: "og:title", content: brand.metaTitle }), _jsx("meta", { property: "og:description", content: brand.metaDesc }), _jsx("meta", { property: "og:type", content: "website" }), _jsx("meta", { property: "og:image", content: brand.image })] }), _jsx(PageHero, { overline: brand.brand, title: brand.h1, sub: brand.tagline, image: brand.image }), _jsx("section", { className: "bg-white py-14 sm:py-20", "data-testid": "brand-intro", children: _jsxs("div", { className: "sp-container", children: [_jsxs(Link, { to: "/split-systems", "data-testid": "brand-back", className: "inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#C8A46A] link-line", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), " Split System Air Conditioning"] }), _jsx("div", { className: "mt-5 max-w-3xl", children: _jsx("p", { className: "leading-relaxed text-[#6E6E73]", children: brand.body }) }), brand.ranges.length > 1 && (_jsx("div", { className: "mt-8 flex flex-wrap items-center gap-2", "data-testid": "range-tabs", children: brand.ranges.map((r) => (_jsx("button", { onClick: () => jumpToRange(r.slug), "data-testid": `range-tab-${r.slug}`, className: "rounded-full border border-[#0B0B0B]/15 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0B0B0B] transition-all hover:border-[#C8A46A] hover:text-[#C8A46A]", children: r.name }, r.slug))) }))] }) }), brand.ranges.map((range, ri) => (_jsx("section", { id: `range-${range.slug}`, "data-testid": `range-${range.slug}`, className: `scroll-mt-24 py-16 sm:py-20 ${ri % 2 === 0 ? "bg-[#F5F5F7]" : "bg-white"}`, children: _jsxs("div", { className: "sp-container", children: [_jsxs("div", { className: "grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-12", children: [_jsxs("div", { className: "max-w-3xl", children: [_jsx("span", { className: "overline text-[#C8A46A]", children: brand.brand }), _jsxs("h2", { className: "mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-[#0B0B0B] md:text-4xl text-balance", children: [brand.brand, " ", range.name] }), _jsx("p", { className: "mt-4 leading-relaxed text-[#6E6E73]", children: range.blurb }), range.features && (_jsx("p", { className: "mt-4 text-sm text-[#0B0B0B]", "data-testid": `features-${range.slug}`, children: range.features.join("  •  ") }))] }), range.image && (_jsx("div", { className: "mx-auto w-full max-w-sm lg:mx-0 lg:justify-self-end", "data-testid": `range-image-${range.slug}`, children: _jsx("div", { className: "flex min-h-[190px] items-center justify-center bg-white px-4 py-6", children: _jsx("img", { src: range.image, alt: `${brand.brand} ${range.name} split system air conditioner`, loading: "lazy", className: "block max-h-[230px] w-full object-contain" }) }) }))] }), _jsx("p", { className: "mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-[#6E6E73]", children: "Supplied & Installed" }), _jsx("div", { className: "mt-3 overflow-hidden rounded-2xl border border-[#E5E5EA] bg-white soft-shadow-sm", children: range.prices.map((row, i) => (_jsxs("div", { "data-testid": `price-row-${range.slug}-${row.kw.replace(/[^0-9a-z]/gi, "")}`, className: `grid gap-3 px-6 py-5 sm:grid-cols-[1fr_1fr_auto] sm:items-center sm:gap-8 ${i > 0 ? "border-t border-[#E5E5EA]" : ""}`, children: [_jsx("span", { className: "font-serif text-xl text-[#0B0B0B] sm:text-2xl", children: row.kw }), _jsx("span", { className: "font-serif text-xl text-[#0B0B0B] sm:text-2xl", children: row.price }), _jsxs("button", { onClick: () => handleBook(range.name, row), "data-testid": `book-btn-${range.slug}-${row.kw.replace(/[^0-9a-z]/gi, "")}`, className: "inline-flex items-center justify-center gap-2 rounded-md bg-[#0B0B0B] border border-[#C8A46A]/60 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#F8F7F5] transition-all hover:border-[#C8A46A] hover:text-[#E4CFA6] hover:-translate-y-[2px]", children: ["Book Installation ", _jsx(ArrowUpRight, { className: "h-4 w-4" })] })] }, row.kw))) }), _jsx("p", { className: "mt-4 text-xs leading-relaxed text-[#6E6E73]", "data-testid": `disclaimer-${range.slug}`, children: "Standard back-to-back installation pricing. Additional pipework, electrical work, brackets or non-standard access may cost extra. Any additional costs are confirmed before work proceeds." })] }) }, range.slug))), _jsx("section", { id: "book", className: "scroll-mt-24 bg-[#0B0B0B] py-24 sm:py-32", "data-testid": "brand-book-section", children: _jsxs("div", { className: "sp-container grid gap-14 lg:grid-cols-2 lg:gap-20", children: [_jsxs("div", { children: [_jsx("span", { className: "overline text-[#C8A46A]", children: "Book Installation" }), _jsx("h2", { className: "mt-5 font-serif text-4xl font-medium leading-tight tracking-tight text-white md:text-5xl text-balance", children: selected
                                        ? `Book your ${brand.brand} ${selected.rangeName} ${selected.kw}`
                                        : `Book your ${brand.brand} installation` }), selected && (_jsxs("p", { className: "mt-5 text-lg text-[#C8A46A]", "data-testid": "brand-selected-summary", children: [selected.price, " \u00B7 Supplied & Installed"] })), _jsx("p", { className: "mt-6 max-w-md leading-relaxed text-white/70", children: "Send us your details and we'll be in touch to confirm your booking and site details. No obligation." })] }), _jsx(Reveal, { delay: 0.1, children: _jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md sm:p-10", "data-testid": "brand-quote-card", children: [_jsx(QuoteForm, { onDark: true, defaultService: "Split System Installation", defaultMessage: selectionMessage, submitLabel: submitLabel }, formKey), _jsx("ul", { className: "mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 pt-5", children: FORM_TRUST_STRIP.slice(0, 5).map((t) => (_jsxs("li", { className: "flex items-center gap-1.5 text-xs font-medium text-white/70", children: [_jsx(Check, { className: "h-3.5 w-3.5 text-[#C8A46A]", strokeWidth: 2.5 }), " ", t] }, t))) })] }) })] }) }), _jsx("section", { className: "bg-white py-14", children: _jsxs("div", { className: "sp-container flex flex-wrap items-center justify-between gap-4", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", "data-testid": "sibling-brands", children: [_jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-[#6E6E73]", children: "Other brands:" }), SPLIT_BRANDS.filter((b) => b.slug !== brand.slug).map((b) => (_jsx(Link, { to: `/split-systems/${b.slug}`, "data-testid": `brand-link-${b.slug}`, className: "rounded-full border border-[#0B0B0B]/15 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0B0B0B] transition-all hover:border-[#C8A46A] hover:text-[#C8A46A]", children: b.brand }, b.slug)))] }), _jsxs(Link, { to: "/split-systems", "data-testid": "brand-back-main", className: "inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#C8A46A] link-line", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), " All split systems"] })] }) }), _jsx(CTASection, {})] }));
};
export default BrandPage;
