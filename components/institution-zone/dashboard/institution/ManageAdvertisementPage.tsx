"use client";
import React from "react";
import SectionHeader from "../shared/SectionHeader";
import { Megaphone } from "@phosphor-icons/react";

const ManageAdvertisementPage: React.FC = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Manage Advertisement"
        breadcrumbItems={[{ label: "Dashboard", href: "/institution-zone/dashboard/overview" }, { label: "Manage Advertisement" }]}
      />
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
          <Megaphone className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">Manage Advertisement</h2>
        <p className="text-sm text-gray-500 max-w-md">
          Create and manage promotional advertisements, sponsored listings, and marketing campaigns for your institution.
        </p>
        <p className="text-xs text-gray-400 mt-4">Coming soon</p>
      </div>
    </div>
  );
};

export default ManageAdvertisementPage;
