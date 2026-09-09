import { Bug, Droplets, Gauge, ShieldCheck, Sparkles, Wind } from "lucide-react";
import CleaningDetailPage from "./CleaningDetailPage";

const BENEFITS = [
  {
    icon: Bug,
    title: "Bacteria & mould build-up",
    desc: "Remove built-up grime and contamination from accessible internal surfaces.",
  },
  {
    icon: Sparkles,
    title: "Dust & allergens",
    desc: "Clean filters and internal surfaces where dust collects and recirculates.",
  },
  {
    icon: Wind,
    title: "Stronger airflow",
    desc: "Reduce dirt restriction through the filters, coil and fan area.",
  },
  {
    icon: Gauge,
    title: "Better efficiency",
    desc: "A cleaner system can move air more freely and work with less restriction.",
  },
  {
    icon: Droplets,
    title: "Fresher smell",
    desc: "Remove damp dust and grime that can contribute to stale air-con odours.",
  },
  {
    icon: ShieldCheck,
    title: "System care",
    desc: "Regular cleaning helps reduce unnecessary strain caused by heavy dirt build-up.",
  },
];

const PLANS = [
  {
    id: "refresh",
    name: "Refresh Clean",
    price: "$99",
    note: "Routine maintenance clean",
    items: [
      "Filter wash and clean",
      "Indoor cover and louvre clean",
      "Light coil surface clean",
      "Drain and airflow check",
      "System operation check",
    ],
  },
  {
    id: "deep",
    name: "Deep Clean",
    price: "$300",
    popular: true,
    note: "For dirty, neglected or odorous units",
    items: [
      "Indoor covers removed for access",
      "Deep evaporator coil clean",
      "Fan barrel / blower clean",
      "Drain tray and drain clean",
      "Protective cleaning bag wash-down",
      "Reassembly and operation test",
    ],
  },
];

const SplitSystemCleaning = () => (
  <CleaningDetailPage
    overline="Split System Cleaning"
    title="Your split system called. It wants a clean."
    sub="From a quick refresh to a proper deep clean, we clean the parts a filter rinse never reaches — with clear pricing and no guesswork."
    benefitsTitle="Less grime in the machine. More comfort in the room."
    benefitsIntro="Split systems quietly collect dust, damp grime and debris behind the front cover. Cleaning the filters, coil, blower area and drain helps the unit breathe properly again."
    benefits={BENEFITS}
    plans={PLANS}
    typeLabel="Split System"
    siblingHref="/ducted-cleaning"
    siblingLabel="ducted cleaning"
    finePrint="Pricing applies to standard wall-mounted split systems with safe access. Heavy contamination, unusual access or damaged components may require a separate quote before work begins."
  />
);

export default SplitSystemCleaning;
