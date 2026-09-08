import { jsx as _jsx } from "react/jsx-runtime";
import ServicePage from "./ServicePage.js";
import { IMAGES } from "../lib/data.js";
const Cleaning = () => (_jsx(ServicePage, { slug: "cleaning", overline: "Air Conditioner Cleaning", title: "Cleaner air, healthier systems", sub: "Thorough coil and filter cleaning that restores efficiency, improves air quality and extends the life of your system.", image: IMAGES.cleaning, introImage: IMAGES.splitIndoor, intro: {
        heading: "A deep clean your system — and your family — will feel",
        body: "Over time, dust, mould and grime build up inside your air conditioner, reducing performance and air quality. Our detailed cleaning treats coils, filters and internal components so your system runs cleaner, cooler and more efficiently.",
    }, features: [
        "Deep coil and filter cleaning",
        "Improved air quality and airflow",
        "Reduced running costs",
        "Healthier home environment",
        "Extends the life of your system",
        "Ideal before summer",
    ] }));
export default Cleaning;
