import { Link } from "react-router-dom";
import { LOGO } from "../lib/data";

export const Logo = ({ onDark = false, scrolled = false }) => (
  <Link to="/" data-testid="logo-link" className="flex items-center">
    <img
      src={LOGO}
      alt="SplitsPro Airconditioning"
      className={`w-auto object-contain transition-all duration-500 ${scrolled ? "h-10 sm:h-11 lg:h-[70px]" : "h-12 sm:h-14 lg:h-[94px]"} ${onDark ? "[filter:brightness(0)_invert(1)]" : ""}`}
    />
  </Link>
);

export default Logo;
