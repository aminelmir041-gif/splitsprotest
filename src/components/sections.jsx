import { useRef, useEffect, useState } from "react";
import { Phone, Check, Star, ShieldCheck, BadgeCheck, MapPin } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Reveal from "./Reveal";
import { PHONE, PHONE_TEL, BRANDS, PROCESS, WHY, GOOGLE_RATING } from "../lib/data";
import { getReviews } from "../lib/api";

export const Overline = ({ children, light = false }) => (
  <span className={`overline ${light ? "text-[#C8A46A]" : ""}`}>{children}</span>
);

export const SectionHeading = ({ overline, title, sub, align = "left", light = false }) => (
  <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
    {overline && <Reveal><Overline light={light}>{overline}</Overline></Reveal>}
    <Reveal delay={0.05}>
      <h2 className={`mt-5 font-serif text-4xl font-medium leading-[1.08] tracking-tight md:text-5xl text-balance ${light ? "text-white" : "text-[#1D1D1F]"}`}>{title}</h2>
    </Reveal>
    {sub && <Reveal delay={0.1}><p className={`mt-5 text-lg leading-relaxed ${light ? "text-white/70" : "text-[#6E6E73]"}`}>{sub}</p></Reveal>}
  </div>
);

// Soft animated airflow lines (used over hero / navy sections)
export const Airflow = ({ className = "" }) => (
  <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} preserveAspectRatio="none" viewBox="0 0 1200 600" fill="none" aria-hidden>
    {[0, 1, 2, 3].map((i) => (
      <motion.path
        key={i}
        d={`M-50 ${120 + i * 110} C 300 ${60 + i * 110}, 600 ${200 + i * 90}, 1250 ${100 + i * 110}`}
        stroke="url(#airflowGrad)"
        strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 0.6, 0], x: [0, 40, 0] }}
        transition={{ duration: 9 + i * 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
      />
    ))}
    <defs>
      <linearGradient id="airflowGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
        <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

