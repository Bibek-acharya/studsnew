"use client";

import React, { useState, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import { Home, CalendarPlus } from "lucide-react";
import { scholarshipProviderApi } from "@/services/scholarshipProviderApi";
import FileUpload from "./common/FileUpload";

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

const quillFormats = ["bold", "italic", "underline", "strike", "list", "align", "link", "image"];

const EVENT_TYPES = [
  { value: "workshop", label: "Workshop" },
  { value: "training", label: "Training" },
  { value: "seminar", label: "Seminar" },
  { value: "conference", label: "Conference" },
  { value: "program", label: "Program" },
  { value: "ceremony", label: "Ceremony" },
  { value: "webinar", label: "Webinar" },
  { value: "meeting", label: "Meeting" },
];

const CATEGORIES = [
  { value: "education", label: "Education" },
  { value: "leadership", label: "Leadership" },
  { value: "community", label: "Community" },
  { value: "health", label: "Health" },
  { value: "fundraising", label: "Fundraising" },
];

const CreateEvent: React.FC = memo(() => {
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("");
  const [category, setCategory] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [venue, setVenue] = useState("");
  const [onlineLink, setOnlineLink] = useState("");
  const [organizedBy, setOrganizedBy] = useState("Sowers Action Nepal");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [enableRegistration, setEnableRegistration] = useState(false);
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [featuredImagePreview, setFeaturedImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImageSelect = useCallback(async (file: File) => {
    const localPreview = URL.createObjectURL(file);
    setFeaturedImagePreview(localPreview);
    setUploadingImage(true);
    setError("");

    try {
      const url = await scholarshipProviderApi.uploadImage(file, "events");
      setFeaturedImageUrl(url);
      setFeaturedImagePreview(url);
    } catch (err: any) {
      setFeaturedImageUrl("");
      setError(err?.message || "Failed to upload featured image");
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const handleSave = useCallback(async (draft: boolean) => {
    if (!title.trim() || !eventDate) { setError("Title and date are required"); return; }
    if (!featuredImageUrl) { setError("Featured image is required"); return; }
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const startDateTime = startTime ? `${eventDate}T${startTime}:00` : `${eventDate}T00:00:00`;
      const endDateTime = endTime ? `${eventDate}T${endTime}:00` : startDateTime;
      await scholarshipProviderApi.createEvent({
        name: title,
        short_desc: shortDesc,
        description: description,
        image_url: featuredImageUrl,
        event_type: eventType,
        category: category,
        max_participants: maxParticipants ? parseInt(maxParticipants) : undefined,
        online_link: onlineLink,
        organized_by: organizedBy,
        contact_person: contactPerson,
        contact_email: contactEmail,
        start_date: startDateTime,
        end_date: endDateTime,
        location: venue,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        enable_registration: enableRegistration,
        status: draft ? "draft" : "upcoming",
      });
      setSuccess(draft ? "Draft saved!" : "Event published!");
    } catch (err: any) {
      setError(err.message || "Failed to save event");
    } finally {
      setSubmitting(false);
    }
  }, [title, eventDate, startTime, endTime, eventType, category, maxParticipants, onlineLink, organizedBy, contactPerson, contactEmail, shortDesc, description, tags, enableRegistration, venue, featuredImageUrl]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Create Event</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Create Event</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CalendarPlus className="w-5 h-5 text-blue-600" /> Create Event
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => handleSave(true)}
              disabled={submitting || uploadingImage}
              className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              Draft
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={submitting || uploadingImage || !title.trim() || !eventDate || !featuredImageUrl}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Publish
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Title <span className="text-red-500">*</span></label>
              <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Enter event title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Type <span className="text-red-500">*</span></label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={eventType} onChange={(e) => setEventType(e.target.value)}>
                <option value="">Select Type</option>
                {EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Date <span className="text-red-500">*</span></label>
              <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Time</label>
              <input type="time" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">End Time</label>
              <input type="time" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Maximum Participants</label>
              <input type="number" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="e.g., 50" value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Venue/Location <span className="text-red-500">*</span></label>
              <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="e.g., Sowers Action Nepal Office, Kathmandu" value={venue} onChange={(e) => setVenue(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Online Meeting Link</label>
              <input type="url" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="https://zoom.us/j/..." value={onlineLink} onChange={(e) => setOnlineLink(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Organized By <span className="text-red-500">*</span></label>
              <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="e.g., Sowers Action Nepal" value={organizedBy} onChange={(e) => setOrganizedBy(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Person</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Contact name" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
              <input type="email" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="events@example.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Featured Image <span className="text-red-500">*</span></label>
            <FileUpload
              accept="image/*"
              maxSize="5MB"
              recommendedSize="1200x630"
              onFileSelect={handleImageSelect}
              previewUrl={featuredImagePreview}
            />
            {uploadingImage && <p className="mt-2 text-xs text-blue-600">Uploading featured image...</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Description / Summary <span className="text-red-500">*</span></label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <ReactQuill theme="snow" value={shortDesc} onChange={setShortDesc} modules={quillModules} formats={quillFormats} className="bg-white" />
            </div>
            <p className="text-xs text-gray-500 text-right mt-1">{shortDesc.replace(/<[^>]*>/g, "").length}/300 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Event Description <span className="text-red-500">*</span></label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <ReactQuill theme="snow" value={description} onChange={setDescription} modules={quillModules} formats={quillFormats} className="bg-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="event, workshop, nepal (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0">Enable Registration</label>
                <p className="text-xs text-gray-500">Allow users to register for this event</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={enableRegistration} onChange={(e) => setEnableRegistration(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}
    </div>
  );
});

CreateEvent.displayName = "CreateEvent";

export default CreateEvent;
