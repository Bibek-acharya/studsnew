"use client";

import { Marker } from "react-leaflet";
import { createMarkerIcon } from "@/utils/mapIcons";
import CollegePopup from "./CollegePopup";

interface CollegeMarkerProps {
  college: {
    id: number;
    name: string;
    latitude?: number;
    longitude?: number;
    logo?: string;
    banner?: string;
    district?: string;
    type?: string;
    rating?: number;
    phone?: string;
  };
  isHighlighted?: boolean;
}

export default function CollegeMarker({
  college,
  isHighlighted,
}: CollegeMarkerProps) {
  if (college.latitude == null || college.longitude == null) return null;
  return (
    <Marker
      position={[college.latitude, college.longitude]}
      icon={createMarkerIcon(isHighlighted ? undefined : college.type)}
    >
      <CollegePopup college={college} />
    </Marker>
  );
}
