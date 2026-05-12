"use client";

import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, Settings, Users, Download, Undo2 } from "lucide-react";
import Dropdown from "@/components/college-recommender/Dropdown";
import { NEPAL_DISTRICTS, NEPAL_PROVINCES } from "@/lib/location-data";
import { toast } from "sonner";
import { scholarshipProviderApi } from "@/services/scholarshipProviderApi";
import { getImageUrl } from "@/services/api";
import ConfirmationModal from "./common/ConfirmationModal";



const ALL_DAYS = Array.from({ length: 10 }, (_, i) => String(i + 7));
const allDistricts = Array.from(new Set(Object.values(NEPAL_DISTRICTS).flat().filter(Boolean))).sort();

const VolunteerShortlist = () => {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterProvince, setFilterProvince] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterDay, setFilterDay] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [totalItems, setTotalItems] = useState(0);
  const [unshortlistTarget, setUnshortlistTarget] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    setLoading(true);
    scholarshipProviderApi.getVolunteerApplications({ page, limit: perPage, status: "shortlisted" })
      .then((res: any) => {
        setVolunteers(res?.applications || []);
        setTotalItems(res?.meta?.total || 0);
        setLoading(false);
      })
      .catch(() => { setLoading(false); toast.error("Failed to load applications"); });
  }, [page]);

  const filtered = useMemo(() => {
    return volunteers.filter(v => {
      const q = search.toLowerCase();
      if (q && !v.full_name.toLowerCase().includes(q) && !v.email.toLowerCase().includes(q)) return false;
      if (filterProvince && v.province !== filterProvince) return false;
      if (filterDistrict && v.district !== filterDistrict) return false;
      if (filterGender && v.gender !== filterGender) return false;
      if (filterDay) {
        const dayNum = parseInt(filterDay, 10);
        const hasDay = v.available_days.some((d: string) => {
          const parts = d.split('-');
          return parts.length === 3 && parseInt(parts[2], 10) === dayNum;
        });
        if (!hasDay) return false;
      }
      return true;
    });
  }, [volunteers, search, filterProvince, filterDistrict, filterGender, filterDay]);

  const totalPages = Math.ceil(totalItems / perPage);
  const paginated = filtered;

  const handleUnshortlist = async () => {
    if (!unshortlistTarget) return;
    const id = unshortlistTarget.id;
    setUnshortlistTarget(null);
    try {
      await scholarshipProviderApi.unshortlistVolunteerApplication(id);
      toast.success("Application moved back to Manage Applications");
      setVolunteers(prev => prev.filter(v => v.id !== id));
    } catch {
      toast.error("Failed to move application");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setFilterProvince("");
    setFilterDistrict("");
    setFilterGender("");
    setFilterDay("");
    setPage(1);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/30 px-4 sm:px-8 pb-8">
      <ConfirmationModal
        isOpen={!!unshortlistTarget}
        title="Move to Manage Applications"
        message={`Remove "${unshortlistTarget?.name}" from shortlist and move back to Manage Applications?`}
        confirmText="Move Back"
        cancelText="Cancel"
        onConfirm={handleUnshortlist}
        onCancel={() => setUnshortlistTarget(null)}
        destructive={false}
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pt-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Shortlist Volunteer</h2>
        <div className="flex items-center text-sm text-slate-500 mt-2 sm:mt-0 gap-2">
          <Settings size={14} />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-slate-800 font-medium">Shortlist Volunteer</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 pb-0">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users size={20} className="text-blue-600" /> Shortlisted Volunteers
            </h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search by name or email..."
                  className="w-64 pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1.5 transition-colors">
                <Download size={16} /> Export
              </button>
            </div>
          </div>

          <div className="mb-6 p-5 bg-gray-50 rounded-lg border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Province:</label>
                <Dropdown
                  value={filterProvince}
                  onChange={v => { setFilterProvince(v); setPage(1); }}
                  options={[{ value: "", label: "All Provinces" }, ...NEPAL_PROVINCES.map(p => ({ value: p, label: p }))]}
                  placeholder="All Provinces"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">District:</label>
                <Dropdown
                  value={filterDistrict}
                  onChange={v => { setFilterDistrict(v); setPage(1); }}
                  options={[{ value: "", label: "All Districts" }, ...allDistricts.map(d => ({ value: d, label: d }))]}
                  placeholder="All Districts"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Gender:</label>
                <Dropdown
                  value={filterGender}
                  onChange={v => { setFilterGender(v); setPage(1); }}
                  options={[
                    { value: "", label: "All" },
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" },
                  ]}
                  placeholder="All"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Available Days:</label>
                <Dropdown
                  value={filterDay}
                  onChange={v => { setFilterDay(v); setPage(1); }}
                  options={[{ value: "", label: "All" }, ...ALL_DAYS.map(d => ({ value: d, label: `Day ${d}` }))]}
                  placeholder="All"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={resetFilters} className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline">Reset Filters</button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="text-center py-4 px-4 font-bold text-gray-700">S.N</th>
                <th className="text-left py-4 px-4 font-bold text-gray-700">Full Name</th>
                <th className="text-center py-4 px-4 font-bold text-gray-700">Gender</th>
                <th className="text-left py-4 px-4 font-bold text-gray-700" style={{ minWidth: 180 }}>Email<br /><span className="text-xs font-normal text-gray-400">/ Phone</span></th>
                <th className="text-left py-4 px-4 font-bold text-gray-700" style={{ minWidth: 260 }}>Province / District<br /><span className="text-xs font-normal text-gray-400">/ Municipality / Ward</span></th>
                <th className="text-center py-4 px-4 font-bold text-gray-700">Participate District</th>
                <th className="text-center py-4 px-4 font-bold text-gray-700">Designation</th>
                <th className="text-center py-4 px-4 font-bold text-gray-700">CV / Resume</th>
                <th className="text-center py-4 px-4 font-bold text-gray-700">Previous Volunteer</th>
                <th className="text-center py-4 px-4 font-bold text-gray-700">Previous Volunteer Role</th>
                <th className="text-center py-4 px-4 font-bold text-gray-700">Available Days</th>
                <th className="text-center py-4 px-4 font-bold text-gray-700">Registered</th>
                <th className="text-center py-4 px-4 font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={13} className="py-20 text-center text-gray-400">Loading...</td></tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-20 text-center text-gray-400">No shortlisted volunteers</td>
                </tr>
              ) : (
                paginated.map((v, i) => (
                <tr key={v.id} className="hover:bg-blue-50 transition-colors">
                  <td className="py-4 px-4 text-gray-500 font-medium text-center">{(page - 1) * perPage + i + 1}</td>
                  <td className="py-4 px-4"><p className="font-semibold text-gray-900">{v.full_name}</p></td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${v.gender === "Male" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"}`}>{v.gender}</span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{v.email}<br /><span className="text-gray-400">{v.phone}</span></td>
                  <td className="py-4 px-4 text-gray-600" style={{ minWidth: 260 }}>{v.province}, {v.district},<br />{v.municipality}, Ward-{v.ward}</td>
                  <td className="py-4 px-4 text-center text-gray-600">{v.participate_district}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">{v.designation}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {v.cv_path ? (
                      <button onClick={async () => { const r = await fetch(getImageUrl(v.cv_path)); const b = await r.blob(); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = v.cv_path.split('/').pop() || 'cv'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(u); }} className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors inline-flex" title="Download CV / Resume">
                        <Download size={18} />
                      </button>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {v.volunteered_before === "Yes" ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Yes</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">No</span>
                    )}
                  </td>
                   <td className="py-4 px-4 text-center text-gray-500 text-xs">
                    {v.volunteered_before === "Yes" ? (
                      <div className="group relative inline-block max-w-[200px]">
                        <div className="truncate">{v.volunteer_details}</div>
                        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 max-w-xs whitespace-normal rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {v.volunteer_details}
                          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                        </div>
                      </div>
                    ) : "-"}
                  </td>
                  <DaysCell days={v.available_days} />
                  <td className="py-4 px-4 text-center text-gray-500 text-xs">{v.created_at}</td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => setUnshortlistTarget({ id: v.id, name: v.full_name })}
                      className="p-2 hover:bg-amber-100 rounded-lg text-amber-600 transition-colors"
                      title="Move to Manage Applications"
                    >
                      <Undo2 size={18} />
                    </button>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{paginated.length}</span> of <span className="font-medium">{totalItems}</span> volunteers
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, page - 2);
              const p = start + i;
              if (p > totalPages) return null;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${
                    page === p ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function DaysCell({ days: dayList }: { days: string[] }) {
  const [open, setOpen] = useState(false);
  const month = "June 2026";
  const firstDay = new Date(2026, 5, 1).getDay();
  const totalDays = 30;

  const modal = open ? createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4" onClick={() => setOpen(false)}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-5 pt-5 pb-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">{month}</h3>
          <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div className="p-5">
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-400 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => <div key={d} className="py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {Array.from({ length: firstDay }, (_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: totalDays }, (_, i) => {
              const day = String(i + 1);
              const hl = dayList.includes(day);
              return <div key={day} className={`w-9 h-9 flex items-center justify-center mx-auto rounded-full text-sm font-medium ${hl ? "bg-amber-100 text-amber-800 font-bold ring-1 ring-amber-300" : "text-gray-600 hover:bg-gray-100"}`}>{day}</div>;
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
            <span className="inline-block w-3 h-3 rounded bg-amber-100 ring-1 ring-amber-300" />
            <span>{dayList.length} available {dayList.length === 1 ? "day" : "days"}</span>
          </div>
        </div>
      </div>
    </div>, document.body
  ) : null;

  return (
    <td className="py-4 px-4 text-center">
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors"
      >
        {dayList.length} {dayList.length === 1 ? "day" : "days"}
      </button>
      {modal}
    </td>
  );
}

export default VolunteerShortlist;
