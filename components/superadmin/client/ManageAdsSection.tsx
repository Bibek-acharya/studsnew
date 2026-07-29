"use client";

import React, { useState } from "react";
import AdvertiseRequestSection from "./AdvertiseRequestSection";
import PopupManagementTab from "./PopupManagementTab";
import HeroBannerTab from "./HeroBannerTab";
import ShowcaseBannerTab from "./ShowcaseBannerTab";
import UniversityAffiliationSection from "./UniversityAffiliationSection";

const TABS = [
  { id: "advertise", label: "Advertise Request" },
  { id: "popup", label: "Landing Page Popup" },
  { id: "hero", label: "Hero Banner" },
  { id: "showcase", label: "Showcase Banner" },
  { id: "affiliation", label: "University Affiliation" },
];

export default function ManageAdsSection() {
  const [activeTab, setActiveTab] = useState("advertise");

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-full">
      <div className="flex items-center gap-1 mb-6 bg-white rounded-lg border border-gray-200 p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "advertise" && <AdvertiseRequestSection />}
      {activeTab === "popup" && <PopupManagementTab />}
      {activeTab === "hero" && <HeroBannerTab />}
      {activeTab === "showcase" && <ShowcaseBannerTab />}
      {activeTab === "affiliation" && <UniversityAffiliationSection />}
    </div>
  );
}
