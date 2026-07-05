"use client";
import React, { useState, useEffect } from "react";
import {
  MagnifyingGlass,
  Pencil,
  Trash,
  BookOpen,
  X,
  Plus,
} from "@phosphor-icons/react";
import { superadminProgramApi } from "@/services/superadminRecordsApi";
import CollegeFilterDropdown from "./CollegeFilterDropdown";

interface Institution {
  id: number;
  institution_name: string;
}

interface Course {
  id: number;
  name: string;
  duration: string;
  fee: string;
  status: string;
  institution_id: number;
  institution_name?: string;
}

export default function SuperadminCourseListSection({
  setActiveSection,
}: {
  setActiveSection: (s: string) => void;
}) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [collegeFilter, setCollegeFilter] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      superadminProgramApi.list(),
      fetch("/api/v1/superadmin/institutions")
        .then((r) => r.json())
        .then((d) => d.data?.institutions || [])
        .catch(() => []),
    ])
      .then(([programRes, insts]) => {
        setCourses(programRes.programs || []);
        setInstitutions(insts);
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await superadminProgramApi.delete(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (id: number) => {
    localStorage.setItem("superadmin_edit_course_id", String(id));
    setActiveSection("superadmin-add-course");
  };

  const institutionMap = new Map(
    institutions.map((i) => [i.id, i.institution_name]),
  );
  const enriched = courses.map((c) => ({
    ...c,
    institution_name:
      c.institution_name || institutionMap.get(c.institution_id) || "-",
  }));

  const filtered = enriched.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(q) ||
      (c.institution_name || "").toLowerCase().includes(q);
    const matchesCollege =
      collegeFilter === null || c.institution_id === collegeFilter;
    return matchesSearch && matchesCollege;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Course Directory</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage all courses across institutions
          </p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("superadmin_edit_course_id");
            setActiveSection("superadmin-add-course");
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by course or institution..."
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Loading...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">
              {search || collegeFilter
                ? "No courses matched."
                : "No courses yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">
                    Institution
                  </th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">
                    Duration
                  </th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">
                    Fee
                  </th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="py-3 px-6 font-medium text-gray-900">
                      {c.name}
                    </td>
                    <td className="py-3 px-6 text-gray-600">
                      {c.institution_name}
                    </td>
                    <td className="py-3 px-6 text-gray-600">
                      {c.duration || "-"}
                    </td>
                    <td className="py-3 px-6 text-gray-600">{c.fee || "-"}</td>
                    <td className="text-center py-3 px-6">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="text-center py-3 px-6">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleEdit(c.id)}
                          className="p-1.5 hover:bg-blue-50 rounded text-blue-600"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 hover:bg-red-50 rounded text-red-600"
                          title="Delete"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
