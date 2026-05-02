"use client";

import React from "react";
import { Plus, Trash } from "@phosphor-icons/react";

interface JourneyTimelineItem {
  year: string;
  title: string;
  description: string;
}

interface JourneyTimelineSectionProps {
  timeline: JourneyTimelineItem[];
  setTimeline: React.Dispatch<React.SetStateAction<JourneyTimelineItem[]>>;
}

const getYearOptions = (selectedYear: string) => {
  const currentYear = new Date().getFullYear();
  let options = '<option value="">Select Year</option>';
  for (let y = currentYear + 5; y >= 1990; y--) {
    options += `<option value="${y}" ${selectedYear == String(y) ? 'selected' : ''}>${y}</option>`;
  }
  return options;
};

const formInputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500";
const formSelectClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer";
const formTextareaClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 min-h-[80px]";

export const JourneyTimelineSection: React.FC<JourneyTimelineSectionProps> = ({
  timeline,
  setTimeline,
}) => {
  const addTimelineItem = () => {
    setTimeline([...timeline, { year: "", title: "", description: "" }]);
  };

  const removeTimelineItem = (index: number) => {
    setTimeline(timeline.filter((_, i) => i !== index));
  };

  const updateTimelineItem = (index: number, field: keyof JourneyTimelineItem, value: string) => {
    setTimeline(timeline.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
      <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Program Journey Timeline</h2>
            <p className="text-sm text-gray-500 mt-0.5">History and milestones of the scholarship program</p>
          </div>
        </div>
        <button
          type="button"
          className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
          onClick={addTimelineItem}
        >
          <Plus size={16} /> Add Milestone
        </button>
      </div>
      <div className="p-6 space-y-4">
        {timeline.map((item, index) => (
          <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-200 relative group">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={formSelectClass}
                    value={item.year}
                    onChange={(e) => updateTimelineItem(index, "year", e.target.value)}
                    dangerouslySetInnerHTML={{ __html: getYearOptions(item.year) }}
                  />
                </div>
              </div>
              <div className="md:col-span-3 space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={formInputClass}
                    value={item.title}
                    onChange={(e) => updateTimelineItem(index, "title", e.target.value)}
                    placeholder="Milestone Title"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className={formTextareaClass}
                    rows={2}
                    value={item.description}
                    onChange={(e) => updateTimelineItem(index, "description", e.target.value)}
                    placeholder="Description"
                  />
                </div>
              </div>
            </div>
            <button
              type="button"
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-6 transition-colors"
              onClick={() => removeTimelineItem(index)}
              title="Remove Milestone"
            >
              <Trash size={18} />
            </button>
          </div>
        ))}
        {timeline.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No milestones added yet.</p>
        )}
      </div>
    </div>
  );
};

export default JourneyTimelineSection;