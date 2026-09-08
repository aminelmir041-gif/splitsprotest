import { Link } from "react-router-dom";
import { Phone, Instagram, Facebook, MapPin } from "lucide-react";
import { NAV, AREAS, HOURS, PHONE, PHONE_TEL, ABN } from "../lib/data";
import Logo from "./Logo";

const MAPS_SRC =
  "https://www.google.com/maps?q=Bass+Hill+NSW+Australia&z=11&output=embed";

export const Footer = () => (
  <footer data-testid="footer" className="bg-[#0B0B0B] text-white">
    <div className="sp-container grid gap-12 py-20 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <Logo onDark />
        <p className="mt-6 max-w-sm font-serif text-2xl leading-snug text-white/90">
          We craft comfort for every home.
        </p>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
          Premium air conditioning installation, cleaning, repairs and maintenance across Western Sydney. Thoughtfully planned, precisely installed.
        </p>
        <div className="mt-6 flex items-center gap-4">
          <a href="#" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-white/60">
            <Instagram className="h-4 w-4" />
          </a>
          <a href="#" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-white/60">
            <Facebook className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="lg:col-span-2">
        <h4 className="overline text-white/50">Explore</h4>
        <ul className="mt-5 space-y-3">
          {NAV.map((n) => (
            <li key={n.to}>
              <Link to={n.to} className="text-sm text-white/70 transition-colors hover:text-white">{n.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-2">
        <h4 className="overline text-white/50">Service Areas</h4>
        <ul className="mt-5 grid grid-cols-1 gap-3">
          {AREAS.slice(0, 9).map((a) => (
            <li key={a} className="text-sm text-white/70">{a}</li>
          ))}
          <li className="text-sm text-white/50">…and all Sydney metro</li>
        </ul>
      </div>

      <div className="lg:col-span-4">
        <h4 className="overline text-white/50">Get In Touch</h4>
        <a href={PHONE_TEL} className="mt-5 flex items-center gap-3 font-serif text-2xl text-white transition-colors hover:text-white/80">
          <Phone className="h-5 w-5 text-white/60" /> {PHONE}
        </a>
        <div className="mt-5 space-y-1.5 text-sm text-white/70">
          {HOURS.map((h) => (
            <p key={h.day} className="flex justify-between gap-6"><span>{h.day}</span><span className="text-white/50">{h.time}</span></p>
          ))}
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm text-white/55">
          <MapPin className="h-4 w-4" /> Western Sydney, NSW
        </p>
        <div className="mt-5 overflow-hidden rounded-sm border border-white/10">
          <iframe
            title="SplitsPro service area map"
            src={MAPS_SRC}
            width="100%"
            height="180"
            style={{ border: 0, filter: "grayscale(1) invert(0.92) contrast(0.9)" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            data-testid="footer-map"
          />
        </div>
      </div>
    </div>

    <div className="border-t border-white/10 pb-24 md:pb-0">
      <div className="sp-container flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
        <p>© {new Date().getFullYear()} SplitsPro. All rights reserved.</p>
        <p>ABN {ABN} · Fully licensed &amp; insured</p>
      </div>
    </div>
  </footer>
);

export default Footer;
