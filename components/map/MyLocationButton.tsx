"use client";

import { useMap } from "react-leaflet";
import { HiLocationMarker } from "react-icons/hi";
import { useState } from "react";

export default function MyLocationButton() {
  const map = useMap();
  const [locating, setLocating] = useState(false);

  const handleClick = () => {
    if (!navigator.geolocation) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.flyTo([pos.coords.latitude, pos.coords.longitude], 16, {
          duration: 1,
        });
        setLocating(false);
      },
      () => {
        setLocating(false);
      },
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={locating}
      className="absolute bottom-6 right-4 z-[2000] bg-white p-2.5 rounded-xl shadow-lg hover:bg-gray-50 border border-gray-100 transition-all duration-200 hover:shadow-xl disabled:opacity-70 group"
      title="Go to my location"
    >
      {locating ? (
        <span className="w-5 h-5 block rounded-full border-2 border-gray-200 border-t-blue-500 animate-spin" />
      ) : (
        <HiLocationMarker className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
      )}
    </button>
  );
}
