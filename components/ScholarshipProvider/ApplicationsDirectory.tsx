"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Home, Star, Search, Eye, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { scholarshipProviderApi, ProviderApplication } from "@/services/scholarshipProviderApi";
import { toast } from "sonner";
import ApplicantProfileModal from "./ApplicantProfileModal";

const GENDER_OPTIONS = ["Male", "Female"];
const ETHNICITY_OPTIONS = ["Bahun", "Chhetri", "Magar", "Tamang", "Gurung", "Rai", "Tharu", "Sherpa", "Madhesi", "Dalit"];
const PROVINCE_OPTIONS = ["Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"];
const DISTRICT_OPTIONS = ["Kathmandu", "Lalitpur", "Kaski", "Chitwan", "Morang", "Sunsari", "Rupandehi", "Dhanusha", "Surkhet", "Solukhumbu"];
const SCHOOL_TYPE_OPTIONS = ["Private", "Public", "Community"];
const STATUS_OPTIONS = ["Pending", "Shortlisted", "Approved", "Rejected"];

export default function ApplicationsDirectory() {
  const [applications, setApplications] = useState<ProviderApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterEthnicity, setFilterEthnicity] = useState("");
  const [filterProvince, setFilterProvince] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterSchool, setFilterSchool] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterExamCenter, setFilterExamCenter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'all' | 'pending' | 'completed' | 'pending_approval'>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [isApproveAction] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showAppRejectModal, setShowAppRejectModal] = useState(false);
  const [appRejectReason, setAppRejectReason] = useState('');
  const [rejectingAppId, setRejectingAppId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await scholarshipProviderApi.getApplications({
          page,
          limit,
          search: search || undefined,
          gender: filterGender || undefined,
          ethnicity: filterEthnicity || undefined,
          province: filterProvince || undefined,
          district: filterDistrict || undefined,
          school_type: filterSchool || undefined,
          status: filterStatus?.toLowerCase() || undefined,
          exam_center: filterExamCenter || undefined,
          payment_status: paymentStatusFilter !== 'all' ? paymentStatusFilter : undefined,
        });
        setApplications(res.applications);
        setTotal(res.meta.total);
      } catch {
        setApplications([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [page, search, filterGender, filterEthnicity, filterProvince, filterDistrict, filterSchool, filterStatus, filterExamCenter, paymentStatusFilter]);

  const handleConfirmPayment = async () => {
    if (!selectedAppId) return;
    try {
      await scholarshipProviderApi.approvePayment(selectedAppId, isApproveAction, rejectionReason);
      setApplications((prev) => prev.map((app) => 
        app.id === selectedAppId ? { 
          ...app, 
          payment: app.payment ? { ...app.payment, status: isApproveAction ? 'completed' : 'rejected' } : undefined
        } : app
      ));
      toast.success(isApproveAction ? 'Payment approved' : 'Payment rejected');
      setShowConfirmModal(false);
      setShowRejectModal(false);
      setSelectedAppId(null);
      setRejectionReason('');
    } catch {
      toast.error('Failed to process payment');
    }
  };

  const handleStatusChange = useCallback(async (id: number, newStatus: string) => {
    try {
      await scholarshipProviderApi.updateApplicationStatus(id, newStatus);
      setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)));
      toast.success('Status updated successfully');
    } catch {
      toast.error('Failed to update status');
    }
  }, []);

  const handleAppReject = (id: number) => {
    setRejectingAppId(id);
    setAppRejectReason('');
    setShowAppRejectModal(true);
  };

  const handleConfirmAppRejection = async () => {
    if (!rejectingAppId) return;
    try {
      await scholarshipProviderApi.updateApplicationStatus(rejectingAppId, 'rejected', appRejectReason);
      setApplications((prev) => prev.map((app) =>
        app.id === rejectingAppId ? { ...app, status: 'rejected' } : app
      ));
      toast.success('Application rejected');
      setShowAppRejectModal(false);
      setRejectingAppId(null);
      setAppRejectReason('');
    } catch {
      toast.error('Failed to reject application');
    }
  };

  const clearFilters = () => {
    setSearch("");
    setFilterGender("");
    setFilterEthnicity("");
    setFilterProvince("");
    setFilterDistrict("");
    setFilterSchool("");
    setFilterStatus("");
    setFilterExamCenter("");
    setPaymentStatusFilter("all");
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);
  const appId = (id: number) => `#APP-2026-${String(id).padStart(3, "0")}`;

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      shortlisted: "bg-purple-100 text-purple-700",
      rejected: "bg-red-100 text-red-700",
    };
    return map[status] || "bg-gray-100 text-gray-700";
  };

  const statusLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Manage Application</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Manage Application</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Home className="w-5 h-5 text-blue-600" /> Application Directory
          </h2>
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
              placeholder="Search by name, phone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <span className="text-xs font-semibold text-gray-700 mr-1">Filters:</span>

          <select value={filterGender} onChange={(e) => { setFilterGender(e.target.value); setPage(1); }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-500">
            <option value="">All Gender</option>
            {GENDER_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={filterEthnicity} onChange={(e) => { setFilterEthnicity(e.target.value); setPage(1); }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-500">
            <option value="">All Ethnicity</option>
            {ETHNICITY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={filterProvince} onChange={(e) => { setFilterProvince(e.target.value); setPage(1); }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-500">
            <option value="">All Province</option>
            {PROVINCE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={filterDistrict} onChange={(e) => { setFilterDistrict(e.target.value); setPage(1); }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-500">
            <option value="">All District</option>
            {DISTRICT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={filterSchool} onChange={(e) => { setFilterSchool(e.target.value); setPage(1); }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-500">
            <option value="">All School Type</option>
            {SCHOOL_TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-500">
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={filterExamCenter} onChange={(e) => { setFilterExamCenter(e.target.value); setPage(1); }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-500">
            <option value="">All Centers</option>
            {[...new Set(applications.map((a) => a.exam_center).filter(Boolean))].sort().map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={paymentStatusFilter} onChange={(e) => { setPaymentStatusFilter(e.target.value as 'all' | 'pending' | 'completed' | 'pending_approval'); setPage(1); }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-500">
            <option value="all">All Payment</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="pending_approval">Pending Approval</option>
          </select>
          <button onClick={clearFilters} className="text-xs text-blue-600 font-medium hover:underline">Clear All</button>
            <span className="text-xs text-gray-400 ml-auto">{applications.length} of {total} applications</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading applications...</div>
        ) : (
          <>
            <div className="overflow-x-auto" style={{ maxWidth: "100%" }}>
              <table className="w-full text-sm" style={{ minWidth: "1800px" }}>
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-center py-3 px-3 w-10"><input type="checkbox" className="rounded" /></th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">App ID</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">Roll No</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-700">Full Name</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">Gender</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">Ethnicity</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">Province</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">District</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">Stream</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">Exam Center</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">GPA</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">School Type</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">Admit Card</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">Payment</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">Final Status</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.length === 0 ? (
                    <tr><td colSpan={16} className="py-8 text-center text-slate-500">No applications found</td></tr>
                  ) : applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="text-center py-3 px-3"><input type="checkbox" className="rounded" /></td>
                      <td className="text-center py-3 px-3 font-mono font-medium text-blue-600">{appId(app.id)}</td>
                      <td className="text-center py-3 px-3 font-mono font-medium text-gray-700">{app.roll_number || "—"}</td>
                      <td className="py-3 px-3 font-medium text-gray-900">{app.first_name} {app.last_name}</td>
                      <td className="text-center py-3 px-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${app.gender === "Female" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700"}`}>{app.gender || "N/A"}</span>
                      </td>
                      <td className="text-center py-3 px-3 text-gray-600">{app.ethnicity || "-"}</td>
                      <td className="text-center py-3 px-3 text-gray-600">{app.province || "-"}</td>
                      <td className="text-center py-3 px-3 text-gray-600">{app.district || "-"}</td>
                      <td className="text-center py-3 px-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${app.stream === "Management" ? "bg-indigo-100 text-indigo-700" : "bg-cyan-100 text-cyan-700"}`}>{app.stream || "N/A"}</span>
                      </td>
                      <td className="text-center py-3 px-3 text-gray-600">{app.exam_center || "-"}</td>
                      <td className="text-center py-3 px-3 font-bold text-green-600">{app.gpa?.toFixed(2) || "-"}</td>
                      <td className="text-center py-3 px-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          app.school_type === "Private" ? "bg-blue-100 text-blue-700" :
                          app.school_type === "Public" ? "bg-green-100 text-green-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>{app.school_type || "N/A"}</span>
                      </td>
                      <td className="text-center py-3 px-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          app.payment?.status === "completed" ? "bg-green-100 text-green-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>{app.payment?.status === "completed" ? "Sent" : "Pending"}</span>
                      </td>
                      <td className="text-center py-3 px-3">
                        {(() => {
                          const status = app.payment?.status;
                          const colors: Record<string, string> = {
                            pending: 'bg-yellow-100 text-yellow-800',
                            completed: 'bg-green-100 text-green-800',
                            pending_approval: 'bg-blue-100 text-blue-800',
                            rejected: 'bg-red-100 text-red-800',
                          };
                          return status ? (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status] || 'bg-gray-100'}`}>
                              {status.replace('_', ' ')}
                            </span>
                          ) : '-';
                        })()}
                      </td>
                      <td className="text-center py-3 px-3">
                        <span className={`${statusBadge(app.status)} px-2 py-1 rounded text-xs font-semibold`}>{statusLabel(app.status)}</span>
                      </td>
                      <td className="text-center py-3 px-3">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => setSelectedApplicantId(app.id)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="View Profile">
                            <Eye className="w-4 h-4" />
                          </button>
                          {(app.status === "pending" || app.status === "under_review") && (
                            <>
                              <button onClick={() => handleStatusChange(app.id, "approved")} className="p-1.5 hover:bg-green-50 rounded text-green-600" title="Approve">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleAppReject(app.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Reject">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {app.status === "approved" && (
                            <button onClick={() => handleStatusChange(app.id, "shortlisted")} className="p-1.5 hover:bg-purple-50 rounded text-purple-600" title="Shortlist">
                              <Star className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500">Showing <span className="font-medium">{(page - 1) * limit + 1}-{Math.min(page * limit, total)}</span> of <span className="font-medium">{total.toLocaleString()}</span> applications</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {(() => {
                  const pages: (number | string)[] = [];
                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    pages.push(1);
                    if (page > 3) pages.push('...');
                    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
                    if (page < totalPages - 2) pages.push('...');
                    pages.push(totalPages);
                  }
                  return pages.map((p, i) =>
                    typeof p === 'string' ? (
                      <span key={`e-${i}`} className="text-gray-400 px-1">...</span>
                    ) : (
                      <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${p === page ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{p}</button>
                    )
                  );
                })()}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedReceipt(null)}>
          <div className="bg-white p-4 rounded max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <img src={selectedReceipt} alt="Receipt" className="max-h-96" />
            <button onClick={() => setSelectedReceipt(null)} className="mt-4 px-4 py-2 bg-gray-600 text-white rounded">
              Close
            </button>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Payment Approval</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to approve this payment?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleConfirmPayment} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reject Payment</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejection:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:border-blue-500"
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleConfirmPayment} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {showAppRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reject Application</h3>
            <p className="text-gray-600 mb-4">Provide a reason for rejecting this application (max 250 characters):</p>
            <textarea
              value={appRejectReason}
              onChange={(e) => e.target.value.length <= 250 && setAppRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:border-blue-500"
              rows={3}
              maxLength={250}
            />
            <p className="text-right text-xs text-gray-400 mb-4">{appRejectReason.length}/250</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAppRejectModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleConfirmAppRejection} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Applicant Profile Modal */}
      {selectedApplicantId && (
        <ApplicantProfileModal
          applicationId={selectedApplicantId}
          onClose={() => setSelectedApplicantId(null)}
          onStatusUpdate={() => {
            scholarshipProviderApi.getApplications({
              page, limit,
              search: search || undefined,
              gender: filterGender || undefined,
              ethnicity: filterEthnicity || undefined,
              province: filterProvince || undefined,
              district: filterDistrict || undefined,
              school_type: filterSchool || undefined,
              status: filterStatus?.toLowerCase() || undefined,
              exam_center: filterExamCenter || undefined,
              payment_status: paymentStatusFilter !== 'all' ? paymentStatusFilter : undefined,
            }).then((res) => {
              setApplications(res.applications);
              setTotal(res.meta.total);
            }).catch(() => {});
          }}
        />
      )}
    </div>
  );
}
