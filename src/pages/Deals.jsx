import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowUpRight, Check, ShieldCheck, Clock3 } from "lucide-react";
import { SPLIT_BRANDS } from "../lib/data";

const Deals = () => {
  const rinnaiImage = SPLIT_BRANDS.find((brand) => brand.slug === "rinnai")?.ranges?.[0]?.image;
  const daikinImage = SPLIT_BRANDS.find((brand) => brand.slug === "daikin")?.ranges?.find((range) => range.slug === "cora")?.image;

  const offers = [
    {
      brand: "Rinnai",
      title: "Rinnai Installed Deals",
      copy: "See the current Rinnai 2.5kW, 3.5kW, 5.0kW and 7.0kW supplied-and-installed specials.",
      warranty: "7-year manufacturer warranty",
      image: rinnaiImage,
      to: "/split-systems/rinnai-local-offer#range-rinnai-local",
    },
    {
      brand: "Daikin",
      title: "Daikin Cora Installed Deals",
      copy: "See the current Daikin Cora 2.5kW, 3.5kW, 5.0kW and 7.0kW supplied-and-installed specials.",
      warranty: "5-year manufacturer warranty",
      image: daikinImage,
      to: "/split-systems/rinnai-local-offer#range-daikin-lite-local",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Current Air Conditioning Deals | Rinnai & Daikin | SplitsPro</title>
        <meta
          name="description"
          content="View current SplitsPro Rinnai and Daikin Cora supplied-and-installed air conditioning deals."
        />
        <link rel="canonical" href="https://splitspro.com.au/deals" />
      </Helmet>

      <section className="relative overflow-hidden bg-[#0B0B0B] pb-16 pt-32 text-white sm:pb-20 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,164,106,0.18),transparent_38%)]" />
        <div className="sp-container relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D8B678]">SplitsPro current offers</p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-[1.02] sm:text-6xl">
            Rinnai &amp; Daikin deals in one place.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            You do not need to find the ad again. Come back here anytime, choose the brand you want, and see the current installed offer.
          </p>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/75">
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#D8B678]" /> Supplied &amp; installed offers</span>
            <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#D8B678]" /> Fast installation availability</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#D8B678]" /> Installation guarantee</span>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F5F1] py-12 sm:py-20">
        <div className="sp-container">
          <div className="grid gap-6 lg:grid-cols-2">
            {offers.map((offer) => (
              <Link
                key={offer.brand}
                to={offer.to}
                className="group overflow-hidden rounded-3xl border border-[#E4E0D8] bg-white shadow-[0_12px_40px_rgba(20,20,20,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(20,20,20,0.10)]"
              >
                <div className="flex min-h-[230px] items-center justify-center bg-[#FBFBFB] p-7 sm:min-h-[270px] sm:p-10">
                  {offer.image ? (
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="max-h-[190px] w-full object-contain sm:max-h-[220px]"
                    />
                  ) : (
                    <div className="font-serif text-4xl text-[#1D1D1F]">{offer.brand}</div>
                  )}
                </div>
                <div className="p-7 sm:p-9">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9A7540]">{offer.brand}</p>
                  <h2 className="mt-2 font-serif text-3xl text-[#1D1D1F] sm:text-4xl">{offer.title}</h2>
                  <p className="mt-4 max-w-xl leading-relaxed text-[#66666B]">{offer.copy}</p>
                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-[#4A4A4E]">
                    <span className="rounded-full bg-[#F7F5F1] px-3 py-2">{offer.warranty}</span>
                    <span className="rounded-full bg-[#F7F5F1] px-3 py-2">Clear installed pricing</span>
                  </div>
                  <div className="mt-7 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-[#9A7540]">
                    View current {offer.brand} deals
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-[#E4E0D8] bg-white p-6 text-center sm:p-8">
            <p className="font-serif text-2xl text-[#1D1D1F]">Save this page and come back whenever you want.</p>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-[#6E6E73]">
              The Deals button stays in the SplitsPro header, so customers can return to these offers without clicking another paid ad.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Deals;
