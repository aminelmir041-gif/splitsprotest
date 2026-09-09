import { Bug, Droplets, Gauge, ShieldCheck, Sparkles, Wind } from "lucide-react";
import CleaningDetailPage from "./CleaningDetailPage";

const BENEFITS = [
  {
    icon: Bug,
    kicker: "Breathe easier",
    title: "Fresh air starts inside the unit",
    desc: "That clean, light feeling starts when the hidden grime is gone and the air coming back into the room feels fresher again.",
  },
  {
    icon: Sparkles,
    kicker: "A cleaner-feeling room",
    title: "Less dust. More fresh.",
    desc: "A cleaner split means less stale dust hanging around the system and a room that simply feels nicer to spend time in.",
  },
  {
    icon: Wind,
    kicker: "Let it breathe",
    title: "Feel the airflow again",
    desc: "Bring back that smooth rush of cool air instead of a tired unit that feels like it is barely pushing across the room.",
  },
  {
    icon: Gauge,
    kicker: "Easy comfort",
    title: "Cooling without the struggle",
    desc: "When the system can breathe properly, comfort feels effortless — quieter, smoother and ready for the hot days when you need it most.",
  },
  {
    icon: Droplets,
    kicker: "Fresh beats funky",
    title: "No more stale air-con smell",
    desc: "Switch it on and enjoy cool air without that damp, dusty smell reminding you what has been sitting inside the unit.",
  },
  {
    icon: ShieldCheck,
    kicker: "Keep the good feeling",
    title: "Make a good unit feel new again",
    desc: "A proper clean can bring back the crisp, cared-for feeling you remember from when the system was newer.",
  },
];

const PLANS = [
  {
    id: "refresh",
    name: "Refresh Clean",
    price: "$99",
    note: "For a unit that just needs a freshen-up",
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
    note: "For the full fresh-start feeling",
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
    title="Make the room feel fresh again."
    sub="Cleaner air. Stronger airflow. No stale air-con smell. Give your split system the fresh-start feeling it has been missing."
    benefitsTitle="The kind of clean you can actually feel."
    benefitsIntro="You know the feeling when a room is cool, fresh and comfortable without the air-con drawing attention to itself? That is the goal — effortless comfort every time you switch it on."
    benefits={BENEFITS}
    dreamLine="Turn it on. Feel the cool air. Forget the unit is even there."
    dreamSub="That is what a good split system should feel like — fresh, quiet, easy comfort that makes the whole room feel better."
    plans={PLANS}
    typeLabel="Split System"
    siblingHref="/ducted-cleaning"
    siblingLabel="ducted cleaning"
    finePrint="Standard wall-mounted split pricing. If your system needs anything outside a normal clean, we’ll confirm it with you first."
  />
);

export default SplitSystemCleaning;
