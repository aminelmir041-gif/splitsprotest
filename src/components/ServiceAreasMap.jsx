import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Circle, CircleMarker, Tooltip } from "react-leaflet";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

const GOLD = "#C8A46A";
const BLACK = "#0B0B0B";
const BASE = { name: "Bass Hill", pos: [-33.9018, 150.9905] };
const SERVICE_AREA = {
  name: "Sydney Metropolitan Service Area",
  center: [-33.91, 150.99],
  radius: 48000,
};

export const ServiceAreasMap = () => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    data-testid="service-map-wrap"
  >
    <div className="overflow-hidden rounded-2xl border border-[#E5E5EA] shadow-[0_16px_50px_rgba(11,11,11,0.10)]">
      <MapContainer
        center={[-33.91, 150.99]}
        zoom={9}
        scrollWheelZoom={false}
        className="h-[390px] w-full sm:h-[460px] md:h-[540px]"
        data-testid="service-map"
        style={{ background: "#F0EBE1" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Circle
          center={SERVICE_AREA.center}
          radius={SERVICE_AREA.radius}
          pathOptions={{
            color: GOLD,
            weight: 3,
            fillColor: GOLD,
            fillOpacity: 0.12,
          }}
          data-testid="map-service-area"
        >
          <Tooltip direction="top" opacity={1} sticky className="sp-map-tip">
            <span className="block font-semibold">{SERVICE_AREA.name}</span>
            <span className="block text-[11px] opacity-70">Approximate SplitsPro coverage</span>
          </Tooltip>
        </Circle>

        <CircleMarker
          center={BASE.pos}
          radius={10}
          pathOptions={{ color: GOLD, weight: 3, fillColor: BLACK, fillOpacity: 1 }}
          data-testid="map-marker-base"
        >
          <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent className="sp-map-tip sp-map-tip-hq">
            <span className="block font-semibold">SplitsPro</span>
            <span className="block text-[11px] opacity-80">Bass Hill base</span>
          </Tooltip>
        </CircleMarker>
      </MapContainer>
    </div>

    <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[#6E6E73]">
        <MapPin className="mr-1 inline h-4 w-4 text-[#C8A46A]" />
        One gold area shows our approximate Sydney service coverage. We regularly travel beyond it too.
      </p>
      <Link
        to="/contact"
        data-testid="check-suburb-btn"
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#0B0B0B] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#F8F7F5] border border-[#C8A46A]/50 transition-all duration-300 hover:border-[#C8A46A] hover:text-[#E4CFA6] hover:-translate-y-[2px] sm:w-auto"
      >
        Check Availability <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  </motion.div>
);

export default ServiceAreasMap;
