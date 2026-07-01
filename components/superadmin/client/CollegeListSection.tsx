"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Building2,
  Plus,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ShieldOff,
  Trash2,
  Eye,
  CreditCard,
  MessageSquare,
  CheckCircle,
  Clock,
  Phone,
  CircleAlert,
  Loader2,
  RefreshCw,
  MapPin,
  Mail,
  Check,
  X,
  DollarSign,
  CalendarDays,
  Edit,
  Star,
} from "lucide-react";
import { NEPAL_PROVINCES } from "@/lib/location-data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Subscription {
  status: string;
  start_date: string | null;
  expire_date: string | null;
  last_payment_date: string | null;
  last_payment_amount: number;
  remarks: string;
}

interface Institution {
  id: number;
  institution_name: string;
  email: string;
  contact_number: string;
  registration_number: string;
  pan_number: string;
  website_url: string;
  province: string;
  district: string;
  local_body: string;
  organization_type: string;
  contact_person: string;
  contact_person_designation: string;
  contact_person_phone: string;
  level: string;
  affiliation: string;
  claimed: boolean;
  verified: boolean;
  verified_by: string;
  verified_at: string | null;
  status: string;
  created_at: string;
  logo_url: string;
  featured?: boolean;
  subscription: Subscription | null;
}

interface ListResponse {
  institutions: Institution[];
  counts: Record<string, number>;
}

interface ApiResponse {
  data: ListResponse;
  message: string;
}

const LEVELS = ["all", "+2", "Bachelor", "A Level", "CTEVT", "Master"];

const PROVINCES = NEPAL_PROVINCES;

const PAYMENT_STATUSES = [
  { value: "", label: "All Payment Status" },
  { value: "paid", label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
  { value: "pending", label: "Pending" },
  { value: "follow_up", label: "Follow Up" },
];

const VERIFICATION_STATUSES = [
  { value: "", label: "All Verification" },
  { value: "verified", label: "Verified" },
  { value: "not_verified", label: "Not Verified" },
];

const CLAIM_STATUSES = [
  { value: "", label: "All Claim Status" },
  { value: "claimed", label: "Claimed" },
  { value: "unclaimed", label: "Unclaimed" },
];

const ORGANIZATION_TYPES = [
  { value: "", label: "All Types" },
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "community", label: "Community" },
];

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

const LEVEL_STYLES: Record<string, string> = {
  "+2": "bg-green-100 text-green-700",
  Bachelor: "bg-blue-100 text-blue-700",
  "A Level": "bg-orange-100 text-orange-700",
  CTEVT: "bg-purple-100 text-purple-700",
  Master: "bg-indigo-100 text-indigo-700",
};

const TYPE_STYLES: Record<string, string> = {
  private: "bg-blue-100 text-blue-700",
  public: "bg-green-100 text-green-700",
  community: "bg-purple-100 text-purple-700",
};

const PAYMENT_STYLES: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
  follow_up: "bg-orange-100 text-orange-700",
};

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-sm";

