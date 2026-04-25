"use client";

import React, { useState, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Calendar, Save, UploadCloud, MapPin, Link } from "lucide-react";
import SectionCard from "./common/SectionCard";
import InputField from "./common/InputField";
import SelectField from "./common/SelectField";
import Button from "./common/Button";
import { scholarshipProviderApi } from "@/services/scholarshipProviderApi";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const quillFormats = ["header", "bold", "italic", "underline", "strike", "list", "align", "link", "image"];

const EVENT_TYPE_OPTIONS = [
  { value: "workshop", label: "Workshop" },
  { value: "seminar", label: "Seminar" },
  { value: "webinar", label: "Webinar" },
  { value: "conference", label: "Conference" },
  { value: "deadline", label: "Deadline" },
];

const CreateEvent: React.FC = memo(() => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSave = useCallback(async (draft: boolean) => {
    if (!title.trim() || !date) return;
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const startDateTime = time ? `${date}T${time}:00` : `${date}T00:00:00`;
      await scholarshipProviderApi.createEvent({
        name: title,
        description,
        event_type: eventType,
        start_date: startDateTime,
        end_date: startDateTime,
        location,
        status: draft ? "draft" : "upcoming",
      });
      setSuccess(draft ? "Draft saved!" : "Event published!");
      setTimeout(() => router.push("/scholarship-provider"), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to save event");
    } finally {
      setSubmitting(false);
    }
  }, [title, date, time, eventType, description, location, router]);

  return (
    <div className="space-y-6">
      <SectionCard>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" /> Create Event
        </h2>

        <div className="space-y-6">
          <InputField label="Event Name" required placeholder="Enter event name" value={title} onChange={(e) => setTitle(e.target.value)} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField label="Event Type" required value={eventType} onChange={(e) => setEventType(e.target.value)} options={EVENT_TYPE_OPTIONS} />
            <InputField label="Date" required type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600" placeholder="Event location" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Registration Link</label>
            <div className="relative">
              <Link className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="url" className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600" placeholder="https://..." value={registrationLink} onChange={(e) => setRegistrationLink(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Featured Image</label>
            <div className="border-2 border-dashed border-slate-200 rounded-md py-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all">
              <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB (1200x630 recommended)</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <ReactQuill theme="snow" value={description} onChange={setDescription} modules={quillModules} formats={quillFormats} className="bg-white" />
            </div>
          </div>
        </div>
      </SectionCard>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => handleSave(true)} disabled={submitting}><Save className="w-4 h-4" /> Save Draft</Button>
        <Button onClick={() => handleSave(false)} disabled={submitting || !title.trim() || !date}><Calendar className="w-4 h-4" /> Publish Event</Button>
      </div>
    </div>
  );
});

CreateEvent.displayName = "CreateEvent";

export default CreateEvent;