// Deep-navy hero used by interior pages (no photo reuse)
export const PageHero = ({ overline, title, sub, image, note, imgPos = "object-center", desktopBrand = false }) => {
  if (image) {
    return (
      <>
        <section className={`${desktopBrand ? "lg:hidden" : ""} relative flex min-h-[58vh] items-end overflow-hidden`}>
          <div className="img-reveal absolute inset-0 -z-10">
            <motion.img src={image} alt={title} initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }} className={`h-full w-full object-cover ${imgPos}`} />
            <div className="absolute inset-0 hero-overlay-lr" />
            <div className="absolute inset-0 hero-overlay-base" />
          </div>
          <div className="sp-container pb-16 pt-40">
            <Reveal><Overline light>{overline}</Overline></Reveal>
            <Reveal delay={0.05}><h1 className="mt-5 max-w-4xl font-serif text-5xl font-medium leading-none tracking-tight text-white md:text-6xl lg:text-7xl text-balance">{title}</h1></Reveal>
            {sub && <Reveal delay={0.1}><p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">{sub}</p></Reveal>}
          </div>
        </section>
        {desktopBrand && (
          <section className="relative hidden h-[390px] items-end overflow-hidden bg-[#17191C] lg:flex">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(200,164,106,0.18),transparent_34%),linear-gradient(110deg,#0B0B0B_0%,#17191C_62%,#25272A_100%)]" />
            <div aria-hidden className="absolute right-[7%] top-1/2 h-[250px] w-[430px] -translate-y-1/2 rounded-full border border-white/[0.035]" />
            <div className="sp-container relative z-10 pb-12 pt-24">
              <Reveal><Overline light>{overline}</Overline></Reveal>
              <Reveal delay={0.05}><h1 className="mt-5 max-w-5xl font-serif text-[58px] font-medium leading-[0.98] tracking-tight text-white text-balance">{title}</h1></Reveal>
              {sub && <Reveal delay={0.1}><p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/75">{sub}</p></Reveal>}
            </div>
          </section>
        )}
      </>
    );
  }
  return (
    <section className="relative flex min-h-[56vh] items-end overflow-hidden bg-[#0B0B0B]">
      <motion.div aria-hidden className="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-[#C8A46A]/50 blur-[120px]" animate={{ x: [0, 80, 0], y: [0, 40, 0] }} transition={{ duration: 16, repeat: Infinity }} />
      <motion.div aria-hidden className="absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-[#C8A46A]/20 blur-[120px]" animate={{ x: [0, -60, 0], y: [0, -30, 0] }} transition={{ duration: 18, repeat: Infinity }} />
      <Airflow className="opacity-40" />
      <div className="sp-container relative pb-16 pt-40">
        <Reveal><Overline light>{overline}</Overline></Reveal>
        <Reveal delay={0.05}><h1 className="mt-5 max-w-4xl font-serif text-5xl font-medium leading-none tracking-tight text-white md:text-6xl lg:text-7xl text-balance">{title}</h1></Reveal>
        {sub && <Reveal delay={0.1}><p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">{sub}</p></Reveal>}
        {note && <Reveal delay={0.15}><p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70">{note}</p></Reveal>}
      </div>
    </section>
  );
};

export const CTASection = () => (
  <section className="relative overflow-hidden bg-[#0B0B0B] py-28 sm:py-36" data-testid="cta-section">
    <motion.div aria-hidden className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#C8A46A]/40 blur-[130px]" animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 8, repeat: Infinity }} />
    <Airflow className="opacity-30" />
    <div className="sp-container relative z-10 text-center">
      <Reveal><Overline light>Request a quote</Overline></Reveal>
      <Reveal delay={0.06}><h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl font-medium leading-tight tracking-tight text-white md:text-5xl text-balance">Let&apos;s craft the right comfort for your home</h2></Reveal>
      <Reveal delay={0.12}><p className="mx-auto mt-6 max-w-xl text-lg text-white/70">A considered consultation, an honest recommendation and a precise installation. Request your free, no-obligation quote today.</p></Reveal>
      <Reveal delay={0.18}>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a href={PHONE_TEL} className="btn-glass-light"><Phone className="h-4 w-4" /> Call {PHONE}</a>
        </div>
      </Reveal>
    </div>
  </section>
);

// 3D tilt card for services
export const TiltCard = ({ children, className = "" }) => {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 150, damping: 18 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => { mx.set(0.5); my.set(0.5); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const WhyGrid = () => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {WHY.map((w, i) => (
      <Reveal key={w.title} delay={(i % 3) * 0.08}>
        <div className="hover-rise group h-full rounded-2xl border border-[#E5E5EA] bg-white p-8 soft-shadow-sm">
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E9D2] text-[#C8A46A]">
            <motion.span aria-hidden className="absolute inset-0 rounded-full bg-[#C8A46A]/10" animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }} />
            <w.icon className="h-6 w-6" strokeWidth={1.7} />
          </span>
          <h3 className="mt-6 font-serif text-xl text-[#1D1D1F]">{w.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#6E6E73]">{w.desc}</p>
        </div>
      </Reveal>
    ))}
  </div>
);

export const ProcessTimeline = () => (
  <div className="relative">
    <div className="absolute left-0 right-0 top-7 hidden h-px bg-[#E5E5EA] lg:block" />
    <motion.div
      className="absolute left-0 top-7 hidden h-px bg-[#C8A46A] lg:block"
      initial={{ width: "0%" }}
      whileInView={{ width: "100%" }}
      viewport={{ once: true }}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
    />
    <div className="grid gap-12 lg:grid-cols-4">
      {PROCESS.map((p, i) => (
        <Reveal key={p.step} delay={i * 0.12}>
          <div className="relative">
            <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-[#C8A46A] bg-white font-serif text-lg font-medium text-[#C8A46A]">{p.step}</span>
            <h3 className="mt-6 font-serif text-2xl text-[#1D1D1F]">{p.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#6E6E73]">{p.desc}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </div>
);

export const BrandStrip = () => (
  <div className="border-y border-[#E5E5EA] bg-white py-14" data-testid="brand-strip">
    <div className="sp-container">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.24em] text-[#6E6E73]">Trusted premium brands</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {BRANDS.map((b) => (
          <span key={b.name} className="cursor-default font-serif text-2xl text-[#1D1D1F]/30 transition-colors duration-300 sm:text-3xl"
            style={{ transition: "color .3s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = b.color)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}
          >
            {b.name}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export const FeatureList = ({ items }) => (
  <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
    {items.map((it, i) => (
      <Reveal key={it} delay={(i % 2) * 0.05}>
        <li className="flex items-center gap-4 border-b border-[#E5E5EA] pb-5">
          <Check className="h-5 w-5 shrink-0 text-[#C8A46A]" strokeWidth={2} />
          <span className="text-lg text-[#1D1D1F]">{it}</span>
        </li>
      </Reveal>
    ))}
  </ul>
);

const Stars = ({ n = 5, className = "" }) => (
  <span className={`inline-flex items-center gap-0.5 ${className}`}>
    {Array.from({ length: n }).map((_, i) => (
      <Star key={i} className="h-4 w-4 fill-[#FBBC04] text-[#FBBC04]" />
    ))}
  </span>
);

// Google rating badge (5.0 · 14 verified reviews)
export const GoogleRating = ({ light = false, className = "" }) => (
  <div data-testid="google-rating" className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 ${light ? "border-white/20 bg-white/10 backdrop-blur-md" : "border-[#E5E5EA] bg-white soft-shadow-sm"} ${className}`}>
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden><path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/><path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/><path fill="#FBBC04" d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/><path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/></svg>
    <span className={`text-sm font-semibold ${light ? "text-white" : "text-[#1D1D1F]"}`}>{GOOGLE_RATING.score}</span>
    <Stars />
    <span className={`text-sm ${light ? "text-white/70" : "text-[#6E6E73]"}`}>{GOOGLE_RATING.count} Verified Reviews</span>
  </div>
);

// Trust badges strip for service pages
export const TrustBadges = () => {
  const items = [
    { icon: Star, label: `${GOOGLE_RATING.score} Google Rating` },
    { icon: ShieldCheck, label: "Licensed & Insured" },
    { icon: BadgeCheck, label: "Premium Brands" },
    { icon: MapPin, label: "Western Sydney" },
  ];
  return (
    <div className="border-y border-[#E5E5EA] bg-[#F5F5F7]" data-testid="trust-badges">
      <div className="sp-container flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-6">
        {items.map((b) => (
          <span key={b.label} className="inline-flex items-center gap-2 text-sm font-semibold text-[#1D1D1F]">
            <b.icon className="h-4 w-4 text-[#C8A46A]" strokeWidth={2} /> {b.label}
          </span>
        ))}
      </div>
    </div>
  );
};

const Avatar = ({ name }) => (
  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F3E9D2] font-serif text-lg font-medium text-[#C8A46A]">
    {name?.trim()?.charAt(0)?.toUpperCase() || "S"}
  </span>
);

// Reviews section that filters by category. Falls back to any reviews if none match.
export const ServiceReviews = ({ category, title = "What local homeowners say", light = false, max = 3 }) => {
  const [reviews, setReviews] = useState([]);
  useEffect(() => { getReviews().then(setReviews).catch(() => setReviews([])); }, []);

  let list = reviews;
  if (category) {
    const matched = reviews.filter((r) => r.category === category);
    list = matched.length ? matched : reviews.filter((r) => r.category === "general");
  }
  list = list.slice(0, max);
  if (!list.length) return null;

  return (
    <section className={`py-24 sm:py-32 ${light ? "bg-[#0B0B0B]" : "bg-white"}`} data-testid="service-reviews">
      <div className="sp-container">
        <div className="flex flex-col items-start gap-4">
          <GoogleRating light={light} />
          <SectionHeading overline="Google Reviews" title={title} light={light} />
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {list.map((r, i) => (
            <Reveal key={r.id || i} delay={i * 0.08}>
              <figure data-testid={`review-${i}`} className={`flex h-full flex-col rounded-2xl border p-8 ${light ? "border-white/10 bg-white/5" : "border-[#E5E5EA] bg-white soft-shadow-sm"}`}>
                <Stars />
                <blockquote className={`mt-5 flex-1 text-base leading-relaxed ${light ? "text-white/85" : "text-[#1D1D1F]"}`}>&ldquo;{r.text}&rdquo;</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <Avatar name={r.name} />
                  <span>
                    <span className={`block text-sm font-semibold ${light ? "text-white" : "text-[#1D1D1F]"}`}>{r.name}</span>
                    <span className={`block text-xs ${light ? "text-white/55" : "text-[#6E6E73]"}`}>Verified Google Review</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
