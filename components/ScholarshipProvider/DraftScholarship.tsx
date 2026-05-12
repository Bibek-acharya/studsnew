"use client";

import React, { useState, useEffect, memo } from "react";
import { Home, Building2, CheckCircle, Tag, MapPin, GraduationCap, Pencil, ChevronLeft, ChevronRight, X, AlertTriangle } from "lucide-react";
import { scholarshipProviderApi, ProviderScholarship } from "@/services/scholarshipProviderApi";
import { toast } from "sonner";
import { getImageUrl } from "@/services/api";
import { validateScholarshipData, validateDates, type FieldError, type ScholarshipFormData } from "@/lib/scholarship-validation";

interface DraftScholarshipProps {
  onEdit?: (id: number) => void;
  onNavigate?: (section: string) => void;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Publish",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const FIELD_LABELS: Record<string, string> = {
  mainTitle: "Main Title",
  providerName: "Provider Name",
  fundingType: "Funding Type",
  scholarshipType: "Scholarship Type",
  educationLevel: "Education Level",
  location: "Location",
  bannerBgUrl: "Banner Image",
  startDate: "Start Date",
  endDate: "End Date",
  contactEmail: "Contact Email",
  primaryPhone: "Primary Phone",
  secondaryPhone: "Secondary Phone",
  websiteUrl: "Website URL",
  coverageArea: "Coverage Area",
  officeAddress: "Office Address",
  mapUrl: "Map URL",
  scholarshipSectionTitle: "Scholarship Section Title",
  scholarshipSubtitle: "Scholarship Subtitle",
  scholarshipDescription: "Scholarship Description",
  eligibilitySectionTitle: "Eligibility Section Title",
  eligibilitySubtitle: "Eligibility Subtitle",
};

interface ValidationErrorModalProps {
  isOpen: boolean;
  errors: FieldError[];
  onEdit: () => void;
  onCancel: () => void;
}

