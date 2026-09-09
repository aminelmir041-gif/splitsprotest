import { Bug, Fan, Gauge, Home, Sparkles, Wind } from "lucide-react";
import CleaningDetailPage from "./CleaningDetailPage";

const BENEFITS = [
  {
    icon: Bug,
    kicker: "Start at the return",
    title: "Cleaner return air",
    desc: "Clean the return-air filter and grille where household dust is constantly drawn in.",
  },
  {
    icon: Fan,
    kicker: "Keep it moving",
    title: "Whole-home airflow",
    desc: "Help maintain more consistent airflow through the system and across your outlets.",
  },
  {
    icon: Sparkles,
    kicker: "Less dust traffic",
    title: "Less built-up dust",
    desc: "Remove visible dust from filters, grilles and accessible air-distribution surfaces.",
  },
  {
    icon: Gauge,
    kicker: "Let the system breathe",
    title: "Efficient operation",
    desc: "Clean filters reduce airflow restriction and help the ducted system breathe properly.",
  },
  {
    icon: Wind,
    kicker: "Clean where you see it",
    title: "Cleaner outlets",
    desc: "Detailed outlet and grille cleaning keeps the visible parts of the system fresh and tidy.",
  },
  {
    icon: Home,
    kicker: "One system, whole home",
    title: "Whole-home system care",
    desc: "A considered clean and inspection helps spot maintenance issues before peak season.",
  },
];

const PLANS = [
  {
    id: "standard",
    name: "Standard Ducted Clean",
    price: "From $299",
    note: "Routine whole-home maintenance",
    items: [
      "Return-air filter clean",
      "Return grille clean",
      "Accessible outlet clean",
      "Indoor unit visual inspection",
      "Drain inspection",
      "Airflow and operation check",
    ],
  },
  {
    id: "deep",
    name: "Deep Ducted Clean",
    price: "From $399",
    popular: true,
    note: "For heavier dust and overdue systems",
    items: [
      "Detailed return-air clean",
      "Filter and grille deep clean",
      "Accessible indoor coil clean",
      "Drain tray and drain clean where accessible",
      "Outlet and grille detailing",
      "Full operation and airflow check",
    ],
  },
];

const DuctedCleaning = () => (
  <CleaningDetailPage
    overline="Ducted Air Conditioning Cleaning"
    title="One system. The whole house breathing through it."
    sub="A tidy return grille is only the beginning. We clean the accessible parts that keep your ducted system moving air around the home properly."
    benefitsTitle="Give the whole system a proper reset."
    benefitsIntro="Ducted air conditioning pulls household air back through the return, filter and indoor unit before sending it around the home again. Keeping those areas clean helps airflow stay consistent and the system work with less restriction."
    benefits={BENEFITS}
    plans={PLANS}
    typeLabel="Ducted"
    siblingHref="/split-system-cleaning"
    siblingLabel="split system cleaning"
    finePrint="Ducted prices are starting prices. Final price depends on system size, safe ceiling access, filter type, number of outlets and the level of build-up found during inspection."
  />
);

export default DuctedCleaning;
