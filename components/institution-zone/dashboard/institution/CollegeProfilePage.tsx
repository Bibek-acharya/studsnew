"use client";

import React, { useState, useRef } from "react";
import {
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  Camera,
  Upload,
  Layout,
  CheckCircle2,
  Save,
  Plus,
  X,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";

const CollegeProfilePage: React.FC = () => {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setter(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            College Profile
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Update your institution's public information and branding
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
            <Save size={18} />
            Save All Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Branding & Media */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Cover Photo */}
            <div className="relative h-48 bg-slate-100 group">
              {coverPhoto ? (
                <img
                  src={coverPhoto}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                  <Layout size={40} />
                  <span className="text-xs font-black uppercase mt-2">
                    Cover Banner
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm font-bold text-slate-900 shadow-xl"
                >
                  <Camera size={16} />
                  Change Cover
                </button>
                <input
                  ref={coverInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setCoverPhoto)}
                />
              </div>
            </div>

            {/* Profile Photo */}
            <div className="px-8 pb-8 flex flex-col items-start -mt-12 relative z-10">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-white p-2 shadow-xl border border-slate-100 overflow-hidden">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                      <Building2 size={32} />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => profileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-2 bg-blue-600 rounded-lg text-white shadow-lg border-2 border-white hover:bg-blue-700 transition-all"
                >
                  <Camera size={16} />
                </button>
                <input
                  ref={profileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setProfilePhoto)}
                />
              </div>

              <div className="mt-6 w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">
                      Institutional Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Sagarmatha College of Engineering"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-bold text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">
                      Institutional Email
                    </label>
                    <input
                      type="email"
                      defaultValue="info@sagarmatha.edu.np"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-bold text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">
                    About the Institution
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-medium text-slate-700 leading-relaxed"
                    defaultValue="Sagarmatha College of Engineering is a premier technical institution committed to academic excellence..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h3 className="text-[14px] font-black uppercase text-slate-900 tracking-wider mb-6 flex items-center gap-2">
              <MapPin size={18} className="text-blue-600" />
              Location & Contact Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Full Address
                  </label>
                  <input
                    type="text"
                    defaultValue="Sanepa, Lalitpur, Nepal"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    defaultValue="01-5555555, 9801234567"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-bold text-slate-700"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Official Website URI
                  </label>
                  <input
                    type="url"
                    defaultValue="https://www.sagarmatha.edu.np"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Province / State
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-bold text-slate-700">
                    <option>Bagmati Province</option>
                    <option>Koshi Province</option>
                    <option>Madhesh Province</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h3 className="text-[14px] font-black uppercase text-slate-900 tracking-wider mb-6">
              Social Connections
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Facebook size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Facebook URL"
                  className="flex-1 bg-slate-50 min-w-0 border-none rounded-xl px-3 py-2.5 text-xs font-bold"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
                  <Instagram size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Instagram URL"
                  className="flex-1 bg-slate-50 min-w-0 border-none rounded-xl px-3 py-2.5 text-xs font-bold"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-400">
                  <Twitter size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Twitter URL"
                  className="flex-1 bg-slate-50 min-w-0 border-none rounded-xl px-3 py-2.5 text-xs font-bold"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0077b5]/10 flex items-center justify-center text-[#0077b5]">
                  <Linkedin size={20} />
                </div>
                <input
                  type="text"
                  placeholder="LinkedIn URL"
                  className="flex-1 bg-slate-50 min-w-0 border-none rounded-xl px-3 py-2.5 text-xs font-bold"
                />
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-3xl border border-emerald-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-base font-black text-emerald-900 uppercase tracking-tighter italic">
                Verified Member
              </h3>
            </div>
            <p className="text-emerald-700/80 text-[13px] font-medium leading-relaxed">
              Your institution is currently a{" "}
              <span className="font-bold">Premium Member</span> of StudSphere.
              Your profile enjoys priority visibility in searches.
            </p>
            <button className="w-full mt-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-emerald-600/20 active:scale-95 transition-all">
              Renew Membership
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeProfilePage;
