"use client";
import React, { useState, useEffect, useCallback } from "react";
import SectionHeader from "../shared/SectionHeader";
import {
  Megaphone,
  PaperPlaneRight,
  ArrowsClockwise,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { apiRequest } from "@/services/api";
import {
  ADVERTISE_FOR_OPTIONS,
  advertiseForLabel,
} from "@/services/advertiseForOptions";

interface AdRequest {
  id: number;
  name: string;
  designation: string;
  contact: string;
  email: string;
  advertise_for: string;
  status: string;
  admin_note?: string;
  created_at: string;
}

const inputClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-600 outline-none transition-colors bg-white";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    declined: "bg-red-100 text-red-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
};

const formatDate = (value: string) => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ManageAdvertisementPage: React.FC = () => {
  // ── Form state ────────────────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [advertiseFor, setAdvertiseFor] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // ── Requests list state ───────────────────────────────────────────────────
  const [requests, setRequests] = useState<AdRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");

  // Prefill email from the logged-in institution user stored at login.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("institutionUser");
      if (stored) {
        const user = JSON.parse(stored);
        if (user?.email) setEmail(String(user.email));
        if (user?.name) setName(String(user.name));
      }
    } catch {
      // ignore malformed stored user
    }
  }, []);

  // ── API (apiRequest auto-attaches the institution token for /institution
  //    paths; we pass it explicitly for clarity, mirroring adminAdApi) ──────
  const getToken = () =>
    typeof window !== "undefined"
      ? localStorage.getItem("institutionToken")
      : null;
  const authOption = () => {
    const token = getToken();
    return token ? { authToken: token } : {};
  };

  const loadRequests = useCallback(async (isRefresh = false) => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    if (isRefresh) setRefreshing(true);
    try {
      const data = await apiRequest<{
        data?: AdRequest[];
      }>("/api/v1/institution/ad-requests", authOption());
      setRequests(Array.isArray(data?.data) ? data.data : []);
      setLoadError("");
    } catch (e) {
      setLoadError(
        e instanceof Error && e.message
          ? e.message
          : "Failed to load your requests.",
      );
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, boolean> = {};
    if (!name.trim()) errs.name = true;
    if (!advertiseFor) errs.advertiseFor = true;
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Please fill in the required fields.");
      return;
    }

    setSaving(true);
    try {
      await apiRequest("/api/v1/institution/ad-requests", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          designation: designation.trim(),
          contact: contact.trim(),
          email: email.trim(),
          advertise_for: advertiseFor,
          ...(note.trim() ? { note: note.trim() } : {}),
        }),
        ...authOption(),
      });
      toast.success("Advertisement request submitted.");
      setName("");
      setDesignation("");
      setContact("");
      setNote("");
      // keep email prefill — most requests come from the same person
      setAdvertiseFor("");
      setErrors({});
      await loadRequests(true);
    } catch (e) {
      toast.error(
        e instanceof Error && e.message ? e.message : "Failed to submit request.",
      );
    } finally {
      setSaving(false);
    }
  };

  const fieldError = (field: string) =>
    errors[field] ? "ring-2 ring-red-500" : "";

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Manage Advertisement"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard/overview" },
          { label: "Manage Advertisement" },
        ]}
      />

      <div className="space-y-6">
        {/* Request Advertisement form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Request Advertisement
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Request an advertisement placement — the site admin reviews and
                approves it before it goes live.
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`${inputClass} ${fieldError("name")}`}
                  placeholder="e.g. John Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Designation</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="e.g. Marketing Officer"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Contact Number</label>
                <input
                  type="tel"
                  className={inputClass}
                  placeholder="e.g. 98XXXXXXXX"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  className={inputClass}
                  placeholder="e.g. marketing@institution.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Defaults to your account email
                </p>
              </div>
              <div>
                <label className={labelClass}>
                  Advertise For <span className="text-red-500">*</span>
                </label>
                <select
                  className={inputClass}
                  value={advertiseFor}
                  onChange={(e) => setAdvertiseFor(e.target.value)}
                >
                  <option value="">Select placement</option>
                  {ADVERTISE_FOR_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Note (optional)</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Anything the admin should know"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
              >
                <PaperPlaneRight
                  className={saving ? "opacity-70" : ""}
                  size={18}
                />
                {saving ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>

        {/* Your requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <MagnifyingGlass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-800">
                  Your Requests
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  All advertisement requests submitted for your institution
                </p>
              </div>
            </div>
            <button
              onClick={() => loadRequests(true)}
              disabled={refreshing}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors shadow-sm shrink-0 disabled:opacity-60"
            >
              <ArrowsClockwise
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">Loading...</p>
            </div>
          ) : loadError ? (
            <div className="text-center py-12">
              <p className="text-sm text-red-500">{loadError}</p>
              <button
                onClick={() => loadRequests(true)}
                className="text-sm text-blue-600 hover:text-blue-800 mt-2"
              >
                Try again
              </button>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
                <Megaphone className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">
                No advertisement requests yet
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Submit your first request above and it will appear here once the
                admin reviews it.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">
                      Advertise For
                    </th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">
                      Submitted
                    </th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">
                      Admin Note
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3.5 font-medium text-gray-800">
                        {advertiseForLabel(r.advertise_for)}
                      </td>
                      <td className="px-6 py-3.5 text-gray-600">
                        {formatDate(r.created_at)}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusBadge(r.status)}`}
                        >
                          {r.status || "pending"}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-gray-600">
                        {r.admin_note ? (
                          r.admin_note
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAdvertisementPage;
