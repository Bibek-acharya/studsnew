"use client";

import React, { useEffect, useState } from "react";
import { Users, Search, Eye, Ban, Undo2, X } from "lucide-react";
import { apiService, getImageUrl } from "@/services/api";

function formatDate(d: string | null): string {
  if (!d) return "Never";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatDateTime(d: string | null): string {
  if (!d) return "Never";
  const dt = new Date(d);
  const date = dt.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const time = dt.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${date} ${time}`;
}

function parseAddr(addr: any): string {
  if (!addr) return "-";
  if (typeof addr !== "string") return "-";
  try {
    const obj = JSON.parse(addr);
    const parts = [obj.province, obj.district, obj.localLevel].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "-";
  } catch {
    return addr || "-";
  }
}

function fmtPreferences(prefs: any): Record<string, string> {
  if (!prefs || !prefs.preferences) return {};
  const p = prefs.preferences;
  const out: Record<string, string> = {};

  const labels: Record<string, string> = {
    current_status: "Current Status",
    contact_number: "Contact",
    school_type: "School Type",
    recent_school_name: "School Name",
    elective: "Elective",
    province: "Province",
    district: "District",
    local_level: "Local Level",
    interested_subject: "Interested Subject",
    interested_city: "Interested City",
    college_name: "College Name",
    course: "Course",
    college_type: "College Type",
    interested_bachelor_course: "Interested Bachelor Course",
    education_level: "Education Level",
    target_exams: "Target Exams",
    preferred_location: "Preferred Location",
    interest: "Career Interest",
  };

  for (const [key, val] of Object.entries(p)) {
    if (labels[key]) {
      let display = String(val ?? "-");
      if (key === "current_status") {
        const statusLabels: Record<string, string> = {
          see_graduate: "SEE Graduate",
          plus_two_running: "+2 Running",
          plus_two_graduate: "+2 Graduate",
          plus2_running: "+2 Running",
          plus2_graduate: "+2 Graduate",
          bachelor_running: "Bachelor Running",
          bachelor_graduate: "Bachelor Graduate",
          masters: "Masters",
        };
        display = statusLabels[String(val)] || display;
      } else if (Array.isArray(val)) {
        display = (val as string[]).join(", ");
      }
      out[labels[key]] = display;
    }
  }

  return out;
}

export default function UserListSection() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewUser, setViewUser] = useState<any>(null);
  const [viewEducation, setViewEducation] = useState<any[]>([]);

  const fetchUsers = (p: number, s: string, st: string) => {
    setLoading(true);
    apiService
      .listAllUsers({
        search: s || undefined,
        status: st || undefined,
        page: p,
        limit: 20,
      })
      .then((res) => {
        setUsers(res.data.users || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setTotal(res.data.pagination?.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers(page, search, statusFilter);
  }, [page, search, statusFilter]); // eslint-disable-line

  const handleSuspend = async (id: number) => {
    try {
      await apiService.suspendUser(id);
      fetchUsers(page, search, statusFilter);
    } catch {
      /* ignore */
    }
  };

  const handleReinstate = async (id: number) => {
    try {
      await apiService.reinstateUser(id);
      fetchUsers(page, search, statusFilter);
    } catch {
      /* ignore */
    }
  };

  const handleView = async (id: number) => {
    try {
      const [userRes, eduRes] = await Promise.all([
        apiService.getUserDetail(id),
        apiService.getUserEducation(id),
      ]);
      setViewUser(userRes.data);
      setViewEducation(eduRes.data || []);
    } catch {
      /* ignore */
    }
  };

  const prefMap = viewUser ? fmtPreferences(viewUser.preferences) : {};

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <Users size={24} className="text-blue-600" /> Manage Users
        </h2>
      </div>
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-11 w-full rounded-md border border-gray-200 pl-10 pr-4 text-sm outline-none focus:border-blue-600"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="h-11 rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-blue-600 bg-white"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
        <span className="text-sm text-gray-500">
          {total.toLocaleString()} users
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left font-bold text-gray-600">
                User
              </th>
              <th className="px-6 py-4 text-left font-bold text-gray-600">
                Email
              </th>
              <th className="px-6 py-4 text-center font-bold text-gray-600">
                Status
              </th>
              <th className="px-6 py-4 text-center font-bold text-gray-600">
                Joined
              </th>
              <th className="px-6 py-4 text-center font-bold text-gray-600">
                Last Login
              </th>
              <th className="px-6 py-4 text-center font-bold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {u.image_url ? (
                        <img
                          src={getImageUrl(u.image_url)}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-bold text-white shadow-sm">
                          {(u.first_name?.[0] || "") +
                            (u.last_name?.[0] || "") || "U"}
                        </div>
                      )}
                      <span className="font-bold text-gray-900">
                        {u.first_name} {u.last_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-500">
                    {u.email}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        u.status === "suspended"
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {u.status || "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-xs text-gray-400">
                    {formatDate(u.created_at)}
                  </td>
                  <td className="px-6 py-4 text-center text-xs text-gray-400">
                    {formatDateTime(u.last_login_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(u.id)}
                        className="rounded-md border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {u.status === "suspended" ? (
                        <button
                          onClick={() => handleReinstate(u.id)}
                          className="rounded-md border border-gray-200 p-2 text-gray-500 hover:bg-green-50 hover:text-green-600"
                          title="Reinstate User"
                        >
                          <Undo2 size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSuspend(u.id)}
                          className="rounded-md border border-gray-200 p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                          title="Suspend User"
                        >
                          <Ban size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-30"
          >
            Prev
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}

      {/* View User Detail Modal */}
      {viewUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setViewUser(null);
            setViewEducation([]);
          }}
        >
          <div
            className="mx-4 w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-900">User Details</h3>
              <button
                onClick={() => setViewUser(null)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center gap-4">
                {viewUser.image_url ? (
                  <img
                    src={getImageUrl(viewUser.image_url)}
                    alt=""
                    className="h-16 w-16 rounded-full object-cover border-2 border-gray-100"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-lg font-bold text-white">
                    {(viewUser.first_name?.[0] || "") +
                      (viewUser.last_name?.[0] || "") || "U"}
                  </div>
                )}
                <div>
                  <h4 className="text-xl font-bold text-gray-900">
                    {viewUser.first_name} {viewUser.last_name}
                  </h4>
                  <p className="text-sm text-gray-500">{viewUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div>
                  <span className="text-xs text-gray-400">Phone</span>
                  <p className="text-sm font-medium">{viewUser.phone || "-"}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Gender</span>
                  <p className="text-sm font-medium">
                    {viewUser.gender || "-"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">DOB</span>
                  <p className="text-sm font-medium">
                    {viewUser.date_of_birth || "-"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Nationality</span>
                  <p className="text-sm font-medium">
                    {viewUser.nationality || "-"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Status</span>
                  <p className="text-sm font-medium capitalize">
                    {viewUser.status || "Active"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Joined</span>
                  <p className="text-sm font-medium">
                    {formatDate(viewUser.created_at)}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <span className="text-xs text-gray-400">Last Login</span>
                <p className="text-sm font-medium">
                  {formatDateTime(viewUser.last_login_at)}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <span className="text-xs text-gray-400">Address</span>
                <p className="text-sm font-medium">
                  {parseAddr(viewUser.address)}
                </p>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <span className="text-xs text-gray-400">Bio</span>
                <p className="text-sm font-medium">{viewUser.bio || "-"}</p>
              </div>

              {viewUser.preferences && (
                <div className="border-t border-gray-100 pt-4">
                  <span className="text-xs text-gray-400 font-bold mb-3 block">
                    Onboarding Data
                  </span>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Status</span>
                      <span
                        className={`text-sm font-medium ${viewUser.preferences.onboarding_completed ? "text-green-600" : "text-amber-600"}`}
                      >
                        {viewUser.preferences.onboarding_completed
                          ? "Completed"
                          : "Incomplete"}
                      </span>
                    </div>
                    {viewUser.preferences.completed_at && (
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">
                          Completed At
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          {formatDateTime(viewUser.preferences.completed_at)}
                        </span>
                      </div>
                    )}
                    {Object.entries(prefMap).map(([key, val]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-xs text-gray-500">{key}</span>
                        <span className="text-sm font-medium text-gray-800">
                          {val || "-"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewEducation.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <span className="text-xs text-gray-400 font-bold mb-3 block">
                    Academic History
                  </span>
                  <table className="w-full text-xs border border-gray-100 rounded-md overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-bold text-gray-500">
                          Level
                        </th>
                        <th className="px-3 py-2 text-left font-bold text-gray-500">
                          Institution
                        </th>
                        <th className="px-3 py-2 text-left font-bold text-gray-500">
                          Board/Univ
                        </th>
                        <th className="px-3 py-2 text-left font-bold text-gray-500">
                          Stream
                        </th>
                        <th className="px-3 py-2 text-left font-bold text-gray-500">
                          Grade
                        </th>
                        <th className="px-3 py-2 text-left font-bold text-gray-500">
                          Year
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {viewEducation.map((e: any) => (
                        <tr key={e.id}>
                          <td className="px-3 py-2 font-medium">{e.level}</td>
                          <td className="px-3 py-2 text-gray-500">
                            {e.institution_name}
                          </td>
                          <td className="px-3 py-2 text-gray-500">
                            {e.board_university}
                          </td>
                          <td className="px-3 py-2 text-gray-500">
                            {e.stream || "-"}
                          </td>
                          <td className="px-3 py-2">
                            {e.grade || "-"}{" "}
                            {e.grading_system ? `(${e.grading_system})` : ""}
                          </td>
                          <td className="px-3 py-2 text-gray-400 whitespace-nowrap">
                            {e.start_year} - {e.end_year}
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
      )}
    </div>
  );
}
