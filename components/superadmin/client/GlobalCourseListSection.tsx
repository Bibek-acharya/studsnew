"use client";
import React, { useState, useEffect } from "react";
import {
  MagnifyingGlass,
  Pencil,
  Trash,
  Plus,
  Check,
  X,
  Eye,
} from "@phosphor-icons/react";
import { Loader2 } from "lucide-react";
import { superadminGlobalCourseApi } from "@/services/superadminRecordsApi";

export default function GlobalCourseListSection({
  setActiveSection,
}: {
  setActiveSection: (s: string, params?: any) => void;
}) {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "pending">("all");

  const fetchCourses = () => {
    setLoading(true);
    const fetcher =
      tab === "pending"
        ? superadminGlobalCourseApi.listPending()
        : superadminGlobalCourseApi.list();
    fetcher
      .then((res) => setCourses(res.courses || []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourses();
  }, [tab]);

  const filtered = courses.filter(
    (c) => !search || c.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const handlePublish = async (id: number) => {
    try {
      await superadminGlobalCourseApi.publish(id);
      fetchCourses();
    } catch {
      alert("Failed to publish");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this course?")) return;
    try {
      await superadminGlobalCourseApi.delete(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Global Courses</h1>
          <p className="text-sm text-gray-500 mt-1">
            {tab === "pending"
              ? "User-created drafts pending review"
              : "All published & draft global courses"}
          </p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("superadmin_edit_global_course_id");
            setActiveSection("global-add-course");
          }}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={18} /> New Global Course
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setTab("all")}
            className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors ${tab === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            All Courses
          </button>
          <button
            onClick={() => setTab("pending")}
            className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors ${tab === "pending" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Pending Review
          </button>
        </div>
        <div className="relative flex-1 max-w-xs">
          <MagnifyingGlass
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No courses found</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Title
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Level
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Field
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Duration
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((course) => (
                <tr
                  key={course.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {course.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {course.level || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {course.field || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {course.duration || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                        course.status === "published"
                          ? "bg-green-100 text-green-700"
                          : course.status === "draft"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {course.isGlobal ? "Global" : "Draft"} · {course.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          setActiveSection("global-add-course", {
                            id: course.id,
                          })
                        }
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      {!course.isGlobal && course.status === "draft" && (
                        <button
                          onClick={() => handlePublish(course.id)}
                          className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50"
                          title="Approve & Publish"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          localStorage.setItem(
                            "superadmin_edit_global_course_id",
                            String(course.id),
                          );
                          setActiveSection("global-add-course");
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                        title="Edit"
                      >
                        <Trash size={16} />
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
  );
}
