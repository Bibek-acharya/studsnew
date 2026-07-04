"use client";

import { Popup } from "react-leaflet";
import Image from "next/image";
import { FaMapMarkerAlt, FaStar, FaExternalLinkAlt } from "react-icons/fa";

interface CollegePopupProps {
  college: {
    id: number;
    name: string;
    logo?: string;
    district?: string;
    type?: string;
    rating?: number;
    latitude?: number;
    longitude?: number;
  };
}

export default function CollegePopup({ college }: CollegePopupProps) {
  const stars = Math.round(college.rating || 0);
  const typeColor: Record<string, string> = {
    public: "bg-blue-100 text-blue-700",
    private: "bg-green-100 text-green-700",
    community: "bg-purple-100 text-purple-700",
  };
  const typeBadge =
    typeColor[college.type?.toLowerCase() || ""] || "bg-gray-100 text-gray-600";

  return (
    <Popup className="college-popup">
      <div className="p-1">
        <div className="flex gap-3 min-w-0 sm:min-w-[200px]">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 shadow-sm">
            {college.logo ? (
              <Image
                src={college.logo}
                alt={college.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold bg-gradient-to-br from-gray-100 to-gray-200">
                {college.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 truncate leading-tight">
              {college.name}
            </h3>
            {college.district && (
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                <FaMapMarkerAlt className="w-3 h-3" />
                {college.district}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              {college.rating !== undefined && (
                <span className="text-xs text-yellow-500 whitespace-nowrap flex items-center gap-0.5">
                  <FaStar className="w-3 h-3" />
                  {stars > 0 ? "★".repeat(stars) : ""}
                  {stars < 5 ? "☆".repeat(5 - stars) : ""} {college.rating}
                </span>
              )}
              {college.type && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${typeBadge}`}
                >
                  {college.type}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <a
            href={
              college.latitude && college.longitude
                ? `https://www.google.com/maps/dir/?api=1&destination=${college.latitude},${college.longitude}`
                : `/find-college/${college.id}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <span className="text-white">Visit</span>
            <FaExternalLinkAlt className="w-3 h-3 text-white" />
          </a>
          <a
            href={`/find-college/${college.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <span className="text-white">View Details</span>
            <FaExternalLinkAlt className="w-3 h-3 text-white" />
          </a>
        </div>
      </div>
    </Popup>
  );
}