async function superadminFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("superadmin_token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
  if (response.status === 401 || response.status === 403)
    throw new Error("auth_required");
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Unexpected response");
  }
  if (!response.ok)
    throw new Error(data.message || data.error || "Request failed");
  return data as T;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getInitialsColors(name: string): string {
  const colors = [
    "from-blue-400 to-blue-600",
    "from-purple-400 to-purple-600",
    "from-orange-400 to-orange-600",
    "from-green-400 to-green-600",
    "from-pink-400 to-pink-600",
    "from-teal-400 to-teal-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function getExpireStatus(expireDate: string | null): {
  label: string;
  style: string;
  date: string;
} {
  if (!expireDate) return { label: "N/A", style: "text-gray-400", date: "-" };
  const d = new Date(expireDate);
  const now = new Date();
  const daysLeft = Math.floor(
    (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  const dateStr = formatDate(expireDate);
  if (daysLeft < 0)
    return { label: "Expired", style: "text-red-600", date: dateStr };
  if (daysLeft <= 30)
    return { label: "Expires soon", style: "text-orange-600", date: dateStr };
  return { label: "Active", style: "text-green-600", date: dateStr };
}

export default function CollegeListSection({
  setActiveSection,
}: {
  setActiveSection: (s: string) => void;
}) {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("");
  const [claimFilter, setClaimFilter] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("");

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [levelCounts, setLevelCounts] = useState<Record<string, number>>({});

  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    institution: Institution | null;
  }>({ open: false, institution: null });
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [paidForDays, setPaidForDays] = useState(365);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentRemarks, setPaymentRemarks] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: "suspend" | "delete" | "verify" | "feature";
    institutionId: number | null;
    institutionName: string;
  }>({
    open: false,
    title: "",
    message: "",
    action: "delete",
    institutionId: null,
    institutionName: "",
  });

  const [actionMsg, setActionMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchInstitutions = useCallback(
    async (filters?: {
      search?: string;
      type?: string;
      paymentStatus?: string;
      verification?: string;
      claim?: string;
      province?: string;
      level?: string;
    }) => {
      setLoading(true);
      setAuthError(false);
      try {
        const params = new URLSearchParams();
        const f = filters || {};
        if (f.search) params.set("search", f.search);
        if (f.type) params.set("type", f.type);
        if (f.paymentStatus) params.set("payment_status", f.paymentStatus);
        if (f.verification) params.set("verification", f.verification);
        if (f.claim) params.set("claim", f.claim);
        if (f.province) params.set("province", f.province);
        if (f.level) params.set("level", f.level);
        const qs = params.toString();
        const response = await superadminFetch<ApiResponse>(
          `/api/v1/superadmin/institutions${qs ? `?${qs}` : ""}`,
        );
        setInstitutions(response.data?.institutions || []);
        setLevelCounts(response.data?.counts || {});
      } catch (error) {
        if (error instanceof Error && error.message === "auth_required")
          setAuthError(true);
        else console.error("Failed to fetch institutions:", error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const refreshWithCurrentFilters = useCallback(() => {
    fetchInstitutions({
      search: searchQuery,
      type: typeFilter,
      paymentStatus: paymentFilter,
      verification: verificationFilter,
      claim: claimFilter,
      province: provinceFilter,
      level: activeTab === "all" ? undefined : activeTab,
    });
  }, [
    searchQuery,
    typeFilter,
    paymentFilter,
    verificationFilter,
    claimFilter,
    provinceFilter,
    activeTab,
    fetchInstitutions,
  ]);

  useEffect(() => {
    refreshWithCurrentFilters();
  }, [refreshWithCurrentFilters]);

  const totalInstitutions = institutions.length;

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    typeFilter,
    paymentFilter,
    verificationFilter,
    claimFilter,
    provinceFilter,
  ]);

  useEffect(() => {
    setSelectAll(false);
    setSelectedIds(new Set());
  }, [currentPage, perPage]);

  const filtered = institutions;
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );
  const startRecord =
    filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endRecord = Math.min(currentPage * perPage, filtered.length);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set());
      setSelectAll(false);
    } else {
      const ids = new Set(paginated.map((i) => i.id));
      setSelectedIds(ids);
      setSelectAll(true);
    }
  };

  const handleSelectOne = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
    setSelectAll(next.size === paginated.length && paginated.length > 0);
  };

  const showActionMsg = (type: "success" | "error", text: string) => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg(null), 4000);
  };

  const handleOpenPayment = (inst: Institution) => {
    setPaymentDate(new Date().toISOString().split("T")[0]);
    setPaidForDays(365);
    setPaymentAmount(0);
    setPaymentRemarks("");
    setPaymentModal({ open: true, institution: inst });
  };

  const handleSubmitPayment = async () => {
    const inst = paymentModal.institution;
    if (!inst || !paymentDate || paidForDays <= 0) return;
    setPaymentProcessing(true);
    try {
      await superadminFetch(
        `/api/v1/superadmin/institutions/${inst.id}/payment`,
        {
          method: "PUT",
          body: JSON.stringify({
            payment_date: paymentDate,
            paid_for_days: paidForDays,
            amount: paymentAmount,
            remarks: paymentRemarks,
          }),
        },
      );
      setPaymentModal({ open: false, institution: null });
      showActionMsg("success", `Payment recorded for ${inst.institution_name}`);
      refreshWithCurrentFilters();
    } catch (e) {
      showActionMsg("error", "Failed to record payment");
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleOpenSuspend = (inst: Institution) => {
    setConfirmDialog({
      open: true,
      title: "Suspend Institution",
      message: `Are you sure you want to suspend "${inst.institution_name}"? This will revoke dashboard access for this institution.`,
      action: "suspend",
      institutionId: inst.id,
      institutionName: inst.institution_name,
    });
  };

  const handleOpenVerify = (inst: Institution) => {
    const action = inst.verified ? "unverify" : "verify";
    setConfirmDialog({
      open: true,
      title: `${action === "verify" ? "Verify" : "Unverify"} Institution`,
      message: `Are you sure you want to ${action} "${inst.institution_name}"?`,
      action: "verify",
      institutionId: inst.id,
      institutionName: inst.institution_name,
    });
  };

  const handleOpenFeature = (inst: Institution) => {
    setConfirmDialog({
      open: true,
      title: `${inst.featured ? "Unfeature" : "Feature"} Institution`,
      message: `Are you sure you want to ${inst.featured ? "unfeature" : "feature"} "${inst.institution_name}"?`,
      action: "feature",
      institutionId: inst.id,
      institutionName: inst.institution_name,
    });
  };

  const handleOpenDelete = (inst: Institution) => {
    setConfirmDialog({
      open: true,
      title: "Delete Institution",
      message: `Are you sure you want to permanently delete "${inst.institution_name}"? This action cannot be undone.`,
      action: "delete",
      institutionId: inst.id,
      institutionName: inst.institution_name,
    });
  };

  const handleConfirmAction = async () => {
    const id = confirmDialog.institutionId;
    if (!id) return;
    try {
      if (confirmDialog.action === "verify") {
        await superadminFetch(`/api/v1/superadmin/institutions/${id}/verify`, {
          method: "PUT",
        });
        showActionMsg(
          "success",
          `${confirmDialog.institutionName} verification status updated`,
        );
      } else if (confirmDialog.action === "suspend") {
        await superadminFetch(`/api/v1/superadmin/institutions/${id}/suspend`, {
          method: "PUT",
        });
        showActionMsg(
          "success",
          `${confirmDialog.institutionName} suspended successfully`,
        );
      } else if (confirmDialog.action === "feature") {
        await superadminFetch(`/api/v1/superadmin/institutions/${id}/feature`, {
          method: "PUT",
        });
        showActionMsg(
          "success",
          `${confirmDialog.institutionName} featured status updated`,
        );
      } else {
        await superadminFetch(`/api/v1/superadmin/institutions/${id}`, {
          method: "DELETE",
        });
        showActionMsg(
          "success",
          `${confirmDialog.institutionName} deleted successfully`,
        );
      }
      setConfirmDialog({ ...confirmDialog, open: false });
      refreshWithCurrentFilters();
    } catch (e) {
      showActionMsg("error", `Failed to ${confirmDialog.action} institution`);
    }
  };

  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Building2 size={48} className="mb-4 opacity-50" />
        <p className="text-lg font-medium text-gray-700">
          Authentication Required
        </p>
        <p className="text-sm mt-1 text-gray-500 mb-6">
          Please log in as Super Admin.
        </p>
        <button
          type="button"
          onClick={() => (window.location.href = "/superadmin/login")}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" /> College List
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all registered colleges
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("add-college")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Add College
          </button>
        </div>
      </div>

      {actionMsg && (
        <div
          className={`mb-4 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
            actionMsg.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {actionMsg.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <CircleAlert className="w-5 h-5 text-red-600" />
          )}
          {actionMsg.text}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6">
          {/* Level Tabs */}
          {/* <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 border-b border-gray-200">
            {LEVELS.map(level => {
              const count = level === "all" ? institutions.length : levelCounts[level] || 0;
              return (
                <button key={level} onClick={() => setActiveTab(level)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap flex items-center gap-2 transition-colors ${
                    activeTab === level
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}>
                  {level === "all" ? "All" : level}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === level ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
                  }`}>{count}</span>
                </button>
              );
            })}
          </div> */}

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by college name, reg. number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${inputClass} pl-10`}
                  style={{ paddingRight: "0.875rem" }}
                />
              </div>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={`${inputClass}`}
              style={{ width: "auto", minWidth: "150px" }}
            >
              {ORGANIZATION_TYPES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className={`${inputClass}`}
              style={{ width: "auto", minWidth: "150px" }}
            >
              {PAYMENT_STATUSES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className={`${inputClass}`}
              style={{ width: "auto", minWidth: "150px" }}
            >
              {VERIFICATION_STATUSES.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
            <select
              value={claimFilter}
              onChange={(e) => setClaimFilter(e.target.value)}
              className={`${inputClass}`}
              style={{ width: "auto", minWidth: "150px" }}
            >
              {CLAIM_STATUSES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className={`${inputClass}`}
              style={{ width: "auto", minWidth: "150px" }}
            >
              <option value="">All Province</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700">
                  <span className="font-semibold">{selectedIds.size}</span>{" "}
                  colleges selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="text-sm bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-1.5 px-3 rounded-lg transition flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" /> Send Email
                </button>
                <button
                  type="button"
                  className="text-sm bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-1.5 px-3 rounded-lg transition flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Verify Selected
                </button>
                <button
                  type="button"
                  className="text-sm bg-white border border-gray-200 hover:bg-gray-50 text-red-600 font-medium py-1.5 px-3 rounded-lg transition flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Building2 size={40} className="mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No colleges found</p>
              <p className="text-sm mt-1">
                Try adjusting your filters or add a new college.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm min-w-[2400px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs w-10">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs w-14">
                        S.N
                      </th>
                      <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs w-36">
                        Register Date
                      </th>
                      <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs w-64">
                        College Name
                      </th>
                      <th className="text-center py-3 px-3 font-semibold text-gray-700 text-xs w-28">
                        Type
                      </th>
                      <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs w-48">
                        Affiliation
                      </th>
                      <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs w-52">
                        Address
                      </th>
                      <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs w-40">
                        Contact Person
                      </th>
                      <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs w-44">
                        Email
                      </th>
                      <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs w-36">
                        Phone
                      </th>
                      <th className="text-center py-3 px-3 font-semibold text-gray-700 text-xs w-32">
                        Account Type
                      </th>
                      <th className="text-center py-3 px-3 font-semibold text-gray-700 text-xs w-28">
                        Claim Status
                      </th>
                      <th className="text-center py-3 px-3 font-semibold text-gray-700 text-xs w-28">
                        Verified
                      </th>
                      <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs w-36">
                        Verified By
                      </th>
                      <th className="text-center py-3 px-3 font-semibold text-gray-700 text-xs w-32">
                        Payment
                      </th>
                      <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs w-40">
                        Last Payment
                      </th>
                      <th className="text-center py-3 px-3 font-semibold text-gray-700 text-xs w-40">
                        Expire Date
                      </th>
                      <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs w-52">
                        Remarks
                      </th>
                      <th className="text-center py-3 px-3 font-semibold text-gray-700 text-xs w-44">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginated.map((inst, idx) => {
                      const sn = (currentPage - 1) * perPage + idx + 1;
                      const expireInfo = getExpireStatus(
                        inst.subscription?.expire_date || null,
                      );
                      return (
                        <tr
                          key={inst.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-3">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(inst.id)}
                              onChange={() => handleSelectOne(inst.id)}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-3 px-3 text-gray-600 text-xs">
                            {sn}
                          </td>
                          <td className="py-3 px-3 text-gray-600 text-xs">
                            <div>{formatDate(inst.created_at)}</div>
                            <div className="text-[10px] text-gray-400">
                              {formatTime(inst.created_at)}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              {inst.logo_url ? (
                                <img
                                  src={inst.logo_url}
                                  className="w-8 h-8 rounded-lg object-contain flex-shrink-0"
                                  alt=""
                                />
                              ) : (
                                <div
                                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getInitialsColors(inst.institution_name)} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}
                                >
                                  {getInitials(inst.institution_name)}
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-900 text-xs">
                                  {inst.institution_name}
                                </p>
                                <p className="text-[10px] text-gray-500">
                                  Reg: {inst.registration_number}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="text-center py-3 px-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${TYPE_STYLES[inst.organization_type] || "bg-gray-100 text-gray-700"}`}
                            >
                              {inst.organization_type || "-"}
                            </span>
                          </td>
                          {/* <td className="text-center py-3 px-3">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${LEVEL_STYLES[inst.level] || "bg-gray-100 text-gray-700"}`}>
                              {inst.level || "-"}
                            </span>
                          </td> */}
                          <td className="py-3 px-3 text-gray-600 text-xs">
                            {inst.affiliation || "-"}
                          </td>
                          <td className="py-3 px-3 text-gray-600 text-xs">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              <div>
                                <p>{inst.district || "-"}</p>
                                <p className="text-[10px] text-gray-400">
                                  {inst.local_body
                                    ? `Ward-${inst.local_body}, ${inst.province}`
                                    : inst.province || ""}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <p className="text-gray-900 text-xs font-medium">
                              {inst.contact_person || "-"}
                            </p>
                            <p className="text-gray-500 text-[10px]">
                              {inst.contact_person_designation || ""}
                            </p>
                          </td>
                          <td className="py-3 px-3 text-gray-600 text-xs">
                            {inst.email}
                          </td>
                          <td className="py-3 px-3 text-gray-600 text-xs">
                            {inst.contact_number ||
                              inst.contact_person_phone ||
                              "-"}
                          </td>
                          <td className="text-center py-3 px-3">
                            {inst.subscription?.expire_date &&
                            new Date(inst.subscription.expire_date) >
                              new Date() ? (
                              <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-semibold">
                                Premium
                              </span>
                            ) : (
                              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-semibold">
                                Free
                              </span>
                            )}
                          </td>
                          <td className="text-center py-3 px-3">
                            {inst.claimed ? (
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                                Claimed
                              </span>
                            ) : (
                              <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-semibold">
                                Unclaimed
                              </span>
                            )}
                          </td>
                          <td className="text-center py-3 px-3">
                            <button
                              type="button"
                              onClick={() => handleOpenVerify(inst)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${inst.verified ? "bg-green-600" : "bg-gray-200"}`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${inst.verified ? "translate-x-[18px]" : "translate-x-[2px]"}`}
                              />
                            </button>
                          </td>
                          <td className="py-3 px-3">
                            {inst.verified_by ? (
                              <>
                                <p className="text-gray-900 text-xs">
                                  {inst.verified_by}
                                </p>
                                {inst.verified_at && (
                                  <p className="text-gray-500 text-[10px]">
                                    {formatDate(inst.verified_at)}
                                  </p>
                                )}
                              </>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                          <td className="text-center py-3 px-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${PAYMENT_STYLES[inst.subscription?.status || ""] || "bg-gray-100 text-gray-700"}`}
                            >
                              {inst.subscription?.status
                                ? inst.subscription.status
                                    .replace("_", " ")
                                    .replace(/\b\w/g, (l) => l.toUpperCase())
                                : "N/A"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-gray-600 text-xs">
                            {inst.subscription?.last_payment_date ? (
                              <>
                                <div>
                                  {formatDate(
                                    inst.subscription.last_payment_date,
                                  )}
                                </div>
                                <div className="text-[10px] text-gray-400">
                                  Rs{" "}
                                  {inst.subscription.last_payment_amount.toLocaleString()}
                                </div>
                              </>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-gray-600 text-xs">
                            <div
                              className={`text-xs font-medium ${expireInfo.style}`}
                            >
                              {expireInfo.date}
                            </div>
                            <div className={`text-[10px] ${expireInfo.style}`}>
                              {expireInfo.label}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-gray-600 text-xs">
                            {inst.subscription?.remarks ? (
                              <div className="flex items-center gap-1">
                                {inst.subscription.remarks.includes(
                                  "verified",
                                ) ? (
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                ) : inst.subscription.remarks.includes(
                                    "awaiting",
                                  ) ? (
                                  <Clock className="w-3 h-3 text-yellow-500" />
                                ) : inst.subscription.remarks.includes(
                                    "call",
                                  ) ? (
                                  <Phone className="w-3 h-3 text-orange-500" />
                                ) : inst.subscription.remarks.includes(
                                    "reminder",
                                  ) ? (
                                  <CircleAlert className="w-3 h-3 text-red-500" />
                                ) : (
                                  <Clock className="w-3 h-3 text-gray-400" />
                                )}
                                <span className="text-xs">
                                  {inst.subscription.remarks}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                          <td className="text-center py-3 px-3">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                className="tooltip p-1.5 hover:bg-green-50 rounded text-green-600 transition-colors"
                                title="Message"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  window.open(
                                    `/find-college/${inst.id}`,
                                    "_blank",
                                  )
                                }
                                className="tooltip p-1.5 hover:bg-purple-50 rounded text-purple-600 transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenPayment(inst)}
                                className="tooltip p-1.5 hover:bg-yellow-50 rounded text-yellow-600 transition-colors"
                                title="Payment"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenSuspend(inst)}
                                className="tooltip p-1.5 hover:bg-orange-50 rounded text-orange-600 transition-colors"
                                title="Suspend"
                              >
                                <ShieldOff className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenFeature(inst)}
                                className={`tooltip p-1.5 rounded transition-colors ${inst.featured ? "text-amber-500 hover:bg-amber-50" : "text-gray-400 hover:bg-amber-50 hover:text-amber-500"}`}
                                title={inst.featured ? "Unfeature" : "Feature"}
                              >
                                <Star className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveSection(
                                    `edit-institution-${inst.id}`,
                                  )
                                }
                                disabled={inst.claimed}
                                className={`tooltip p-1.5 rounded transition-colors ${
                                  inst.claimed
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "hover:bg-indigo-50 text-indigo-600"
                                }`}
                                title={
                                  inst.claimed
                                    ? "Cannot edit - Institution is claimed"
                                    : "Edit"
                                }
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenDelete(inst)}
                                className="tooltip p-1.5 hover:bg-red-50 rounded text-red-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-wrap items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-500">
                    Showing{" "}
                    <span className="font-semibold text-gray-700">
                      {startRecord}-{endRecord}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-700">
                      {filtered.length}
                    </span>{" "}
                    colleges
                  </p>
                  <select
                    value={perPage}
                    onChange={(e) => {
                      setPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className={`${inputClass}`}
                    style={{
                      width: "auto",
                      padding: "0.5rem 2rem 0.5rem 0.75rem",
                    }}
                  >
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 7) pageNum = i + 1;
                    else if (currentPage <= 4) pageNum = i + 1;
                    else if (currentPage >= totalPages - 3)
                      pageNum = totalPages - 6 + i;
                    else pageNum = currentPage - 3 + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {paymentModal.open && paymentModal.institution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-yellow-600" /> Record
                  Payment
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {paymentModal.institution.institution_name}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setPaymentModal({ open: false, institution: null })
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className={`${inputClass}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paid For (Days)
                </label>
                <input
                  type="number"
                  min={1}
                  value={paidForDays}
                  onChange={(e) => setPaidForDays(Number(e.target.value))}
                  className={`${inputClass}`}
                  placeholder="e.g. 365"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Expiry date will be:{" "}
                  {paymentDate && paidForDays > 0
                    ? (() => {
                        const d = new Date(paymentDate);
                        d.setDate(d.getDate() + paidForDays);
                        return d.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                      })()
                    : "-"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (Rs)
                </label>
                <input
                  type="number"
                  min={0}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className={`${inputClass}`}
                  placeholder="e.g. 50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks
                </label>
                <textarea
                  value={paymentRemarks}
                  onChange={(e) => setPaymentRemarks(e.target.value)}
                  className={`${inputClass} h-20 resize-none`}
                  placeholder="Optional remarks about this payment..."
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() =>
                  setPaymentModal({ open: false, institution: null })
                }
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitPayment}
                disabled={paymentProcessing || !paymentDate || paidForDays <= 0}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {paymentProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {paymentProcessing ? "Recording..." : "Record Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {confirmDialog.title}
              </h3>
              <button
                type="button"
                onClick={() =>
                  setConfirmDialog({ ...confirmDialog, open: false })
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              {confirmDialog.message}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setConfirmDialog({ ...confirmDialog, open: false })
                }
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-2 ${
                  confirmDialog.action === "verify"
                    ? "bg-green-600 hover:bg-green-700"
                    : confirmDialog.action === "suspend"
                      ? "bg-orange-600 hover:bg-orange-700"
                      : confirmDialog.action === "feature"
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {confirmDialog.action === "verify" ? (
                  <CheckCircle className="w-4 h-4" />
                ) : confirmDialog.action === "suspend" ? (
                  <ShieldOff className="w-4 h-4" />
                ) : confirmDialog.action === "feature" ? (
                  <Star className="w-4 h-4" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                {confirmDialog.action === "verify"
                  ? "Verify"
                  : confirmDialog.action === "suspend"
                    ? "Suspend"
                    : confirmDialog.action === "feature"
                      ? confirmDialog.title.startsWith("Unfeature")
                        ? "Unfeature"
                        : "Feature"
                      : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
