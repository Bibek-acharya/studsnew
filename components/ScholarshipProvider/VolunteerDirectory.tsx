"use client";

import React, { useEffect, useState, useCallback } from "react";
import { scholarshipProviderApi } from "@/services/scholarshipProviderApi";
import { Building2, MapPin, Clock, Users, ToggleLeft, ToggleRight, Loader2, Search, Pencil, CalendarDays, ListChecks, Settings } from "lucide-react";
import { toast } from "sonner";

interface VolunteerRequest {
  id: number;
  title: string;
  banner_image: string;
  description: string;
  volunteer_type: string;
  volunteer_payment: string;
  date_mode: string;
  application_deadline: string;
  specific_dates: string[];
  districts: string[];
  active: boolean;
  applicant_count: number;
  organizer: string;
  location: string;
}

const formatDate = (d: string) => {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

interface VolunteerDirectoryProps {
  onEdit?: (id: number) => void;
}

const VolunteerDirectory = ({ onEdit }: VolunteerDirectoryProps) => {
  const [volunteers, setVolunteers] = useState<VolunteerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  useEffect(() => {
    setLoading(true);
    scholarshipProviderApi.getVolunteers()
      .then((res: any) => {
        const data = res?.data?.volunteers || [];
        setVolunteers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleVolunteer = useCallback((id: number) => {
    scholarshipProviderApi.toggleVolunteer(id).then(() => {
      setVolunteers(prev =>
        prev.map(v =>
          v.id === id ? { ...v, active: !v.active } : v
        )
      );
    }).catch(() => toast.error("Failed to toggle volunteer"));
  }, []);

  const filtered = volunteers.filter(v => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = v.title.toLowerCase().includes(q) || v.location.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" && v.active) || (statusFilter === "inactive" && !v.active);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full min-h-screen bg-slate-50/30 px-4 sm:px-8 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pt-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Volunteer Directory</h2>
        <div className="flex items-center text-sm text-slate-500 mt-2 sm:mt-0 gap-2">
          <Settings size={14} />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-slate-800 font-medium">Volunteer Directory</span>
        </div>
      </div>
      <div className="flex items-center justify-end pb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search volunteers..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64"
            />
          </div>
          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg">
            {(["all", "active", "inactive"] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                  statusFilter === s ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-medium">Loading volunteer directory...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Users className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {searchTerm || statusFilter !== "all" ? "No Matching Results" : "No Volunteers"}
          </h3>
          <p className="text-sm text-slate-500 max-w-[300px] mx-auto">
            {searchTerm || statusFilter !== "all" ? "Try adjusting your search or filter." : "Create a volunteer opportunity to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(v => (
            <div key={v.id} className="rounded-[16px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden">
              <div className="relative">
                {v.banner_image ? (
                  <img src={v.banner_image} alt={v.title} className="h-36 w-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <div className="h-36 w-full bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
                    <Users size={40} className="text-slate-300" />
                  </div>
                )}
                {v.active && <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow">Recruiting</div>}
              </div>
              <div className="p-4">
                <div className="mb-3 flex items-center gap-2">
                  {v.volunteer_type === "paid" ? (
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white ${v.active ? "bg-green-600" : "bg-slate-400"}`}>Paid</span>
                  ) : (
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white ${v.active ? "bg-[#0000ff]" : "bg-slate-400"}`}>Free</span>
                  )}
                  {v.volunteer_payment && v.volunteer_type === "paid" && <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-1 rounded-full">NPR {v.volunteer_payment}</span>}
                  {v.applicant_count > 0 && <span className="bg-amber-50 text-amber-700 text-[11px] font-bold px-2 py-1 rounded-full">{v.applicant_count} applicant{v.applicant_count !== 1 ? "s" : ""}</span>}
                </div>
                <h3 className="text-[16px] font-bold text-slate-900 mb-3 leading-tight line-clamp-2">{v.title}</h3>
                <div className="space-y-2 mb-3 text-[13px] text-slate-600">
                  <div className="flex items-center"><Building2 size={15} className="mr-2 shrink-0 text-slate-400" /><span className="truncate">{v.organizer}</span></div>
                  <div className="flex items-center"><MapPin size={15} className="mr-2 shrink-0 text-slate-400" /><span className="truncate">{v.location || "N/A"}</span></div>
                  <div className="flex items-center"><Clock size={15} className="mr-2 shrink-0 text-slate-400" /><span>Apply by: <strong className="text-orange-600">{formatDate(v.application_deadline) || "Not set"}</strong></span></div>
                </div>
                {v.districts && v.districts.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Participating Districts</p>
                    <div className="flex flex-wrap gap-1">
                      {v.districts.slice(0, 3).map(d => <span key={d} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-medium">{d}</span>)}
                      {v.districts.length > 3 && <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[11px] font-medium">+{v.districts.length - 3}</span>}
                    </div>
                  </div>
                )}
                {v.description && <div className="text-[13px] text-slate-500 mb-3 line-clamp-2 leading-relaxed [&_*]:!text-[13px] [&_*]:!text-slate-500" dangerouslySetInnerHTML={{ __html: v.description }} />}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => toggleVolunteer(v.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${v.active ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
                  >
                    {v.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    {v.active ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => onEdit?.(v.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VolunteerDirectory;
