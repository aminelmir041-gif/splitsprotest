import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import { PageHero, CTASection } from "../components/sections";
import { GALLERY } from "../lib/data";

const DUCTED_INSPIRATION = [
  {
    src: "https://images.pexels.com/photos/33451939/pexels-photo-33451939.jpeg?cs=srgb&dl=pexels-hngstrm-33451939.jpg&fm=jpg",
    title: "Vertical Vent Detail",
    tag: "Ducted Inspiration",
  },
  {
    src: "https://images.pexels.com/photos/36451512/pexels-photo-36451512/free-photo-of-modern-luxury-living-room-with-high-ceiling.png?auto=compress&dpr=1&h=750&w=1260",
    title: "Premium High-Ceiling Living",
    tag: "Whole-Home Comfort",
  },
  {
    src: "https://images.pexels.com/photos/36601409/pexels-photo-36601409.jpeg?cs=srgb&dl=pexels-ritam-das-113941289-36601409.jpg&fm=jpg",
    title: "Luxury Living With Discreet Airflow",
    tag: "Ducted Inspiration",
  },
];

const Gallery = () => (
  <>
    <PageHero
      overline="Gallery"
      title="Installations worth showing"
      sub="A considered look at recent SplitsPro projects across Western Sydney homes — clean, discreet and beautifully finished."
    />

    <section className="bg-[#F5F5F7] py-20 sm:py-24" data-testid="ducted-inspiration">
      <div className="sp-container">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C8A46A]">Ducted Design Inspiration</p>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-tight tracking-tight text-[#1D1D1F] sm:text-4xl md:text-5xl">
            Premium interiors, discreet airflow
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#6E6E73] sm:text-base">
            Inspiration for customers who want a more architectural ducted finish — including clean linear and vertical vent details. These inspiration images show design possibilities and are not SplitsPro project photography.
          </p>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {DUCTED_INSPIRATION.map((item, i) => (
            <motion.figure
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group overflow-hidden rounded-2xl border border-[#E0DDD7] bg-white soft-shadow-sm"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#ECEAE6]">
                <img src={item.src} alt={item.title} loading="lazy" className="img-zoom h-full w-full object-cover" />
              </div>
              <figcaption className="p-5">
                <p className="font-serif text-xl text-[#1D1D1F]">{item.title}</p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#C8A46A]">{item.tag}</p>
                <p className="mt-2 text-xs leading-relaxed text-[#6E6E73]">Design inspiration · not a SplitsPro installation</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-white py-24" data-testid="gallery-grid">
      <div className="sp-container">
        <div className="mb-10 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C8A46A]">Real SplitsPro Work</p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-[#1D1D1F] sm:text-4xl">Recent installations</h2>
        </div>
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {GALLERY.map((g, i) => (
            <motion.figure
              key={i}
              data-testid={`gallery-item-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group img-reveal relative mb-6 break-inside-avoid overflow-hidden rounded-2xl soft-shadow-sm"
            >
              {g.placeholder ? (
                <div className="flex aspect-[3/4] w-full flex-col items-center justify-center bg-[#0B0B0B] text-white/70">
                  <ImageIcon className="h-9 w-9" strokeWidth={1.4} />
                  <span className="mt-3 text-sm">{g.title}</span>
                </div>
              ) : g.rotate ? (
                <>
                  <div className="relative aspect-square w-full overflow-hidden">
                    <div className="absolute inset-0 rotate-90">
                      <img
                        src={g.src}
                        alt={g.title}
                        loading="lazy"
                        data-testid={`gallery-img-rotated-${i}`}
                        className="img-zoom h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <span className="font-serif text-lg text-white">{g.title}</span>
                    <span className="text-xs uppercase tracking-wider text-white/80">{g.tag}</span>
                  </figcaption>
                </>
              ) : g.portrait ? (
                <>
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <img src={g.src} alt={g.title} loading="lazy" className="img-zoom h-full w-full object-cover" />
                  </div>
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <span className="font-serif text-lg text-white">{g.title}</span>
                    <span className="text-xs uppercase tracking-wider text-white/80">{g.tag}</span>
                  </figcaption>
                </>
              ) : (
                <>
                  <img src={g.src} alt={g.title} loading="lazy" className="img-zoom w-full object-cover" />
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <span className="font-serif text-lg text-white">{g.title}</span>
                    <span className="text-xs uppercase tracking-wider text-white/80">{g.tag}</span>
                  </figcaption>
                </>
              )}
            </motion.figure>
          ))}
        </div>
      </div>
    </section>

    <CTASection />
  </>
);

export default Gallery;
