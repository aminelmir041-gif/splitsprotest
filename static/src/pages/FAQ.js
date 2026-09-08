import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { PageHero } from "../components/sections.js";
import Reveal from "../components/Reveal.js";
import { FAQS } from "../lib/data.js";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "../components/ui/accordion.js";
const FAQ = () => (_jsxs(_Fragment, { children: [_jsx(PageHero, { overline: "Frequently Asked Questions", title: "Clear answers, no jargon", sub: "Everything you need to know about our air conditioning installation, cleaning, maintenance and repairs." }), _jsx("section", { className: "bg-white py-24 sm:py-32", "data-testid": "faq-section", children: _jsx("div", { className: "sp-container max-w-3xl", children: _jsx(Reveal, { children: _jsx(Accordion, { type: "single", collapsible: true, className: "w-full", children: FAQS.map((f, i) => (_jsxs(AccordionItem, { value: `item-${i}`, "data-testid": `faq-item-${i}`, className: "border-b border-[#E5E5EA]", children: [_jsx(AccordionTrigger, { className: "py-7 text-left font-serif text-xl font-normal text-[#1D1D1F] hover:no-underline", children: f.q }), _jsx(AccordionContent, { className: "pb-7 text-base leading-relaxed text-[#6E6E73]", children: f.a })] }, i))) }) }) }) })] }));
export default FAQ;
