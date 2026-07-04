"use client";

import { useMap } from "react-leaflet";
import L from "leaflet";
import { HiViewGridAdd } from "react-icons/hi";

interface FitAllButtonProps {
  colleges: { latitude: number; longitude: number }[];
}

export default function FitAllButton({ colleges }: FitAllButtonProps) {
  const map = useMap();

  const handleClick = () => {
    const valid = colleges.filter((c) => c.latitude && c.longitude);
    if (valid.length === 0) return;
    const bounds = L.latLngBounds(valid.map((c) => [c.latitude, c.longitude]));
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="absolute bottom-6 right-[4.5rem] z-[2000] bg-white px-3 py-2.5 rounded-xl shadow-lg hover:bg-gray-50 border border-gray-100 transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
      title="Show all colleges"
      disabled={colleges.length === 0}
    >
      <HiViewGridAdd className="w-5 h-5 text-gray-600 group-hover:text-gray-700 transition-colors" />
    </button>
  );
}
