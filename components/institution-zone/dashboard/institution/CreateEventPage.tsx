"use client";

import React, { useState } from "react";
import { CalendarBlank, FloppyDisk, Image } from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";

const CreateEventPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [category, setCategory] = useState("Academic");
  const [maxParticipants, setMaxParticipants] = useState("");

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Create Event"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard" },
          { label: "Events", href: "/institution-zone/dashboard/events/directory" },
          { label: "Create" },
        ]}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event title..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
          />
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter event description..."
            rows={5}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            >
              <option>Academic</option>
              <option>Cultural</option>
              <option>Sports</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Main Auditorium"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Organizer</label>
            <input
              type="text"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              placeholder="e.g. Department of Science"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Featured Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 cursor-pointer transition-colors">
              <Image className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Upload event banner</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG (Max 5MB)</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Participants</label>
            <input
              type="number"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              placeholder="e.g. 200"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
