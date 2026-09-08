import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LOGO } from "../lib/data";

export const PageLoader = () => {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1250);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="loader-wrap"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="rounded-2xl border border-[#C8A46A]/40 bg-white px-8 py-7 text-center shadow-2xl sm:px-12">
            <motion.img
              src={LOGO}
              alt="SplitsPro"
              className="mx-auto h-20 w-auto object-contain sm:h-24"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.div className="mx-auto mt-6 h-px w-40 overflow-hidden bg-[#C8A46A]/25">
              <motion.div className="h-full bg-[#C8A46A]" initial={{ x: "-100%" }} animate={{ x: "0%" }} transition={{ duration: 1, ease: "easeInOut" }} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
