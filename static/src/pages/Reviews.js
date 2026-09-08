import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { PageHero, CTASection, GoogleRating } from "../components/sections.js";
import Reveal from "../components/Reveal.js";
import { getReviews } from "../lib/api.js";
const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getReviews().then(setReviews).catch(() => setReviews([])).finally(() => setLoading(false));
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx(PageHero, { overline: "Google Reviews", title: "Kind words from local homeowners", sub: "Real feedback from Western Sydney customers who trusted SplitsPro with their comfort." }), _jsx("section", { className: "bg-white py-24 sm:py-32", "data-testid": "reviews-grid", children: _jsxs("div", { className: "sp-container", children: [_jsx("div", { className: "mb-14", children: _jsx(GoogleRating, {}) }), loading ? (_jsx("p", { className: "text-[#6E6E73]", children: "Loading reviews\u2026" })) : (_jsx("div", { className: "grid gap-8 md:grid-cols-2 lg:grid-cols-3", children: reviews.map((r, i) => (_jsx(Reveal, { delay: (i % 3) * 0.08, children: _jsxs("figure", { "data-testid": `review-card-${i}`, className: "flex h-full flex-col rounded-2xl border border-[#E5E5EA] bg-white p-8 soft-shadow-sm", children: [_jsx("span", { className: "inline-flex items-center gap-0.5", children: Array.from({ length: r.rating }).map((_, s) => (_jsx(Star, { className: "h-4 w-4 fill-[#FBBC04] text-[#FBBC04]" }, s))) }), _jsxs("blockquote", { className: "mt-5 flex-1 text-base leading-relaxed text-[#1D1D1F]", children: ["\u201C", r.text, "\u201D"] }), _jsxs("figcaption", { className: "mt-6 flex items-center gap-3", children: [_jsx("span", { className: "flex h-11 w-11 items-center justify-center rounded-full bg-[#F3E9D2] font-serif text-lg font-medium text-[#C8A46A]", children: r.name?.trim()?.charAt(0)?.toUpperCase() || "S" }), _jsxs("span", { children: [_jsx("span", { className: "block text-sm font-semibold text-[#1D1D1F]", children: r.name }), _jsxs("span", { className: "block text-xs text-[#6E6E73]", children: ["Verified Google Review", r.service ? ` · ${r.service}` : ""] })] })] })] }) }, r.id))) }))] }) }), _jsx(CTASection, {})] }));
};
export default Reviews;
