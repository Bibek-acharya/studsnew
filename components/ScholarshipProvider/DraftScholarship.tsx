"use client";

import React, { useState, useEffect, memo } from "react";
import { Home, Building2, CheckCircle, DollarSign, MapPin, GraduationCap, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import { scholarshipProviderApi, ProviderScholarship } from "@/services/scholarshipProviderApi";

interface DraftScholarshipProps {
  onEdit?: (id: number) => void;
  onNavigate?: (section: string) => void;
}

const DRAFT_FALLBACKS: ProviderScholarship[] = [
  {
    id: 1, provider_id: 1, title: "Medical Scholarship 2082", provider: "Sowers Action Nepal", description: "",
    funding_type: "FULLY FUNDED", status: "draft", location: "Bharatpur, Nepal", value: "NPR 500,000",
    degree_level: "MBBS / BDS", deadline: "", image_url: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80",
    field_of_study: [], scholarship_type: "", applications_count: 0, created_at: "", updated_at: "",
  },
  {
    id: 2, provider_id: 1, title: "Agriculture Development Grant", provider: "Sowers Action Nepal", description: "",
    funding_type: "PARTIAL TUITION", status: "draft", location: "Butwal, Nepal", value: "NPR 200,000",
    degree_level: "Diploma / Bachelors", deadline: "", image_url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80",
    field_of_study: [], scholarship_type: "", applications_count: 0, created_at: "", updated_at: "",
  },
];

const DraftScholarship: React.FC<DraftScholarshipProps> = memo(({ onEdit, onNavigate }) => {
  const [drafts, setDrafts] = useState<ProviderScholarship[]>(DRAFT_FALLBACKS);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [publishing, setPublishing] = useState<number | null>(null);
  const perPage = 8;

  useEffect(() => {
    async function fetchDrafts() {
      try {
        const res = await scholarshipProviderApi.getScholarships(1, 50);
        const draftSchols = res.scholarships.filter((s) => s.status === "draft");
        setDrafts(draftSchols.length > 0 ? draftSchols : DRAFT_FALLBACKS);
      } catch {
        setDrafts(DRAFT_FALLBACKS);
      } finally {
        setLoading(false);
      }
    }
    fetchDrafts();
  }, []);

  const handlePublish = async (id: number) => {
    if (!confirm("Are you sure you want to publish this scholarship? It will be visible to students.")) return;
    setPublishing(id);
    try {
      await scholarshipProviderApi.publishScholarship(id);
      setDrafts((prev) => prev.filter((d) => d.id !== id));
      alert("Scholarship published successfully!");
    } catch (err) {
      alert("Failed to publish scholarship");
    } finally {
      setPublishing(null);
    }
  };

  const totalPages = Math.ceil(drafts.length / perPage);
  const pagedDrafts = drafts.slice((page - 1) * perPage, page * perPage);

  const fundingColor = (type: string) => {
    const map: Record<string, string> = {
      "FULLY FUNDED": "bg-blue-50 text-blue-600",
      "PARTIAL TUITION": "bg-purple-50 text-purple-600",
      "MERIT-BASED": "bg-cyan-50 text-cyan-600",
    };
    return map[type] || "bg-gray-50 text-gray-600";
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading drafts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Draft Scholarship</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Draft Scholarship</span>
        </div>
      </div>

      {pagedDrafts.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center border border-slate-100">
          <p className="text-slate-500">No draft scholarships found.</p>
          <button
            onClick={() => onNavigate?.("sec-create-scholarship")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Create New Scholarship
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pagedDrafts.map((sch) => (
              <div key={sch.id} className="bg-white rounded-lg border border-gray-200 p-3.5 shadow-sm">
                <div className="w-full h-28 rounded-lg overflow-hidden mb-3 bg-gray-100">
                  <img
                    src={sch.image_url || "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80"}
                    alt={sch.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className={`${fundingColor(sch.funding_type)} text-[10px] font-bold px-2 py-1 rounded-md`}>
                    {sch.funding_type || "SCHOLARSHIP"}
                  </span>
                  <span className="bg-yellow-50 text-yellow-600 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-yellow-500" /> DRAFT
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-0.5 truncate">{sch.title}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                  <Building2 className="w-3 h-3" />
                  <span className="truncate">{sch.provider}</span>
                  <CheckCircle className="w-3 h-3 text-blue-600" />
                </div>
                <div className="bg-gray-50 rounded-lg p-3 flex flex-col gap-2 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                      <DollarSign className="w-3 h-3 text-gray-400" />
                      <span className="text-xs">{sch.value}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600 text-xs truncate">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs truncate">{sch.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                    <GraduationCap className="w-3 h-3 text-gray-400" />
                    <span className="text-xs">{sch.degree_level}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-yellow-600 text-xs font-medium">
                    <Pencil className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs">Last edited: recently</span>
                  </div>
                </div>
                <div className="flex gap-1.5 mt-3">
                  <button
                    onClick={() => onEdit?.(sch.id)}
                    className="flex-[1] py-2 px-2 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors text-[11px]"
                  >
                    Edit Draft
                  </button>
                  <button
                    onClick={() => handlePublish(sch.id)}
                    disabled={publishing === sch.id}
                    className="flex-[1] py-2 px-2 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800 transition-colors text-[11px] disabled:opacity-50"
                  >
                    {publishing === sch.id ? 'Publishing...' : 'Publish'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {drafts.length > perPage && (
            <div className="flex items-center justify-between mt-6 mb-8">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{(page - 1) * perPage + 1}-{Math.min(page * perPage, drafts.length)}</span> of <span className="font-medium">{drafts.length}</span> drafts
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg border ${page === 1 ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${page === i + 1 ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg border ${page === totalPages ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
});

DraftScholarship.displayName = "DraftScholarship";

export default DraftScholarship;
