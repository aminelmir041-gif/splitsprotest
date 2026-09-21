import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Check, Clock3, Eye, Loader2, Phone, ShieldCheck, Sparkles, Wifi, Wind } from "lucide-react";
import { toast } from "sonner";
import { submitQuote } from "../lib/api";
import { PHONE, PHONE_TEL } from "../lib/data";
import zenaRoom from "../lib/embedded/zenaRoom";
import zenaStreamer from "../lib/embedded/zenaStreamer";
import zenaBlack from "../lib/embedded/zenaBlack";

const OFFERS = [
  { kw: "2.5kW", price: "$1,900", use: "Bedrooms & smaller rooms" },
  { kw: "5.0kW", price: "$2,550", use: "Medium living areas" },
  { kw: "6.0kW", price: "$2,750", use: "Larger living spaces" },
];

const TRUST = [
  "5-Year Daikin Manufacturer Warranty",
  "SplitsPro Installation Guarantee",
  "Installation Within 7 Business Days",
  "Standard Electrical Installation Included",
];

const FEATURES = [
  { icon: Wifi, title: "Built-in Wi-Fi", text: "Control your Zena from your phone for easy everyday comfort." },
  { icon: Sparkles, title: "Streamer air purification", text: "Daikin clean-air technology designed to help reduce odours and contaminants captured by the system." },
  { icon: Eye, title: "Intelligent comfort", text: "Smart sensing helps the system respond to room conditions and occupancy." },
  { icon: Wind, title: "Premium airflow", text: "Refined airflow control helps spread heating and cooling comfortably through the room." },
];

