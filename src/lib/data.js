import {
  Snowflake, Wind, Wrench, Sparkles, ShieldCheck, HeartHandshake,
  BadgeCheck, Home as HomeIcon, Brush, MessageSquareQuote,
} from "lucide-react";
import coraUserImage from "./embedded/cora";
import aliraXUserImage from "./embedded/aliraX";
import aliraXAltUserImage from "./embedded/aliraXAlt";
import daikinInstallIndoorCorner from "./embedded/daikinInstallIndoorCorner";
import daikinInstallOutdoorBracket from "./embedded/daikinInstallOutdoorBracket";
import daikinInstallIndoorLabel from "./embedded/daikinInstallIndoorLabel";
import daikinInstallOutdoorClose from "./embedded/daikinInstallOutdoorClose";
import daikinInstallIndoorStraight from "./embedded/daikinInstallIndoorStraight";

export const PHONE = "0414 698 435";
export const PHONE_TEL = "tel:0414698435";
export const ABN = "62 137 127 557";
export const LOGO = `${process.env.PUBLIC_URL || ""}/logo.png`;
const PUBLIC = process.env.PUBLIC_URL || "";

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
  installDaikinIndoorCorner: daikinInstallIndoorCorner,
  installDaikinOutdoorBracket: daikinInstallOutdoorBracket,
  installDaikinIndoorLabel: daikinInstallIndoorLabel,
  installDaikinOutdoorClose: daikinInstallOutdoorClose,
  installDaikinIndoorStraight: daikinInstallIndoorStraight,
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
  { name: "Fujitsu", color: "#E60027" },
  { name: "Rinnai", color: "#E4002B" },
  { name: "Samsung", color: "#1428A0" },
  { name: "Panasonic", color: "#0033A0" },
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
  { src: IMAGES.installDaikinIndoorStraight, title: "Daikin Split — Clean Wall Finish", tag: "Daikin Install"  },
  { src: IMAGES.installDaikinOutdoorBracket, title: "Daikin Outdoor — Wall Bracket", tag: "Daikin Install"  },
  { src: IMAGES.installDaikinIndoorCorner, title: "Daikin Split — Corner Installation", tag: "Daikin Install"  },
  { src: IMAGES.installDaikinIndoorLabel, title: "Daikin Split — Indoor Installation", tag: "Daikin Install"  },
  { src: IMAGES.installDaikinOutdoorClose, title: "Daikin Outdoor — R32 Installation", tag: "Daikin Install"  },
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
export const GOOGLE_RATING = { score: "5.0", count: 24 };

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
    tagline: "Cora, Alira X and the slimline Zena — quiet, refined Daikin comfort for Australian homes.",
    metaTitle: "Daikin Split System Prices, Features & Installation | SplitsPro",
    h1: "Daikin Split System Air Conditioning",
    metaDesc: "Compare Daikin Cora, Alira X and Zena split systems. See easy-to-understand features, model sizes and supplied & installed prices from SplitsPro.",
    body: "Daikin gives you three clear choices: Cora for dependable everyday comfort, Alira X for advanced air quality and smart features, and Zena when you want premium technology in a very slim designer indoor unit. Below we explain what the features actually do in plain English.",
    image: IMAGES.splitBedroom,
    installEditorial: {
      primary: {
        src: IMAGES.installDaikinIndoorStraight,
        alt: "Clean Daikin split system installation completed by SplitsPro",
      },
      secondary: {
        src: IMAGES.installDaikinOutdoorClose,
        alt: "Daytime Daikin R32 outdoor unit installation completed by SplitsPro",
      },
      tertiary: {
        src: IMAGES.installDaikinIndoorCorner,
        alt: "Daikin indoor split system installed neatly by SplitsPro",
      },
    },
    ranges: [
      {
        slug: "cora",
        name: "Cora",
        blurb: "A quiet, efficient all-rounder for bedrooms and living areas. Cora focuses on comfortable airflow, accurate temperature control and cleaner air without making the controls complicated.",
        features: ["Coanda Airflow", "Intelligent Eye", "Enzyme Blue Filter", "0.5°C Control", "Quiet Operation", "R32"],
        featureDetails: [
          { title: "Coanda Airflow", desc: "Instead of blasting cold air straight at you, the louvre sends it along the ceiling so it travels farther and mixes through the room more evenly." },
          { title: "Intelligent Eye", desc: "On applicable models, a sensor can detect people in the room and help manage airflow for comfort. When the room is empty it can move into an energy-saving operation." },
          { title: "Enzyme Blue air filter", desc: "The deodorising filter helps trap microscopic particles, break down odours and deactivate bacteria captured by the filter." },
          { title: "Precision temperature control", desc: "You can set the room temperature in 0.5°C steps, so you are not stuck choosing between one whole degree too warm or too cold." },
          { title: "Quiet fan design", desc: "A large cross-flow fan and efficient motor move more air with less noise — useful for bedrooms and living rooms." },
          { title: "R32 refrigerant", desc: "R32 is the modern refrigerant used by this range. It has a lower global-warming impact than older R410A systems and helps support efficient operation." },
        ],
        image: coraUserImage,
        gallery: [
          { src: coraUserImage, alt: "Daikin Cora indoor unit" },
        ],
        prices: [
          { kw: "2.5kW", model: "FTKM25WVMA", price: "$1,600" },
          { kw: "3.5kW", model: "FTKM35WVMA", price: "$1,750" },
          { kw: "5.0kW", model: "FTKM50WVMA", price: "$2,250" },
          { kw: "7.1kW", model: "FTKM71WVMA", price: "$2,700" },
        ],
      },
      {
        slug: "alira-x",
        name: "Alira X",
        blurb: "Daikin's air-quality focused premium split. It combines three-stage filtration, Streamer technology, mould-control functions, smart control and comfortable airflow.",
        features: ["Streamer", "3-Stage Filtration", "Mould-Proof Operation", "Coanda Airflow", "Intelligent Eye", "Built-In Wi-Fi"],
        featureDetails: [
          { title: "Streamer air cleaning", desc: "Streamer uses a high-power plasma discharge to break down unwanted substances captured inside the unit. Daikin laboratory research using a test Streamer generator also showed inactivation of SARS-CoV-2. This is an air-cleaning feature — it is not a medical guarantee and does not mean an installed air conditioner prevents COVID-19." },
          { title: "Three layers of filtration", desc: "A pre-filter catches larger dust, the Enzyme Blue filter helps with odours and particles, and Streamer works on pollutants captured inside the unit." },
          { title: "Mould-Proof Operation", desc: "After cooling or dry mode, the unit can run a drying operation to reduce moisture left inside the indoor unit, helping limit mould and stale odours." },
          { title: "Coanda Airflow", desc: "Air is guided along the ceiling for a longer throw and more even room temperature instead of a harsh draught straight at you." },
          { title: "2-Area Intelligent Eye", desc: "The people sensor can manage airflow around occupants and move to energy-saving operation when nobody is detected." },
          { title: "Built-in Wi-Fi", desc: "Control temperature, mode and schedules from your phone through Daikin's supported mobile control system." },
        ],
        note: "Streamer coronavirus figures come from Daikin laboratory testing of a test Streamer generator, not a claim that the installed air conditioner prevents infection.",
        image: aliraXUserImage,
        gallery: [
          { src: aliraXUserImage, alt: "Daikin Alira X indoor unit" },
          { src: aliraXAltUserImage, alt: "Daikin Alira X front view" },
        ],
        prices: [
          { kw: "2.5kW", price: "$1,950" },
          { kw: "3.5kW", price: "$2,400" },
          { kw: "5.0kW", price: "$3,000" },
          { kw: "7.1kW", price: "$3,500" },
        ],
      },
      {
        slug: "zena",
        name: "Zena",
        blurb: "Zena is the designer Daikin. It is only 185 mm deep and comes in White Hair Line or Black Wood, so it sits closer to the wall and looks much less bulky than a typical split system.",
        features: ["Slimline Design", "White or Black", "Streamer", "Built-In Wi-Fi", "Coanda Airflow", "Intelligent Eye", "Grid Eye", "Saw Edge Fan"],
        featureDetails: [
          { title: "Ultra-slim designer body", desc: "The indoor unit is about 295 mm high, 798 mm wide and only 185 mm deep. In simple terms: it sticks out from the wall less and looks cleaner in modern rooms." },
          { title: "White Hair Line or Black Wood", desc: "Choose the light finish to blend into a white wall, or the dark Black Wood finish when you want the air conditioner to look like part of the room design." },
          { title: "Streamer air cleaning", desc: "Streamer breaks down bacteria, mould and other unwanted substances captured inside the unit. Daikin has also published laboratory SARS-CoV-2 inactivation results for a test Streamer generator; that does not mean the installed unit guarantees protection from COVID-19." },
          { title: "Advanced titanium apatite filter", desc: "The filter helps trap microscopic particles, break down smells and deactivate bacteria captured on the filter." },
          { title: "Coanda + Vertical Airflow", desc: "In cooling, air can travel along the ceiling for a long, gentle throw. In heating, the louvres can push warm air down the wall toward the floor so your feet do not stay cold." },
          { title: "Intelligent Eye", desc: "A presence sensor notices when the room is empty and can automatically use an energy-saving operation after around 20 minutes." },
          { title: "Grid Eye floor sensor", desc: "During heating it also checks the floor temperature and adjusts airflow direction to help warm the room more evenly from bottom to top." },
          { title: "Saw Edge fan", desc: "The fan blade shape is designed to move a strong volume of air quietly while still fitting inside Zena's very slim casing." },
          { title: "Built-in Wi-Fi", desc: "Phone control is built into the indoor unit, so you can change temperature and operation without adding a bulky external Wi-Fi box." },
        ],
        note: "Zena is available in 2.5, 3.5, 5.0 and 6.0 kW reverse-cycle sizes. White models end in W; Black Wood models end in K.",
        image: `${PUBLIC}/products/zena-black-uploaded.webp`,
        gallery: [
          { src: `${PUBLIC}/products/zena-black-uploaded.webp`, alt: "Daikin Zena Black Wood indoor unit" },
          { src: `${PUBLIC}/products/zena-white-uploaded.webp`, alt: "Daikin Zena White Hair Line with Streamer" },
        ],
        prices: [
          { kw: "2.5kW", model: "FTXJ25TVMAW / K", price: "$1,850" },
          { kw: "3.5kW", model: "FTXJ35TVMAW / K", price: "$2,050" },
          { kw: "5.0kW", model: "FTXJ50TVMAW / K", price: "$2,450" },
          { kw: "6.0kW", model: "FTXJ60TVMAW / K", price: "$2,700" },
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
    slug: "mitsubishi",
    brand: "Mitsubishi",
    label: "Mitsubishi",
    tagline: "Mitsubishi Electric AP Series and Mitsubishi Heavy Industries Ciara Series — compare both in one place.",
    metaTitle: "Mitsubishi Split System Prices & Installation | SplitsPro",
    h1: "Mitsubishi Split System Air Conditioning",
    metaDesc: "Compare Mitsubishi Electric AP Series and Mitsubishi Heavy Industries Ciara split systems, supplied and installed by SplitsPro.",
    body: "For easier comparison, we group the two Mitsubishi air conditioning options on one page. Mitsubishi Electric and Mitsubishi Heavy Industries are separate manufacturers: choose the AP Series for refined ultra-quiet comfort, or the Ciara Series for compact design, smart control and strong clean-air features.",
    image: IMAGES.splitLiving,
    ranges: [
      {
        slug: "electric-ap",
        manufacturer: "Mitsubishi Electric",
        name: "AP Series",
        displayName: "Mitsubishi Electric AP Series",
        tabLabel: "Electric AP",
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
      {
        slug: "heavy-ciara",
        manufacturer: "Mitsubishi Heavy Industries",
        name: "Ciara Series",
        displayName: "Mitsubishi Heavy Industries Ciara Series",
        tabLabel: "Heavy Ciara",
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
  {
    slug: "fujitsu",
    brand: "Fujitsu",
    label: "Fujitsu",
    tagline: "Fujitsu Lifestyle Range — quiet, efficient comfort with smart energy-saving features.",
    metaTitle: "Fujitsu Split System Prices & Installation | SplitsPro",
    h1: "Fujitsu Split System Air Conditioning",
    metaDesc: "Compare Fujitsu Lifestyle KMTC split systems from 2.5kW to 7.1kW with supplied & installed prices, model numbers and easy feature explanations.",
    body: "Fujitsu's Lifestyle KMTC range is a strong all-round choice. It is designed to be quiet, efficient and easy to live with, with useful functions such as a human sensor, economy mode, powerful mode and air-cleaning filters.",
    image: IMAGES.heroInterior,
    ranges: [
      {
        slug: "lifestyle-kmtc",
        name: "Lifestyle KMTC",
        blurb: "A practical premium range for bedrooms through to large living rooms. The smaller 2.5kW model can run as low as 19 dBA in quiet cooling, while the range adds energy-management and air-cleaning features.",
        features: ["Human Sensor", "Economy Mode", "Super Quiet", "Powerful Mode", "Apple-Catechin Filter", "Blue Fin"],
        featureDetails: [
          { title: "Human Sensor", desc: "The indoor unit can detect movement in the room. This helps the system avoid wasting energy when the space is not being used." },
          { title: "Economy Mode", desc: "Limits maximum power demand when you do not need full output — useful when you want steady comfort with lower electricity use." },
          { title: "Powerful Mode", desc: "Temporarily drives the compressor and fan harder to pull a hot or cold room toward the set temperature faster." },
          { title: "Super Quiet Mode", desc: "Drops the indoor fan speed for quieter operation. The 2.5kW Lifestyle model is rated down to about 19 dBA in quiet cooling." },
          { title: "Apple-Catechin Filter", desc: "Uses static electricity and apple-derived polyphenol treatment to help capture fine dust, mould spores and microorganisms on the filter." },
          { title: "Long-Life Ion Deodorisation", desc: "Helps break down absorbed smells using ions generated by very fine ceramic particles." },
          { title: "Blue Fin outdoor coil", desc: "Adds corrosion resistance to the outdoor heat exchanger, which is especially useful in humid or coastal conditions." },
          { title: "Wi-Fi options", desc: "Wi-Fi control is available on supported Lifestyle systems, and Fujitsu also sells Lifestyle Next packages with compatible Wi-Fi control included." },
        ],
        prices: [
          { kw: "2.5kW", model: "ASTG09KMTC", price: "$1,550" },
          { kw: "3.5kW", model: "ASTG12KMTC", price: "$1,700" },
          { kw: "5.0kW", model: "ASTG18KMTC", price: "$2,200" },
          { kw: "6.0kW", model: "ASTG22KMTC", price: "$2,450" },
          { kw: "7.1kW", model: "ASTG24KMTC", price: "$2,650" },
        ],
      },
    ],
  },
  {
    slug: "samsung",
    brand: "Samsung",
    label: "Samsung",
    tagline: "Samsung GEO WindFree — soft draught-free comfort, SmartThings control and advanced self-cleaning.",
    metaTitle: "Samsung WindFree Split System Prices & Installation | SplitsPro",
    h1: "Samsung WindFree Split System Air Conditioning",
    metaDesc: "Compare Samsung GEO WindFree split systems from 2.5kW to 8.0kW with model numbers, supplied & installed prices and simple feature explanations.",
    body: "Samsung WindFree is for people who dislike a cold stream of air blowing directly at them. It cools quickly first, then can maintain comfort by gently dispersing air through thousands of tiny holes across the front panel.",
    image: IMAGES.heroInterior,
    ranges: [
      {
        slug: "geo-windfree",
        name: "GEO WindFree AI Smart",
        blurb: "Samsung's current WindFree range combines quiet micro-hole airflow with AI Auto Cooling, built-in Wi-Fi, SmartThings, air-cleaning filters and automatic coil-cleaning functions.",
        features: ["WindFree Cooling", "AI Auto Cooling", "SmartThings Wi-Fi", "Quad-Care Filter", "Freeze Wash", "Good Sleep"],
        featureDetails: [
          { title: "WindFree Cooling", desc: "The unit cools the room quickly, then can close the main blade and maintain comfort through thousands of tiny holes. That means much less of the cold draught feeling on your face or body." },
          { title: "AI Auto Cooling", desc: "With Wi-Fi enabled, the system can use room conditions and learned usage patterns to choose suitable operating modes automatically." },
          { title: "SmartThings control", desc: "Built-in Wi-Fi lets you turn it on, change temperature, schedule it and monitor it from the Samsung SmartThings app." },
          { title: "Quad-Care filter", desc: "Designed to collect fine dust including PM2.5 and reduce certain viruses, bacteria and allergens on the filter under Samsung's laboratory test conditions." },
          { title: "Freeze Wash", desc: "Freezes the heat exchanger, melts the ice to wash contaminants away, then dries the coil. In simple terms, it gives the indoor coil a deeper automatic clean." },
          { title: "3-step Auto Clean", desc: "After use, the indoor fan can keep running to dry moisture left on the heat exchanger, helping reduce the damp environment where smells and bacteria can build up." },
          { title: "Good Sleep", desc: "Adjusts temperature and airflow through the night and can use WindFree airflow so you are not sleeping under a harsh cold blast." },
          { title: "Fast Cooling", desc: "Uses a larger fan and wide airflow path to pull the room temperature down quickly before switching to gentler comfort operation." },
        ],
        note: "Samsung's virus-reduction claims relate to specific filter laboratory tests and do not mean the air conditioner prevents viral infection in a room.",
        prices: [
          { kw: "2.5kW", model: "AR09DXEANWKNSA", price: "$1,650" },
          { kw: "3.5kW", model: "AR12DXEANWKNSA", price: "$1,800" },
          { kw: "5.0kW", model: "AR18DXEANWKNSA", price: "$2,300" },
          { kw: "7.0kW", model: "AR24DXEANWKNSA", price: "$2,700" },
          { kw: "8.0kW", model: "AR30DXEANWKNSA", price: "$3,100" },
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
