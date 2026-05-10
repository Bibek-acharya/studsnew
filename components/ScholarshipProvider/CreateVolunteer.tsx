"use client";

import React, { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Settings, CalendarDays, ListChecks, MapPin, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { scholarshipProviderApi } from "@/services/scholarshipProviderApi";
import FileUpload from "./common/FileUpload";
import RichTextEditor from "./common/RichTextEditor";
import { NEPAL_DISTRICTS } from "@/lib/location-data";

interface CreateVolunteerProps {
  editId?: number | null;
}

const UPLOAD_FOLDER = "volunteer-banners";
const allDistricts = Array.from(new Set(Object.values(NEPAL_DISTRICTS).flat())).sort();

const formInputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500";
const dateInputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 [color-scheme:light]";

const CreateVolunteer = ({ editId }: CreateVolunteerProps) => {
  const router = useRouter();
  const isEditing = Boolean(editId);

  const [volunteerTitle, setVolunteerTitle] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [volunteerType, setVolunteerType] = useState<"free" | "paid">("free");
  const [volunteerPayment, setVolunteerPayment] = useState("");
  const [dateMode, setDateMode] = useState<"specific" | "range">("range");
  const [specificDates, setSpecificDates] = useState<string[]>([]);
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [volunteeringLocation, setVolunteeringLocation] = useState("");
  const [districts, setDistricts] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [volunteerTitleError, setVolunteerTitleError] = useState("");
  const [bannerImageError, setBannerImageError] = useState("");
  const [dateError, setDateError] = useState("");
  const [deadlineError, setDeadlineError] = useState("");
  const [districtError, setDistrictError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [volunteerPaymentError, setVolunteerPaymentError] = useState("");
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    if (editId) {
      scholarshipProviderApi.getVolunteerByID(editId).then((res: any) => {
        const data = res?.data || res;
        if (data) {
          setVolunteerTitle(data.title || "");
          setBannerImage(data.banner_image || "");
          setVolunteerType(data.volunteer_type || "free");
          setVolunteerPayment(data.volunteer_payment || "");
          setDateMode(data.date_mode || "range");
          setSpecificDates(data.specific_dates || []);
          setRangeStart(data.range_start || "");
          setRangeEnd(data.range_end || "");
          setApplicationDeadline(data.application_deadline || "");
          setDescription(data.description || "");
          setVolunteeringLocation(data.location || "");
          setDistricts(data.districts || []);
        }
      }).catch(() => toast.error("Failed to load volunteer"));
    }
  }, [editId]);

  const validateForm = useCallback(() => {
    let hasError = false;
    let firstFieldId: string | null = null;
    const setErr = (fieldId: string, setter: (v: string) => void, msg: string) => {
      setter(msg);
      if (!firstFieldId) firstFieldId = fieldId;
      hasError = true;
    };

    setVolunteerTitleError("");
    setBannerImageError("");
    setDateError("");
    setDeadlineError("");
    setDistrictError("");
    setDescriptionError("");
    setVolunteerPaymentError("");
    setLocationError("");

    if (!volunteerTitle.trim()) setErr("volunteerTitle", setVolunteerTitleError, "Volunteer title is required");
    if (!bannerImage) setErr("bannerImage", setBannerImageError, "Banner image is required");
    if (dateMode === "range") {
      if (!rangeStart) setErr("rangeStart", setDateError, "Start date is required");
      if (!rangeEnd) setErr("rangeEnd", setDateError, "End date is required");
      if (rangeStart && rangeEnd && rangeStart > rangeEnd) setErr("rangeEnd", setDateError, "End date must be after start date");
    } else {
      if (specificDates.length === 0) setErr("specificDates", setDateError, "Select at least one date");
    }
    if (!applicationDeadline) setErr("applicationDeadline", setDeadlineError, "Application deadline is required");
    if (districts.length === 0) setErr("districts", setDistrictError, "Select at least one district");
    if (!description.trim()) setErr("description", setDescriptionError, "Description is required");
    if (volunteerType === "paid" && !volunteerPayment.trim()) setErr("volunteerPayment", setVolunteerPaymentError, "Payment amount is required");

    return { isValid: !hasError, firstFieldId };
  }, [volunteerTitle, bannerImage, dateMode, rangeStart, rangeEnd, specificDates, applicationDeadline, districts, description, volunteerType, volunteerPayment, volunteeringLocation]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await scholarshipProviderApi.uploadImage(file, UPLOAD_FOLDER);
      setBannerImage(url);
      setBannerImageError("");
      toast.success("Image uploaded");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      const el = document.getElementById(validation.firstFieldId || "");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: volunteerTitle,
        banner_image: bannerImage,
        description,
        location: volunteeringLocation,
        volunteer_type: volunteerType,
        volunteer_payment: volunteerPayment,
        date_mode: dateMode,
        range_start: rangeStart,
        range_end: rangeEnd,
        specific_dates: specificDates,
        application_deadline: applicationDeadline,
        districts,
        active: false,
      };

      if (editId) {
        await scholarshipProviderApi.updateVolunteer(editId, payload);
      } else {
        await scholarshipProviderApi.createVolunteer(payload);
      }

      toast.success(isEditing ? "Volunteer opportunity updated" : "Volunteer opportunity created");
      router.push("/scholarship-provider/dashboard");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const toggleDistrict = (d: string) => {
    setDistricts(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
    setDistrictError("");
  };

  const formatDate = (d: string) => {
    if (!d) return "";
    return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 pb-32">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{isEditing ? "Edit Volunteer" : "Create Volunteer"}</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Settings size={16} />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">{isEditing ? "Edit Volunteer" : "Create Volunteer"}</span>
        </div>
      </div>

      {/* Banner & Title */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Banner & Title</h2>
            <p className="text-sm text-gray-500 mt-0.5">Header image and volunteer opportunity title</p>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Volunteer Title <span className="text-red-500">*</span></label>
            <input id="volunteerTitle" type="text" className={`${formInputClass} ${volunteerTitleError ? "border-red-500 bg-red-50/10" : ""}`} placeholder="e.g. Scholarship Outreach Volunteer" value={volunteerTitle} onChange={e => { setVolunteerTitle(e.target.value); setVolunteerTitleError(""); }} />
            {volunteerTitleError && <p className="text-red-500 text-xs mt-1">{volunteerTitleError}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Volunteer Type <span className="text-red-500">*</span></label>
            <div className="flex items-center gap-3">
              {(["free", "paid"] as const).map(t => (
                <button key={t} type="button" onClick={() => { setVolunteerType(t); setVolunteerPaymentError(""); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${volunteerType === t ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}>{t === "free" ? "Free" : "Paid"}</button>
              ))}
            </div>
          </div>
          {volunteerType === "paid" && (
            <div id="volunteerPayment" className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Payment Amount (NPR) <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">NPR</span>
                <input type="text" inputMode="numeric" className={`${formInputClass} pl-12 ${volunteerPaymentError ? "border-red-500 bg-red-50/10" : ""}`} placeholder="e.g. 5000" value={volunteerPayment} onChange={e => { setVolunteerPayment(e.target.value.replace(/[^0-9]/g, "")); setVolunteerPaymentError(""); }} />
              </div>
              {volunteerPaymentError && <p className="text-red-500 text-xs mt-1">{volunteerPaymentError}</p>}
            </div>
          )}
          <div id="bannerImage" className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Banner Image <span className="text-red-500">*</span></label>
            <FileUpload accept="image/*" maxSize="5MB" onFileSelect={handleUpload} previewUrl={bannerImage} onClearPreview={() => { setBannerImage(""); setBannerImageError(""); }} />
            {uploading && <p className="text-blue-600 text-xs mt-1 flex items-center gap-1"><span className="animate-spin">&#9696;</span> Uploading...</p>}
            {bannerImageError && <p className="text-red-500 text-xs mt-1">{bannerImageError}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Volunteering Location</label>
            <input type="text" className={`${formInputClass} ${locationError ? "border-red-500 bg-red-50/10" : ""}`} placeholder="e.g. Central Park, South Gate" value={volunteeringLocation} onChange={e => { setVolunteeringLocation(e.target.value); setLocationError(""); }} />
            {locationError && <p className="text-red-500 text-xs mt-1">{locationError}</p>}
          </div>
        </div>
      </div>

      {/* Volunteer Dates */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
          <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><CalendarDays className="w-5 h-5" /></div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Volunteer Requirement Dates</h2>
            <p className="text-sm text-gray-500 mt-0.5">Choose how volunteers select their participation dates</p>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => { setDateMode("range"); setDateError(""); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${dateMode === "range" ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}><CalendarDays size={16} /> Date Range</button>
            <button type="button" onClick={() => { setDateMode("specific"); setDateError(""); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${dateMode === "specific" ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}><ListChecks size={16} /> Specific Dates</button>
          </div>
          <div id={dateMode === "range" ? "rangeStart" : "specificDates"}>
            {dateMode === "range" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Start Date <span className="text-red-500">*</span></label>
                  <input type="date" value={rangeStart} onChange={e => { setRangeStart(e.target.value); setDateError(""); }} className={`${dateInputClass} ${dateError ? "border-red-500 bg-red-50/10" : ""}`} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">End Date <span className="text-red-500">*</span></label>
                  <input type="date" value={rangeEnd} onChange={e => { setRangeEnd(e.target.value); setDateError(""); }} className={`${dateInputClass} ${dateError ? "border-red-500 bg-red-50/10" : ""}`} />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Add a Date</label>
                    <input type="date" onChange={e => { const v = e.target.value; if (v && !specificDates.includes(v)) { setSpecificDates(prev => [...prev, v].sort()); setDateError(""); } }} className={`${dateInputClass} ${dateError ? "border-red-500 bg-red-50/10" : ""}`} />
                  </div>
                </div>
                {specificDates.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {specificDates.map(d => (
                      <span key={d} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        {formatDate(d)}
                        <button onClick={() => setSpecificDates(prev => prev.filter(x => x !== d))} className="hover:text-red-600 transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
                      </span>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-400 italic">No dates selected yet.</p>}
              </div>
            )}
          </div>
          {dateError && <p className="text-red-500 text-xs">{dateError}</p>}
        </div>
      </div>

      {/* Application Deadline */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
          <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Clock className="w-5 h-5" /></div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Application Deadline</h2>
            <p className="text-sm text-gray-500 mt-0.5">Last date for volunteers to apply</p>
          </div>
        </div>
        <div className="p-6">
          <div className="max-w-xs space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Deadline <span className="text-red-500">*</span></label>
            <input id="applicationDeadline" type="date" value={applicationDeadline} onChange={e => { setApplicationDeadline(e.target.value); setDeadlineError(""); }} className={`${dateInputClass} ${deadlineError ? "border-red-500 bg-red-50/10" : ""}`} />
            {deadlineError && <p className="text-red-500 text-xs mt-1">{deadlineError}</p>}
          </div>
        </div>
      </div>

      {/* Districts */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
          <div className="p-2 bg-green-100 text-green-600 rounded-lg"><MapPin className="w-5 h-5" /></div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Districts to Participate</h2>
            <p className="text-sm text-gray-500 mt-0.5">Select where this volunteer opportunity is available</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <DistrictSelector districts={districts} onChange={setDistrictError} onToggle={toggleDistrict} />
          {districtError && <p className="text-red-500 text-xs">{districtError}</p>}
          {districts.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400 font-medium">{districts.length} selected:</span>
              {districts.map(d => (
                <span key={d} className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 rounded text-xs font-medium">
                  {d}
                  <button onClick={() => toggleDistrict(d)} className="hover:text-red-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
          <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Description</h2>
            <p className="text-sm text-gray-500 mt-0.5">Describe the volunteer role, requirements, and perks</p>
          </div>
        </div>
        <div className="p-6">
          <div id="description" className="space-y-1.5">
            <RichTextEditor value={description} onChange={v => { setDescription(v); setDescriptionError(""); }} placeholder="Describe what volunteers will do, requirements, perks..." minHeight={250} />
            {descriptionError && <p className="text-red-500 text-xs mt-1">{descriptionError}</p>}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
        <button type="button" onClick={() => router.push("/scholarship-provider/dashboard")} className="px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
        <button type="button" onClick={handleSave} disabled={saving} className="px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:opacity-50">{saving ? "Saving..." : isEditing ? "Update" : "Create Volunteer"}</button>
      </div>
    </div>
  );
};

function DistrictSelector({ districts, onChange, onToggle }: { districts: string[]; onChange: (s: string) => void; onToggle: (d: string) => void }) {
  const [search, setSearch] = useState("");
  const filtered = allDistricts.filter(d => d.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div className="relative mb-3">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input type="text" placeholder="Search districts..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500" />
      </div>
      <div id="districts" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
        {filtered.map(d => (
          <button key={d} type="button" onClick={() => { onToggle(d); onChange(""); }} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-all text-left ${districts.includes(d) ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}>
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0 ${districts.includes(d) ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
              {districts.includes(d) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
            </div>
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CreateVolunteer;
