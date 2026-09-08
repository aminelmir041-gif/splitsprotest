import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

const GOLD = "#C8A46A";
const BLACK = "#0B0B0B";

const BASE = { name: "Bass Hill", pos: [-33.9018, 150.9905] };

// Suburbs & regions we regularly service across Western Sydney & surrounds.
const SUBURBS = [
  { name: "Parramatta", pos: [-33.8148, 151.0017] },
  { name: "Liverpool", pos: [-33.9200, 150.9231] },
  { name: "Fairfield", pos: [-33.8720, 150.9560] },
  { name: "Cabramatta", pos: [-33.8940, 150.9354] },
  { name: "Bankstown", pos: [-33.9171, 151.0349] },
  { name: "Blacktown", pos: [-33.7710, 150.9060] },
  { name: "Campbelltown", pos: [-34.0630, 150.8140] },
  { name: "Penrith", pos: [-33.7514, 150.6941] },
  { name: "Auburn", pos: [-33.8494, 151.0325] },
  { name: "Merrylands", pos: [-33.8348, 150.9925] },
  { name: "Wetherill Park", pos: [-33.8578, 150.9046] },
  { name: "Guildford", pos: [-33.8560, 150.9870] },
  { name: "Granville", pos: [-33.8330, 151.0110] },
  { name: "Chester Hill", pos: [-33.8880, 150.9970] },
  { name: "Regents Park", pos: [-33.8840, 151.0230] },
  { name: "Greenacre", pos: [-33.9060, 151.0560] },
  { name: "Revesby", pos: [-33.9500, 151.0150] },
  { name: "Panania", pos: [-33.9560, 151.0000] },
  { name: "Oran Park", pos: [-34.0090, 150.7430] },
  { name: "Woodcroft", pos: [-33.7570, 150.8760] },
];

const SubTip = ({ name }) => (
  <Tooltip direction="top" offset={[0, -8]} opacity={1} className="sp-map-tip">
    <span className="block font-semibold">{name}</span>
    <span className="block text-[11px] opacity-70">Serviced by Splits Pro</span>
  </Tooltip>
);

const hover = (base) => ({
  mouseover: (e) => e.target.setStyle({ radius: base + 3, fillOpacity: 1 }),
  mouseout: (e) => e.target.setStyle({ radius: base, fillOpacity: 0.9 }),
});

export const ServiceAreasMap = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      data-testid="service-map-wrap"
    >
      <div className="overflow-hidden rounded-2xl border border-[#E5E5EA] shadow-[0_16px_50px_rgba(11,11,11,0.10)]">
        <MapContainer
          center={[-33.87, 150.92]}
          zoom={10}
          scrollWheelZoom={false}
          className="h-[440px] w-full md:h-[520px]"
          data-testid="service-map"
          style={{ background: "#F0EBE1" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {ready && SUBURBS.map((s, i) => (
            <CircleMarker
              key={s.name}
              center={s.pos}
              radius={6}
              pathOptions={{ color: "#ffffff", weight: 2, fillColor: GOLD, fillOpacity: 0.9 }}
              eventHandlers={hover(6)}
              className="sp-marker"
              data-testid={`map-marker-${i}`}
            >
              <SubTip name={s.name} />
            </CircleMarker>
          ))}

          {/* Home base — premium black + gold */}
          <CircleMarker
            center={BASE.pos}
            radius={13}
            pathOptions={{ color: GOLD, weight: 3, fillColor: BLACK, fillOpacity: 1 }}
            eventHandlers={hover(13)}
            data-testid="map-marker-base"
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent className="sp-map-tip sp-map-tip-hq">
              <span className="block font-semibold">Splits Pro HQ</span>
              <span className="block text-[11px] opacity-80">Based in Bass Hill</span>
            </Tooltip>
          </CircleMarker>
        </MapContainer>
      </div>

      <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#6E6E73]">
          <MapPin className="mr-1 inline h-4 w-4 text-[#C8A46A]" />
          If your suburb isn&apos;t listed — we regularly travel further afield.
        </p>
        <Link
          to="/contact"
          data-testid="check-suburb-btn"
          className="inline-flex items-center gap-2 rounded-md bg-[#0B0B0B] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#F8F7F5] border border-[#C8A46A]/50 transition-all duration-300 hover:border-[#C8A46A] hover:text-[#E4CFA6] hover:-translate-y-[2px]"
        >
          Check Availability <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ServiceAreasMap;
