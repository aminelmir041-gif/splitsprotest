import { Bug, Droplets, Gauge, ShieldCheck, Sparkles, Wind } from "lucide-react";
import CleaningDetailPage from "./CleaningDetailPage";

const BENEFITS = [
  {
    icon: Bug,
    kicker: "Breathe easier",
    title: "Cleaner air starts inside the unit",
    desc: "That clean, light feeling starts when the hidden grime is gone and the air coming back into the room feels fresher again.",
  },
  {
    icon: Sparkles,
    kicker: "Less floating around",
    title: "Less dust. More comfort.",
    desc: "A cleaner split helps the room feel fresher, lighter and more comfortable every time you switch it on.",
  },
  {
    icon: Wind,
    kicker: "Feel the difference",
    title: "Stronger, smoother airflow",
    desc: "Bring back that satisfying rush of cool air instead of a tired unit that feels like it is barely moving air across the room.",
  },
  {
    icon: Gauge,
    kicker: "Easy comfort",
    title: "Cooling without the struggle",
    desc: "When the system can breathe properly, comfort feels effortless — smoother, quieter and ready for the days you need it most.",
  },
  {
    icon: Droplets,
    kicker: "Fresh beats funky",
    title: "No more stale air-con smell",
    desc: "Enjoy that crisp, clean feeling when the air-con comes on, without the damp or dusty smell hanging around the room.",
  },
  {
    icon: ShieldCheck,
    kicker: "Keep the good feeling",
    title: "Make a good unit feel new again",
    desc: "Bring back the fresh, cared-for feeling you remember from when the system was newer and every switch-on felt effortless.",
  },
];

const PLANS = [
  {
    id: "standard",
    name: "Standard Clean",
    price: "$100",
    note: "For regular maintenance and a freshen-up",
    items: [
      "Wash and clean filters",
      "Clean indoor covers and accessible surfaces",
      "Clean accessible evaporator coil surface",
      "Check and clear accessible drain area",
      "Basic airflow and operation check",
    ],
  },
  {
    id: "deep",
    name: "Deep Clean",
    price: "$180",
    popular: true,
    badge: "Limited Time Offer",
    note: "A more thorough wash for built-up dirt and grime",
    items: [
      "Everything in the Standard Clean",
      "Protective cleaning bag fitted around indoor unit",
      "Thorough evaporator coil wash",
      "Blower wheel and internal airflow-path clean",
      "Drain tray and accessible drain-line clean",
    ],
  },
];

const SplitSystemCleaning = () => (
  <CleaningDetailPage
    overline="Split System Cleaning · Bass Hill & Chester Hill Offer"
    title="Goodbye grime. Hello fresh air."
    sub="Standard Clean $100 or step up to our $180 Deep Clean limited-time local offer. Simple pricing, clear inclusions and no confusing service menu."
    benefitsTitle="Small clean. Big difference."
    benefitsIntro="This is not about staring at the air-conditioner. It is about walking into the room and instantly feeling that the air is fresher, the cooling feels stronger and the whole space is simply nicer to be in."
    benefits={BENEFITS}
    dreamLine="Same unit. A whole new feeling."
    dreamSub="Cleaner air, stronger airflow and that crisp, just-cleaned feeling every time you walk into the room."
    plans={PLANS}
    typeLabel="Split System"
    siblingHref="/ducted-cleaning"
    siblingLabel="ducted cleaning"
    finePrint="Limited-time local pricing for Bass Hill, Chester Hill and selected nearby suburbs. Standard wall-mounted split systems only. Heavy contamination, difficult access or repairs are quoted separately and confirmed before work starts."
  />
);

export default SplitSystemCleaning;
