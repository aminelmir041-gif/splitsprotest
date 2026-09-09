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
    id: "refresh",
    name: "Refresh Clean",
    price: "$99",
    note: "For a unit that just needs a freshen-up",
    items: [],
  },
  {
    id: "deep",
    name: "Deep Clean",
    price: "$300",
    popular: true,
    note: "For the full fresh-start feeling",
    items: [],
  },
];

const SplitSystemCleaning = () => (
  <CleaningDetailPage
    overline="Split System Cleaning"
    title="Goodbye grime. Hello fresh air."
    sub="Less dust. Smoother airflow. No stale air-con smell. Bring back that fresh, crisp feeling every time you switch it on."
    benefitsTitle="Small clean. Big difference."
    benefitsIntro="This is not about staring at the air-conditioner. It is about walking into the room and instantly feeling that the air is fresher, the cooling feels stronger and the whole space is simply nicer to be in."
    benefits={BENEFITS}
    dreamLine="Same unit. A whole new feeling."
    dreamSub="Cleaner air, stronger airflow and that crisp, just-cleaned feeling every time you walk into the room."
    plans={PLANS}
    typeLabel="Split System"
    siblingHref="/ducted-cleaning"
    siblingLabel="ducted cleaning"
    finePrint="Standard wall-mounted split pricing. If your system needs anything outside a normal clean, we’ll confirm it with you first."
  />
);

export default SplitSystemCleaning;
