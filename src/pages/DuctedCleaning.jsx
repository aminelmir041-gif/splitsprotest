import { Bug, Fan, Gauge, Home, Sparkles, Wind } from "lucide-react";
import CleaningDetailPage from "./CleaningDetailPage";

const BENEFITS = [
  {
    icon: Bug,
    kicker: "Fresh from the start",
    title: "Cleaner air starts at the return",
    desc: "The return is where the whole home breathes back into the system. Keep that starting point fresh and the whole experience feels better.",
  },
  {
    icon: Fan,
    kicker: "Room to room",
    title: "Smooth airflow through the whole home",
    desc: "The best ducted comfort is the kind you barely notice — even airflow, room to room, without one area feeling forgotten.",
  },
  {
    icon: Sparkles,
    kicker: "A fresher home",
    title: "Less dust traffic",
    desc: "Keep the parts you see and the air path you rely on feeling cleaner, tidier and more cared for across the house.",
  },
  {
    icon: Gauge,
    kicker: "Effortless comfort",
    title: "Let the system breathe easy",
    desc: "When airflow is less restricted, the whole system can feel smoother and more effortless when the weather turns hot.",
  },
  {
    icon: Wind,
    kicker: "Clean lines, clean feel",
    title: "Vents that match the rest of the home",
    desc: "Fresh-looking outlets and grilles help the whole system disappear back into the ceiling where good ducted air should be.",
  },
  {
    icon: Home,
    kicker: "Whole-home comfort",
    title: "One clean. Every room feels it.",
    desc: "Ducted air is about the whole house feeling comfortable together — bedrooms, living spaces and everything in between.",
  },
];

const PLANS = [
  {
    id: "standard",
    name: "Standard Ducted Clean",
    price: "From $299",
    note: "For a well-kept system that needs a refresh",
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
    note: "For the fuller whole-home reset",
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
    title="Make the whole home feel lighter."
    sub="Fresh return air. Smoother airflow. Cleaner-looking vents. Give your ducted system the reset that every room gets to enjoy."
    benefitsTitle="One system. A fresher feeling everywhere."
    benefitsIntro="Ducted comfort should feel invisible — the whole home simply feels right. Cleaner, smoother airflow helps bring back that effortless feeling from room to room."
    benefits={BENEFITS}
    dreamLine="Walk from room to room and the comfort just follows you."
    dreamSub="No fuss. No stale feeling. Just a home that feels cool, fresh and settled from the moment the system comes on."
    plans={PLANS}
    typeLabel="Ducted"
    siblingHref="/split-system-cleaning"
    siblingLabel="split system cleaning"
    finePrint="Ducted pricing starts from the amounts shown and varies with system size and access. We’ll confirm any difference before booking the work."
  />
);

export default DuctedCleaning;
