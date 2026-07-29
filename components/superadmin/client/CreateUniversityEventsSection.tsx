"use client";

import "react-quill-new/dist/quill.snow.css";

import React, { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { Home, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { adminEventApi } from "@/services/eventApi";
import FileUpload from "@/components/ScholarshipProvider/common/FileUpload";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [["bold", "italic", "underline", "strike"], [{ list: "ordered" }, { list: "bullet" }], [{ align: [] }], ["link", "image"], ["clean"]],
};
const quillFormats = ["bold", "italic", "underline", "strike", "list", "align", "link", "image"];

const CATEGORIES = [
  { value: "workshop", label: "Workshop" }, { value: "seminar", label: "Seminar" },
  { value: "conference", label: "Conference" }, { value: "webinar", label: "Webinar" },
  { value: "training", label: "Training" }, { value: "program", label: "Program" },
  { value: "ceremony", label: "Ceremony" }, { value: "meeting", label: "Meeting" },
  { value: "competition", label: "Competition" }, { value: "other", label: "Other" },
];

interface University { id: number; name: string; }

export default function CreateUniversityEventsSection({ setActiveSection, editId }: { setActiveSection: (s: string) => void; editId?: number }) {
  const isEditing = !!editId;
  const [universities, setUniversities] = useState<University[]>([]);
  const [universityId, setUniversityId] = useState(0);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [registrationFee, setRegistrationFee] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("superadmin_token");
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const res = await fetch(`${baseUrl}/api/v1/admin/universities?limit=500`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        setUniversities(json?.data?.universities?.map((u: any) => ({ id: u.id, name: u.name })) || []);
      } catch {}
    })();
    if (editId != null) {
      (async () => {
        try {
          const event = await adminEventApi.getById(editId);
          setTitle(event.title || "");
          setCategory(event.category || "");
          setOrganizer(event.organizer || "");
          setLocation(event.location || "");
          setEventDate(event.date || "");
          setEventTime(event.time || "");
          setRegistrationFee(event.registrationFee || "");
          setExcerpt(event.excerpt || "");
          setDescription(event.description || "");
          setImageUrl(event.image || "");
          setImagePreview(event.image || "");
          setUniversityId((event as any).university_id || 0);
        } catch { setError("Failed to load event"); }
      })();
    }
  }, [editId]);

  const handleImageSelect = useCallback(async (file: File) => {
    setImagePreview(URL.createObjectURL(file));
    setUploadingImage(true);
    setError("");
    try {
      const url = await adminEventApi.uploadImage(file);
      setImageUrl(url);
      setImagePreview(url);
    } catch (err: any) { setError(err?.message || "Failed to upload image"); }
    finally { setUploadingImage(false); }
  }, []);

  const handleClearImage = useCallback(() => { setImageUrl(""); setImagePreview(""); }, []);

  const handleSave = useCallback(async () => {
    if (!title.trim()) { setError("Title is required"); return; }
    if (!universityId) { setError("Please select a university"); return; }
    if (!imageUrl) { setError("Featured image is required"); return; }
    setSubmitting(true);
    setError("");
    try {
      const payload = { title: title.trim(), category, organizer, location, date: eventDate, time: eventTime, registrationFee, excerpt, description, image: imageUrl, university_id: universityId };
      if (isEditing && editId) { await adminEventApi.update(editId, payload); toast.success("Event updated."); }
      else { await adminEventApi.create(payload); toast.success("Event created."); }
      setActiveSection("university-events");
    } catch (err: any) { setError(err.message || "Failed to save"); }
    finally { setSubmitting(false); }
  }, [title, category, organizer, location, eventDate, eventTime, registrationFee, excerpt, description, imageUrl, universityId, isEditing, editId, setActiveSection]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">{isEditing ? "Edit University Event" : "Create University Event"}</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" /> <span>Dashboard</span> <span>-</span> <span className="text-gray-800 font-medium">{isEditing ? "Edit" : "Create"} Event</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">University *</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={universityId} onChange={(e) => setUniversityId(Number(e.target.value))}>
              <option value={0}>Select University</option>
              {universities.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={organizer} onChange={(e) => setOrganizer(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input type="time" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Fee</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={registrationFee} onChange={(e) => setRegistrationFee(e.target.value)} placeholder="Free" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image *</label>
            <FileUpload label="" uploadedText="Image uploaded" accept="image/*" maxSize="5MB" previewUrl={imagePreview} previewClassName="w-full h-44 object-cover rounded-lg" onFileSelect={handleImageSelect} onClearPreview={handleClearImage} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <ReactQuill theme="snow" value={excerpt} onChange={setExcerpt} modules={quillModules} formats={quillFormats} placeholder="Brief description..." className="bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <ReactQuill theme="snow" value={description} onChange={setDescription} modules={quillModules} formats={quillFormats} placeholder="Full description..." className="bg-white" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setActiveSection("university-events")} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
            <button onClick={handleSave} disabled={submitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">{submitting ? "Saving..." : isEditing ? "Update" : "Publish"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
