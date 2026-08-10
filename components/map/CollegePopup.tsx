"use client";

import { useState, useEffect } from "react";
import { Popup } from "react-leaflet";
import Image from "next/image";
import {
  FaMapMarkerAlt,
  FaStar,
  FaBuilding,
  FaInfoCircle,
  FaDirections,
  FaShareAlt,
} from "react-icons/fa";
import ShareCollegeModal from "@/app/find-college/[id]/ShareCollegeModal";

interface CollegePopupProps {
  college: {
    id: number;
    name: string;
    logo?: string;
    district?: string;
    type?: string;
    rating?: number;
    reviews?: number;
    latitude?: number;
    longitude?: number;
  };
}

export default function CollegePopup({ college }: CollegePopupProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [origin, setOrigin] = useState("");
  const stars = Math.round(college.rating || 0);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const typeColor: Record<string, string> = {
    public: "bg-blue-100 text-blue-700",
    private: "bg-green-100 text-green-700",
    community: "bg-purple-100 text-purple-700",
  };
  const typeBadge =
    typeColor[college.type?.toLowerCase() || ""] || "bg-gray-100 text-gray-600";

  const shareUrl = origin
    ? `${origin}/find-college/${college.id}`
    : `https://studsphere.com/find-college/${college.id}`;

  return (
    <>
      <Popup className="college-popup">
        <div className="p-3 rounded-md border border-gray-200 bg-white max-w-[280px]">
          {/* Header: Logo + Name */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
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
            <h3 className="font-semibold text-sm text-gray-900 truncate leading-tight">
              {college.name}
            </h3>
          </div>

          {/* Info row: Rating + Type + Location */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {college.rating !== undefined && (
              <span className="text-xs text-yellow-500 whitespace-nowrap flex items-center gap-0.5">
                <FaStar className="w-3 h-3" />
                {stars > 0 ? "★".repeat(stars) : ""}
                {stars < 5 ? "☆".repeat(5 - stars) : ""} {college.rating}
                {college.reviews !== undefined && (
                  <span className="text-gray-400 ml-0.5">({college.reviews})</span>
                )}
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

          {college.district && (
            <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
              <FaMapMarkerAlt className="w-3 h-3 text-red-400" />
              {college.district}
            </p>
          )}

          {/* Action grid: 4 circular buttons */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            <a
              href="/find-college"
              className="flex flex-col items-center gap-1 group"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <FaBuilding className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium text-gray-600">View</span>
            </a>

            <a
              href={`/find-college/${college.id}`}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <FaInfoCircle className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium text-gray-600">Detail</span>
            </a>

            <a
              href={
                college.latitude && college.longitude
                  ? `https://www.google.com/maps/dir/?api=1&destination=${college.latitude},${college.longitude}`
                  : `/find-college/${college.id}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 group"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <FaDirections className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium text-gray-600">Visit</span>
            </a>

            <button
              onClick={() => setShareOpen(true)}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <FaShareAlt className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium text-gray-600">Share</span>
            </button>
          </div>
        </div>
      </Popup>

      <ShareCollegeModal
        collegeName={college.name}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        shareUrl={shareUrl}
        shareTitle={college.name}
        shareText={`Check out ${college.name} on Studsphere`}
      />
    </>
  );
}