const ZenaQuickForm = () => {
  const [phone, setPhone] = useState("");
  const [suburb, setSuburb] = useState("");
  const [room, setRoom] = useState("");
  const [size, setSize] = useState("Not sure");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!suburb.trim() || phone.replace(/\D/g, "").length < 8) {
      toast.error("Please enter your phone number and suburb.");
      return;
    }

    setLoading(true);
    try {
      await submitQuote({
        name: "Daikin Zena special lead",
        phone: phone.trim(),
        suburb: suburb.trim(),
        service: "Split System Installation",
        email: "",
        photo_url: "",
        message: `Daikin Zena one-off offer. Selected size: ${size}. Room size: ${room.trim() || "Not supplied"}. Offer prices: 2.5kW $1,900, 5.0kW $2,550, 6.0kW $2,750 — fully supplied and installed, standard electrical included.`,
      });
      setDone(true);
      toast.success("Your Zena enquiry has been sent.");
    } catch {
      toast.error("Something went wrong. Please call SplitsPro instead.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/10 p-8 text-center text-white" data-testid="zena-success">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#C8A46A]">
          <Check className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-serif text-2xl">We’ve got your Zena enquiry.</h3>
        <p className="mt-2 text-sm text-white/65">We’ll contact you to confirm sizing, site conditions and your installation date.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3" data-testid="zena-form">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          inputMode="tel"
          autoComplete="tel"
          placeholder="Phone number"
          className="h-14 rounded-xl border border-white/15 bg-white/10 px-4 text-base text-white outline-none placeholder:text-white/45 focus:border-[#C8A46A]"
          data-testid="zena-phone"
        />
        <input
          value={suburb}
          onChange={(e) => setSuburb(e.target.value)}
          autoComplete="address-level2"
          placeholder="Your suburb"
          className="h-14 rounded-xl border border-white/15 bg-white/10 px-4 text-base text-white outline-none placeholder:text-white/45 focus:border-[#C8A46A]"
          data-testid="zena-suburb"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {OFFERS.map((offer) => (
          <button
            type="button"
            key={offer.kw}
            onClick={() => setSize(offer.kw)}
            className={`min-h-14 rounded-xl border px-2 text-sm font-bold transition-all ${
              size === offer.kw
                ? "border-[#C8A46A] bg-[#C8A46A] text-[#0B0B0B]"
                : "border-white/15 bg-white/5 text-white hover:border-[#C8A46A]"
            }`}
            data-testid={`zena-size-${offer.kw.replace(".", "-")}`}
          >
            {offer.kw}
          </button>
        ))}
      </div>

      <input
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        placeholder="Room size (optional) — e.g. 6m × 5m"
        className="h-14 rounded-xl border border-white/15 bg-white/10 px-4 text-base text-white outline-none placeholder:text-white/45 focus:border-[#C8A46A]"
        data-testid="zena-room"
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-1 flex h-14 items-center justify-center rounded-xl bg-[#C8A46A] px-6 text-sm font-extrabold uppercase tracking-[0.12em] text-[#0B0B0B] disabled:opacity-60"
        data-testid="zena-submit"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Get My Installed Zena Price"}
      </button>

      <p className="text-center text-[11px] text-white/45">Only phone and suburb are required.</p>
    </form>
  );
};

const ZenaSpecial = () => (
  <>
    <Helmet>
      <title>Daikin Zena Special Sydney | From $1,900 Fully Installed | SplitsPro</title>
      <meta
        name="description"
        content="One-off Daikin Zena installed special: 2.5kW $1,900, 5.0kW $2,550 and 6.0kW $2,750 fully supplied and installed by SplitsPro."
      />
      <link rel="canonical" href="https://splitspro.com.au/daikin-zena-special" />
      <meta property="og:title" content="Daikin Zena One-Off Installed Special | SplitsPro" />
      <meta property="og:description" content="2.5kW $1,900 · 5.0kW $2,550 · 6.0kW $2,750 — all fully supplied & installed." />
      <meta property="og:image" content={zenaRoom} />
    </Helmet>

    <div className="bg-[#0B0B0B] px-4 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.16em] text-white">
      One-off Daikin Zena sale · <span className="text-[#E4CFA6]">You won’t see this exact offer again</span>
    </div>

    <section className="relative overflow-hidden bg-[#0B0B0B] text-white" data-testid="zena-hero">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(200,164,106,0.18),transparent_36%)]" />
      <div className="sp-container relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.06fr_.94fr] lg:items-center lg:py-24">
        <div>
          <span className="inline-flex rounded-full border border-[#C8A46A]/40 bg-[#C8A46A]/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#E4CFA6]">
            Daikin Zena · Limited Allocation
          </span>

          <h1 className="mt-6 max-w-4xl font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
            Premium Daikin Zena.
            <span className="block text-[#E4CFA6]">Fully installed from $1,900.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/72 sm:text-xl">
            Designer styling, smart comfort and Daikin reliability — with standard electrical installation included.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {OFFERS.map((offer) => (
              <a
                key={offer.kw}
                href="#zena-book"
                className="rounded-2xl border border-white/15 bg-white/[0.07] p-5 transition-all hover:-translate-y-1 hover:border-[#C8A46A]"
              >
                <span className="text-sm font-bold text-[#E4CFA6]">{offer.kw} Zena</span>
                <span className="mt-1 block font-serif text-4xl">{offer.price}</span>
                <span className="mt-2 block text-[10px] font-extrabold uppercase tracking-[0.1em] text-white/50">
                  Fully supplied & installed
                </span>
              </a>
            ))}
          </div>

          <div className="mt-7 grid gap-2 sm:grid-cols-2">
            {TRUST.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-semibold text-white/82">
                <Check className="h-4 w-4 shrink-0 text-[#C8A46A]" strokeWidth={3} />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#zena-book" className="inline-flex min-h-14 items-center justify-center rounded-md bg-[#C8A46A] px-8 text-xs font-extrabold uppercase tracking-[0.15em] text-[#0B0B0B]">
              Claim This Zena Price
            </a>
            <a href={PHONE_TEL} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-md border border-white/25 px-7 text-xs font-bold uppercase tracking-[0.14em] text-white">
              <Phone className="h-4 w-4" /> {PHONE}
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-2 -top-4 z-10 rotate-3 rounded-2xl bg-[#E4CFA6] px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.12em] text-[#0B0B0B] shadow-xl">
            One-off
            <br />
            price
          </div>
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white p-4 shadow-2xl">
            <img src={zenaRoom} alt="Daikin Zena installed in a modern room" className="aspect-[4/3] w-full rounded-2xl object-cover" />
            <div className="flex items-center justify-between gap-4 px-2 pb-1 pt-4 text-[#1D1D1F]">
              <div>
                <p className="font-serif text-xl">Daikin Zena</p>
                <p className="text-xs text-[#6E6E73]">Designer reverse-cycle split system</p>
              </div>
              <span className="rounded-full bg-[#F5F0E7] px-3 py-2 text-xs font-bold">2.5 · 5.0 · 6.0kW</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="border-b border-[#E8E6E1] bg-[#FBFAF8] py-5 sm:py-6">
      <div className="sp-container grid grid-cols-2 gap-0 overflow-hidden rounded-2xl border border-[#E5E5EA] bg-white sm:grid-cols-4">
        {[
          ["5 Years", "Manufacturer warranty"],
          ["7 Business Days", "Installation timeframe"],
          ["Included", "Standard electrical"],
          ["Guaranteed", "SplitsPro installation"],
        ].map(([big, small]) => (
          <div key={big} className="border-b border-r border-[#E5E5EA] px-4 py-5 text-center sm:border-b-0">
            <p className="font-serif text-xl text-[#1D1D1F]">{big}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">{small}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="bg-white py-20 sm:py-28">
      <div className="sp-container">
        <div className="mx-auto max-w-3xl text-center">
          <span className="overline text-[#C8A46A]">Why Zena</span>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-[#1D1D1F] sm:text-5xl">
            Premium comfort without a bulky-looking indoor unit.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[#6E6E73]">
            Zena is Daikin’s designer wall-mounted range — refined, compact and loaded with smart comfort features.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-[#E5E5EA] bg-[#FBFAF8] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3E9D2] text-[#8F6A34]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-serif text-2xl text-[#1D1D1F]">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#6E6E73]">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <figure className="overflow-hidden rounded-2xl border border-[#E5E5EA] bg-white">
            <img src={zenaStreamer} alt="Daikin Zena Streamer air purification" className="aspect-[16/10] w-full object-cover" />
            <figcaption className="p-5">
              <p className="font-serif text-xl text-[#1D1D1F]">Cleaner-air technology built in</p>
              <p className="mt-2 text-sm text-[#6E6E73]">Streamer Technology is one of the reasons Zena sits above a basic entry-level split system.</p>
            </figcaption>
          </figure>
          <figure className="overflow-hidden rounded-2xl border border-[#E5E5EA] bg-white">
            <img src={zenaBlack} alt="Daikin Zena black finish" className="aspect-[16/10] w-full object-cover" />
            <figcaption className="p-5">
              <p className="font-serif text-xl text-[#1D1D1F]">Designed to look better on the wall</p>
              <p className="mt-2 text-sm text-[#6E6E73]">Zena’s designer finishes suit homes where appearance matters as much as performance.</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section className="bg-[#F8F7F4] py-20 sm:py-28" data-testid="zena-pricing">
      <div className="sp-container">
        <div className="mx-auto max-w-3xl text-center">
          <span className="overline text-[#C8A46A]">One-off installed pricing</span>
          <h2 className="mt-4 font-serif text-4xl text-[#1D1D1F] sm:text-5xl">Three Zena sizes. Fully installed.</h2>
          <p className="mt-4 text-[#6E6E73]">
            Every price below includes the system, standard installation and standard electrical installation.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-4 lg:grid-cols-3">
          {OFFERS.map((offer, index) => (
            <div key={offer.kw} className={`rounded-3xl border p-7 ${index === 0 ? "border-[#C8A46A] bg-[#FFF8E8]" : "border-[#E5E5EA] bg-white"}`}>
              {index === 0 && (
                <span className="rounded-full bg-[#C8A46A] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#0B0B0B]">
                  From $1,900
                </span>
              )}
              <h3 className="mt-5 font-serif text-3xl text-[#1D1D1F]">Daikin Zena {offer.kw}</h3>
              <p className="mt-3 font-serif text-5xl text-[#1D1D1F]">{offer.price}</p>
              <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#8F6A34]">Fully supplied & installed</p>
              <p className="mt-5 text-sm text-[#6E6E73]">{offer.use}</p>

              <ul className="mt-6 space-y-3 text-sm text-[#1D1D1F]">
                {[
                  "Standard installation included",
                  "Standard electrical installation included",
                  "5-year Daikin manufacturer warranty",
                  "SplitsPro installation guarantee",
                  "Installation within 7 business days",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#C8A46A]" strokeWidth={3} />
                    {item}
                  </li>
                ))}
              </ul>

              <a href="#zena-book" className="mt-7 flex min-h-13 items-center justify-center rounded-md bg-[#0B0B0B] px-5 py-4 text-xs font-bold uppercase tracking-[0.12em] text-white">
                Get {offer.kw} for {offer.price}
              </a>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-7 max-w-4xl text-center text-[11px] leading-relaxed text-[#6E6E73]">
          Promotional pricing applies to qualifying standard installations and is subject to site conditions, correct sizing and stock availability.
          Extra pipework, difficult access, pumps, switchboard upgrades, asbestos-related work or other non-standard requirements are quoted before proceeding.
          Manufacturer warranty is subject to Daikin Australia’s warranty terms.
        </p>
      </div>
    </section>

    <section id="zena-book" className="scroll-mt-24 bg-[#0B0B0B] py-20 text-white sm:py-28">
      <div className="sp-container grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-20">
        <div>
          <span className="overline text-[#C8A46A]">Quick Zena enquiry</span>
          <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            Secure the special before this allocation is gone.
          </h2>
          <p className="mt-5 max-w-lg text-lg text-white/65">
            No long form. Enter your phone and suburb, choose the size you’re considering, and we’ll confirm the rest.
          </p>

          <div className="mt-8 space-y-3">
            {[
              { icon: Clock3, text: "Installation within 7 business days" },
              { icon: ShieldCheck, text: "5-year manufacturer warranty" },
              { icon: Check, text: "SplitsPro installation guarantee" },
              { icon: Check, text: "Standard electrical installation included" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm font-semibold text-white/80">
                <Icon className="h-5 w-5 text-[#C8A46A]" />
                {text}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur sm:p-8">
          <p className="font-serif text-2xl">Get this price confirmed</p>
          <p className="mt-1 text-sm text-white/55">Phone + suburb are the only required fields.</p>
          <div className="mt-6">
            <ZenaQuickForm />
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[#F3E9D2] py-16">
      <div className="sp-container text-center">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#8F6A34]">Limited Zena allocation</p>
        <h2 className="mx-auto mt-3 max-w-4xl font-serif text-3xl leading-tight text-[#1D1D1F] sm:text-4xl">
          You won’t see this exact Zena offer again.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[#6E6E73]">
          Once the allocated systems are sold, these fully installed promotional prices end.
        </p>
        <a href="#zena-book" className="mt-7 inline-flex min-h-14 items-center justify-center rounded-md bg-[#0B0B0B] px-8 text-xs font-bold uppercase tracking-[0.12em] text-white">
          Claim the offer
        </a>
      </div>
    </section>
  </>
);

export default ZenaSpecial;
