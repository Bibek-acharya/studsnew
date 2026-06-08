"use client";

import React from "react";
import EmptyTabState from "./EmptyTabState";

interface TabFacilitiesProps {
  facilities: any[];
}

const TabFacilities: React.FC<TabFacilitiesProps> = ({ facilities }) => {
  if (facilities.length === 0) return <EmptyTabState tabName="facilities" />;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Campus Facilities</h2>
        <p className="mt-1 text-[14px] text-gray-500">State-of-the-art infrastructure for holistic learning.</p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {facilities.map((facility: any, i: number) => (
          <div key={facility.title || facility.heading || i} className="flex items-start gap-4 rounded-md border border-gray-200 bg-white p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-blue/5 text-brand-blue">
              <i className={`fa-solid ${facility.icon || "fa-question"} text-[18px]`}></i>
            </div>
            <div>
              <h4 className="text-[16px] font-bold text-gray-900">{facility.title || facility.heading}</h4>
              <p className="text-[13px] text-gray-600">{facility.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabFacilities;
