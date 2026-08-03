"use client";

import React, { useState } from "react";
import { JobApplication, careersApi } from "@/services/api";
import { X, FileText, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import JobEmailDialog from "./JobEmailDialog";

interface ReviewApplicantModalProps {
  applicant: JobApplication;
  onClose: () => void;
  onUpdated: () => void;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  shortlisted: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  reviewed: "bg-purple-100 text-purple-700",
};

export default function ReviewApplicantModal({
  applicant,
  onClose,
  onUpdated,
}: ReviewApplicantModalProps) {
  const [notes, setNotes] = useState(applicant.notes || "");
  const [saving, setSaving] = useState(false);
  const [emailDialog, setEmailDialog] = useState<{
    open: boolean;
    action: "shortlist" | "reject";
  }>({ open: false, action: "shortlist" });

  const handleStatusUpdate = async (status: string, emailNotes?: string) => {
    setSaving(true);
    try {
      await careersApi.updateApplicantStatus(applicant.id, status, emailNotes || notes);
      toast.success(`Applicant ${status}`);
      onUpdated();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const handleShortlist = () => {
    setEmailDialog({ open: true, action: "shortlist" });
  };

  const handleReject = () => {
    setEmailDialog({ open: true, action: "reject" });
  };

  const handleEmailSend = async (subject: string, body: string) => {
    setSaving(true);
    try {
      const newStatus = emailDialog.action === "shortlist" ? "shortlisted" : "rejected";
      await careersApi.sendApplicantEmail(applicant.id, subject, body, newStatus);
      toast.success(`Applicant ${newStatus} and email sent`);
      onUpdated();
    } catch {
      toast.error("Failed to send email");
    } finally {
      setSaving(false);
    }
  };

  const handleEmailSkip = async () => {
    const newStatus = emailDialog.action === "shortlist" ? "shortlisted" : "rejected";
    await handleStatusUpdate(newStatus);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">
              Review Applicant
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Name
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {applicant.full_name}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Email
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {applicant.email}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Phone
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {applicant.phone || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Applied
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(applicant.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Status
                </p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    statusColors[applicant.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {applicant.status}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                Documents
              </p>
              <div className="flex gap-3">
                {applicant.has_resume && (
                  <a
                    href={careersApi.getResumeUrl(applicant.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Resume
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {applicant.has_cover_letter && (
                  <a
                    href={careersApi.getCoverLetterUrl(applicant.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Cover Letter
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {!applicant.has_resume && !applicant.has_cover_letter && (
                  <p className="text-sm text-gray-400">No documents uploaded</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">
                Internal Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-600 outline-none resize-none"
                placeholder="Add notes about this applicant..."
              />
              <button
                onClick={() => handleStatusUpdate(applicant.status)}
                disabled={saving}
                className="mt-2 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
              >
                Save Notes
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleReject}
              disabled={saving}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              Reject
            </button>
            <button
              onClick={handleShortlist}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Shortlist
            </button>
          </div>
        </div>
      </div>

      {emailDialog.open && (
        <JobEmailDialog
          applicantName={applicant.full_name}
          applicantEmail={applicant.email}
          action={emailDialog.action}
          onSend={handleEmailSend}
          onSkip={handleEmailSkip}
          onCancel={() => setEmailDialog({ open: false, action: "shortlist" })}
        />
      )}
    </>
  );
}
