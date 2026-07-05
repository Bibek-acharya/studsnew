"use client";
import React, { useMemo, useState, useEffect } from "react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import {
  MagnifyingGlass,
  BookmarkSimple,
  CheckCircle,
  XCircle,
  Eye,
  ChatCircleDots,
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
  gpa?: string;
  gender?: string;
  address?: string;
  institution_id?: number;
  institution_name?: string;
}

const statusPill = () => (
  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
    Shortlisted
  </span>
);

const ITEMS_PER_PAGE = 10;

export default function SuperadminAdmissionShortlistSection({
  setActiveSection,
}: {
  setActiveSection: (s: string) => void;
}) {
  const [data, setData] = useState<Applicant[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [collegeFilter, setCollegeFilter] = useState<number | null>(null);
  const [page, setPage] = useState(1);

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
        setData(
          (res?.data || []).filter((a: any) => a.status === "shortlisted"),
        );
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
    let items = enriched.filter((a) => a.status === "shortlisted");
    if (collegeFilter !== null) {
      items = items.filter((a) => a.institution_id === collegeFilter);
    }
    if (search) {
      const s = search.toLowerCase();
      items = items.filter(
        (a) =>
          a.student_name?.toLowerCase().includes(s) ||
          a.student_email?.toLowerCase().includes(s),
      );
    }
    return items;
  }, [enriched, search, collegeFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Admission Shortlist"
        breadcrumbItems={[
          { label: "Dashboard", href: "#" },
          { label: "Admission" },
          { label: "Shortlist" },
        ]}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative w-full sm:w-72">
              <MagnifyingGlass
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search shortlisted..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
              />
            </div>
            <CollegeFilterDropdown
              institutions={institutions}
              value={collegeFilter}
              onChange={setCollegeFilter}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Loading...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <BookmarkSimple className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">
              {search ? "No matches." : "No shortlisted applicants yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
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
                    Email
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
                      <p className="font-medium text-gray-900">
                        {a.student_name}
                      </p>
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
                      {a.student_email}
                    </td>
                    <td className="text-center px-4 py-3">{statusPill()}</td>
                    <td className="text-center px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          className="p-1.5 hover:bg-blue-50 rounded text-blue-600"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
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
                className="w-8 h-8 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
              >
                <CaretLeft className="w-4 h-4 mx-auto" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-8 h-8 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
              >
                <CaretRight className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
