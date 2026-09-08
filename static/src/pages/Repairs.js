import { jsx as _jsx } from "react/jsx-runtime";
import ServicePage from "./ServicePage.js";
import { IMAGES } from "../lib/data.js";
const Repairs = () => (_jsx(ServicePage, { slug: "repairs", overline: "Maintenance & Repairs", title: "Diagnosed properly, fixed for good", sub: "Careful servicing and accurate diagnostics that keep every brand running at its best \u2014 including emergency call-outs when comfort can't wait.", image: IMAGES.technician, introImage: IMAGES.outdoorDaikin, imgPos: "object-[50%_38%]", intro: {
        heading: "We find the real problem, then fix it right",
        body: "Not cooling, noisy or leaking? We diagnose the underlying cause rather than treating symptoms, and give honest advice on whether a repair or replacement makes better sense for your home. Preventative maintenance keeps things running smoothly all year.",
    }, features: [
        "Accurate fault diagnostics",
        "All major brands serviced & repaired",
        "Preventative maintenance plans",
        "Honest repair-vs-replace advice",
        "Emergency response available",
        "Upfront pricing before any work",
    ] }));
export default Repairs;
