"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, CloudUpload, File, X, Loader2 } from "lucide-react";
import EmptyTabState from "@/app/find-college/[id]/components/EmptyTabState";

interface AdmissionsTabProps {
  universityId: number;
  admissionsList: any[];
  officialNoticesList: any[];
}

export default function AdmissionsTab({
  universityId,
  admissionsList,
  officialNoticesList,
}: AdmissionsTabProps) {
  const [admissionsPage, setAdmissionsPage] = useState(1);
  const admissionsPerPage = 10;
  const [showDateReportModal, setShowDateReportModal] = useState(false);
  const [dateReportContact, setDateReportContact] = useState("");
  const [dateReportFeedback, setDateReportFeedback] = useState("");
  const [dateReportFile, setDateReportFile] = useState<File | null>(null);
  const [dateReportSubmitting, setDateReportSubmitting] = useState(false);
  const [dateReportError, setDateReportError] = useState("");
  const [dateReportSuccess, setDateReportSuccess] = useState(false);
  const [officialNoticePreview, setOfficialNoticePreview] = useState<string | null>(null);

  return (
    <div className="px-4 sm:px-0 space-y-8">
      <div className="overflow-hidden rounded-md border border-gray-100 bg-white">
        <div className="border-b border-gray-100 bg-[#f8fafc] px-6 py-4">
          <h3 className="flex items-center gap-2 text-[16px] font-bold text-gray-900">
            Admissions
          </h3>
        </div>
        {admissionsList.length > 0 ? (
          <>
            <div className="w-full overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-12 gap-2 border-b border-gray-100 bg-white px-6 py-5">
                  <div className="col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800">PROGRAM</div>
                  <div className="col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">OPENS</div>
                  <div className="col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">DEADLINE</div>
                  <div className="col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800">DESCRIPTION</div>
                  <div className="col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">ACTIONS</div>
                </div>
                <div className="divide-y divide-gray-100">
                  {admissionsList
                    .slice((admissionsPage - 1) * admissionsPerPage, admissionsPage * admissionsPerPage)
                    .map((ad: any, i: number) => (
                      <div key={i} className="grid grid-cols-12 gap-2 px-6 py-5 hover:bg-gray-50/50 items-center">
                        <div className="col-span-3">
                          <h4 className="text-[15.5px] font-bold text-gray-900">{ad.program || ad.title}</h4>
                          {ad.faculty && <p className="text-[13px] text-gray-500">{ad.faculty}</p>}
                        </div>
                        <div className="col-span-2 text-[14px] text-gray-600">{ad.opens_from || "-"}</div>
                        <div className="col-span-2 text-[14px] text-gray-600">{ad.deadline || "-"}</div>
                        <div className="col-span-3 text-[14px] text-gray-600">{ad.short_description || "-"}</div>
                        <div className="col-span-2">
                          <Link href={`/universities/${universityId}/affiliated-colleges`} className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700">
                            View Colleges
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            {admissionsList.length > admissionsPerPage && (
              <div className="flex items-center justify-between border-t border-gray-100 bg-white px-6 py-4">
                <p className="text-sm text-gray-600">
                  Showing {((admissionsPage - 1) * admissionsPerPage) + 1} to {Math.min(admissionsPage * admissionsPerPage, admissionsList.length)} of {admissionsList.length} admissions
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAdmissionsPage(p => Math.max(1, p - 1))}
                    disabled={admissionsPage === 1}
                    className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setAdmissionsPage(p => p + 1)}
                    disabled={admissionsPage * admissionsPerPage >= admissionsList.length}
                    className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyTabState tabName="Admissions" />
        )}
        {admissionsList.length > 0 && (
          <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-3">
            <p className="text-sm text-gray-600">Do you think the dates are wrong? Report here</p>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setShowDateReportModal(true)}
                className="rounded-md bg-red-50 px-4 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
              >
                Yes
              </button>
              <button className="rounded-md bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-200 transition-colors">
                No
              </button>
            </div>
          </div>
        )}
      </div>

      {officialNoticesList.length > 0 && (
        <div>
          <div className="mb-4">
            <p className="text-[15px] text-gray-700">
              The official notice is available below for your review.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {officialNoticesList.map((notice: any, i: number) => (
              <div
                key={i}
                className="bg-white border border-gray-100 hover:border-blue-500/20 rounded-md overflow-hidden cursor-pointer transition-all duration-300 group"
                onClick={() => setOfficialNoticePreview(notice.url)}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  <img
                    src={notice.url}
                    alt={`Official Notice ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {officialNoticePreview && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95"
          onClick={() => setOfficialNoticePreview(null)}
        >
          <button
            type="button"
            onClick={() => setOfficialNoticePreview(null)}
            className="absolute right-8 top-5 z-[1001] cursor-pointer text-[40px] text-white hover:text-gray-300"
          >
            &times;
          </button>
          <img
            src={officialNoticePreview}
            alt="Official Notice"
            className="max-h-[85vh] max-w-[90%] rounded-md object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {showDateReportModal && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50"
          onClick={() => {
            setShowDateReportModal(false);
            setDateReportContact("");
            setDateReportFeedback("");
            setDateReportFile(null);
            setDateReportError("");
            setDateReportSuccess(false);
          }}
        >
          <div
            className="mx-4 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Do you think the dates are wrong?
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Help us improve by reporting incorrect admission dates.
            </p>

            {dateReportSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="text-2xl text-green-500"></Check>
                </div>
                <p className="text-gray-700 font-medium">Thank you for your feedback!</p>
                <p className="text-sm text-gray-500 mt-1">We will review the dates shortly.</p>
                <button
                  onClick={() => {
                    setShowDateReportModal(false);
                    setDateReportContact("");
                    setDateReportFeedback("");
                    setDateReportFile(null);
                    setDateReportError("");
                    setDateReportSuccess(false);
                  }}
                  className="mt-6 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setDateReportError("");

                  if (!/^[0-9]{10}$/.test(dateReportContact) || !dateReportContact.startsWith("9")) {
                    setDateReportError("Contact number must be 10 digits starting with 9");
                    return;
                  }
                  if (dateReportFeedback.length < 20) {
                    setDateReportError("Feedback must be at least 20 characters");
                    return;
                  }

                  setDateReportSubmitting(true);
                  try {
                    const formData = new FormData();
                    formData.append("contact", dateReportContact);
                    formData.append("feedback", dateReportFeedback);
                    formData.append("university_id", String(universityId || ""));
                    if (dateReportFile) {
                      formData.append("file", dateReportFile);
                    }

                    const base = process.env.NEXT_PUBLIC_API_URL || "";
                    const res = await fetch(`${base}/api/v1/reports`, {
                      method: "POST",
                      body: formData,
                    });

                    if (!res.ok) {
                      const data = await res.json();
                      throw new Error(data.message || data.error || "Failed to submit report");
                    }

                    setDateReportSuccess(true);
                  } catch (err: any) {
                    setDateReportError(err?.message || "Failed to submit report. Please try again.");
                  } finally {
                    setDateReportSubmitting(false);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    pattern="[9][0-9]{9}"
                    placeholder="9XXXXXXXXX"
                    value={dateReportContact}
                    onChange={(e) => setDateReportContact(e.target.value.replace(/\D/g, ""))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-400">10 digits starting with 9</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Your Feedback
                  </label>
                  <textarea
                    rows={4}
                    minLength={20}
                    placeholder="Describe what dates you think are wrong..."
                    value={dateReportFeedback}
                    onChange={(e) => setDateReportFeedback(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    {dateReportFeedback.length}/20 min characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Attach File (optional)
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer bg-gray-50 border border-dashed border-gray-300 rounded-md px-4 py-3 hover:border-blue-400 transition-colors">
                    <CloudUpload className="text-gray-400"></CloudUpload>
                    <span className="text-sm text-gray-600">
                      {dateReportFile ? dateReportFile.name : "Upload image or document"}
                    </span>
                    <input
                      type="file"
                      accept="image/*,.pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setDateReportFile(file);
                      }}
                    />
                  </label>
                  {dateReportFile && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <File className="text-blue-500"></File>
                      <span className="truncate">{dateReportFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setDateReportFile(null)}
                        className="text-red-400 hover:text-red-600 ml-auto"
                      >
                        <X className="h-4 w-4"></X>
                      </button>
                    </div>
                  )}
                </div>

                {dateReportError && (
                  <p className="text-sm text-red-500">{dateReportError}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDateReportModal(false);
                      setDateReportContact("");
                      setDateReportFeedback("");
                      setDateReportFile(null);
                      setDateReportError("");
                    }}
                    className="flex-1 rounded-md border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={dateReportSubmitting}
                    className="flex-1 rounded-md bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {dateReportSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin"></Loader2>
                        Submitting...
                      </>
                    ) : (
                      "Submit Report"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
