"use client";

import React, { useState, useMemo } from "react";
import { Plus, MagnifyingGlass, Pencil, Trash, Eye, MapPin, Clock, CalendarBlank } from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";

interface EventItem {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
}

const INITIAL_EVENTS: EventItem[] = [
  { id: 1, title: "Spring Festival 2026", date: "May 15, 2026", time: "10:00 AM - 6:00 PM", location: "Main Campus Ground", category: "Cultural", description: "Annual spring festival with music, dance, and food stalls." },
  { id: 2, title: "AI Workshop Series", date: "May 10, 2026", time: "2:00 PM - 5:00 PM", location: "CS Lab Block", category: "Academic", description: "Hands-on workshop on machine learning and AI fundamentals." },
  { id: 3, title: "Inter-College Cricket Tournament", date: "May 20, 2026", time: "9:00 AM - 4:00 PM", location: "Sports Complex", category: "Sports", description: "Annual cricket tournament featuring 12 colleges." },
  { id: 4, title: "Photography Exhibition", date: "June 01, 2026", time: "11:00 AM - 7:00 PM", location: "Art Gallery", category: "Cultural", description: "Student photography showcase on campus life and nature." },
  { id: 5, title: "Research Symposium", date: "May 25, 2026", time: "10:00 AM - 3:00 PM", location: "Conference Hall", category: "Academic", description: "Presentations of undergraduate and graduate research projects." },
  { id: 6, title: "Yoga & Wellness Camp", date: "May 08, 2026", time: "6:00 AM - 8:00 AM", location: "Yoga Hall", category: "Sports", description: "Week-long yoga and meditation camp for students and faculty." },
  { id: 7, title: "Alumni Networking Dinner", date: "June 05, 2026", time: "7:00 PM - 10:00 PM", location: "Grand Ballroom", category: "Cultural", description: "Networking dinner connecting current students with alumni." },
];

const categoryStyles: Record<string, string> = {
  Academic: "bg-blue-100 text-blue-700",
  Cultural: "bg-purple-100 text-purple-700",
  Sports: "bg-green-100 text-green-700",
};

const EventsDirectoryPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "all">("all");

  const filteredEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter((item) => {
        const matchSearch =
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase());
        const eventDate = new Date(item.date);
        if (activeTab === "upcoming") return matchSearch && eventDate >= now;
        if (activeTab === "past") return matchSearch && eventDate < now;
        return matchSearch;
      });
  }, [events, search, activeTab]);

  const handleDelete = (id: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Events Directory"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard" },
          { label: "Events" },
        ]}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap">
          <Plus size={18} />
          Create Event
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {(["upcoming", "past", "all"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryStyles[item.category]}`}>
                {item.category}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{item.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-4">{item.description}</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CalendarBlank size={16} />
                <span>{item.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock size={16} />
                <span>{item.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={16} />
                <span>{item.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Eye size={18} />
              </button>
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsDirectoryPage;
