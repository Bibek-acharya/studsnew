"use client";

import React from "react";
import RichTextEditor from "../common/RichTextEditor";

interface AboutSectionProps {
  aboutOverview: string;
  setAboutOverview: (v: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  aboutOverview,
  setAboutOverview,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
      <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">About Tab - Introduction Text</h2>
          <p className="text-sm text-gray-500 mt-0.5">Main description shown in the About tab</p>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            First Paragraph - Program Overview <span className="text-red-500">*</span>
          </label>
          <RichTextEditor
            value={aboutOverview}
            onChange={setAboutOverview}
            placeholder="Describe what the scholarship program is about"
            minHeight={120}
          />
          <p className="text-xs text-gray-500">Describe what the scholarship program is about</p>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;