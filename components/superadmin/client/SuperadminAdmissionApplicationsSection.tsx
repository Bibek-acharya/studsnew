"use client";
import React, { useMemo, useState, useEffect } from "react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import {
  Files,
  HourglassHigh,
  CheckCircle,
  XCircle,
  MagnifyingGlass,
  BookmarkSimple,
  Eye,
  ChatCircleDots,
  WhatsappLogo,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import CollegeFilterDropdown from "./CollegeFilterDropdown";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Institution {
  id: number;
  institution_name: string;
}

interface Applicant {
  id: number;
  student_name: string;
  student_email: string;
  student_phone: string;
  program_name: string;
  program_level: string;
  status: string;
  created_at: string;
  gender?: string;
  address?: string;
  gpa?: string;
  institution_id?: number;
  institution_name?: string;
}

const statusPill = (status: string) => {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    shortlisted: "bg-blue-100 text-blue-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    under_review: "bg-purple-100 text-purple-700",
    waitlisted: "bg-orange-100 text-orange-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
};

const ITEMS_PER_PAGE = 10;

export default function SuperadminAdmissionApplicationsSection({
  setActiveSection,
}: {
  setActiveSection: (s: string) => void;
}) {
  const [data, setData] = useState<Applicant[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [collegeFilter, setCollegeFilter] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);

  const getToken = () => localStorage.getItem("superadmin_token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) {
          setLoading(false);
          return;
        }
        const [res, insts] = await Promise.all([
          fetch(`${API_BASE_URL}/api/v1/superadmin/admissions`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => r.json()),
          fetch(`${API_BASE_URL}/api/v1/superadmin/institutions`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((r) => r.json())
            .then((d) => d.data?.institutions || [])
            .catch(() => []),
        ]);
        setData(res?.data || []);
        setInstitutions(insts);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = getToken();
      await fetch(`${API_BASE_URL}/api/v1/superadmin/admissions/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      setData((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (e) {
      console.error(e);
    }
  };

  const institutionMap = new Map(
    institutions.map((i) => [i.id, i.institution_name]),
  );
  const enriched = data.map((a) => ({
    ...a,
    institution_name:
      a.institution_name || institutionMap.get(a.institution_id || 0) || "-",
  }));

  const filtered = useMemo(() => {
    return enriched.filter((row) => {
      if (activeTab !== "all" && row.status !== activeTab) return false;
      if (collegeFilter !== null && row.institution_id !== collegeFilter)
        return false;
      if (search) {
        const s = search.toLowerCase();
        if (
          !row.student_name?.toLowerCase().includes(s) &&
          !row.student_email?.toLowerCase().includes(s) &&
          !row.student_phone?.includes(s)
        )
          return false;
      }
      return true;
    });
  }, [enriched, activeTab, search, collegeFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );
  const toggleAll = () =>
    selected.length === paginated.length
      ? setSelected([])
      : setSelected(paginated.map((a) => a.id));
  const toggleOne = (id: number) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const tabs = ["all", "pending", "shortlisted", "approved", "rejected"];
  const counts: Record<string, number> = {};
  tabs.forEach(
    (t) =>
      (counts[t] =
        t === "all" ? data.length : data.filter((a) => a.status === t).length),
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Applications"
        breadcrumbItems={[
          { label: "Dashboard", href: "#" },
          { label: "Admission" },
          { label: "Applications" },
        ]}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header + Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <MagnifyingGlass
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search applicants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <CollegeFilterDropdown
                institutions={institutions}
                value={collegeFilter}
                onChange={setCollegeFilter}
              />
              <button className="px-4 py-2.5 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
                <Files size={18} /> Export
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-3 border-b border-gray-200 flex items-center gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
              className={`text-sm font-medium whitespace-nowrap pb-1 border-b-2 transition-colors ${activeTab === tab ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-gray-700"}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab]})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Loading...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <HourglassHigh className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">
              {search
                ? "No applicants matched."
                : "No applications received yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={
                        selected.length === paginated.length &&
                        paginated.length > 0
                      }
                      onChange={toggleAll}
                      className="w-4 h-4"
                    />
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Institution
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Program
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Contact
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(a.id)}
                        onChange={() => toggleOne(a.id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">
                        {a.student_name}
                      </p>
                      <p className="text-xs text-gray-500">{a.student_email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {a.institution_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {a.program_name}{" "}
                      <span className="text-xs text-gray-400">
                        ({a.program_level})
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {a.student_phone || "-"}
                    </td>
                    <td className="text-center px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusPill(a.status)}`}
                      >
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      </span>
                    </td>
                    <td className="text-center px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          className="p-1.5 hover:bg-blue-50 rounded text-blue-600"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {a.status === "pending" && (
                          <>
                            <button
                              onClick={() => updateStatus(a.id, "shortlisted")}
                              className="p-1.5 hover:bg-blue-50 rounded text-blue-600"
                              title="Shortlist"
                            >
                              <BookmarkSimple className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateStatus(a.id, "approved")}
                              className="p-1.5 hover:bg-green-50 rounded text-green-600"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateStatus(a.id, "rejected")}
                              className="p-1.5 hover:bg-red-50 rounded text-red-600"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          className="p-1.5 hover:bg-green-50 rounded text-green-600"
                          title="Message"
                        >
                          <ChatCircleDots className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 hover:bg-green-50 rounded text-green-600"
                          title="WhatsApp"
                        >
                          <WhatsappLogo className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
              >
                <CaretLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
              >
                <CaretRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
