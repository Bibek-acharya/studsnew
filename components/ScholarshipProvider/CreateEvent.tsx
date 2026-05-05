"use client";

import React, { useState, useCallback, useEffect, memo } from "react";
import dynamic from "next/dynamic";
import { Home, CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import { scholarshipProviderApi } from "@/services/scholarshipProviderApi";
import FileUpload from "./common/FileUpload";
import DatePicker from "./common/DatePicker";
import Dropdown from "../college-recommender/Dropdown";

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

interface CreateEventProps {
  eventId?: number | null;
  onNavigate?: (section: string) => void;
  onEditComplete?: () => void;
}

const CreateEvent: React.FC<CreateEventProps> = memo(({ eventId, onNavigate, onEditComplete }) => {
  const isEditing = !!eventId;
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (eventId != null) {
      const id = eventId as number;
      async function fetchEvent() {
        try {
          const event = await scholarshipProviderApi.getEventById(id);
          setTitle(event.name || "");
          setEventType(event.event_type || "");
          setCategory(event.category || "");
          if (event.start_date) {
            const datePart = event.start_date.split('T')[0];
            setEventDate(datePart);
            const timePart = event.start_date.split('T')[1]?.substring(0, 5) || "";
            setStartTime(timePart);
          }
          if (event.end_date) {
            const endTimePart = event.end_date.split('T')[1]?.substring(0, 5) || "";
            setEndTime(endTimePart);
          }
          setMaxParticipants(event.max_participants?.toString() || "");
          setVenue(event.location || "");
          setOnlineLink(event.online_link || "");
          setOrganizedBy(event.organized_by || "");
          setContactPerson(event.contact_person || "");
          setContactEmail(event.contact_email || "");
          setShortDesc(event.short_desc || "");
          setDescription(event.description || "");
          setTags(event.tags?.join(", ") || "");
          setEnableRegistration(event.enable_registration || false);
          setFeaturedImageUrl(event.image_url || "");
          setFeaturedImagePreview(event.image_url || "");
        } catch (err) {
          setError("Failed to load event");
        }
      }
      fetchEvent();
    }
  }, [eventId]);

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

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Event title is required";
    if (!eventDate) errs.eventDate = "Event date is required";
    else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(eventDate) < today) errs.eventDate = "Event date cannot be in the past";
    }
    if (!eventType) errs.eventType = "Event type is required";
    if (!venue.trim()) errs.venue = "Venue is required";
    if (!featuredImageUrl) errs.featuredImage = "Featured image is required";
    if (!shortDesc.replace(/<[^>]*>/g, "").trim()) errs.shortDesc = "Summary is required";
    if (!description.replace(/<[^>]*>/g, "").trim()) errs.description = "Description is required";
    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) errs.contactEmail = "Invalid email format";
    if (startTime && endTime && startTime >= endTime) {
      errs.endTime = "End time must be after start time";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [title, eventDate, eventType, venue, featuredImageUrl, shortDesc, description, contactEmail, startTime, endTime]);

  const handleSave = useCallback(async (draft: boolean) => {
    if (!validate()) return;
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const startDateTime = startTime ? `${eventDate}T${startTime}:00` : `${eventDate}T00:00:00`;
      const endDateTime = endTime ? `${eventDate}T${endTime}:00` : startDateTime;
      const payload = {
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
      };
      if (isEditing && eventId) {
        await scholarshipProviderApi.updateEvent(eventId, payload);
        toast.success(draft ? "Your event has been updated as a draft." : "Your event has been updated.");
      } else {
        await scholarshipProviderApi.createEvent(payload);
        toast.success(draft ? "Your event has been saved as a draft." : "Your event is now live.");
      }
      onEditComplete?.();
      onNavigate?.("sec-events-directory");
    } catch (err: any) {
      setError(err.message || "Failed to save event");
    } finally {
      setSubmitting(false);
    }
  }, [validate, title, eventDate, startTime, endTime, eventType, category, maxParticipants, onlineLink, organizedBy, contactPerson, contactEmail, shortDesc, description, tags, enableRegistration, venue, featuredImageUrl, onNavigate, isEditing, eventId, onEditComplete]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">{isEditing ? 'Edit Event' : 'Create Event'}</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">{isEditing ? 'Edit Event' : 'Create Event'}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CalendarPlus className="w-5 h-5 text-blue-600" /> {isEditing ? 'Edit Event' : 'Create Event'}
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
              disabled={submitting || uploadingImage}
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
              <input type="text" className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${errors.title ? "border-red-500" : "border-gray-200"}`} placeholder="Enter event title" value={title} onChange={(e) => { setTitle(e.target.value); setErrors((prev) => ({ ...prev, title: "" })); }} />
              {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Type <span className="text-red-500">*</span></label>
              <Dropdown
                value={eventType}
                onChange={(v) => { setEventType(v); setErrors((prev) => ({ ...prev, eventType: "" })); }}
                options={EVENT_TYPES}
                placeholder="Select Type"
                error={errors.eventType}
              />
              {errors.eventType && <p className="mt-1 text-xs text-red-500">{errors.eventType}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <Dropdown
                value={category}
                onChange={(v) => setCategory(v)}
                options={CATEGORIES}
                placeholder="Select Category"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <DatePicker
              value={eventDate}
              onChange={(v) => { setEventDate(v); setErrors((prev) => ({ ...prev, eventDate: "" })); }}
              placeholder="Select event date"
              label="Event Date"
              required
              minDate={new Date().toISOString().split("T")[0]}
              error={errors.eventDate}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Time</label>
              <input type="time" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">End Time</label>
              <input type="time" className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${errors.endTime ? "border-red-500" : "border-gray-200"}`} value={endTime} onChange={(e) => { setEndTime(e.target.value); setErrors((prev) => ({ ...prev, endTime: "" })); }} />
              {errors.endTime && <p className="mt-1 text-xs text-red-500">{errors.endTime}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Maximum Participants</label>
              <input type="number" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="e.g., 50" value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Venue/Location <span className="text-red-500">*</span></label>
              <input type="text" className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${errors.venue ? "border-red-500" : "border-gray-200"}`} placeholder="e.g., Sowers Action Nepal Office, Kathmandu" value={venue} onChange={(e) => { setVenue(e.target.value); setErrors((prev) => ({ ...prev, venue: "" })); }} />
              {errors.venue && <p className="mt-1 text-xs text-red-500">{errors.venue}</p>}
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
              <input type="email" className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${errors.contactEmail ? "border-red-500" : "border-gray-200"}`} placeholder="events@example.com" value={contactEmail} onChange={(e) => { setContactEmail(e.target.value); setErrors((prev) => ({ ...prev, contactEmail: "" })); }} />
              {errors.contactEmail && <p className="mt-1 text-xs text-red-500">{errors.contactEmail}</p>}
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
            {errors.featuredImage && <p className="mt-1 text-xs text-red-500">{errors.featuredImage}</p>}
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
    </div>
  );
});

CreateEvent.displayName = "CreateEvent";

export default CreateEvent;
