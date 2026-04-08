"use client";

import React, { useState } from "react";
import { 
  Settings, User, Shield, Bell, 
  Trash2, Save, Globe, Smartphone,
  Mail, MessageSquare, AppWindow, LogOut,
  ChevronRight, Lock, Eye, EyeOff
} from "lucide-react";

const SettingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Configure your login, security, and institutional preferences.</p>
        </div>
        <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/10">
           <Save className="w-4 h-4 shadow-sm" /> Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
         {/* Navigation */}
         <div className="w-full lg:w-72 space-y-2 shrink-0">
            {[
              { id: "general", label: "General Admin", icon: Settings },
              { id: "security", label: "Password & Security", icon: Shield },
              { id: "notifications", label: "Email / Alerts", icon: Bell },
              { id: "appearance", label: "Branding / Colors", icon: Globe },
              { id: "integration", label: "API Integrations", icon: AppWindow },
            ].map((nav) => (
              <button 
                 key={nav.id}
                 onClick={() => setActiveTab(nav.id)}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all transition-duration-300 ${
                    activeTab === nav.id ? "bg-blue-50 text-blue-600 shadow-sm" : "text-slate-500 hover:bg-slate-50"
                 }`}
              >
                 <nav.icon className="w-4 h-4" />
                 {nav.label}
              </button>
            ))}
            
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all mt-6">
                <LogOut className="w-4 h-4" />
                Sign Out Sessions
            </button>
         </div>

         {/* Content Area */}
         <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 lg:p-8 font-bold italic">
            {activeTab === "general" && (
               <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                     <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest leading-none">Institutional Admin Profile</h3>
                     <p className="text-[10px] text-slate-400 mt-1 uppercase leading-none">Primary Management Credentials</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest pl-1 text-slate-400">Admin Display Name</label>
                        <input type="text" defaultValue="NCIT Admin Panel" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest pl-1 text-slate-400">Recovery Email</label>
                        <input type="email" defaultValue="admin@ncit.edu.np" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                     </div>
                  </div>
                  
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100/50 flex items-start gap-4">
                     <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Smartphone className="w-4 h-4" /></div>
                     <div>
                        <p className="text-xs text-amber-900 leading-none">Primary Phone: +977-98510XXXXX</p>
                        <p className="text-[10px] text-amber-600 mt-1 font-bold italic leading-none">Verified Identity for 2FA</p>
                     </div>
                     <button className="ml-auto text-[10px] text-amber-600 underline">Change</button>
                  </div>
               </div>
            )}

            {activeTab === "security" && (
               <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                     <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest leading-none">Security Control</h3>
                     <p className="text-[10px] text-slate-400 mt-1 uppercase leading-none">Master Access Credentials</p>
                  </div>

                  <div className="space-y-4 max-w-md">
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest pl-1 text-slate-400 font-bold">Current Master Password</label>
                        <div className="relative">
                            <input type={showPass ? "text" : "password"} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none pr-10" />
                            <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                     </div>
                     <div className="space-y-2 pt-2">
                        <label className="text-[10px] uppercase tracking-widest pl-1 text-slate-400 font-bold">New Master Password</label>
                        <input type="password" placeholder="Min 12 characters" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                     </div>
                     <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all uppercase tracking-widest flex items-center gap-2">
                         <Lock className="w-3.5 h-3.5" /> Initialize Change
                     </button>
                  </div>
               </div>
            )}
            
            {activeTab !== "general" && activeTab !== "security" && (
               <div className="py-20 text-center space-y-3">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                     <Settings className="w-8 h-8 animate-spin-slow" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 uppercase italic">Under Construction</h3>
                  <p className="text-sm text-slate-400 font-bold">Advanced configuration modules for {activeTab} will be available in the next release.</p>
               </div>
            )}

            <div className="mt-20 pt-10 border-t border-slate-100">
                <div className="flex items-center gap-4 group cursor-pointer hover:bg-rose-50 p-4 rounded-2xl transition-all border border-transparent hover:border-rose-100">
                    <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center shrink-0"><Trash2 className="w-5 h-5" /></div>
                    <div className="flex-1">
                        <p className="text-xs text-rose-600 uppercase tracking-widest font-black leading-none">Terminate Institutional Account</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase leading-none font-bold italic">This action will permanently delete all records and active programs.</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-rose-500" />
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SettingPage;
