"use client";

import "react-quill-new/dist/quill.snow.css";

import React, { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { Home, CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import { adminEventApi } from "@/services/eventApi";
import FileUpload from "@/components/ScholarshipProvider/common/FileUpload";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const quillFormats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "align",
  "link",
  "image",
];

const CATEGORIES = [
  { value: "workshop", label: "Workshop" },
  { value: "seminar", label: "Seminar" },
  { value: "conference", label: "Conference" },
  { value: "webinar", label: "Webinar" },
  { value: "training", label: "Training" },
  { value: "program", label: "Program" },
  { value: "ceremony", label: "Ceremony" },
  { value: "meeting", label: "Meeting" },
  { value: "competition", label: "Competition" },
  { value: "other", label: "Other" },
];

export default function CreateEventSection({
  setActiveSection,
  editId,
}: {
  setActiveSection: (s: string) => void;
  editId?: number;
}) {
  const isEditing = !!editId;
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
        } catch {
          setError("Failed to load event");
        }
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
    } catch (err: any) {
      setImageUrl("");
      setError(err?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const handleClearImage = useCallback(() => {
    setImageUrl("");
    setImagePreview("");
  }, []);

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!imageUrl) {
      setError("Featured image is required");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        title,
        category,
        organizer,
        location,
        date: eventDate,
        time: eventTime,
        registrationFee,
        excerpt,
        description,
        image: imageUrl,
      };
      if (isEditing && editId) {
        await adminEventApi.update(editId, payload);
        toast.success("Event updated successfully.");
      } else {
        await adminEventApi.create(payload);
        toast.success("Event created successfully.");
      }
      setActiveSection("manage-events");
    } catch (err: any) {
      setError(err.message || "Failed to save event");
    } finally {
      setSubmitting(false);
    }
  }, [
    title,
    category,
    organizer,
    location,
    eventDate,
    eventTime,
    registrationFee,
    excerpt,
    description,
    imageUrl,
    isEditing,
    editId,
    setActiveSection,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditing ? "Edit Event" : "Create Event"}
        </h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">
            {isEditing ? "Edit Event" : "Create Event"}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CalendarPlus className="w-5 h-5 text-blue-600" />{" "}
            {isEditing ? "Edit Event" : "Create Event"}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveSection("manage-events")}
              className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={
                submitting || uploadingImage || !title.trim() || !imageUrl
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : isEditing
                  ? "Update Event"
                  : "Publish Event"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-500"
                placeholder="Enter event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Organizer
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                placeholder="Organizer name"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Time
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Registration Fee
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                placeholder="Free"
                value={registrationFee}
                onChange={(e) => setRegistrationFee(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Location
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              placeholder="Event location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Featured Image <span className="text-red-500">*</span>
            </label>
            <FileUpload
              accept="image/*"
              maxSize="5MB"
              recommendedSize="1200x630"
              onFileSelect={handleImageSelect}
              previewUrl={imagePreview}
              onClearPreview={handleClearImage}
            />
            {uploadingImage && (
              <p className="mt-2 text-xs text-blue-600">
                Uploading featured image...
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Short Description
            </label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <ReactQuill
                theme="snow"
                value={excerpt}
                onChange={setExcerpt}
                modules={quillModules}
                formats={quillFormats}
                className="bg-white"
              />
            </div>
            <p className="text-xs text-gray-500 text-right mt-1">
              {excerpt.replace(/<[^>]*>/g, "").length}/300 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Description
            </label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                modules={quillModules}
                formats={quillFormats}
                className="bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
