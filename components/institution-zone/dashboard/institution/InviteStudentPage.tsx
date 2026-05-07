"use client";
import React from "react";
import SectionHeader from "../shared/SectionHeader";
import { EnvelopeOpen } from "@phosphor-icons/react";

const InviteStudentPage: React.FC = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Invite Student"
        breadcrumbItems={[{ label: "Dashboard", href: "/institution-zone/dashboard/overview" }, { label: "Invite Student" }]}
      />
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
          <EnvelopeOpen className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">Invite Student</h2>
        <p className="text-sm text-gray-500 max-w-md">
          Invite students to apply to your institution, track invitation status, and manage referral links.
        </p>
        <p className="text-xs text-gray-400 mt-4">Coming soon</p>
      </div>
    </div>
  );
};

export default InviteStudentPage;
