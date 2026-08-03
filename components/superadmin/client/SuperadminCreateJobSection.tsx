"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import { careersApi, Job } from "@/services/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";

const QuillEditor = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "clean"],
  ],
};

const inputClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-600 outline-none transition-colors bg-white";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
const selectClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-600 outline-none appearance-none bg-white transition-colors";

const JOB_TYPES = ["full-time", "part-time", "contract", "internship", "remote"];
const STATUSES = ["draft", "published", "closed"];

export default function SuperadminCreateJobSection({
  setActiveSection,
  editId,
}: {
  setActiveSection: (s: string) => void;
  editId?: number;
}) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!editId);
  const [form, setForm] = useState({
    title: "",
    department: "",
    description: "",
    requirements: "",
    location: "",
    job_type: "full-time",
    salary_range: "",
    application_deadline: "",
    status: "draft",
  });

  useEffect(() => {
    if (!editId) return;
    careersApi
      .listAllJobs({ limit: 200 })
      .then((res) => {
        const job = (res.data?.jobs || []).find((j) => j.id === editId);
        if (job) {
          setForm({
            title: job.title || "",
            department: job.department || "",
            description: job.description || "",
            requirements: job.requirements || "",
            location: job.location || "",
            job_type: job.job_type || "full-time",
            salary_range: job.salary_range || "",
            application_deadline: job.application_deadline
              ? job.application_deadline.split("T")[0]
              : "",
            status: job.status || "draft",
          });
        } else {
          toast.error("Job not found");
          setActiveSection("superadmin-job-directory");
        }
      })
      .catch(() => {
        toast.error("Failed to load job");
        setActiveSection("superadmin-job-directory");
      })
      .finally(() => setFetching(false));
  }, [editId, setActiveSection]);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.department.trim()) {
      toast.error("Department is required");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }

    setLoading(true);
    try {
      const payload: Partial<Job> = {
        title: form.title.trim(),
        department: form.department.trim(),
        description: form.description,
        requirements: form.requirements,
        location: form.location.trim(),
        job_type: form.job_type,
        salary_range: form.salary_range.trim(),
        application_deadline: form.application_deadline || undefined,
        status: form.status,
      };

      if (editId) {
        await careersApi.updateJob(editId, payload);
        toast.success("Job updated successfully");
      } else {
        await careersApi.createJob(payload);
        toast.success("Job created successfully");
      }
      setActiveSection("superadmin-job-directory");
    } catch {
      toast.error(editId ? "Failed to update job" : "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-full">
      <SectionHeader
        title={editId ? "Edit Job" : "Create Job"}
        breadcrumbItems={[
          { label: "Dashboard" },
          { label: "Job Directory" },
          { label: editId ? "Edit Job" : "Create Job" },
        ]}
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-3xl"
      >
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Job Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className={inputClass}
              placeholder="e.g. Senior Software Engineer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Department *</label>
              <input
                type="text"
                value={form.department}
                onChange={(e) => update("department", e.target.value)}
                className={inputClass}
                placeholder="e.g. Engineering"
              />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                className={inputClass}
                placeholder="e.g. Remote / Bangalore"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Job Type</label>
              <select
                value={form.job_type}
                onChange={(e) => update("job_type", e.target.value)}
                className={selectClass}
              >
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Salary Range</label>
              <input
                type="text"
                value={form.salary_range}
                onChange={(e) => update("salary_range", e.target.value)}
                className={inputClass}
                placeholder="e.g. ₹8L - ₹15L"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Application Deadline</label>
              <input
                type="date"
                value={form.application_deadline}
                onChange={(e) => update("application_deadline", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                className={selectClass}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Description *</label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <QuillEditor
                theme="snow"
                value={form.description}
                onChange={(val: string) => update("description", val)}
                modules={quillModules}
                placeholder="Describe the role, responsibilities..."
                className="bg-white"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Requirements</label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <QuillEditor
                theme="snow"
                value={form.requirements}
                onChange={(val: string) => update("requirements", val)}
                modules={quillModules}
                placeholder="Skills, experience, qualifications..."
                className="bg-white"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setActiveSection("superadmin-job-directory")}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading
              ? editId
                ? "Updating..."
                : "Creating..."
              : editId
                ? "Update Job"
                : "Create Job"}
          </button>
        </div>
      </form>
    </div>
  );
}