const ValidationErrorModal: React.FC<ValidationErrorModalProps> = ({
  isOpen,
  errors,
  onEdit,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Cannot Publish</h3>
            <p className="text-sm text-gray-500">Please fix the following issues:</p>
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 max-h-64 overflow-y-auto space-y-2 mb-6">
          {errors.map((err, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-red-500 mt-0.5 shrink-0">•</span>
              <div>
                <span className="font-medium text-red-800">
                  {FIELD_LABELS[err.field] || err.field}
                </span>
                <span className="text-red-700"> — {err.message}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Draft
          </button>
        </div>
      </div>
    </div>
  );
};



function scholarshipToFormData(s: ProviderScholarship): ScholarshipFormData {
  const d = s as any;
  return {
    mainTitle: s.title || "",
    providerName: d.provider_name || s.provider || "",
    fundingType: s.funding_type || "",
    scholarshipType: s.scholarship_type || "",
    educationLevel: d.education_level || s.degree_level || "",
    location: s.location || "",
    bannerBgUrl: s.banner_background_image_url || s.image_url || "",
    startDate: s.application_start_date?.split("T")[0] || "",
    endDate: s.application_end_date?.split("T")[0] || s.deadline?.split("T")[0] || "",
    contactEmail: d.contact_email || "",
    primaryPhone: d.primary_phone || "",
    secondaryPhone: d.secondary_phone || "",
    websiteUrl: d.website_url || "",
    coverageArea: d.coverage_area || "",
    officeAddress: d.office_address || "",
    mapUrl: d.map_url || "",
    scholarshipSectionTitle: s.scholarship_section_title || "",
    scholarshipSubtitle: s.scholarship_subtitle || "",
    scholarshipDescription: s.scholarship_description_1 || s.description || "",
    eligibilitySectionTitle: s.eligibility_section_title || "",
    eligibilitySubtitle: s.eligibility_subtitle || "",
  };
}

const DraftScholarship: React.FC<DraftScholarshipProps> = memo(({ onEdit, onNavigate }) => {
  const [drafts, setDrafts] = useState<ProviderScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [publishing, setPublishing] = useState<number | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    scholarshipId: number | null;
    title: string;
  }>({
    isOpen: false,
    scholarshipId: null,
    title: "",
  });
  const [validationModal, setValidationModal] = useState<{
    isOpen: boolean;
    scholarshipId: number | null;
    errors: FieldError[];
  }>({
    isOpen: false,
    scholarshipId: null,
    errors: [],
  });
  const perPage = 8;

  useEffect(() => {
    async function fetchDrafts() {
      try {
        const res = await scholarshipProviderApi.getScholarships(1, 50);
        const draftSchols = res.scholarships.filter((s) => s.status === "draft");
        setDrafts(draftSchols);
      } catch {
        setDrafts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDrafts();
  }, []);

  const handlePublishClick = (id: number, title: string) => {
    setConfirmModal({
      isOpen: true,
      scholarshipId: id,
      title: title,
    });
  };

  const handleConfirmPublish = async () => {
    if (!confirmModal.scholarshipId) return;
    const id = confirmModal.scholarshipId;
    const title = confirmModal.title;
    setConfirmModal({ isOpen: false, scholarshipId: null, title: "" });
    setPublishing(id);

    try {
      const scholarship = await scholarshipProviderApi.getScholarshipById(id);
      const formData = scholarshipToFormData(scholarship);

      const fieldErrors = validateScholarshipData(formData);
      const dateErrors = validateDates(formData.startDate, formData.endDate);
      const allErrors = [...fieldErrors.errors, ...dateErrors.errors];

      if (allErrors.length > 0) {
        setPublishing(null);
        setValidationModal({ isOpen: true, scholarshipId: id, errors: allErrors });
        return;
      }

      const payload: Record<string, unknown> = { ...scholarship, status: "published" };
      await scholarshipProviderApi.updateScholarship(id, payload as any);
      setDrafts((prev) => prev.filter((d) => d.id !== id));
      toast.success("Your scholarship is now live and visible in the directory.");
    } catch (err) {
      toast.error("Failed to publish scholarship");
    } finally {
      setPublishing(null);
    }
  };

  const handleCancelPublish = () => {
    setConfirmModal({ isOpen: false, scholarshipId: null, title: "" });
  };

  const handleCloseValidation = () => {
    setValidationModal({ isOpen: false, scholarshipId: null, errors: [] });
  };

  const handleEditFromValidation = () => {
    const id = validationModal.scholarshipId;
    setValidationModal({ isOpen: false, scholarshipId: null, errors: [] });
    if (id && onEdit) {
      onEdit(id);
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
    <>
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title="Publish Scholarship"
        message={`Are you sure you want to publish "${confirmModal.title}"? It will be visible to students.`}
        confirmText="Publish"
        cancelText="Cancel"
        onConfirm={handleConfirmPublish}
        onCancel={handleCancelPublish}
      />

      <ValidationErrorModal
        isOpen={validationModal.isOpen}
        errors={validationModal.errors}
        onEdit={handleEditFromValidation}
        onCancel={handleCloseValidation}
      />
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
                  {(() => {
                    const img = sch.banner_background_image_url || sch.banner_image || sch.image_url;
                    return img ? (
                      <div className="w-full h-28 rounded-lg overflow-hidden mb-3 bg-gray-100">
                        <img src={getImageUrl(img)} alt={sch.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-full h-28 rounded-lg overflow-hidden mb-3 bg-gray-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-400 text-center px-2">{sch.title}</span>
                      </div>
                    );
                  })()}
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className={`${fundingColor(sch.funding_type)} text-[10px] font-bold px-2 py-1 rounded-md`}>
                      {sch.funding_type || "SCHOLARSHIP"}
                    </span>
                    <span className="bg-yellow-50 text-yellow-600 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-yellow-500" /> DRAFT
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-3 truncate">{sch.title}</h3>
                  <div className="bg-gray-50 rounded-lg p-3 flex flex-col gap-2 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                        <Tag className="w-3 h-3 text-gray-400" />
                        <span className="text-xs capitalize">{sch.funding_type?.toLowerCase()}</span>
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
                      onClick={() => handlePublishClick(sch.id, sch.title)}
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
    </>
  );
});

DraftScholarship.displayName = "DraftScholarship";

export default DraftScholarship;
