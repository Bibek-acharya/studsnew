"use client";
import React, { useState, useEffect } from "react";
import { MagnifyingGlass, Pencil, Trash, BookOpen, X, CheckCircle } from "@phosphor-icons/react";
import SectionHeader from "../shared/SectionHeader";
import { getInstitutionCourses, saveInstitutionCourse, deleteInstitutionCourse, InstitutionCourse } from "@/services/institutionCourses";

const CourseListPage: React.FC = () => {
  const [courses, setCourses] = useState<InstitutionCourse[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<InstitutionCourse | null>(null);
  const [form, setForm] = useState({ name: "", level: "Bachelor", duration: "", fees: "", seats: "" });

  useEffect(() => {
    setCourses(getInstitutionCourses());
  }, []);

  const refresh = () => {
    setCourses(getInstitutionCourses());
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", level: "Bachelor", duration: "", fees: "", seats: "" });
    setShowForm(true);
  };

  const openEdit = (c: InstitutionCourse) => {
    setEditing(c);
    setForm({ name: c.name, level: c.level, duration: c.duration, fees: c.fees, seats: String(c.seats) });
    setShowForm(true);
  };

  const handleSave = () => {
    const nextId = editing ? editing.id : Math.max(0, ...courses.map((c) => c.id)) + 1;
    saveInstitutionCourse({
      id: nextId,
      name: form.name,
      level: form.level,
      duration: form.duration,
      fees: form.fees,
      seats: Number(form.seats) || 0,
      status: editing?.status || "Active",
      source: "institution",
    });
    setShowForm(false);
    refresh();
  };

  const handleDelete = (id: number) => {
    deleteInstitutionCourse(id);
    refresh();
  };

  const filtered = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Course List"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard" },
          { label: "Course" },
          { label: "List" },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
          />
        </div>
      </div>

      {showForm && (
        <div className="mb-6 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{editing ? "Edit Course" : "Add Course"}</h3>
            <button onClick={() => setShowForm(false)} className="p-1 text-gray-400 hover:text-gray-600">
              <X />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none" placeholder="e.g. B.Tech CS" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none bg-white">
                <option>+2</option>
                <option>Bachelor</option>
                <option>Master</option>
                <option>Diploma</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none" placeholder="e.g. 4 Years" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fees</label>
              <input type="text" value={form.fees} onChange={(e) => setForm({ ...form, fees: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none" placeholder="e.g. $12,000/year" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
              <input type="number" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none" placeholder="e.g. 60" />
            </div>
          </div>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 inline-flex items-center gap-2">
            <CheckCircle weight="bold" />
            {editing ? "Update Course" : "Save Course"}
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No courses found. Click &quot;Add Course&quot; to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <div key={course.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <BookOpen className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 leading-tight">{course.name}</h3>
                    <span className="text-xs text-gray-500">{course.level}</span>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  {course.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-sm font-medium text-gray-700">{course.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Fees</p>
                  <p className="text-sm font-medium text-gray-700">{course.fees}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Seats</p>
                  <p className="text-sm font-medium text-gray-700">{course.seats}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <button onClick={() => openEdit(course)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50">
                  <Pencil />
                  Edit
                </button>
                <button onClick={() => handleDelete(course.id)} className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 text-gray-700 rounded-lg text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                  <Trash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseListPage;
