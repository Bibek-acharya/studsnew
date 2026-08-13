"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass, Pencil, Trash, BookOpen, X } from "@phosphor-icons/react";
import SectionHeader from "../shared/SectionHeader";
import { institutionProgramApi } from "@/services/institutionProgramApi";
import { InstitutionProgram } from "@/types/course";

const CourseListPage: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<InstitutionProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    institutionProgramApi.list(1, 100)
      .then(res => setCourses(res.programs || []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await institutionProgramApi.delete(id);
      setCourses(prev => prev.filter(c => c.id !== id));
      window.dispatchEvent(new Event("institution-data-changed"));
    } catch (e) { console.error(e); }
  };

  const filtered = courses.filter(c => c.globalCourseTitle.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader title="Course List" breadcrumbItems={[{ label: "Dashboard" }, { label: "Course" }, { label: "List" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input type="text" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400"><p className="text-sm">Loading...</p></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">{search ? "No courses matched." : "No courses yet."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Fee</th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="py-3 px-6 font-medium text-gray-900">{c.globalCourseTitle}</td>
                    <td className="py-3 px-6 text-gray-600">{c.fee || "-"}</td>
                    <td className="text-center py-3 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{c.status}</span>
                    </td>
                    <td className="text-center py-3 px-6">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => router.push(`/institution-zone/dashboard/course/create?id=${c.id}`)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Delete">
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
};

export default CourseListPage;
