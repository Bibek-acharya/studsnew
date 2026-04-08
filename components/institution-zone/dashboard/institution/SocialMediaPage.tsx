"use client";

import React from "react";
import { 
  Share2, Globe, ExternalLink, RefreshCw,
  Plus, ArrowUpRight, BarChart2, MessageSquare
} from "lucide-react";

// Social icons from icons8 or similar can be used, but for now we use generic placeholders 
// as lucide-react doesn't have brand icons in modern versions.
const Facebook = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const Twitter = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const Instagram = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const Linkedin = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const SocialMediaPage: React.FC = () => {
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Social Connections</h1>
          <p className="text-slate-500 text-sm mt-1">Manage institutional links and social presence across platforms.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm">
           <RefreshCw className="w-4 h-4" /> Sync feeds
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-bold">
        {[
          { platform: "Facebook", id: "@ncit.official", icon: Facebook, color: "blue", stats: "12K Followers", status: "Connected" },
          { platform: "Instagram", id: "@ncit_nepal", icon: Instagram, color: "rose", stats: "8.5K Followers", status: "Connected" },
          { platform: "LinkedIn", id: "/company/ncit", icon: Linkedin, color: "blue", stats: "4.2K Professionals", status: "Not Linked" },
          { platform: "Twitter", id: "@ncit_official", icon: Twitter, color: "sky", stats: "2.1K Followers", status: "Connected" },
          { platform: "Website", id: "ncit.edu.np", icon: Globe, color: "slate", stats: "Official Portal", status: "Always Active" },
        ].map((social, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-blue-500 transition-all cursor-pointer overflow-hidden">
             {/* Hover Decor */}
             <div className="absolute -top-6 -right-6 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors"></div>
             
             <div className="flex items-center gap-4 relative">
                <div className={`p-3 rounded-2xl bg-${social.color}-50 text-${social.color}-600`}>
                   <social.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                   <h3 className="text-slate-900 uppercase font-black italic">{social.platform}</h3>
                   <p className="text-xs text-slate-400">{social.id}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
             </div>
             
             <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                <span className="text-[10px] text-slate-400 tracking-widest uppercase">{social.stats}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full ${
                  social.status === "Connected" ? "bg-emerald-50 text-emerald-600" : 
                  social.status === "Not Linked" ? "bg-slate-100 text-slate-400 italic font-medium" : "bg-blue-50 text-blue-600"
                }`}>
                   {social.status}
                </span>
             </div>
          </div>
        ))}

        <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-5 rounded-2xl flex flex-col items-center justify-center text-center group hover:bg-white hover:border-blue-300 transition-all cursor-pointer">
           <div className="p-3 bg-white rounded-full shadow-sm text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all mb-3"><Plus className="w-6 h-6" /></div>
           <p className="text-sm text-slate-600">Connect New Platform</p>
           <p className="text-[10px] text-slate-400 italic">TikTok, YouTube, or Custom RSS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
               <MessageSquare className="w-4 h-4 text-emerald-500" /> Shareable Assets
            </h3>
            <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-4 group cursor-pointer hover:bg-slate-100 transition-all">
                <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-400 italic">JPG</div>
                <div className="flex-1 font-bold">
                    <p className="text-xs text-slate-900 uppercase">Institutional Logo.png</p>
                    <p className="text-[10px] text-slate-400">High Res (4k) - Transparent</p>
                </div>
                <button className="text-[10px] text-blue-600 underline">DOWNLOAD</button>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-4 group cursor-pointer hover:bg-slate-100 transition-all">
                <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-400 italic">PDF</div>
                <div className="flex-1 font-bold">
                    <p className="text-xs text-slate-900 uppercase">Brand Guidelines.pdf</p>
                    <p className="text-[10px] text-slate-400">v2.1 Last Updated Oct 2024</p>
                </div>
                <button className="text-[10px] text-blue-600 underline">DOWNLOAD</button>
            </div>
         </div>

         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 font-bold italic">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
               <BarChart2 className="w-4 h-4 text-indigo-500" /> Cross-Platform Reach
            </h3>
            <div className="space-y-4 pt-2">
               <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 italic">Total Engagements</span>
                  <span className="text-slate-900 px-2 bg-emerald-50 text-emerald-600 rounded">84.2K</span>
               </div>
               <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                  <div className="h-full bg-blue-600" style={{ width: "45%" }}></div>
                  <div className="h-full bg-rose-500" style={{ width: "25%" }}></div>
                  <div className="h-full bg-sky-400" style={{ width: "20%" }}></div>
                  <div className="h-full bg-slate-300" style={{ width: "10%" }}></div>
               </div>
               <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                     <div className="w-2 h-2 rounded bg-blue-600"></div> FB (45%)
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                     <div className="w-2 h-2 rounded bg-rose-500"></div> IG (25%)
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                     <div className="w-2 h-2 rounded bg-sky-400"></div> TW (20%)
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SocialMediaPage;
