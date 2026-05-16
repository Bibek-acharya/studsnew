"use client";
import React, { useState, useEffect } from "react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import { MagnifyingGlass, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { institutionEntranceApi, InstitutionEntrance, EntranceApplicant } from "@/services/institutionEntranceApi";

type TabStatus = "all" | "shortlisted" | "approved" | "pending" | "rejected";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  under_review: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  waitlisted: "bg-purple-100 text-purple-700",
  shortlisted: "bg-blue-100 text-blue-700",
  registered: "bg-gray-100 text-gray-700",
};

const statusLabels: Record<string, string> = {
  registered: "Registered",
  pending: "Pending",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  waitlisted: "Waitlisted",
  shortlisted: "Shortlisted",
};

const statusPill = (status: string) => {
  const color = statusColors[status] || "bg-gray-100 text-gray-700";
  const label = statusLabels[status] || status;
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>;
};

const ITEMS_PER_PAGE = 5;

const EntranceApplicantsPage = () => {
  const [entrances, setEntrances] = useState<InstitutionEntrance[]>([]);
  const [selectedEntrance, setSelectedEntrance] = useState<number | "">("");
  const [applicants, setApplicants] = useState<EntranceApplicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabStatus>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    institutionEntranceApi.list(1, 100)
      .then(res => setEntrances(res.entrances || []))
      .catch(() => setEntrances([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedEntrance) { setApplicants([]); return; }
    institutionEntranceApi.getApplicants(Number(selectedEntrance))
      .then(setApplicants)
      .catch(() => setApplicants([]));
  }, [selectedEntrance]);

  const filtered = React.useMemo(() => {
    return applicants.filter((row) => {
      if (activeTab !== "all" && row.status !== activeTab) return false;
      const s = search.toLowerCase();
      if (s && !String(row.user_id).includes(s)) return false;
      return true;
    });
  }, [applicants, activeTab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const toggleAll = () => {
    if (selected.length === paginated.length) setSelected([]);
    else setSelected(paginated.map(a => a.id));
  };

  const toggleOne = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const tabs: TabStatus[] = ["all", "shortlisted", "approved", "pending", "rejected"];
  const tabCounts: Record<string, number> = {};
  applicants.forEach(a => { tabCounts[a.status] = (tabCounts[a.status] || 0) + 1; });
  tabCounts["all"] = applicants.length;

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-full">
      <SectionHeader title="Entrance Applicants" breadcrumbItems={[{ label: "Dashboard" }, { label: "Applicants" }]} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-wrap items-center gap-4">
          <select value={selectedEntrance} onChange={e => { setSelectedEntrance(e.target.value ? Number(e.target.value) : ""); setPage(1); }}
            className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none">
            <option value="">Select Entrance Exam</option>
            {entrances.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
          <div className="relative w-full sm:w-64">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search applicants..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none" />
          </div>
        </div>

        {!selectedEntrance ? (
          <div className="text-center py-12 text-gray-400"><p className="text-sm">Select an entrance exam to view applicants</p></div>
        ) : loading ? (
          <div className="text-center py-12 text-gray-400"><p className="text-sm">Loading...</p></div>
        ) : applicants.length === 0 ? (
          <div className="text-center py-12 text-gray-400"><p className="text-sm">No applicants found for this entrance.</p></div>
        ) : (
          <>
            <div className="px-6 py-3 border-b border-gray-200 flex items-center gap-4 overflow-x-auto">
              {tabs.map(tab => (
                <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }}
                  className={`text-sm font-medium whitespace-nowrap pb-1 border-b-2 transition-colors ${
                    activeTab === tab ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-gray-700"
                  }`}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tabCounts[tab] || 0})
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-10 px-4 py-3"><input type="checkbox" checked={selected.length === paginated.length && paginated.length > 0} onChange={toggleAll} className="w-4 h-4" /></th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">User ID</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-700">Score</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-700">Rank</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-700">Status</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-700">Applied</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginated.map(a => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(a.id)} onChange={() => toggleOne(a.id)} className="w-4 h-4" /></td>
                      <td className="px-4 py-3 font-medium text-gray-900">{a.user_id}</td>
                      <td className="text-center px-4 py-3 text-gray-600">{a.score || "-"}</td>
                      <td className="text-center px-4 py-3 text-gray-600">{a.rank || "-"}</td>
                      <td className="text-center px-4 py-3">{statusPill(a.status)}</td>
                      <td className="text-center px-4 py-3 text-gray-500">{new Date(a.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Showing {(safePage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 hover:bg-gray-50"><CaretLeft className="w-4 h-4" /></button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${page === i + 1 ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{i + 1}</button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 hover:bg-gray-50"><CaretRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EntranceApplicantsPage;
