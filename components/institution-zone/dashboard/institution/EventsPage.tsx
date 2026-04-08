"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  MoreVertical,
  Trash2,
  Edit3,
  Eye,
  Users,
  Image as ImageIcon,
  Share2,
} from "lucide-react";

const EVENTS = [
  {
    id: 1,
    title: "Annual IT Exhibition & Conference 2026",
    date: "2024-05-12",
    time: "10:00 AM",
    location: "Main Auditorium",
    attendees: 450,
    status: "Published",
  },
  {
    id: 2,
    title: "Tech Fest Workshop Series",
    date: "2024-05-20",
    time: "01:00 PM",
    location: "Computer Lab 4",
    attendees: 120,
    status: "Draft",
  },
  {
    id: 3,
    title: "Industrial Visit: Data Center",
    date: "2024-06-05",
    time: "09:00 AM",
    location: "Off-Campus",
    attendees: 30,
    status: "Published",
  },
];

const EventsPage: React.FC = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Events & Activities
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Showcase your campus life and institutional events
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg active:scale-95">
          <Plus size={18} />
          Launch New Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters and Stats */}
        <div className="lg:col-span-4 flex flex-col md:flex-row items-center justify-between gap-4 p-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex p-1 bg-slate-50 rounded-xl w-full md:w-auto">
            {["Published", "Drafts", "Archived"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                  tab === "Published"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex-1 relative w-full px-2 hidden md:block">
            <Search
              size={16}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full bg-slate-50 border-none rounded-xl py-2 pl-12 pr-4 text-sm focus:ring-1 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <button className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 mx-1">
            <Filter size={20} />
          </button>
        </div>

        {/* Dynamic Cards Grid */}
        {EVENTS.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col h-full group"
          >
            <div className="relative h-44 bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
              <ImageIcon size={40} className="text-slate-300" />
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <div
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight shadow-xl ${
                    event.status === "Published"
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-500 text-white"
                  }`}
                >
                  {event.status}
                </div>
              </div>
              <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors" />
            </div>

            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase leading-tight tracking-tight">
                  {event.title}
                </h3>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar size={14} className="text-blue-500" />
                  <span className="text-[12px] font-bold">{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock size={14} className="text-blue-500" />
                  <span className="text-[12px] font-bold">{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin size={14} className="text-blue-500" />
                  <span className="text-[12px] font-bold">
                    {event.location}
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                  <Users size={14} />
                  {event.attendees} Registered
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors">
                    <Share2 size={16} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors">
                    <Edit3 size={16} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-rose-600 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 min-h-[300px] flex flex-col items-center justify-center group hover:bg-white hover:border-blue-200 transition-all duration-300 h-full">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 shadow-sm transition-all duration-300">
            <Plus size={28} />
          </div>
          <p className="mt-4 text-slate-400 font-bold group-hover:text-blue-600 transition-colors">
            Create Activity
          </p>
        </button>
      </div>
    </div>
  );
};

export default EventsPage;
