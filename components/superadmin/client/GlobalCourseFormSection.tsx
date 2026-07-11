"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { superadminGlobalCourseApi } from "@/services/superadminRecordsApi";

const inputClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-600 outline-none transition-colors bg-white";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
const selectClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-600 outline-none appearance-none bg-white transition-colors";

export default function GlobalCourseFormSection({
  setActiveSection,
}: {
  setActiveSection: (s: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [shortTitle, setShortTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [level, setLevel] = useState("");
  const [field, setField] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [estFee, setEstFee] = useState("");
  const [govtFee, setGovtFee] = useState("");
  const [privateFee, setPrivateFee] = useState("");
  const [mode, setMode] = useState("");
  const [degreeLabel, setDegreeLabel] = useState("");
  const [careerPath, setCareerPath] = useState("");
  const [location, setLocation] = useState("");
  const [badges, setBadges] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("superadmin_edit_global_course_id")
        : null;
    const id = stored ? Number(stored) : null;
    setEditId(id);
    if (!id) {
      setLoading(false);
      return;
    }
    superadminGlobalCourseApi
      .getById(id)
      .then((c) => {
        setTitle(c.title || "");
        setShortTitle(c.shortTitle || "");
        setDescription(c.description || "");
        setDuration(c.duration || "");
        setLevel(c.level || "");
        setField(c.field || "");
        setAffiliation(c.affiliation || "");
        setEstFee(c.estFee || "");
        setGovtFee(c.govtFee || "");
        setPrivateFee(c.privateFee || "");
        setMode(c.mode || "");
        setDegreeLabel(c.degreeLabel || "");
        setCareerPath(c.careerPath || "");
        setLocation(c.location || "");
        setBadges((c.badges || []).join(", "));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [editId]);

  const handleSave = async () => {
    if (!title.trim()) return alert("Title is required");
    setSaving(true);
    try {
      const payload = {
        title,
        shortTitle: shortTitle || undefined,
        description,
        duration,
        level,
        field,
        affiliation,
        estFee,
        govtFee: govtFee || undefined,
        privateFee: privateFee || undefined,
        mode,
        degreeLabel,
        careerPath,
        location,
        badges: badges
          .split(",")
          .map((b) => b.trim())
          .filter(Boolean),
      };
      if (editId) {
        await superadminGlobalCourseApi.update(editId, payload);
      } else {
        await superadminGlobalCourseApi.create(payload);
      }
      setActiveSection("global-course-directory");
    } catch (e: any) {
      alert(e?.message || "Failed to save");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      <button
        onClick={() => setActiveSection("global-course-directory")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft size={16} /> Back to Global Courses
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        {editId ? "Edit Global Course" : "Create Global Course"}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Global courses are published as master records visible to all
        institutions and students.
      </p>

      <div className="space-y-5 bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelClass}>
              Title <span className="text-red-500">*</span>
            </label>
            <input
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bachelor of Science in Computer Science"
            />
          </div>
          <div>
            <label className={labelClass}>Short Title</label>
            <input
              className={inputClass}
              value={shortTitle}
              onChange={(e) => setShortTitle(e.target.value)}
              placeholder="e.g. B.Sc. CSIT"
            />
          </div>
          <div>
            <label className={labelClass}>Level</label>
            <select
              className={selectClass}
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="">Select Level</option>
              <option value="+2">+2</option>
              <option value="Bachelor">Bachelor</option>
              <option value="Master">Master</option>
              <option value="Diploma">Diploma</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Field</label>
            <input
              className={inputClass}
              value={field}
              onChange={(e) => setField(e.target.value)}
              placeholder="e.g. Science, Management"
            />
          </div>
          <div>
            <label className={labelClass}>Duration</label>
            <input
              className={inputClass}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 4 Years"
            />
          </div>
          <div>
            <label className={labelClass}>Affiliation</label>
            <input
              className={inputClass}
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              placeholder="e.g. Tribhuvan University"
            />
          </div>
          <div>
            <label className={labelClass}>Estimated Fee</label>
            <input
              className={inputClass}
              value={estFee}
              onChange={(e) => setEstFee(e.target.value)}
              placeholder="e.g. NPR 250,000"
            />
          </div>
          <div>
            <label className={labelClass}>Mode</label>
            <select
              className={selectClass}
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="">Select Mode</option>
              <option value="On-Campus">On-Campus</option>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Degree Label</label>
            <input
              className={inputClass}
              value={degreeLabel}
              onChange={(e) => setDegreeLabel(e.target.value)}
              placeholder="e.g. Bachelor's Degree"
            />
          </div>
          <div>
            <label className={labelClass}>Badges (comma-separated)</label>
            <input
              className={inputClass}
              value={badges}
              onChange={(e) => setBadges(e.target.value)}
              placeholder="e.g. Popular, Science"
            />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input
              className={inputClass}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Kathmandu"
            />
          </div>
          <div>
            <label className={labelClass}>Career Path</label>
            <input
              className={inputClass}
              value={careerPath}
              onChange={(e) => setCareerPath(e.target.value)}
              placeholder="e.g. Software Engineer, Data Scientist"
            />
          </div>
          <div>
            <label className={labelClass}>Government Fee</label>
            <input
              className={inputClass}
              value={govtFee}
              onChange={(e) => setGovtFee(e.target.value)}
              placeholder="e.g. NPR 50,000"
            />
          </div>
          <div>
            <label className={labelClass}>Private Fee</label>
            <input
              className={inputClass}
              value={privateFee}
              onChange={(e) => setPrivateFee(e.target.value)}
              placeholder="e.g. NPR 200,000"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea
              className={`${inputClass} min-h-[100px]`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Course description..."
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {saving && <Loader2 className="animate-spin" size={16} />}
          {editId ? "Update Global Course" : "Create Global Course"}
        </button>
        <button
          onClick={() => setActiveSection("global-course-directory")}
          className="px-6 py-2.5 border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
