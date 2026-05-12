"use client";

import React, { useEffect, useState } from "react";
import { X, Star, CheckCircle, XCircle, Download, FileText, ImageIcon, CreditCard } from "lucide-react";
import { scholarshipProviderApi, ProviderApplication } from "@/services/scholarshipProviderApi";
import { toast } from "sonner";

interface ApplicantProfileModalProps {
  applicationId: number;
  onClose: () => void;
  onStatusUpdate?: () => void;
}

export default function ApplicantProfileModal({ applicationId, onClose, onStatusUpdate }: ApplicantProfileModalProps) {
  const [application, setApplication] = useState<ProviderApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const toAbsoluteUrl = (path: string | undefined | null): string => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  async function loadApplication() {
    setLoading(true);
    try {
      const res = await scholarshipProviderApi.getApplicationById(applicationId);
      setApplication(res);
    } catch {
      toast.error("Failed to load application");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  async function handlePaymentApproval(approve: boolean) {
    if (!application) return;
    setSavingStatus(true);
    try {
      await scholarshipProviderApi.approvePayment(application.id, approve, "");
      setApplication((prev) =>
        prev
          ? {
              ...prev,
              payment: prev.payment
                ? { ...prev.payment, status: approve ? "completed" : "failed" }
                : undefined,
            }
          : null
      );
      toast.success(approve ? "Payment approved and admit card sent" : "Payment rejected");
    } catch {
      toast.error("Failed to process payment");
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!application) return;
    setSavingStatus(true);
    try {
      await scholarshipProviderApi.updateApplicationStatus(application.id, newStatus);
      setApplication((prev) => (prev ? { ...prev, status: newStatus } : null));
      const name = application.full_name || `${application.first_name} ${application.last_name}`;
      if (newStatus === 'shortlisted') toast.success(`Shortlisted ${name}.`);
      else if (newStatus === 'rejected') toast.success(`Rejected ${name}'s application.`);
      else toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
      onStatusUpdate?.();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setSavingStatus(false);
    }
  }

  const initials = application
    ? `${application.first_name?.[0] || ""}${application.last_name?.[0] || ""}`
    : "--";

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

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Applicant Profile
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-500">Loading applicant details...</div>
          ) : !application ? (
            <div className="py-20 text-center text-red-500">Failed to load applicant details.</div>
          ) : (
            <div className="p-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-4">
                  {application.photo_url ? (
                    <img
                      src={toAbsoluteUrl(application.photo_url)}
                      alt="Applicant"
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                      {initials}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{application.first_name} {application.last_name}</h3>
                    <p className="text-gray-600 text-sm">{application.phone_number || ""}{application.phone_number && application.email ? " | " : ""}{application.email}</p>
                    <div className="mt-1">
                      <span className={`${statusBadge(application.status)} px-3 py-0.5 rounded-full text-xs font-semibold`}>{statusLabel(application.status)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    Personal Information
                  </h4>
                  <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                    <InfoRow label="Full Name" value={`${application.first_name} ${application.last_name}`} />
                    <InfoRow label="Gender" value={application.gender} />
                    <InfoRow label="Ethnicity" value={application.ethnicity} />
                    <InfoRow label="Date of Birth (BS)" value={application.date_of_birth_bs} />
                    <InfoRow label="Age" value={application.age != null ? String(application.age) : undefined} />
                    <InfoRow label="Phone Number" value={application.phone_number} />
                    <InfoRow label="Email Address" value={application.email} />
                    {application.photo_url && (
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Photo</p>
                        <img
                          src={toAbsoluteUrl(application.photo_url)}
                          alt="Applicant photo"
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 border"
                          onClick={() => setPreviewImage(toAbsoluteUrl(application.photo_url))}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Education Details */}
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    Education Details
                  </h4>
                  <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                    <InfoRow label="SEE GPA" value={application.gpa != null ? application.gpa.toFixed(2) : undefined} highlight />
                    <InfoRow label="School Type" value={application.school_type} />
                    <InfoRow label="School Name" value={application.school_name} />
                    <InfoRow label="School Province" value={application.school_province} />
                    <InfoRow label="School District" value={application.school_district} />
                    <InfoRow label="School Municipality" value={application.school_municipality} />
                    <InfoRow label="School Tole/Village" value={application.school_tole} />
                  </div>
                </div>

                {/* Permanent Address */}
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    Permanent Address
                  </h4>
                  <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                    <InfoRow label="Province" value={application.permanent_province} />
                    <InfoRow label="District" value={application.permanent_district} />
                    <InfoRow label="Municipality/RM" value={application.permanent_municipality} />
                    <InfoRow label="Ward No" value={application.permanent_ward} />
                    <InfoRow label="Tole/Village" value={application.permanent_tole} />
                  </div>
                </div>

                {/* Family Background */}
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    Family Background
                  </h4>
                  <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                    <InfoRow label="Parent's Name" value={application.guardian_name} />
                    <InfoRow label="Parent's Phone" value={application.guardian_phone} />
                    <InfoRow label="Father's Occupation" value={application.father_occupation} />
                    <InfoRow label="Mother's Occupation" value={application.mother_occupation} />
                    <InfoRow label="Family Monthly Income" value={application.family_monthly_income != null ? `NPR ${application.family_monthly_income.toLocaleString()}` : undefined} />
                    <InfoRow label="Total Family Members" value={application.family_members_count != null ? String(application.family_members_count) : undefined} />
                  </div>
                </div>

                {/* Submitted Documents */}
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    Submitted Documents
                  </h4>
                  <div className="space-y-3 p-4 bg-gray-50 rounded-xl min-h-[100px]">
                    {application.documents && application.documents.length > 0 ? (
                      application.documents.map((doc: any, index: number) => {
                        const isImage = doc.type?.startsWith("image/") || doc.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                        return (
                          <div key={index} className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg bg-white">
                            {isImage ? (
                              <ImageIcon className="w-5 h-5 text-blue-500 shrink-0" />
                            ) : (
                              <FileText className="w-5 h-5 text-red-500 shrink-0" />
                            )}
                            <a
                              href={toAbsoluteUrl(doc.url)}
                              download
                              className="flex-1 min-w-0 flex items-center gap-2 hover:text-blue-700"
                              title="Download"
                            >
                              <p className="text-xs font-medium text-gray-800 truncate">{doc.name || doc.title || "Document"}</p>
                              {doc.type && <p className="text-[10px] text-gray-400 shrink-0">{doc.type}</p>}
                            </a>
                            <a
                              href={toAbsoluteUrl(doc.url)}
                              download
                              className="p-1.5 hover:bg-blue-50 rounded text-blue-600 shrink-0"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-4">No documents submitted</p>
                    )}
                  </div>
                </div>

                {/* Payment Information */}
                {application.payment && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Payment Information
                    </h4>
                    <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                      <InfoRow label="Status" value={application.payment.status?.replace("_", " ")} />
                      <InfoRow label="Amount" value={application.payment.amount != null ? `Rs. ${application.payment.amount.toLocaleString()}` : undefined} />
                      <InfoRow label="Method" value={application.payment.method} />
                      <InfoRow label="Transaction ID" value={application.payment.transaction_id} />
                      <InfoRow label="Paid At" value={application.payment.paid_at ? new Date(application.payment.paid_at).toLocaleString() : undefined} />
                      {application.payment?.receipt_url && (
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500 mb-2">Payment Receipt</p>
                          <img
                            src={toAbsoluteUrl(application.payment.receipt_url)}
                            alt="Payment receipt"
                            className="max-h-32 rounded-lg cursor-pointer hover:opacity-80 border"
                            onClick={() => setPreviewImage(toAbsoluteUrl(application.payment?.receipt_url))}
                          />
                        </div>
                      )}
                      {application.payment?.status === "pending_approval" && (
                        <div className="pt-3 border-t border-gray-200 flex gap-2">
                          <button
                            onClick={() => handlePaymentApproval(true)}
                            disabled={savingStatus}
                            className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-semibold disabled:opacity-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5 inline mr-1" /> Approve Payment
                          </button>
                          <button
                            onClick={() => handlePaymentApproval(false)}
                            disabled={savingStatus}
                            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs font-semibold disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5 inline mr-1" /> Reject Payment
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Admit Card Details */}
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    Admit Card Details
                  </h4>
                  <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                    <InfoRow label="Stream" value={application.stream} />
                    <InfoRow label="Exam Center" value={application.exam_center} />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-gray-200">
                <button onClick={onClose} disabled={savingStatus} className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-6 rounded-lg transition text-sm">
                  Close
                </button>
                {application.status === "approved" && (
                  <button onClick={() => handleStatusChange("shortlisted")} disabled={savingStatus} className="border border-purple-300 hover:bg-purple-50 text-purple-700 font-medium py-2.5 px-6 rounded-lg transition text-sm flex items-center gap-2">
                    <Star className="w-4 h-4" /> Shortlist
                  </button>
                )}
                {(application.status === "pending" || application.status === "under_review") && (
                  <>
                    <button onClick={() => handleStatusChange("rejected")} disabled={savingStatus} className="border border-red-300 hover:bg-red-50 text-red-700 font-medium py-2.5 px-6 rounded-lg transition text-sm flex items-center gap-2">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                    <button onClick={() => handleStatusChange("approved")} disabled={savingStatus} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-lg transition text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {previewImage && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-2xl max-h-[90vh] mx-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPreviewImage(null)} className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-slate-600 hover:text-slate-900">
              <X className="w-4 h-4" />
            </button>
            <img src={previewImage} alt="Preview" className="max-w-full max-h-[85vh] rounded-lg shadow-2xl" />
          </div>
        </div>
      )}
    </>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value?: string | null; highlight?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <span className={`text-sm font-medium text-right ${highlight ? "text-green-600 font-bold" : "text-gray-900"}`}>{value}</span>
    </div>
  );
}
