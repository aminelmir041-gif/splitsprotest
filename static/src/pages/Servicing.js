import { jsx as _jsx } from "react/jsx-runtime";
import ServicePage from "./ServicePage.js";
import { IMAGES } from "../lib/data.js";
const Servicing = () => (_jsx(ServicePage, { slug: "servicing", overline: "Air Conditioning Maintenance", title: "Protect your comfort, year after year", sub: "Considered, preventative servicing that keeps your system efficient, reliable and running at its best through every season.", image: IMAGES.technician, introImage: IMAGES.cleaning, imgPos: "object-[50%_38%]", intro: {
        heading: "Small, regular care prevents big, costly problems",
        body: "Preventative maintenance keeps your air conditioner efficient, protects your warranty and helps avoid breakdowns when you need comfort most. We check, clean and fine-tune every component with care.",
    }, features: [
        "Comprehensive performance service",
        "Preventative checks to avoid breakdowns",
        "Maintains manufacturer warranty",
        "Improved efficiency and lower bills",
        "Scheduled maintenance plans",
        "Reliable after-sales support",
    ] }));
export default Servicing;
