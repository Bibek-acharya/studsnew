"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Mail, Phone, GraduationCap, BookOpen, Users, FileText, Check, X, Star } from "lucide-react";
import { scholarshipProviderApi, ProviderApplication } from "@/services/scholarshipProviderApi";
import { toast } from "sonner";

interface ApplicationDetailsProps {
  applicationId: string;
  onBack: () => void;
  onStatusUpdate?: () => void;
}

export default function ApplicationDetails({ applicationId, onBack, onStatusUpdate }: ApplicationDetailsProps) {
  const [application, setApplication] = useState<ProviderApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  async function loadApplication() {
    setLoading(true);
    setError("");
    try {
      const id = parseInt(applicationId, 10);
      const res = await scholarshipProviderApi.getApplicationById(id);
      setApplication(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load application");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!application) return;
    setSavingStatus(true);
    try {
      await scholarshipProviderApi.updateApplicationStatus(application.id, newStatus);
      setApplication((prev) => (prev ? { ...prev, status: newStatus } : null));
      const name = application.full_name || `${application.first_name} ${application.last_name}`;
      if (newStatus === 'shortlisted') {
        toast.success(`You have shortlisted ${name}.`);
      } else if (newStatus === 'rejected') {
        toast.success(`You have rejected ${name}'s application.`);
      } else {
        toast.success(`Application status updated to ${newStatus.replace('_', ' ')}`);
      }
      onStatusUpdate?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setSavingStatus(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-6 text-red-700">
        <p className="font-bold">{error || "Application not found"}</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-semibold">
          Go Back
        </button>
      </div>
    );
  }

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      shortlisted: "bg-purple-100 text-purple-700",
      rejected: "bg-red-100 text-red-700",
      under_review: "bg-blue-100 text-blue-700",
    };
    return map[status] || "bg-gray-100 text-gray-700";
  };

  const statusLabel = (s: string) => s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const initials = `${application.first_name?.[0] || ""}${application.last_name?.[0] || ""}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Applicant Details</h2>
            <p className="text-sm text-slate-500">#{application.id} &middot; Applied {new Date(application.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={application.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={savingStatus}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-blue-600 disabled:opacity-50"
          >
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            {initials}
          </div>
          <h3 className="text-lg font-bold text-slate-900">{application.first_name} {application.last_name}</h3>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className={`${statusBadge(application.status)} px-3 py-0.5 rounded-full text-xs font-semibold`}>{statusLabel(application.status)}</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">{application.scholarship?.title}</p>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-left">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Mail className="w-4 h-4 text-slate-400" /> {application.email}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Phone className="w-4 h-4 text-slate-400" /> {application.phone_number || "N/A"}
            </div>
          </div>
        </div>

        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" /> Personal Information
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <DetailField label="Full Name" value={`${application.first_name} ${application.last_name}`} />
              <DetailField label="Gender" value={application.gender || "N/A"} />
              <DetailField label="Age" value={application.age != null ? String(application.age) : "N/A"} />
              <DetailField label="Email" value={application.email} />
              <DetailField label="Phone" value={application.phone_number || "N/A"} />
            </div>
          </div>

          {/* Application Form Data */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Application Form Data
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <DetailField label="Full Name" value={application.full_name || `${application.first_name} ${application.last_name}`} />
              <DetailField label="Ethnicity" value={application.ethnicity || "N/A"} />
              <DetailField label="Ethnicity Other" value={application.ethnicity_other || "N/A"} />
              <DetailField label="DOB (BS)" value={application.date_of_birth_bs || "N/A"} />
              <DetailField label="DOB (AD)" value={application.date_of_birth_ad || "N/A"} />
              <DetailField label="Photo" value={application.photo_url ? "Uploaded" : "N/A"} />
            </div>
          </div>

          {/* Education Information */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> Education Information
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <DetailField label="School Name" value={application.school_name || "N/A"} />
              <DetailField label="School Type" value={application.school_type || "N/A"} />
              <DetailField label="GPA" value={application.gpa != null ? application.gpa.toFixed(2) : "N/A"} />
              <DetailField label="School Province" value={application.school_province || "N/A"} />
              <DetailField label="School District" value={application.school_district || "N/A"} />
              <DetailField label="School Municipality" value={application.school_municipality || "N/A"} />
              <DetailField label="School Tole" value={application.school_tole || "N/A"} />
            </div>
          </div>

          {/* Exam & Stream */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Exam & Stream Details
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <DetailField label="Stream" value={application.stream || "N/A"} />
              <DetailField label="Exam Center" value={application.exam_center || "N/A"} />
              <DetailField label="Province" value={application.province || "N/A"} />
            </div>
          </div>

          {/* Family & Address */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" /> Family & Address
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <DetailField label="Permanent Province" value={application.permanent_province || "N/A"} />
              <DetailField label="Permanent District" value={application.permanent_district || "N/A"} />
              <DetailField label="Permanent Municipality" value={application.permanent_municipality || "N/A"} />
              <DetailField label="Permanent Ward" value={application.permanent_ward || "N/A"} />
              <DetailField label="Permanent Tole" value={application.permanent_tole || "N/A"} />
              <DetailField label="Temporary Province" value={application.temporary_province || "N/A"} />
              <DetailField label="Temporary District" value={application.temporary_district || "N/A"} />
              <DetailField label="Temporary Municipality" value={application.temporary_municipality || "N/A"} />
              <DetailField label="Temporary Ward" value={application.temporary_ward || "N/A"} />
              <DetailField label="Temporary Tole" value={application.temporary_tole || "N/A"} />
              <DetailField label="Guardian Name" value={application.guardian_name || "N/A"} />
              <DetailField label="Guardian Phone" value={application.guardian_phone || "N/A"} />
              <DetailField label="Guardian Email" value={application.guardian_email || "N/A"} />
              <DetailField label="Father Occupation" value={application.father_occupation || "N/A"} />
              <DetailField label="Father Occupation Other" value={application.father_occupation_other || "N/A"} />
              <DetailField label="Mother Occupation" value={application.mother_occupation || "N/A"} />
              <DetailField label="Mother Occupation Other" value={application.mother_occupation_other || "N/A"} />
              <DetailField label="Family Income" value={application.family_monthly_income != null ? `Rs. ${application.family_monthly_income.toLocaleString()}` : "N/A"} />
              <DetailField label="Family Members" value={application.family_members_count != null ? String(application.family_members_count) : "N/A"} />
            </div>
          </div>

          {/* Scholarship Information */}
          {application.scholarship && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Scholarship Information
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <DetailField label="Scholarship" value={application.scholarship.title} />
                <DetailField label="Value" value={application.scholarship.value || "N/A"} />
                <DetailField label="Type" value={application.scholarship.funding_type || "N/A"} />
              </div>
            </div>
          )}

          {/* Personal Statement */}
          {application.personal_statement && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Personal Statement</h4>
              <p className="text-slate-700 text-sm leading-relaxed italic">{application.personal_statement}</p>
            </div>
          )}

          {/* Documents */}
          {application.documents && application.documents.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Documents
              </h4>
              <div className="space-y-2">
                {application.documents.map((doc: any, index: number) => (
                  <a
                    key={index}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-blue-600 hover:text-blue-700"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-medium">{doc.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h4>
            <div className="flex flex-wrap gap-3">
              {application.status !== "approved" && (
                <button onClick={() => handleStatusChange("approved")} disabled={savingStatus} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
                  <Check className="w-4 h-4" /> Approve
                </button>
              )}
              {application.status !== "shortlisted" && application.status !== "approved" && (
                <button onClick={() => handleStatusChange("shortlisted")} disabled={savingStatus} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
                  <Star className="w-4 h-4" /> Shortlist
                </button>
              )}
              {application.status !== "rejected" && (
                <button onClick={() => handleStatusChange("rejected")} disabled={savingStatus} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
                  <X className="w-4 h-4" /> Reject
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <p className="text-xs font-semibold text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}
