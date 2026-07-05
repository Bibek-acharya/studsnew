"use client";
import React, { useState, useEffect } from "react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import {
  MagnifyingGlass,
  Eye,
  Pencil,
  Trash,
  CaretLeft,
  CaretRight,
  FolderOpen,
} from "@phosphor-icons/react";
import { superadminAdmissionApi } from "@/services/superadminRecordsApi";

interface PublishedAdmission {
  id: number;
  title: string;
  program: string;
  level: string;
  publishedDate: string;
  status: string;
  applicants: number;
  institution_id: number;
  institution_name?: string;
}

const statusColors: Record<string, string> = {
  Published: "text-green-600 bg-green-50",
  Draft: "text-orange-600 bg-orange-50",
  Archived: "text-gray-600 bg-gray-100",
};

const statusPill = (status: string) => {
  const color = statusColors[status] || "bg-gray-100 text-gray-700";
  return (
    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${color}`}>
      {status}
    </span>
  );
};

const ITEMS_PER_PAGE = 5;

export default function SuperadminAdmissionDirectorySection({
  setActiveSection,
}: {
  setActiveSection: (s: string) => void;
}) {
  const [admissions, setAdmissions] = useState<PublishedAdmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await superadminAdmissionApi.list("published", 1, 100);
        if (Array.isArray(res.admissions)) {
          setAdmissions(
            res.admissions.map((a: any) => ({
              id: a.id,
              title: a.title || "",
              program: a.program || "",
              level: a.level || "",
              publishedDate: a.published_at || "",
              status: a.status === "published" ? "Published" : "Draft",
              applicants: a.applicants || 0,
              institution_id: a.institution_id || 0,
              institution_name: a.institution_name || "",
            })),
          );
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [activeLevel, setActiveLevel] = useState<string>("all");

  const ALL_LEVELS = ["+2", "A-Level", "Diploma/CTEVT", "Bachelor", "Master"];

  const filtered = admissions.filter((a) => {
    if (activeLevel !== "all" && a.level !== activeLevel) return false;
    const s = search.toLowerCase();
    const matchesSearch =
      !s ||
      a.title.toLowerCase().includes(s) ||
      a.program.toLowerCase().includes(s) ||
      a.level.toLowerCase().includes(s) ||
      (a.institution_name || "").toLowerCase().includes(s);
    return matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-full">
      <SectionHeader
        title="Admission Directory"
        breadcrumbItems={[
          { label: "Dashboard", href: "#" },
          { label: "Admission Directory" },
        ]}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Level Tabs */}
        <div className="flex items-center gap-1 px-6 pt-4 pb-2 overflow-x-auto">
          <button
            onClick={() => {
              setActiveLevel("all");
              setPage(1);
            }}
            className={`whitespace-nowrap px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
              activeLevel === "all"
                ? "bg-[#0000ff] text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          {ALL_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => {
                setActiveLevel(level);
                setPage(1);
              }}
              className={`whitespace-nowrap px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                activeLevel === level
                  ? "bg-[#0000ff] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 self-center">
            Published Admissions
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative min-w-[250px]">
              <MagnifyingGlass
                weight="bold"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
              />
              <input
                placeholder="Search admissions..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Published Date</th>
                <th className="px-4 py-3">Applicants</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="flex flex-col items-center justify-center py-16">
                      <FolderOpen className="w-16 h-16 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg font-medium mb-6">
                        {activeLevel === "all"
                          ? "No admissions found."
                          : `No ${activeLevel} admissions found.`}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((admission) => (
                  <tr
                    key={admission.id}
                    className="hover:bg-gray-50 border-b border-gray-200"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {admission.title}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {admission.program}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {admission.level}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {admission.publishedDate}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {admission.applicants}
                    </td>
                    <td className="px-4 py-3">
                      {statusPill(admission.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          title="Edit"
                          onClick={() => {
                            localStorage.setItem(
                              "superadmin_edit_admission_id",
                              String(admission.id),
                            );
                            setActiveSection("superadmin-create-admission");
                          }}
                          className="p-1.5 rounded text-gray-400 hover:text-green-600 hover:bg-green-50"
                        >
                          <Pencil weight="bold" className="w-4 h-4" />
                        </button>
                        <button
                          title="Delete"
                          onClick={async () => {
                            if (confirm("Delete this admission?")) {
                              await superadminAdmissionApi.delete(admission.id);
                              setAdmissions((prev) =>
                                prev.filter((a) => a.id !== admission.id),
                              );
                            }
                          }}
                          className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash weight="bold" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
            <p className="text-sm text-gray-500">
              Showing {(safePage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of{" "}
              {filtered.length} records
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="p-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CaretLeft weight="bold" className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, safePage - 3), safePage + 2)
                .map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-8 h-8 rounded border text-sm font-medium flex items-center justify-center ${
                      n === safePage
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="p-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CaretRight weight="bold" className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
