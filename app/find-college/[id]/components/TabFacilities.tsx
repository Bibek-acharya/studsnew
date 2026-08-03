"use client";

import React from "react";
import EmptyTabState from "./EmptyTabState";

interface TabFacilitiesProps {
  facilities: any[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  "fa-solid fa-book": <i className="fa-solid fa-book text-white"></i>,
  "fa-solid fa-flask": <i className="fa-solid fa-flask text-white"></i>,
  "fa-solid fa-laptop": <i className="fa-solid fa-laptop text-white"></i>,
  "fa-solid fa-building": <i className="fa-solid fa-building text-white"></i>,
  "fa-solid fa-users": <i className="fa-solid fa-users text-white"></i>,
  "fa-solid fa-wifi": <i className="fa-solid fa-wifi text-white"></i>,
  "fa-solid fa-dumbbell": <i className="fa-solid fa-dumbbell text-white"></i>,
  "fa-solid fa-utensils": <i className="fa-solid fa-utensils text-white"></i>,
  "fa-solid fa-bus": <i className="fa-solid fa-bus text-white"></i>,
  "fa-solid fa-bed": <i className="fa-solid fa-bed text-white"></i>,
  "fa-solid fa-medkit": <i className="fa-solid fa-medkit text-white"></i>,
  "fa-solid fa-microscope": <i className="fa-solid fa-microscope text-white"></i>,
  "fa-solid fa-graduation-cap": <i className="fa-solid fa-graduation-cap text-white"></i>,
  "fa-solid fa-futbol": <i className="fa-solid fa-futbol text-white"></i>,
  "fa-solid fa-theater-masks": <i className="fa-solid fa-theater-masks text-white"></i>,
  "fa-solid fa-music": <i className="fa-solid fa-music text-white"></i>,
  "fa-solid fa-palette": <i className="fa-solid fa-palette text-white"></i>,
  "fa-solid fa-camera": <i className="fa-solid fa-camera text-white"></i>,
  "fa-solid fa-book-reader": <i className="fa-solid fa-book-reader text-white"></i>,
  "fa-solid fa-chalkboard-teacher": <i className="fa-solid fa-chalkboard-teacher text-white"></i>,
};

const TabFacilities: React.FC<TabFacilitiesProps> = ({ facilities }) => {
  if (facilities.length === 0) return <EmptyTabState tabName="facilities" />;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Our Facilities
        </h2>
        <p className="text-gray-600">
          World-class infrastructure for holistic learning
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility: any, i: number) => (
          <div
            key={facility.title || facility.heading || i}
            className="border border-gray-200 rounded-md p-6"
          >
            <div className="w-12 h-12 rounded-md bg-[#0000ff] flex items-center justify-center text-white mb-4">
              <i
                className={`fa-solid ${facility.icon?.replace("fa-solid ", "").replace("fa-", "") || "question"} text-[22px]`}
              ></i>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">
              {facility.title || facility.heading}
            </h3>
            <p className="text-sm text-gray-600">
              {facility.desc || facility.description || ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabFacilities;
