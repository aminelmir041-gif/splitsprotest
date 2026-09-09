import HomeComfortPage from "./HomeComfortPage";
import DuctedPricingSelector from "../components/DuctedPricingSelector";
import { IMAGES } from "../lib/data";

const Ducted = () => (
  <HomeComfortPage
    slug="ducted"
    overline="Ducted Air Conditioning"
    title="Whole-home comfort, elegantly hidden"
    sub="Zoned ducted air conditioning concealed within your ceiling — seamless comfort with discreet vents and intelligent control."
    image={IMAGES.controller}
    introImage={IMAGES.controller}
    imgPos="object-center"
    afterHero={<DuctedPricingSelector />}
    intro={{
      heading: "Designed around your home, not the other way around",
      body: "Ducted systems reward careful planning. We map zones to how you live, plan ceiling access to minimise disruption and integrate discreet vents and intuitive controls throughout your home. The result is even, effortless comfort at the touch of a controller.",
    }}
    features={[
      "Custom zoning for room-by-room control",
      "Discreet ductwork and designer vents",
      "Intuitive wall controllers",
      "Ideal for new builds and established homes",
      "Energy-efficient inverter technology",
      "Commercial ducted solutions available",
    ]}
  />
);

export default Ducted;
