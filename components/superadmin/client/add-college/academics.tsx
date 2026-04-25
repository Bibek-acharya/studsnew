"use client";

import React from "react";
import { BookOpen, ClipboardList, GraduationCap } from "lucide-react";
import { FormCard } from "./FormCard";
import { FormInput } from "./FormInput";
import { COURSE_LEVELS, ADMISSION_STATUSES, PROGRAM_STATUSES } from "@/lib/superadmin/constants";

export function CoursesFeesCard({
  locked,
  onToggleLock,
}: {
  locked: boolean;
  onToggleLock: () => void;
}) {
  const courses = [
    { initials: "CS", name: "B.Sc. CSIT", meta: "4 Years • Rs. 150,000/year • 120 Seats", bg: "bg-blue-100 text-blue-600" },
    { initials: "BF", name: "BBA Finance", meta: "4 Years • Rs. 120,000/year • 80 Seats", bg: "bg-green-100 text-green-600" },
  ];

  return (
    <FormCard
      icon={<BookOpen size={24} className="text-blue-600" />}
      title="Courses & Fees"
      sub="Add programs offered by the college"
      locked={locked}
      onToggleLock={onToggleLock}
      action={
        <button
          type="button"
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M12 5v14" />
          </svg>
          Add Course
        </button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-md bg-gray-50 p-6">
          <h4 className="mb-4 text-sm font-bold text-gray-700">Add New Course</h4>
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FormInput label="Course Name" type="text" placeholder="e.g., B.Sc. CSIT" />
            <FormInput label="Level" type="select" options={COURSE_LEVELS} />
            <FormInput label="Duration" placeholder="e.g., 4 Years" />
            <FormInput label="Fees/Year (Rs.)" type="number" placeholder="150000" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormInput label="Specialization" placeholder="e.g., AI, Data Science" />
            <FormInput label="Eligibility" placeholder="10+2 with 60%" />
            <FormInput label="Total Seats" type="number" placeholder="120" />
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-bold text-gray-700">Added Courses ({courses.length})</h4>
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.name}
                className="flex items-center justify-between rounded-md border border-gray-200 p-4 transition-colors hover:border-blue-300"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-md text-sm font-medium ${course.bg}`}
                  >
                    {course.initials}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{course.name}</p>
                    <p className="text-sm text-gray-500">{course.meta}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-md p-2 text-blue-600 transition-colors hover:bg-blue-50"
                    title="Edit"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="rounded-md p-2 text-red-600 transition-colors hover:bg-red-50"
                    title="Delete"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FormCard>
  );
}

export function AdmissionsCard({
  locked,
  onToggleLock,
}: {
  locked: boolean;
  onToggleLock: () => void;
}) {
  return (
    <FormCard
      icon={<ClipboardList size={24} className="text-green-600" />}
      title="Admissions"
      sub="Manage admission notices and deadlines"
      locked={locked}
      onToggleLock={onToggleLock}
      action={
        <button
          type="button"
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M12 5v14" />
          </svg>
          Add Notice
        </button>
      }
    >
      <div className="rounded-md bg-gray-50 p-6">
        <h4 className="mb-4 text-sm font-bold text-gray-700">Add Admission Notice</h4>
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput label="Program Name" placeholder="e.g., +2 Science (Biology)" />
          <FormInput label="Affiliation" placeholder="e.g., NEB" />
        </div>
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormInput label="Admission Open Date" type="date" />
          <FormInput label="Application Deadline" type="date" />
          <FormInput label="Status" type="select" options={ADMISSION_STATUSES} />
        </div>
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">Program Image</label>
          <div className="cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-6 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50">
            <svg className="mx-auto mb-2 h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
            <p className="text-sm text-gray-600">Click to upload image</p>
            <p className="mt-1 text-xs text-gray-500">JPG, PNG (max. 2MB)</p>
            <input type="file" className="hidden" accept="image/*" />
          </div>
        </div>
      </div>
    </FormCard>
  );
}

export function OfferedProgramsCard({
  locked,
  onToggleLock,
}: {
  locked: boolean;
  onToggleLock: () => void;
}) {
  return (
    <FormCard
      icon={<GraduationCap size={24} className="text-purple-600" />}
      title="Offered Programs"
      sub="List all programs offered"
      locked={locked}
      onToggleLock={onToggleLock}
      action={
        <button
          type="button"
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M12 5v14" />
          </svg>
          Add Program
        </button>
      }
    >
      <div className="rounded-md bg-gray-50 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <FormInput label="Program Name" placeholder="Science (Biology)" />
          <FormInput label="Level" type="select" options={COURSE_LEVELS} />
          <FormInput label="Affiliation" placeholder="NEB" />
          <FormInput label="Status" type="select" options={PROGRAM_STATUSES} />
        </div>
      </div>
    </FormCard>
  );
}
