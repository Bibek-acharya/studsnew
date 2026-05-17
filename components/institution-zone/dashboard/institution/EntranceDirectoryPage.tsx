"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import { MagnifyingGlass, Eye, Pencil, Trash, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { institutionEntranceApi, InstitutionEntrance } from "@/services/institutionEntranceApi";

const statusColors: Record<string, string> = {
  upcoming: "text-orange-600 bg-orange-50",
  ongoing: "text-green-600 bg-green-50",
  closed: "text-red-600 bg-red-50",
};

const statusPill = (status: string) => {
  const color = statusColors[status] || "bg-gray-100 text-gray-700";
  return <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${color}`}>{status}</span>;
};

const ITEMS_PER_PAGE = 5;

const EntranceDirectoryPage: React.FC = () => {
  const router = useRouter();
  const [exams, setExams] = useState<InstitutionEntrance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    institutionEntranceApi.list(1, 100)
      .then(res => setExams(res.entrances || []))
      .catch(() => setExams([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = exams.filter((e) => {
    const s = search.toLowerCase();
    if (!s) return true;
    return e.title.toLowerCase().includes(s) || e.status.toLowerCase().includes(s);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleDelete = async (id: number) => {
    try {
      await institutionEntranceApi.delete(id);
      setExams(prev => prev.filter(e => e.id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-full">
      <SectionHeader title="Entrance Directory" breadcrumbItems={[{ label: "Dashboard" }, { label: "Entrance Directory" }]} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="relative w-full sm:w-80">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search entrances..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400"><p className="text-sm">Loading...</p></div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">{search ? "No entrances matched your search." : "No entrances yet."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Exam Name</th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">Date</th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">Seats</th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">Filled</th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-50">
                    <td className="py-3 px-6 font-medium text-gray-900">{exam.title}</td>
                    <td className="text-center py-3 px-6 text-gray-600">{new Date(exam.date).toLocaleDateString()}</td>
                    <td className="text-center py-3 px-6 text-gray-600">{exam.total_seats}</td>
                    <td className="text-center py-3 px-6 text-gray-600">{exam.filled_seats}</td>
                    <td className="text-center py-3 px-6">{statusPill(exam.status)}</td>
                    <td className="text-center py-3 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="View"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => router.push(`/institution-zone/dashboard/entrance?id=${exam.id}`)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="Edit"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(exam.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Delete"><Trash className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">Showing {(safePage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 hover:bg-gray-50">
                <CaretLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${page === i + 1 ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{i + 1}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 hover:bg-gray-50">
                <CaretRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntranceDirectoryPage;
