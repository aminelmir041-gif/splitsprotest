import {
  Snowflake, Wind, Wrench, Sparkles, ShieldCheck, HeartHandshake,
  BadgeCheck, Home as HomeIcon, Brush, MessageSquareQuote,
} from "lucide-react";

export const PHONE = "0414 698 435";
export const PHONE_TEL = "tel:0414698435";
export const ABN = "62 137 127 557";
export const LOGO = "/logo.png";

const A = "https://customer-assets-lxgj4vgw.emergentagent.net/job_splitspro-preview/artifacts/";

export const HOURS = [
  { day: "Monday – Friday", time: "7:00am – 6:00pm" },
  { day: "Saturday", time: "8:00am – 4:00pm" },
  { day: "Sunday", time: "Emergency call-outs" },
];

export const NAV = [
  { label: "Home", to: "/" },
  { label: "Split Systems", to: "/split-systems" },
  { label: "Ducted", to: "/ducted" },
  { label: "Cleaning", to: "/cleaning" },
  { label: "Gallery", to: "/gallery" },
  { label: "Service Areas", to: "/service-areas" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export const SERVICE_OPTIONS = [
  "Split System Installation",
  "Ducted Air Conditioning",
  "Air Conditioner Cleaning",
  "Maintenance & Repairs",
  "Air Conditioner Replacement",
  "Emergency Air Conditioning",
  "Commercial Air Conditioning",
];

// Real client photography (uploaded).
export const IMAGES = {
  heroLiving: A + "q03928px_hero1.png",
  splitOutdoorInstall: A + "juttcwwk_wmremove-transformed.jpeg",
  heroInterior: A + "q6fmbwv0_AdobeStock_569217207.webp",
  splitBedroom: A + "4gx7zwbm_Daikin-Zena-Split-System-sq.jpg",
  splitLiving: A + "g2e5o1an_AdobeStock_2001823238.webp",
  splitIndoor: A + "iai8aofm_20260716_183258%281%29.webp",
  ductedHall: A + "2tkheqar_ducted-air-conditioning-01.jpg",
  ductedVent: A + "dq00wh00_ducted-720.webp",
  cleaning: A + "lf1angzr_AdobeStock_2014887759.webp",
  controller: A + "micwrs4g_AdobeStock_709351486_Editorial_Use_Only.webp",
  technician: A + "361ebd4d_file_0000000002b081faa42489c6f6c612a3.png",
  outdoorRinnai: A + "tvk64ify_Rinnai-reverse-cycle-split-system-aircon-outdoor-unit.jpg",
  outdoorRinnai2: A + "meyqoj4d_file_000000004bf881fbb2fa04727afb3b11.png",
  outdoorDaikin: A + "8sn2d27k_AdobeStock_1222382516_Editorial_Use_Only.webp",
  // Real customer installs — added Aug 2026
  installDaikinBathroom: A + "ld9z3ey8_20260807_165742.webp",
  installRinnaiWall: A + "a2zwvxp5_20260808_150102.webp",
  installDaikinOutdoor2: A + "q9r7krqk_20260810_162548.webp",
  installDaikinGarage: A + "smto7cvr_IMG-20260811-WA0065.webp",
};

export const FEATURED_SERVICES = [
  {
    slug: "split-systems",
    title: "Split System Installation",
    desc: "Quiet, energy-efficient split systems, expertly sized and installed for the room they serve.",
    image: IMAGES.splitBedroom,
    pos: "object-center",
    icon: Snowflake,
  },
  {
    slug: "ducted",
    title: "Ducted Air Conditioning",
    desc: "Whole-home comfort concealed within your ceiling, with discreet vents and intelligent zoning.",
    image: IMAGES.controller,
    pos: "object-center",
    icon: Wind,
  },
  {
    slug: "cleaning",
    title: "Air Conditioner Cleaning",
    desc: "Thorough coil and filter cleaning for healthier air, cleaner systems and better efficiency.",
    image: IMAGES.cleaning,
    pos: "object-center",
    icon: Sparkles,
  },
  {
    slug: "repairs",
    title: "Maintenance & Repairs",
    desc: "Careful servicing and accurate diagnostics that keep every brand running at its best.",
    image: IMAGES.technician,
    pos: "object-[50%_38%]",
    icon: Wrench,
  },
];

export const BRANDS = [
  { name: "Daikin", color: "#0097E0" },
  { name: "Mitsubishi Electric", color: "#E60012" },
  { name: "Panasonic", color: "#0033A0" },
  { name: "Fujitsu", color: "#E60027" },
  { name: "Rinnai", color: "#E4002B" },
];

export const WHY = [
  { icon: ShieldCheck, title: "Licensed & Insured", desc: "Fully licensed, insured and refrigerant-handling certified for complete peace of mind." },
  { icon: HeartHandshake, title: "Tailored Comfort Solutions", desc: "Every system is matched precisely to your home, not sold from a script." },
  { icon: BadgeCheck, title: "Premium Installation Standards", desc: "Meticulous workmanship and finishing on every single installation." },
  { icon: HomeIcon, title: "Respect For Your Home", desc: "We protect your space, work tidily and treat your home as our own." },
  { icon: Brush, title: "Clean Workmanship", desc: "Spotless finishes and a clean site — always left better than we found it." },
  { icon: MessageSquareQuote, title: "Honest Recommendations", desc: "Straight advice with no pressure and no inflated claims." },
];

export const PROCESS = [
  { step: "01", title: "Consultation", desc: "We visit, listen and understand your home — how you live and what you need." },
  { step: "02", title: "Recommendation", desc: "A considered plan with the right system and a clear, honest quote." },
  { step: "03", title: "Professional Installation", desc: "Skilled technicians install with precision, care and a premium finish." },
  { step: "04", title: "Enjoy Lasting Comfort", desc: "Balanced, efficient comfort backed by reliable after-sales support." },
];

// Local-SEO service areas — primary: South Western Sydney, then secondary regions.
export const AREAS_REGIONS = [
  { region: "South Western Sydney", primary: true, suburbs: ["Bass Hill", "Bankstown", "Yagoona", "Condell Park", "Greenacre", "Chester Hill", "Guildford", "Fairfield", "Cabramatta"] },
  { region: "Canterbury-Bankstown", suburbs: ["Punchbowl", "Belmore", "Lakemba", "Roselands", "Padstow", "Revesby", "Panania", "Milperra"] },
  { region: "Liverpool Region", suburbs: ["Liverpool", "Moorebank", "Casula", "Prestons", "Edmondson Park"] },
  { region: "Macarthur", suburbs: ["Campbelltown", "Camden", "Oran Park", "Gregory Hills", "Leppington"] },
  { region: "Western Sydney", suburbs: ["Parramatta", "Auburn", "Lidcombe", "Wentworth Point", "Homebush", "Blacktown", "Castle Hill", "Kellyville", "Baulkham Hills"] },
  { region: "Inner West", suburbs: ["Strathfield", "Burwood", "Ashfield", "Ryde"] },
  { region: "Sutherland Shire & Southern", suburbs: ["Peakhurst", "Hurstville", "Rockdale", "Cronulla", "Miranda", "Sylvania"] },
  { region: "Eastern Suburbs", suburbs: ["Mascot", "Maroubra", "Randwick", "Bondi Junction"] },
];

export const AREAS = AREAS_REGIONS.flatMap((r) => r.suburbs);

export const GALLERY = [
  { src: IMAGES.splitBedroom, title: "Daikin Zena Split", tag: "Split System" },
  { src: IMAGES.splitLiving, title: "Living Room Install", tag: "Residential" },
  { src: IMAGES.outdoorRinnai, title: "Rinnai Outdoor Unit", tag: "Outdoor" },
  { src: IMAGES.ductedVent, title: "Concealed Ducted Vent", tag: "Ducted" },
  { src: IMAGES.splitIndoor, title: "Rinnai Indoor Split", tag: "Split System" },
  { src: IMAGES.outdoorDaikin, title: "Daikin Condenser", tag: "Outdoor" },
  { src: IMAGES.ductedHall, title: "Ducted Hallway Vent", tag: "Ducted" },
  { src: IMAGES.installDaikinBathroom, title: "Daikin Split — Ensuite", tag: "Split System", rotate: true },
  { src: IMAGES.installRinnaiWall, title: "Rinnai Split — Living Area", tag: "Split System", rotate: true },
  { src: IMAGES.installDaikinOutdoor2, title: "Daikin Outdoor — Bracket Mount", tag: "Outdoor", rotate: true },
  { src: IMAGES.installDaikinGarage, title: "Daikin Split — Utility Room", tag: "Split System", rotate: true },
];

export const FAQS = [
  { q: "How do you decide which system is right for my home?", a: "We start with a consultation — considering room sizes, ceiling height, orientation, insulation and how you use each space. Rather than guessing, we recommend the system that genuinely suits your home and budget." },
  { q: "Which air conditioning brands do you install?", a: "We install and service premium brands including Daikin, Mitsubishi Electric, Panasonic, Fujitsu and Rinnai, and will recommend the best fit for your needs." },
  { q: "Do you offer air conditioner cleaning?", a: "Yes. We provide thorough coil and filter cleaning to improve air quality, efficiency and the lifespan of your system — ideal before summer." },
  { q: "Are you licensed and insured?", a: "Absolutely. SplitsPro is fully licensed, insured and refrigerant-handling certified. ABN 62 137 127 557." },
  { q: "How long does an installation take?", a: "A standard split system is typically completed within a few hours. Ducted systems usually take one to two days depending on the size of the home. We confirm timing at the planning stage." },
  { q: "Do you clean up after the installation?", a: "Always. A clean, professional finish and respect for your home are part of the SplitsPro standard — we leave your space spotless." },
  { q: "Which areas do you service?", a: "We're based in South Western Sydney and service all Sydney metropolitan suburbs — from Liverpool, Bankstown and Fairfield through to the Inner West, Eastern Suburbs, Sutherland Shire and Macarthur. Call us to confirm your suburb." },
];


// ---- Trust / social proof ----
export const GOOGLE_RATING = { score: "5.0", count: 14 };

// Featured hero review (shown directly under hero CTA).
export const FEATURED_REVIEW = {
  name: "Sia",
  rating: 5,
  service: "Split System Installation",
  text: "We had the most fantastic experience with Splits Pro. They were professional from the initial quote through to installation, explained every option clearly, and completed the job to an exceptionally high standard. The workmanship was clean, efficient and we couldn't be happier. Highly recommended.",
};

// Short testimonial shown beside the homepage enquiry form.
export const TRUST_QUOTE =
  "Professional, punctual and meticulous. Splits Pro genuinely care about getting the installation right the first time.";

export const TRUST_BADGES = [
  { icon: "star", label: "5.0 Google Rating" },
  { icon: "shield", label: "Licensed & Insured" },
  { icon: "badge", label: "Premium Brands" },
  { icon: "map", label: "Western Sydney" },
];

// ---- Home Comfort Plan™ (Split System + Ducted conversion pages) ----
export const HOME_COMFORT_INCLUDES = [
  "In-Home Comfort Consultation",
  "Complete Property Assessment",
  "Professional System Recommendation",
  "Recommended Unit Placement",
  "Airflow & Comfort Planning",
  "Energy Efficiency Advice",
  "Fixed Written Quote",
  "Installation Timeline",
  "Personalised Home Comfort Plan™",
];

export const HOME_COMFORT_GUARANTEES = [
  "Minimum 5-Year Manufacturer's Warranty on all new systems",
  "Splits Pro Workmanship Guarantee",
  "Licensed & Insured",
  "Installed with quality materials and attention to detail",
  "Fixed Written Quote",
];

export const FORM_TRUST_STRIP = [
  "Normally Valued At Over $200",
  "Complimentary For Limited Monthly Appointments",
  "Fixed Written Quote",
  "Minimum 5-Year Manufacturer's Warranty",
  "Workmanship Guarantee",
  "Licensed & Insured",
  "5.0\u2605 Google Rated",
];


// Per-service landing-page configuration.
export const SERVICE_LANDING = {
  "split-systems": {
    reviewCategory: "split-systems",
    featuredImage: IMAGES.splitOutdoorInstall,
    featuredCaption: "One of our professionally installed split systems in a Western Sydney home.",
    formHeading: "Book Your Free Split System Quote & Plan",
    formService: "Split System Installation",
    benefits: [
      { icon: Snowflake, title: "Precisely Sized", desc: "Systems matched to each room's size, orientation and how you use it — never guessed." },
      { icon: BadgeCheck, title: "Premium Brands", desc: "Daikin, Mitsubishi Electric, Panasonic, Fujitsu and Rinnai — the right fit for your home." },
      { icon: Brush, title: "Flawless Finish", desc: "Concealed pipe runs, tidy placement and a spotless clean-up on every install." },
    ],
    gallery: [IMAGES.splitBedroom, IMAGES.splitLiving, IMAGES.splitIndoor, IMAGES.outdoorRinnai],
    faqs: [FAQS[0], FAQS[1], FAQS[4], FAQS[5]],
  },
  ducted: {
    reviewCategory: "ducted",
    formHeading: "Book Your Free Ducted Design & Quote",
    formService: "Ducted Air Conditioning",
    benefits: [
      { icon: Wind, title: "Whole-Home Comfort", desc: "Even, effortless temperature throughout every room, controlled from one place." },
      { icon: HomeIcon, title: "Custom Zoning", desc: "Zones mapped to how you live, with discreet designer vents concealed in the ceiling." },
      { icon: BadgeCheck, title: "Energy Efficient", desc: "Inverter technology and intelligent control keep running costs down." },
    ],
    gallery: [IMAGES.ductedHall, IMAGES.ductedVent, IMAGES.controller, IMAGES.outdoorDaikin],
    faqs: [FAQS[0], FAQS[1], FAQS[4], FAQS[5]],
  },
  cleaning: {
    reviewCategory: "cleaning",
    formHeading: "Book Your Air Conditioner Clean & Service",
    formService: "Air Conditioner Cleaning",
    benefits: [
      { icon: Sparkles, title: "Healthier Air", desc: "Deep coil and filter cleaning removes dust, mould and grime for cleaner air." },
      { icon: BadgeCheck, title: "Better Efficiency", desc: "A clean system runs cooler, quieter and cheaper — noticeable straight away." },
      { icon: ShieldCheck, title: "Longer Lifespan", desc: "Regular cleaning protects your investment and extends the life of your unit." },
    ],
    gallery: [IMAGES.cleaning, IMAGES.splitIndoor, IMAGES.splitBedroom, IMAGES.controller],
    faqs: [FAQS[2], FAQS[3], FAQS[5], FAQS[6]],
  },
  repairs: {
    reviewCategory: "repairs",
    formHeading: "Book Your Air Conditioning Repair & Diagnosis",
    formService: "Maintenance & Repairs",
    benefits: [
      { icon: Wrench, title: "Accurate Diagnostics", desc: "We find the underlying cause, not just the symptom — and fix it right first time." },
      { icon: MessageSquareQuote, title: "Honest Advice", desc: "Straight guidance on repair-vs-replace, with upfront pricing before any work." },
      { icon: ShieldCheck, title: "All Brands Serviced", desc: "Skilled diagnostics and repairs across every major air conditioning brand." },
    ],
    gallery: [IMAGES.technician, IMAGES.outdoorDaikin, IMAGES.outdoorRinnai2, IMAGES.controller],
    faqs: [FAQS[3], FAQS[4], FAQS[5], FAQS[6]],
  },
  servicing: {
    reviewCategory: "servicing",
    formHeading: "Book Your Air Conditioning Maintenance Service",
    formService: "Maintenance & Repairs",
    benefits: [
      { icon: ShieldCheck, title: "Prevent Breakdowns", desc: "Regular preventative care catches small issues before they become costly problems." },
      { icon: BadgeCheck, title: "Protect Your Warranty", desc: "Scheduled servicing keeps your manufacturer warranty valid and your system reliable." },
      { icon: HeartHandshake, title: "Lower Running Costs", desc: "A well-maintained system runs more efficiently, keeping your energy bills down." },
    ],
    gallery: [IMAGES.technician, IMAGES.cleaning, IMAGES.controller, IMAGES.splitIndoor],
    faqs: [FAQS[3], FAQS[4], FAQS[5], FAQS[6]],
  },
};


// ---- Split System brand pricing navigation ----
// One entry per manufacturer. Each contains one or more product ranges with pricing.
// Prices are supplied-and-installed for a standard back-to-back installation.
export const PRICING_DISCLAIMER =
  "Prices shown are based on a standard back-to-back installation. Additional pipework, electrical work, brackets, difficult access or other non-standard installation requirements may incur additional costs. Any additional costs will be confirmed before work proceeds.";

export const SPLIT_BRANDS = [
  {
    slug: "daikin",
    brand: "Daikin",
    label: "Daikin",
    tagline: "Australia's most popular residential split systems — Cora and Alira X.",
    metaTitle: "Daikin Split System Prices & Installation | SplitsPro",
    h1: "Daikin Split System Air Conditioning",
    metaDesc: "Compare Daikin Cora and Daikin Alira X supplied & installed prices from SplitsPro. Book your Daikin split system installation online.",
    body: "Daikin's residential range covers the popular Cora and the premium Alira X — both quiet, reliable reverse cycle split systems backed by Daikin's manufacturer's warranty.",
    image: IMAGES.splitBedroom,
    ranges: [
      {
        slug: "cora",
        name: "Cora",
        blurb: "Quiet, efficient and reliable everyday Daikin comfort. Cora combines whisper-quiet operation with Coanda airflow, precision temperature control and an Enzyme Blue air-purifying filter, making it a great choice for bedrooms and living areas.",
        features: ["Quiet Operation", "Coanda Airflow", "Air Purification", "Intelligent Comfort"],
        image: "https://otterair.com.au/wp-content/uploads/2024/11/Daikin-XL-Range-5.jpg",
        prices: [
          { kw: "2.5kW", price: "$1,650" },
          { kw: "3.5kW", price: "$1,700" },
          { kw: "5.0kW", price: "$2,450" },
          { kw: "7.1kW", price: "$2,700" },
        ],
      },
      {
        slug: "alira-x",
        name: "Alira X",
        blurb: "Daikin's premium choice for customers who want cleaner air and smarter comfort. Alira X combines Streamer air purification, three-stage filtration, Mould-Proof Operation, humidity sensing and built-in Wi-Fi.",
        features: ["Streamer Purification", "Mould Protection", "Built-In Wi-Fi", "3-Stage Filtration"],
        image: "https://www.daikin.co.nz/cdn/shop/files/Alira_FTXM46WVMA_IDU_28c296f1-f9a4-434f-bcb4-b90d51c02a1c.png?v=1703027226",
        prices: [
          { kw: "2.5kW", price: "$1,950" },
          { kw: "3.5kW", price: "$2,400" },
          { kw: "5.0kW", price: "$3,000" },
          { kw: "7.1kW", price: "$3,500" },
        ],
      },
    ],
  },
  {
    slug: "rinnai",
    brand: "Rinnai",
    label: "Rinnai",
    tagline: "Rinnai reverse cycle split systems — PB Series and T Series.",
    metaTitle: "Rinnai Split System Prices & Installation | SplitsPro",
    h1: "Rinnai Split System Air Conditioning",
    metaDesc: "Compare Rinnai PB Series and Rinnai T Series supplied & installed prices from SplitsPro. Book your Rinnai split system installation online.",
    body: "The Rinnai PB Series and T Series are dependable reverse cycle split systems — a great value choice for bedrooms, living rooms, home offices and granny flats.",
    image: IMAGES.outdoorRinnai,
    ranges: [
      {
        slug: "pb-series",
        name: "PB Series",
        blurb: "Smart, reliable heating and cooling designed for Australian conditions. The PB Series includes Wi-Fi control, quiet inverter operation, self-cleaning, 3D airflow, dehumidifying and sleep functions for comfortable everyday use.",
        features: ["Wi-Fi Control", "Self-Cleaning", "3D Airflow", "Quiet Operation"],
        image: IMAGES.outdoorRinnai,
        prices: [
          { kw: "2.5kW", price: "$1,450" },
          { kw: "3.5kW", price: "$1,550" },
          { kw: "5.0kW", price: "$1,900" },
          { kw: "7.0kW", price: "$2,300" },
        ],
      },
      {
        slug: "t-series",
        name: "T Series",
        blurb: "Affordable smart comfort with modern controls. The Rinnai T Series includes Wi-Fi and voice control, Turbo heating and cooling, dehumidifying mode, Sleep Mode and a high-density air filter.",
        features: ["Wi-Fi + Voice Control", "Turbo Mode", "Sleep Mode", "High-Density Filter"],
        image: IMAGES.outdoorRinnai2,
        prices: [
          { kw: "2.5kW", price: "$1,450" },
          { kw: "3.5kW", price: "$1,550" },
          { kw: "5.0kW", price: "$1,900" },
          { kw: "7.1kW", price: "$2,300" },
        ],
      },
    ],
  },
  {
    slug: "mitsubishi-electric",
    brand: "Mitsubishi Electric",
    label: "Mitsubishi Electric",
    tagline: "Mitsubishi Electric AP Series — refined, whisper-quiet performance.",
    metaTitle: "Mitsubishi Electric Split System Prices & Installation | SplitsPro",
    h1: "Mitsubishi Electric Split System Air Conditioning",
    metaDesc: "Mitsubishi Electric AP Series split systems supplied and installed by SplitsPro. View sizes, supplied & installed prices and book your installation.",
    body: "The Mitsubishi Electric AP Series is renowned for quiet, refined performance and long-term reliability — a premium choice for living areas, bedrooms and open-plan spaces where sound levels matter.",
    image: IMAGES.splitLiving,
    ranges: [
      {
        slug: "ap-series",
        name: "MSZ-AP Series",
        blurb: "Premium Mitsubishi Electric comfort designed around exceptionally quiet operation. The AP Series combines Quiet Mode, Night Mode, built-in Wi-Fi on current applicable models and Dual Barrier Coating to help reduce dust and greasy dirt building up inside the unit.",
        features: ["Ultra-Quiet", "Night Mode", "Wi-Fi Control", "Dual Barrier Coating"],
        image: "https://customer-assets-lxgj4vgw.emergentagent.net/job_splitspro-preview/artifacts/gam9w14y_Screenshot_20260817_152036_ChatGPT.jpg",
        prices: [
          { kw: "2.5kW", price: "$1,799" },
          { kw: "3.5kW", price: "$1,999" },
          { kw: "5.0kW", price: "$2,699" },
          { kw: "7.1kW", price: "$3,199" },
        ],
      },
    ],
  },
  {
    slug: "mitsubishi-heavy-industries",
    brand: "Mitsubishi Heavy Industries",
    label: "Mitsubishi Heavy Industries",
    tagline: "Mitsubishi Heavy Industries Ciara Series — Japanese-engineered comfort.",
    metaTitle: "Mitsubishi Heavy Industries Split System Prices & Installation | SplitsPro",
    h1: "Mitsubishi Heavy Industries Split System Air Conditioning",
    metaDesc: "Mitsubishi Heavy Industries Ciara Series split systems supplied and installed by SplitsPro. View sizes, supplied & installed prices and book online.",
    body: "Mitsubishi Heavy Industries is a separate manufacturer from Mitsubishi Electric. The Ciara Series offers Japanese engineering, quiet operation and strong warranty support at a competitive price.",
    image: IMAGES.splitIndoor,
    ranges: [
      {
        slug: "ciara-series",
        name: "Ciara Series",
        blurb: "A compact premium split system with smart control and strong clean-air features. Ciara includes built-in Wi-Fi, voice control compatibility, Allergen Clear filtration, Self-Clean Operation, quiet operation and advanced 3D airflow.",
        features: ["Built-In Wi-Fi", "Voice Control", "Allergen Clear", "Self-Cleaning"],
        image: "https://wholesaleaircon.com.au/cdn/shop/files/ciara-indoor_9a2bc94f-50b5-48a5-a76f-dd227a9ce584_1200x.png?v=1719892493",
        prices: [
          { kw: "2.0kW", price: "$1,450" },
          { kw: "2.5kW", price: "$1,590" },
          { kw: "3.3kW", price: "$1,790" },
          { kw: "5.0kW", price: "$2,250" },
          { kw: "6.3kW", price: "$2,590" },
          { kw: "7.1kW", price: "$2,690" },
        ],
      },
    ],
  },
];

// ---- Split System FAQs (added for SEO) ----
export const SPLIT_FAQS = [
  { q: "How much does a split system installation cost?", a: "Supplied-and-installed prices vary with the brand, capacity (kW) and the complexity of the pipe run. As a guide, a straightforward 2.5kW–3.5kW install typically starts from around a few thousand dollars, with larger or more complex jobs quoted individually. We provide a fixed written quote before any work starts — no surprises." },
  { q: "What size split system do I need?", a: "The right size depends on room dimensions, ceiling height, windows, insulation, sun exposure and how the room is used. Under-sized units struggle in summer; over-sized units short-cycle and waste energy. Send us your room details and we'll recommend the correct capacity." },
  { q: "Is a 2.5kW split system enough for a bedroom?", a: "A 2.5kW split system is generally suitable for a standard bedroom up to around 20-25 m². Larger master bedrooms, north-facing rooms or rooms with high ceilings may need 3.5kW. We'll confirm based on your room." },
  { q: "What size air conditioner should I use for a living room?", a: "Most Australian living rooms suit a 5.0kW–7.1kW reverse cycle split system. Open-plan or double-height spaces may benefit from an 8.0kW+ unit, or in some cases a ducted system." },
  { q: "Can you replace my existing split system?", a: "Yes. We regularly replace old wall-mounted split systems with new Daikin, Rinnai, Mitsubishi Electric or Mitsubishi Heavy Industries units — reusing existing wall penetrations where possible for a neat finish." },
  { q: "Which split system brand should I choose?", a: "It comes down to your priorities. Daikin and Mitsubishi Electric are known for premium refinement and reliability. Rinnai offers strong value. Mitsubishi Heavy Industries sits between the two. We'll recommend a shortlist based on your room and budget." },
  { q: "Do you supply and install the air conditioner?", a: "Yes — every quote we provide is supplied and installed. That includes the unit, bracket, pipe, control cabling, testing and commissioning." },
  { q: "How long does a split system installation take?", a: "A standard split system installation is typically completed in a few hours. More complex installs (long pipe runs, second-storey mounts, tricky access) may take longer — we confirm timing at quote." },
];
