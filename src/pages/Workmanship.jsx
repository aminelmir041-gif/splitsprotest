import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { BadgeCheck, Camera, ClipboardCheck, FileCheck2, Phone, ShieldCheck, Wrench } from "lucide-react";
import { PHONE, PHONE_TEL } from "../lib/data";

const promises = [
  { icon: ClipboardCheck, title: "Plan before we install", text: "We discuss the room, layout and suitable system before confirming the work." },
  { icon: Wrench, title: "Careful installation", text: "We take care with positioning, pipework, drainage, electrical connections and a tidy finish." },
  { icon: Camera, title: "Photos and job records", text: "We can document relevant installation details and provide job photos where appropriate." },
  { icon: FileCheck2, title: "Clear paperwork", text: "We explain what was installed and provide applicable invoices, warranty details and compliance documentation." },
  { icon: ShieldCheck, title: "Licensed and insured", text: "We take licensing, insurance and applicable installation requirements seriously." },
  { icon: BadgeCheck, title: "Support after installation", text: "If something isn't right, contact us and we'll review the issue and explain the next steps." },
];

export default function Workmanship() {
  return <div className="bg-white text-[#1D1D1F]">
    <Helmet><title>Workmanship & Trust | SplitsPro</title><meta name="description" content="How SplitsPro plans, installs, documents and supports air conditioning work." /></Helmet>
    <section className="bg-[#111827] text-white px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <p className="uppercase tracking-[.2em] text-sm text-amber-300 mb-5">SplitsPro · Workmanship & Trust</p>
        <h1 className="text-4xl sm:text-6xl font-semibold leading-tight max-w-4xl">Good workmanship is more than how an installation looks.</h1>
        <p className="mt-7 text-lg sm:text-xl text-gray-200 max-w-3xl">It's the planning, care, checks, documentation and support that go into the job — before we call it finished.</p>
        <a href={PHONE_TEL} className="inline-flex mt-9 bg-amber-400 text-black font-semibold px-7 py-4 rounded-lg">Call SplitsPro: {PHONE}</a>
      </div>
    </section>
    <section className="px-6 py-16 sm:py-24"><div className="mx-auto max-w-5xl">
      <p className="text-sm uppercase tracking-widest text-amber-700">Our workmanship approach</p>
      <h2 className="mt-3 text-3xl sm:text-4xl font-semibold">What you can expect from us</h2>
      <div className="grid md:grid-cols-2 gap-5 mt-10">{promises.map(({icon: Icon,title,text})=><div key={title} className="rounded-xl border border-gray-200 p-7"><Icon className="text-amber-600 mb-4" size={28}/><h3 className="text-xl font-semibold">{title}</h3><p className="mt-3 text-gray-600 leading-relaxed">{text}</p></div>)}</div>
    </div></section>
    <section className="bg-[#F5F5F7] px-6 py-16 sm:py-24"><div className="mx-auto max-w-5xl">
      <h2 className="text-3xl sm:text-4xl font-semibold">If there's ever a concern</h2>
      <p className="mt-5 max-w-3xl text-lg text-gray-700">We believe concerns should be handled clearly and fairly. Tell us what's happened and share any photos or documents you have. We'll review the work, explain our findings and discuss an appropriate resolution, including any applicable warranty or compliance obligations.</p>
      <p className="mt-5 text-gray-600">No confusing promises or disappearing after the job — just a clear way to raise an issue.</p>
    </div></section>
    <section className="px-6 py-16 sm:py-24"><div className="mx-auto max-w-5xl text-center">
      <h2 className="text-3xl sm:text-4xl font-semibold">Want your installation done properly?</h2>
      <p className="mt-4 text-gray-600 text-lg">Talk us through your home and we'll help you understand the options.</p>
      <a href={PHONE_TEL} className="inline-flex items-center gap-2 mt-8 bg-[#111827] text-white px-8 py-4 rounded-lg font-semibold"><Phone size={19}/> Call {PHONE}</a>
      <p className="mt-7"><Link className="underline text-gray-600" to="/split-systems">Explore split systems</Link></p>
    </div></section>
  </div>;
}
