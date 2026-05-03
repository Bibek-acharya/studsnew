"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Home, Building2, CheckCircle, DollarSign, MapPin, GraduationCap, Calendar, Trash2, Pencil, Users } from "lucide-react";
import { scholarshipProviderApi, ProviderScholarship } from "@/services/scholarshipProviderApi";
import ConfirmationModal from "./common/ConfirmationModal";

interface ScholarshipDirectoryProps {
  onEdit?: (id: number) => void;
}

const FALLBACKS: ProviderScholarship[] = [
  {
    id: 1, provider_id: 1, title: "Nepal STEM Excellence Grant", provider: "Tech Nepal Foundation", description: "",
    funding_type: "PARTIAL TUITION", status: "finished", location: "Kathmandu, Nepal", value: "NPR 400,000",
    degree_level: "Bachelors", deadline: "2026-04-10", image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    field_of_study: [], scholarship_type: "", applications_count: 12, created_at: "", updated_at: "",
  },
  {
    id: 2, provider_id: 1, title: "Project Shiksha Scholarship 2082", provider: "Sowers Action Nepal", description: "",
    funding_type: "FULLY FUNDED", status: "active", location: "Kathmandu, Nepal", value: "NPR 50,000/yr",
    degree_level: "+2 / Grade 11-12", deadline: "2026-06-30", image_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    field_of_study: [], scholarship_type: "", applications_count: 45, created_at: "", updated_at: "",
  },
  {
    id: 3, provider_id: 1, title: "Women in Engineering Grant", provider: "Ncell Foundation", description: "",
    funding_type: "PARTIAL TUITION", status: "active", location: "Pokhara, Nepal", value: "NPR 250,000",
    degree_level: "Bachelors", deadline: "2026-05-15", image_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    field_of_study: [], scholarship_type: "", applications_count: 28, created_at: "", updated_at: "",
  },
  {
    id: 4, provider_id: 1, title: "Community Leadership Award", provider: "100 Group Nepal", description: "",
    funding_type: "FULLY FUNDED", status: "active", location: "Lalitpur, Nepal", value: "NPR 180,000",
    degree_level: "Bachelors / Masters", deadline: "2026-07-20", image_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    field_of_study: [], scholarship_type: "", applications_count: 8, created_at: "", updated_at: "",
  },
  {
    id: 5, provider_id: 1, title: "ICT Scholarship Nepal", provider: "Creating Opportunities", description: "",
    funding_type: "MERIT-BASED", status: "active", location: "Biratnagar, Nepal", value: "NPR 300,000",
    degree_level: "+2 / Diploma", deadline: "2026-08-10", image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    field_of_study: [], scholarship_type: "", applications_count: 34, created_at: "", updated_at: "",
  },
  {
    id: 6, provider_id: 1, title: "Rural Student Scholarship", provider: "RONB Foundation", description: "",
    funding_type: "PARTIAL TUITION", status: "active", location: "Nepalgunj, Nepal", value: "NPR 150,000",
    degree_level: "+2 / Bachelors", deadline: "2026-09-05", image_url: "https://images.unsplash.com/photo-1523050854058-8df90910b683?auto=format&fit=crop&w=800&q=80",
    field_of_study: [], scholarship_type: "", applications_count: 19, created_at: "", updated_at: "",
  },
];

const ScholarshipDirectory: React.FC<ScholarshipDirectoryProps> = memo(({ onEdit }) => {
  const [scholarships, setScholarships] = useState<ProviderScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; scholarshipId: number | null; title: string }>({
    isOpen: false,
    scholarshipId: null,
    title: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await scholarshipProviderApi.getScholarships(1, 50);
        const nonDrafts = (res.scholarships.length > 0 ? res.scholarships : FALLBACKS).filter((s) => s.status !== 'draft');
        setScholarships(nonDrafts);
      } catch {
        setScholarships(FALLBACKS.filter((s) => s.status !== 'draft'));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    const target = scholarships.find((s) => s.id === id);
    setDeleteModal({
      isOpen: true,
      scholarshipId: id,
      title: target?.title || "this scholarship",
    });
  }, [scholarships]);

  const confirmDeleteScholarship = useCallback(async () => {
    if (!deleteModal.scholarshipId) return;
    const scholarshipId = deleteModal.scholarshipId;
    setDeleteModal({ isOpen: false, scholarshipId: null, title: "" });
    try {
      await scholarshipProviderApi.deleteScholarship(scholarshipId);
      setScholarships((prev) => prev.filter((s) => s.id !== scholarshipId));
    } catch {
      alert("Failed to delete scholarship");
    }
  }, [deleteModal.scholarshipId]);

  const fundingColor = (type: string) => {
    const map: Record<string, string> = {
      "FULLY FUNDED": "bg-green-50 text-green-600",
      "PARTIAL TUITION": "bg-blue-50 text-blue-600",
      "MERIT-BASED": "bg-cyan-50 text-cyan-600",
    };
    return map[type] || "bg-gray-50 text-gray-600";
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: "bg-green-50 text-green-600",
      draft: "bg-yellow-50 text-yellow-600",
      finished: "bg-orange-50 text-orange-600",
    };
    return map[status] || "bg-gray-50 text-gray-600";
  };

  const statusDot = (status: string) => {
    const map: Record<string, string> = {
      active: "bg-green-500",
      draft: "bg-yellow-500",
      finished: "bg-orange-500",
    };
    return map[status] || "bg-gray-500";
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading scholarships...</div>;
  }

  return (
    <div className="space-y-6">
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Scholarship"
        message={`Are you sure you want to delete \"${deleteModal.title}\"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteScholarship}
        onCancel={() => setDeleteModal({ isOpen: false, scholarshipId: null, title: "" })}
        destructive
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Scholarship Directory</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Scholarship Directory</span>
        </div>
      </div>

      {scholarships.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center border border-slate-100">
          <p className="text-slate-500">No scholarships found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {scholarships.map((sch) => (
            <div key={sch.id} className="bg-white rounded-lg border border-gray-200 p-3.5 shadow-sm">
              <div className="w-full h-28 rounded-xl overflow-hidden mb-3">
                <img
                  src={sch.image_url || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"}
                  alt={sch.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`${fundingColor(sch.funding_type)} text-[10px] font-bold px-2 py-1 rounded-md`}>
                  {sch.funding_type || "SCHOLARSHIP"}
                </span>
                <span className={`${statusBadge(sch.status)} text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1`}>
                  <span className={`w-1 h-1 rounded-full ${statusDot(sch.status)}`} /> {sch.status.toUpperCase()}
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
                <div className="flex items-center gap-1.5 text-red-500 text-xs font-medium">
                  <Calendar className="w-3 h-3 text-red-400" />
                  <span className="text-xs">Ends: {sch.deadline ? new Date(sch.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}</span>
                </div>
              </div>
              <div className="flex gap-1.5 mt-3">
                <button
                  onClick={() => onEdit?.(sch.id)}
                  className="flex-[0.7] py-2 px-2 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors text-[11px]"
                >
                  <Pencil className="w-3 h-3 inline mr-0.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(sch.id)}
                  className="flex-[0.7] py-2 px-2 border border-red-200 text-red-600 font-semibold rounded-md hover:bg-red-50 transition-colors text-[11px]"
                >
                  <Trash2 className="w-3 h-3 inline mr-0.5" /> Delete
                </button>
                <button className="flex-[1.6] py-2 px-2 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800 transition-colors text-[11px]">
                  <Users className="w-3 h-3 inline mr-0.5" /> View Applicant
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

ScholarshipDirectory.displayName = "ScholarshipDirectory";

export default ScholarshipDirectory;
