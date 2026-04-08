"use client";

import React, { useState } from "react";
import { 
  Building2, MapPin, Globe, Phone, Mail, 
  Settings, Save, Upload, Edit3, Trash2,
  Info, Camera, Plus, Award, User
} from "lucide-react";

const CollegeProfilePage: React.FC = () => {
  const [collegeName, setCollegeName] = useState("Nepal College of Information Technology (NCIT)");
  const [about, setAbout] = useState("Nepal College of Information Technology – NCIT, established in 2001, has been providing high-quality engineering and management education in Nepal. NCIT is a pioneer college in Nepal for providing International quality education in various engineering and management streams.");

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Institutional Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your college's public profile, branding, and visibility.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm w-max">
           <Save className="w-4 h-4" /> Save Profile
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Visuals & Basic Info */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 relative overflow-hidden">
             <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center relative group overflow-hidden border border-slate-200">
                <div className="text-slate-400 group-hover:text-blue-500 transition-all flex flex-col items-center">
                   <Upload className="w-8 h-8 mb-2" />
                   <span className="text-xs font-bold uppercase">Change Banner</span>
                </div>
                <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Camera className="w-8 h-8 text-white" />
                </button>
             </div>
             <div className="flex mt-6 gap-4 items-end">
                <div className="w-20 h-20 bg-white border-4 border-white shadow-lg rounded-2xl -mt-10 relative group overflow-hidden">
                   <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-2xl">NC</div>
                   <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Edit3 className="w-4 h-4 text-white" />
                   </button>
                </div>
                <div className="flex-1 pb-1">
                   <h3 className="font-bold text-slate-900 truncate">NCIT Official</h3>
                   <p className="text-xs text-slate-400 font-bold uppercase underline italic">Level A accreditation</p>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
             <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-2"><Info className="w-4 h-4 text-blue-600" /> General Info</h3>
             <div className="space-y-3">
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">College Name</label>
                   <input 
                      type="text" 
                      value={collegeName} 
                      onChange={(e) => setCollegeName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20"
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Location</label>
                   <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                      <input type="text" defaultValue="Balkumari, Lalitpur" className="bg-transparent text-sm w-full outline-none font-semibold" />
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Website</label>
                   <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                      <input type="text" defaultValue="www.ncit.edu.np" className="bg-transparent text-sm w-full outline-none font-semibold italic underline" />
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column - Deep Content */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 font-bold">
             <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                Institutional Story (About)
                <button className="text-xs text-blue-600 hover:underline">Draft Version</button>
             </h3>
             <textarea 
                rows={6}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
                   <span>Key Accolades</span>
                   <button className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Plus className="w-3.5 h-3.5" /></button>
                </h3>
                <div className="space-y-3 font-bold">
                   {[
                     { text: "Excellence in Engineering 2025", date: "Jan 2025" },
                     { text: "Top Management College in Nepal", date: "Dec 2024" },
                   ].map((item, i) => (
                      <div key={i} className="flex gap-3 items-start group">
                         <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                            <Award className="w-4 h-4 text-amber-600" />
                         </div>
                         <div className="flex-1">
                            <p className="text-sm text-slate-800">{item.text}</p>
                            <p className="text-[10px] text-slate-400 italic">{item.date}</p>
                         </div>
                         <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-300 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                   ))}
                </div>
             </div>

             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3 font-bold uppercase italic underline">
                   <span>Contact Directory</span>
                   <button className="p-1 px-3 text-xs bg-slate-100 text-slate-500 rounded-lg">Update</button>
                </h3>
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><Phone className="w-4 h-4 text-slate-500" /></div>
                      <div>
                         <p className="text-xs text-slate-400 font-bold">Front Desk</p>
                         <p className="text-sm text-slate-800 font-bold">+977-1-5186354</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><Mail className="w-4 h-4 text-slate-500" /></div>
                      <div>
                         <p className="text-xs text-slate-400 font-bold">E-mail</p>
                         <p className="text-sm text-slate-800 font-bold">info@ncit.edu.np</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeProfilePage;
