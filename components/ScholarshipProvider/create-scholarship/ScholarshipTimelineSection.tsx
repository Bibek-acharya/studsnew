"use client";

import React from "react";
import { Plus, Trash } from "@phosphor-icons/react";

interface TimelineEvent {
  title: string;
  date: string;
  description: string;
  icon: string;
}

interface ScholarshipTimelineSectionProps {
  timelineEvents: TimelineEvent[];
  setTimelineEvents: React.Dispatch<React.SetStateAction<TimelineEvent[]>>;
}

const formInputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500";
const formTextareaClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 min-h-[80px]";

export const ScholarshipTimelineSection: React.FC<ScholarshipTimelineSectionProps> = ({
  timelineEvents,
  setTimelineEvents,
}) => {
  const addEvent = () => {
    setTimelineEvents([...timelineEvents, { title: "", date: "", description: "", icon: "" }]);
  };

  const removeEvent = (index: number) => {
    setTimelineEvents(timelineEvents.filter((_, i) => i !== index));
  };

  const updateEvent = (index: number, field: keyof TimelineEvent, value: string) => {
    setTimelineEvents(timelineEvents.map((e, i) => i === index ? { ...e, [field]: value } : e));
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
            <h2 className="text-lg font-semibold text-gray-800">Key Dates & Timeline</h2>
            <p className="text-sm text-gray-500 mt-0.5">Important dates for this scholarship</p>
          </div>
        </div>
        <button
          type="button"
          className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
          onClick={addEvent}
        >
          <Plus size={16} /> Add Event
        </button>
      </div>
      <div className="p-6 space-y-4">
        {timelineEvents.map((event, index) => (
          <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-200 relative group">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={formInputClass}
                  value={event.title}
                  onChange={(e) => updateEvent(index, "title", e.target.value)}
                  placeholder="e.g. Application Deadline"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={formInputClass}
                  value={event.date}
                  onChange={(e) => updateEvent(index, "date", e.target.value)}
                  placeholder="e.g. Ashad 30, 2082 (Monday)"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Icon
                </label>
                <input
                  type="text"
                  className={formInputClass}
                  value={event.icon}
                  onChange={(e) => updateEvent(index, "icon", e.target.value)}
                  placeholder="e.g. Calendar"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  className={formInputClass}
                  value={event.description}
                  onChange={(e) => updateEvent(index, "description", e.target.value)}
                  placeholder="Additional details"
                />
              </div>
            </div>
            <button
              type="button"
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-6 transition-colors"
              onClick={() => removeEvent(index)}
              title="Remove Event"
            >
              <Trash size={18} />
            </button>
          </div>
        ))}
        {timelineEvents.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No timeline events added yet.</p>
        )}
      </div>
    </div>
  );
};

export default ScholarshipTimelineSection;