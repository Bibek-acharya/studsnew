import L from "leaflet";

const COLORS: Record<string, string> = {
  public: "#3B82F6",
  private: "#22C55E",
  community: "#A855F7",
};

const cache = new Map<string, L.DivIcon>();

export function createMarkerIcon(type?: string): L.DivIcon {
  const key = type?.toLowerCase() || "default";
  const cached = cache.get(key);
  if (cached) return cached;

  const color = COLORS[type?.toLowerCase() || ""] || "#6B7280";
  const icon = L.divIcon({
    className: "",
    html: `<svg viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg" style="width:32px;height:42px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 26 16 26s16-17.163 16-26C32 7.163 24.837 0 16 0z" fill="${color}"/>
      <circle cx="16" cy="14" r="7" fill="white"/>
    </svg>`,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
  cache.set(key, icon);
  return icon;
}
