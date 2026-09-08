import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import { PageHero, CTASection } from "../components/sections";
import { GALLERY } from "../lib/data";

const Gallery = () => (
  <>
    <PageHero
      overline="Gallery"
      title="Installations worth showing"
      sub="A considered look at recent SplitsPro projects across Western Sydney homes — clean, discreet and beautifully finished."
    />

    <section className="bg-white py-24" data-testid="gallery-grid">
      <div className="sp-container columns-1 gap-6 sm:columns-2 lg:columns-3">
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
                  <img
                    src={g.src}
                    alt={g.title}
                    loading="lazy"
                    className="img-zoom h-full w-full object-cover"
                  />
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
    </section>

    <CTASection />
  </>
);

export default Gallery;
