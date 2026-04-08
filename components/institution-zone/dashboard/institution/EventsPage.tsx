"use client";

import React, { useState } from "react";
import { 
  Calendar, MapPin, Users, Plus, 
  Search, Filter, ExternalLink, 
  Trash2, Edit2, Clock, CheckCircle2,
  ChevronRight, MoreVertical
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  status: "Confirmed" | "Ongoing" | "Pending" | "Past";
}

const eventsList: Event[] = [
  {
    id: "E-401",
    title: "Annual Convocation 2026",
    date: "2026-04-10",
    time: "10:00 AM",
    location: "Main Auditorium",
    attendees: 1200,
    status: "Confirmed",
  },
  {
    id: "E-402",
    title: "Tech Expo 2026",
    date: "2026-03-25",
    time: "11:00 AM",
    location: "Basement Hall",
    attendees: 450,
    status: "Pending",
  },
  {
    id: "E-403",
    title: "Career Fair",
    date: "2026-03-05",
    time: "09:00 AM",
    location: "Main Ground",
    attendees: 800,
    status: "Past",
  },
];

const EventsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusStyle = (status: Event["status"]) => {
    switch (status) {
      case "Confirmed": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Ongoing": return "bg-emerald-100 text-emerald-700 border-emerald-200 animate-pulse";
      case "Pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Past": return "bg-slate-100 text-slate-700 border-slate-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Event Management</h1>
          <p className="text-slate-500 text-sm mt-1">Plan and coordinate institutional events and ceremonies.</p>
        </div>
        <button className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition-all flex items-center gap-2 shadow-sm w-max">
          <Calendar className="w-4 h-4" /> Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {eventsList.map((ev) => (
          <div key={ev.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all flex flex-col">
            <div className="flex items-center justify-between mb-4">
               <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(ev.status)}`}>
                  {ev.status}
               </span>
               <button className="text-slate-400 hover:text-slate-600 p-1"><MoreVertical className="w-4 h-4" /></button>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-2 truncate">{ev.title}</h3>
            
            <div className="space-y-3 mt-auto">
               <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold text-slate-700">{ev.date}</span>
               </div>
               <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold text-slate-700">{ev.time}</span>
               </div>
               <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span className="font-semibold text-slate-700 truncate">{ev.location}</span>
               </div>
               <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span className="font-semibold text-slate-700">{ev.attendees} registered</span>
               </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
               <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
                  Manage Attendees <ChevronRight className="w-3.5 h-3.5" />
               </button>
               <div className="flex gap-2">
                  <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-amber-600"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
               </div>
            </div>
          </div>
        ))}
        {/* Placeholder for new event */}
        <div className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-all group">
           <div className="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center mb-3 group-hover:border-blue-500 group-hover:text-blue-600">
              <Plus className="w-6 h-6" />
           </div>
           <span className="text-sm font-bold text-slate-400 group-hover:text-blue-600">Plan New Event</span>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
