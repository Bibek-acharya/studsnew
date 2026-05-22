"use client";

import React, { useEffect, useState } from "react";
import { Home, Search, ChevronLeft, ChevronRight, Eye, CheckCircle, XCircle } from "lucide-react";
import { scholarshipProviderApi, ProviderApplication } from "@/services/scholarshipProviderApi";
import { toast } from "sonner";
import ApplicantProfileModal from "./ApplicantProfileModal";

export default function PaymentDisputes() {
  const [applications, setApplications] = useState<ProviderApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    scholarshipProviderApi.getPendingPaymentApplications({
      page, limit,
      search: search || undefined,
    }).then((res) => {
      setApplications(res.applications);
      setTotal(res.meta.total);
    }).catch(() => {
      setApplications([]);
    }).finally(() => {
      setLoading(false);
    });
  }, [page, search]);

  const handleApprovePayment = async (id: number) => {
    try {
      await scholarshipProviderApi.approvePayment(id, true);
      toast.success("Payment approved");
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch {
      toast.error("Failed to approve payment");
    }
  };

  const handleRejectPayment = async (id: number) => {
    try {
      await scholarshipProviderApi.approvePayment(id, false);
      toast.success("Payment rejected");
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch {
      toast.error("Failed to reject payment");
    }
  };

  const handleApproveApplication = async (id: number) => {
    try {
      await scholarshipProviderApi.updateApplicationStatus(id, "approved");
      toast.success("Application approved");
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch {
      toast.error("Failed to approve application");
    }
  };

  const handleRejectApplication = async (id: number) => {
    try {
      await scholarshipProviderApi.updateApplicationStatus(id, "rejected");
      toast.success("Application rejected");
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch {
      toast.error("Failed to reject application");
    }
  };

  const handleUpdateDisputeStatus = async (id: number, status: string) => {
    try {
      await scholarshipProviderApi.updateDisputeStatus(id, status);
      setApplications((prev) => prev.map((a) =>
        a.id === id ? { ...a, payment: a.payment ? { ...a.payment, dispute_status: status } : a.payment } : a
      ));
    } catch {
      toast.error("Failed to update dispute status");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Payment Disputes</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Payment Disputes</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Home className="w-5 h-5 text-blue-600" /> Pending Payment Applications
          </h2>
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">S.N</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-700">Full Name</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">Payment Status</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">Amount</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">Receipt</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">Dispute Status</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.length === 0 ? (
                    <tr><td colSpan={7} className="py-12 text-center text-slate-500">No pending payment applications found</td></tr>
                  ) : applications.map((app, i) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="text-center py-3 px-3 text-gray-500">{(page - 1) * limit + i + 1}</td>
                      <td className="py-3 px-3 font-medium text-gray-900">
                        <button onClick={() => setSelectedApplicantId(app.id)} className="text-blue-600 hover:underline text-left">
                          {app.first_name} {app.last_name}
                        </button>
                      </td>
                      <td className="text-center py-3 px-3">
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800">Pending</span>
                      </td>
                      <td className="text-center py-3 px-3 font-medium text-gray-700">
                        {app.payment?.amount ? `Rs. ${app.payment.amount}` : "-"}
                      </td>
                      <td className="text-center py-3 px-3">
                        {app.payment?.receipt_url ? (
                          <a
                            href={app.payment.receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-xs"
                          >
                            View Receipt
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="text-center py-3 px-3">
                        <select
                          value={app.payment?.dispute_status || "pending"}
                          onChange={(e) => handleUpdateDisputeStatus(app.id, e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="called">Called</option>
                          <option value="no_response">No Response</option>
                          <option value="follow_up_required">Follow-up Required</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="text-center py-3 px-3">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setSelectedApplicantId(app.id)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="View Profile">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleApprovePayment(app.id)} className="p-1.5 hover:bg-green-50 rounded text-green-600" title="Approve Payment">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleRejectPayment(app.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Reject Payment">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{(page - 1) * limit + 1}-{Math.min(page * limit, total)}</span> of <span className="font-medium">{total.toLocaleString()}</span>
              </p>
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
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedApplicantId && (
        <ApplicantProfileModal
          applicationId={selectedApplicantId}
          onClose={() => setSelectedApplicantId(null)}
          onStatusUpdate={() => {
            scholarshipProviderApi.getPendingPaymentApplications({ page, limit, search: search || undefined }).then((res) => {
              setApplications(res.applications);
              setTotal(res.meta.total);
            }).catch(() => {});
          }}
        />
      )}
    </div>
  );
}
